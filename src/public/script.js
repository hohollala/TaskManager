// 전역 변수
let tasks = [];
let selectedTaskId = null;
let searchTerm = "";
let sortOption = "date-asc";
let globalAnalysisResult = null; // 새로 추가: 전역 분석 결과 저장
let svg, g, simulation;
let width, height; // << 새로 추가: 너비와 높이를 전역 변수로 정의
let isGraphInitialized = false; // << 새로 추가: 차트 초기화 여부 추적
let zoom; // << 새로 추가: 확대/축소 동작 객체 저장

// 새로 추가: i18n 전역 변수
let currentLang = "en"; // 기본 언어
let translations = {}; // 로드된 번역 저장

// DOM 요소
const taskListElement = document.getElementById("task-list");
const taskDetailsContent = document.getElementById("task-details-content");
const statusFilter = document.getElementById("status-filter");
const currentTimeElement = document.getElementById("current-time");
const progressIndicator = document.getElementById("progress-indicator");
const progressCompleted = document.getElementById("progress-completed");
const progressInProgress = document.getElementById("progress-in-progress");
const progressPending = document.getElementById("progress-pending");
const progressLabels = document.getElementById("progress-labels");
const dependencyGraphElement = document.getElementById("dependency-graph");
const globalAnalysisResultElement = document.getElementById(
  "global-analysis-result"
); // HTML에 이 요소가 있다고 가정
const langSwitcher = document.getElementById("lang-switcher"); // << 새로 추가: 언어 전환기 요소 가져오기
const resetViewBtn = document.getElementById("reset-view-btn"); // << 새로 추가: 뷰 재설정 버튼 요소 가져오기

// API 호출 중복 방지를 위한 디바운싱
let pendingRequests = new Map();
const DEBOUNCE_DELAY = 1000; // 1초

// 디바운싱된 API 호출 함수
async function debouncedApiCall(endpoint, data, options = {}) {
  const requestKey = `${endpoint}-${JSON.stringify(data)}`;
  
  // 이미 진행 중인 동일한 요청이 있으면 기다림
  if (pendingRequests.has(requestKey)) {
    console.log(`🔄 중복 요청 감지: ${endpoint}`);
    return pendingRequests.get(requestKey);
  }
  
  // 새 요청 생성
  const requestPromise = fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    ...options
  });
  
  // 요청을 맵에 저장
  pendingRequests.set(requestKey, requestPromise);
  
  try {
    const response = await requestPromise;
    return response;
  } finally {
    // 요청 완료 후 맵에서 제거
    setTimeout(() => {
      pendingRequests.delete(requestKey);
    }, DEBOUNCE_DELAY);
  }
}

// 초기화
document.addEventListener("DOMContentLoaded", () => {
  // fetchTasks(); // initI18n()에 의해 트리거됨
  initI18n(); // << 새로 추가: i18n 초기화
  updateCurrentTime();
  setInterval(updateCurrentTime, 1000);
  updateDimensions(); // << 새로 추가: 초기화 시 크기 업데이트

  // 이벤트 리스너
  // statusFilter.addEventListener("change", renderTasks); // changeLanguage에 의해 트리거되거나 applyTranslations 후에 트리거됨
  if (statusFilter) {
    statusFilter.addEventListener("change", renderTasks);
  }

  // 새로 추가: 뷰 재설정 버튼 이벤트 리스너
  if (resetViewBtn) {
    resetViewBtn.addEventListener("click", resetView);
  }

  // 새로 추가: 검색 및 정렬 이벤트 리스너
  const searchInput = document.getElementById("search-input");
  const sortOptions = document.getElementById("sort-options");

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchTerm = e.target.value.toLowerCase();
      renderTasks();
    });
  }

  if (sortOptions) {
    sortOptions.addEventListener("change", (e) => {
      sortOption = e.target.value;
      renderTasks();
    });
  }

  // 새로 추가: SSE 연결 설정
  setupSSE();

  // 새로 추가: 언어 전환기 이벤트 리스너
  if (langSwitcher) {
    langSwitcher.addEventListener("change", (e) =>
      changeLanguage(e.target.value)
    );
  }

  // 새로 추가: 창 크기 변경 시 크기 업데이트
  window.addEventListener("resize", () => {
    updateDimensions();
    if (svg && simulation) {
      svg.attr("viewBox", [0, 0, width, height]);
      simulation.force("center", d3.forceCenter(width / 2, height / 2));
      simulation.alpha(0.3).restart();
    }
  });
});

// 새로 추가: i18n 핵심 함수
// 1. 언어 감지 (URL 매개변수 > navigator.language > 'en')
function detectLanguage() {
  // 1. URL 매개변수에서 우선 읽기
  const urlParams = new URLSearchParams(window.location.search);
  const urlLang = urlParams.get("lang");
  if (urlLang && ["en", "zh-TW"].includes(urlLang)) {
    return urlLang;
  }

  // 2. 브라우저 언어 확인 (localStorage 확인 제거)
  const browserLang = navigator.language || navigator.userLanguage || "en";
  if (browserLang.toLowerCase().startsWith("zh")) return "zh-TW"; // 간체도 먼저 번체로 폴백

  // 3. 기본값
  return "en";
}

// 2. 비동기 번역 파일 로드
async function loadTranslations(lang) {
  try {
    const response = await fetch(`/locales/${lang}.json`);
    if (!response.ok) {
      throw new Error(
        `Failed to load ${lang}.json, status: ${response.status}`
      );
    }
    translations = await response.json();
    console.log(`Translations loaded for ${lang}`);
  } catch (error) {
    console.error("Error loading translations:", error);
    if (lang !== "en") {
      console.warn(`Falling back to English translations.`);
      await loadTranslations("en"); // 영어로 폴백
    } else {
      translations = {}; // 영어도 실패하면 번역 초기화
      // 더 영구적인 오류 메시지를 표시할 수 있습니다.
      alert("Critical error: Could not load language files.");
    }
  }
}

// 3. 번역 함수
function translate(key, replacements = {}) {
  let translated = translations[key] || key; // 키 자체로 폴백
  // 간단한 치환 자리 표시자 (예: {message})
  for (const placeholder in replacements) {
    translated = translated.replace(
      `{${placeholder}}`,
      replacements[placeholder]
    );
  }
  return translated;
}

// 4. DOM에 번역 적용 (textContent, placeholder, title 처리)
function applyTranslations() {
  console.log("Applying translations for:", currentLang);
  document.querySelectorAll("[data-i18n-key]").forEach((el) => {
    const key = el.dataset.i18nKey;
    const translatedText = translate(key);

    // 특정 속성 먼저 처리
    if (el.hasAttribute("placeholder")) {
      el.placeholder = translatedText;
    } else if (el.hasAttribute("title")) {
      el.title = translatedText;
    } else if (el.tagName === "OPTION") {
      el.textContent = translatedText;
      // 필요한 경우 value도 번역할 수 있지만 일반적으로 필요하지 않음
    } else {
      // 대부분의 요소에 대해 textContent 설정
      el.textContent = translatedText;
    }
  });
  // 데이터 키가 없는 요소(있는 경우)를 수동으로 업데이트
  // 예: footer 시간 형식이 로컬라이즈되어야 하는 경우 여기에서 처리
  // updateCurrentTime(); // 시간 형식도 업데이트되어야 함(필요한 경우)
}

// 5. i18n 초기화
async function initI18n() {
  currentLang = detectLanguage();
  console.log(`Initializing i18n with language: ${currentLang}`);
  // << 새로 추가: 전환기 초기값 설정 >>
  if (langSwitcher) {
    langSwitcher.value = currentLang;
  }
  await loadTranslations(currentLang);
  applyTranslations();
  await fetchTasks();
}

// 새로 추가: 언어 전환 함수
function changeLanguage(lang) {
  if (!lang || !["en", "zh-TW"].includes(lang)) {
    console.warn(`Invalid language selected: ${lang}. Defaulting to English.`);
    lang = "en";
  }
  currentLang = lang;
  console.log(`Changing language to: ${currentLang}`);
  loadTranslations(currentLang)
    .then(() => {
      console.log("Translations reloaded, applying...");
      applyTranslations();
      console.log("Re-rendering components...");
      // 다시 번역이 필요한 구성 요소 렌더링
      renderTasks();
      if (selectedTaskId) {
        const task = tasks.find((t) => t.id === selectedTaskId);
        if (task) {
          selectTask(selectedTaskId); // ID를 전달하여 selectTask가 다시 찾고 렌더링
        } else {
          // 선택된 작업이 더 이상 존재하지 않으면 세부 사항 클리어
          taskDetailsContent.innerHTML = `<p class="placeholder">${translate(
            "task_details_placeholder"
          )}</p>`;
          selectedTaskId = null;
          highlightNode(null);
        }
      } else {
        // 작업이 선택되지 않은 경우 세부 사항 패널이 플레이스홀더를 표시하도록 함
        taskDetailsContent.innerHTML = `<p class="placeholder">${translate(
          "task_details_placeholder"
        )}</p>`;
      }
      renderDependencyGraph(); // 다시 차트 렌더링 (플레이스홀더 포함)
      updateProgressIndicator(); // 다시 진행률 표시줄 렌더링 (레이블 포함)
      renderGlobalAnalysisResult(); // 전역 분석 다시 렌더링 (제목)
      // 드롭다운 메뉴의 값이 현재 언어와 일치하도록 확인
      if (langSwitcher) langSwitcher.value = currentLang;
      console.log("Language change complete.");
    })
    .catch((error) => {
      console.error("Error changing language:", error);
      // 사용자에게 피드백을 줄 수 있습니다. 예: 오류 메시지 표시
      showTemporaryError("Failed to change language. Please try again."); // 번역 키가 필요함
    });
}
// --- i18n 핵심 함수 끝 ---

// 작업 데이터 가져오기
async function fetchTasks() {
  try {
    // 초기 로딩 시 로딩 표시 (현재는 번역 사용)
    if (tasks.length === 0) {
      taskListElement.innerHTML = `<div class="loading">${translate(
        "task_list_loading"
      )}</div>`;
    }

    const response = await fetch("/api/tasks");

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    const newTasks = data.tasks || [];

    // 전역 분석 결과 (첫 번째 비어있지 않은 것 찾기)
    let foundAnalysisResult = null;
    for (const task of newTasks) {
      if (task.analysisResult) {
        foundAnalysisResult = task.analysisResult;
        break; // 하나만 찾으면 됨
      }
    }
    // 저장된 결과와 현재 결과가 다를 때만 업데이트
    if (foundAnalysisResult !== globalAnalysisResult) {
      globalAnalysisResult = foundAnalysisResult;
      renderGlobalAnalysisResult(); // 표시 업데이트
    }

    // --- 스마트 업데이트 로직 (초기 - 여전히 깜박임 방지 필요) ---
    // 작업 수 또는 식별자를 비교하여 다시 렌더링할지 결정
    // 이상적으로는 각 작업의 내용을 비교하고 DOM 업데이트
    const tasksChanged = didTasksChange(tasks, newTasks);

    if (tasksChanged) {
      tasks = newTasks; // 전역 작업 목록 업데이트
      console.log("Tasks updated via fetch, re-rendering...");
      renderTasks();
      updateProgressIndicator();
      renderDependencyGraph(); // 차트 업데이트
    } else {
      console.log(
        "No significant task changes detected, skipping full re-render."
      );
      // 목록을 다시 렌더링할 필요가 없으면 진행률 표시줄만 업데이트
      updateProgressIndicator();
      // 차트를 업데이트해야 할지 고려 (상태가 변경되었을 경우)
      // renderDependencyGraph(); // 임시로 주석 처리, 상태 변경이 중요한 경우가 아니면
    }

    // *** setTimeout 폴링 제거 ***
    // setTimeout(fetchTasks, 30000);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    // 기존 목록을 덮어쓰지 않고 초기 로딩 실패 시에만
    if (tasks.length === 0) {
      taskListElement.innerHTML = `<div class="error">${translate(
        "error_loading_tasks",
        { message: error.message }
      )}</div>`;
      if (progressIndicator) progressIndicator.style.display = "none";
      if (dependencyGraphElement)
        dependencyGraphElement.innerHTML = `<div class="error">${translate(
          "error_loading_graph"
        )}</div>`;
    } else {
      showTemporaryError(
        translate("error_updating_tasks", { message: error.message })
      );
    }
  }
}

// 새로 추가: Server-Sent Events 연결 설정
function setupSSE() {
  console.log("Setting up SSE connection to /api/tasks/stream");
  const evtSource = new EventSource("/api/tasks/stream");

  evtSource.onmessage = function (event) {
    console.log("SSE message received:", event.data);
    // event.data 내용에 따라 더 복잡한 판단을 할 수 있습니다. 현재는 메시지를 받으면 업데이트
  };

  evtSource.addEventListener("update", function (event) {
    console.log("SSE 'update' event received:", event.data);
    // 업데이트 이벤트를 받으면 작업 목록 다시 가져오기
    fetchTasks();
  });

  evtSource.onerror = function (err) {
    console.error("EventSource failed:", err);
    // 재연결 로직 구현 가능
    evtSource.close(); // 오류가 발생한 연결 닫기
    // 잠시 후 다시 연결 시도
    setTimeout(setupSSE, 5000); // 5초 후 다시 시도
  };

  evtSource.onopen = function () {
    console.log("SSE connection opened.");
  };
}

// 새로 추가: 작업 목록 변경 여부 비교 보조 함수 (가장 완벽한 버전)
function didTasksChange(oldTasks, newTasks) {
  if (!oldTasks || !newTasks) return true; // 초기 로딩 또는 오류 상태 처리

  if (oldTasks.length !== newTasks.length) {
    console.log("Task length changed.");
    return true; // 길이 변경은 업데이트가 필요함
  }

  const oldTaskMap = new Map(oldTasks.map((task) => [task.id, task]));
  const newTaskIds = new Set(newTasks.map((task) => task.id)); // 제거된 작업 확인

  // 먼저 제거된 작업 확인
  for (const oldTask of oldTasks) {
    if (!newTaskIds.has(oldTask.id)) {
      console.log(`Task removed: ${oldTask.id}`);
      return true;
    }
  }

  // 새로운 또는 수정된 작업 확인
  for (const newTask of newTasks) {
    const oldTask = oldTaskMap.get(newTask.id);
    if (!oldTask) {
      console.log(`New task found: ${newTask.id}`);
      return true; // 새 작업 ID 발견
    }

    // 관련 필드 비교
    const fieldsToCompare = [
      "name",
      "description",
      "status",
      "notes",
      "implementationGuide",
      "verificationCriteria",
      "summary",
    ];

    for (const field of fieldsToCompare) {
      if (oldTask[field] !== newTask[field]) {
        // null/undefined 비교에 주의가 필요합니다.
        // 예: !(oldTask[field] == null && newTask[field] == null)은 하나가 null/undefined이고 다른 하나가 아니면 체크합니다.
        if (
          !(oldTask[field] === null && newTask[field] === null) &&
          !(oldTask[field] === undefined && newTask[field] === undefined)
        ) {
          console.log(`Task ${newTask.id} changed field: ${field}`);
          return true;
        }
      }
    }

    // 의존성 (문자열 또는 객체 배열) 비교
    if (!compareDependencies(oldTask.dependencies, newTask.dependencies)) {
      console.log(`Task ${newTask.id} changed field: dependencies`);
      return true;
    }

    // 관련 파일 (객체 배열) 비교 - 먼저 단순 길이 체크
    if (!compareRelatedFiles(oldTask.relatedFiles, newTask.relatedFiles)) {
      console.log(`Task ${newTask.id} changed field: relatedFiles`);
      return true;
    }

    // 옵션: updatedAt을 마지막 확인으로 비교하여 다른 필드가 동일하게 보이면
    if (oldTask.updatedAt?.toString() !== newTask.updatedAt?.toString()) {
      console.log(`Task ${newTask.id} changed field: updatedAt (fallback)`);
      return true;
    }
  }

  return false; // 중요한 변경이 감지되지 않음
}

// 의존성 배열 비교 도우미 함수
function compareDependencies(deps1, deps2) {
  const arr1 = deps1 || [];
  const arr2 = deps2 || [];

  if (arr1.length !== arr2.length) return false;

  // 문자열 또는 객체 {taskId: string}인 ID 추출
  const ids1 = new Set(
    arr1.map((dep) =>
      typeof dep === "object" && dep !== null ? dep.taskId : dep
    )
  );
  const ids2 = new Set(
    arr2.map((dep) =>
      typeof dep === "object" && dep !== null ? dep.taskId : dep
    )
  );

  if (ids1.size !== ids2.size) return false; // 고유 의존성 수가 다름
  for (const id of ids1) {
    if (!ids2.has(id)) return false;
  }
  return true;
}

// 관련 파일 배열 비교 도우미 함수 (단순 또는 복잡)
function compareRelatedFiles(files1, files2) {
  const arr1 = files1 || [];
  const arr2 = files2 || [];

  if (arr1.length !== arr2.length) return false;

  // 단순 비교: 경로와 유형이 동일한 순서에서 동일한지 확인
  // 더 강력한 확인을 위해 문자열 집합 `path|type` 또는 깊은 객체 비교 사용
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i].path !== arr2[i].path || arr1[i].type !== arr2[i].type) {
      return false;
    }
    // 필요한 경우 추가 필드 비교 (description, lines 등)
    // if (arr1[i].description !== arr2[i].description) return false;
  }
  return true;
}

// 새로 추가: 임시 오류 메시지 표시 함수
function showTemporaryError(message) {
  const errorElement = document.createElement("div");
  errorElement.className = "temporary-error";
  errorElement.textContent = message; // 메시지 자체 유지
  document.body.appendChild(errorElement);
  setTimeout(() => {
    errorElement.remove();
  }, 3000); // 3초 표시
}

// 작업 목록 렌더링 - *** 더 똑똑한 업데이트를 위해 최적화가 필요합니다 ***
function renderTasks() {
  console.log("Rendering tasks..."); // 로그 추가
  const filterValue = statusFilter.value;

  let filteredTasks = tasks;
  if (filterValue !== "all") {
    filteredTasks = filteredTasks.filter((task) => task.status === filterValue);
  }

  if (searchTerm) {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    filteredTasks = filteredTasks.filter(
      (task) =>
        (task.name && task.name.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (task.description &&
          task.description.toLowerCase().includes(lowerCaseSearchTerm))
    );
  }

  // 필터링된 작업 ID 집합을 그래프 렌더링에 사용
  const filteredTaskIds = new Set(filteredTasks.map(task => task.id));

  filteredTasks.sort((a, b) => {
    switch (sortOption) {
      case "name-asc":
        return (a.name || "").localeCompare(b.name || "");
      case "name-desc":
        return (b.name || "").localeCompare(a.name || "");
      case "status":
        const statusOrder = { pending: 1, in_progress: 2, completed: 3 };
        return (statusOrder[a.status] || 0) - (statusOrder[b.status] || 0);
      case "date-asc":
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      case "date-desc":
      default:
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    }
  });

  // 그래프 표시 상태 업데이트
  updateGraphVisibility(filteredTaskIds);

  // --- 단순 대체 (깜박임 발생) ---
  // TODO: DOM Diffing 또는 더 똑똑한 업데이트 전략 구현
  if (filteredTasks.length === 0) {
    taskListElement.innerHTML = `<div class="placeholder">${translate(
      "task_list_empty"
    )}</div>`;
  } else {
    taskListElement.innerHTML = filteredTasks
      .map(
        (task) => `
            <div class="task-item status-${task.status.replace(
              "_",
              "-"
            )}" data-id="${task.id}" onclick="selectTask('${task.id}')">
            <h3>${task.name}</h3>
            <div class="task-meta">
                <span class="task-status status-${task.status.replace(
                  "_",
                  "-"
                )}">${getStatusText(task.status)}</span>
            </div>
            </div>
        `
      )
      .join("");
  }
  // --- 단순 대체 끝 ---

  // 다시 선택 상태 적용
  if (selectedTaskId) {
    const taskExists = tasks.some((t) => t.id === selectedTaskId);
    if (taskExists) {
      const selectedElement = document.querySelector(
        `.task-item[data-id="${selectedTaskId}"]`
      );
      if (selectedElement) {
        selectedElement.classList.add("selected");
      }
    } else {
      // 새로운 목록에서 선택된 작업이 더 이상 존재하지 않으면 선택 해제
      console.log(
        `Selected task ${selectedTaskId} no longer exists, clearing selection.`
      );
      selectedTaskId = null;
      taskDetailsContent.innerHTML = `<p class="placeholder">${translate(
        "task_details_placeholder"
      )}</p>`;
      highlightNode(null); // 그래프 강조 해제
    }
  }
}

// 새로 추가: 그래프 가시성 업데이트 함수
function updateGraphVisibility(filteredTaskIds) {
  if (!g) return;

  // 노드 스타일 업데이트
  g.select(".nodes")
    .selectAll("g.node-item")
    .style("opacity", d => filteredTaskIds.has(d.id) ? 1 : 0.2)
    .style("filter", d => filteredTaskIds.has(d.id) ? "none" : "grayscale(80%)");

  // 연결 스타일 업데이트
  g.select(".links")
    .selectAll("line.link")
    .style("opacity", d => {
      const sourceVisible = filteredTaskIds.has(d.source.id || d.source);
      const targetVisible = filteredTaskIds.has(d.target.id || d.target);
      return (sourceVisible && targetVisible) ? 0.6 : 0.1;
    })
    .style("stroke", d => {
      const sourceVisible = filteredTaskIds.has(d.source.id || d.source);
      const targetVisible = filteredTaskIds.has(d.target.id || d.target);
      return (sourceVisible && targetVisible) ? "#999" : "#ccc";
    });

  // 축소판의 노드 및 연결 스타일 업데이트
  const minimapContent = svg.select(".minimap-content");
  
  minimapContent.selectAll(".minimap-node")
    .style("opacity", d => filteredTaskIds.has(d.id) ? 1 : 0.2)
    .style("filter", d => filteredTaskIds.has(d.id) ? "none" : "grayscale(80%)");

  minimapContent.selectAll(".minimap-link")
    .style("opacity", d => {
      const sourceVisible = filteredTaskIds.has(d.source.id || d.source);
      const targetVisible = filteredTaskIds.has(d.target.id || d.target);
      return (sourceVisible && targetVisible) ? 0.6 : 0.1;
    })
    .style("stroke", d => {
      const sourceVisible = filteredTaskIds.has(d.source.id || d.source);
      const targetVisible = filteredTaskIds.has(d.target.id || d.target);
      return (sourceVisible && targetVisible) ? "#999" : "#ccc";
    });
}

// 새로 추가: 노드를 뷰 중앙으로 이동하는 함수
function centerNode(nodeId) {
  if (!svg || !g || !simulation) return;

  const node = simulation.nodes().find(n => n.id === nodeId);
  if (!node) return;

  // 현재 뷰의 변환 상태 가져오기
  const transform = d3.zoomTransform(svg.node());
  
  // 노드를 중앙으로 이동하는 데 필요한 변환 계산
  const scale = transform.k; // 현재 확대/축소 수준 유지
  const x = width / 2 - node.x * scale;
  const y = height / 2 - node.y * scale;

  // 부드러운 전환을 통해 새 위치로 이동
  svg.transition()
    .duration(750) // 750ms 전환 시간
    .call(zoom.transform, d3.zoomIdentity
      .translate(x, y)
      .scale(scale)
    );
}

// 작업 선택 함수 수정
function selectTask(taskId) {
  // 이전 선택 상태 및 강조 해제
  if (selectedTaskId) {
    const previousElement = document.querySelector(
      `.task-item[data-id="${selectedTaskId}"]`
    );
    if (previousElement) {
      previousElement.classList.remove("selected");
    }
  }

  // 동일한 작업을 다시 클릭하면 선택 해제
  if (selectedTaskId === taskId) {
    selectedTaskId = null;
    taskDetailsContent.innerHTML = `<p class="placeholder">${translate(
      "task_details_placeholder"
    )}</p>`;
    highlightNode(null); // 강조 해제
    return;
  }

  selectedTaskId = taskId;

  // 새로운 선택 상태 추가
  const selectedElement = document.querySelector(
    `.task-item[data-id="${taskId}"]`
  );
  if (selectedElement) {
    selectedElement.classList.add("selected");
  }

  // 작업 세부 사항 가져와서 표시
  const task = tasks.find((t) => t.id === taskId);

  if (!task) {
    taskDetailsContent.innerHTML = `<div class="placeholder">${translate(
      "error_task_not_found"
    )}</div>`;
    return;
  }

  // --- 안전하게 작업 세부 사항 채우기 ---
  // 1. 기본 구조 (innerHTML을 사용하지만 동적 콘텐츠를 ID가 있는 빈 요소로 대체)
  taskDetailsContent.innerHTML = `
    <div class="task-details-header">
      <h3 id="detail-name"></h3>
      <div class="task-meta">
        <span>${translate(
          "task_detail_status_label"
        )} <span id="detail-status" class="task-status"></span></span>
      </div>
    </div>
    
    <!-- 새로 추가: 조건부 요약 표시 -->
    <div class="task-details-section" id="detail-summary-section" style="display: none;">
      <h4>${translate("task_detail_summary_title")}</h4>
      <p id="detail-summary"></p>
    </div>
    
    <div class="task-details-section">
      <h4>${translate("task_detail_description_title")}</h4>
      <p id="detail-description"></p>
    </div>
    
    <div class="task-details-section">
      <h4>${translate("task_detail_implementation_guide_title")}</h4>
      <pre id="detail-implementation-guide"></pre>
    </div>
    
    <div class="task-details-section">
      <h4>${translate("task_detail_verification_criteria_title")}</h4>
      <p id="detail-verification-criteria"></p>
    </div>
    
    <div class="task-details-section">
      <h4>${translate("task_detail_dependencies_title")}</h4>
      <div class="dependencies" id="detail-dependencies">
        <!-- 의존성은 JS에 의해 채워집니다 -->
      </div>
    </div>
    
    <div class="task-details-section">
      <h4>${translate("task_detail_related_files_title")}</h4>
      <div class="related-files" id="detail-related-files">
        <!-- 관련 파일은 JS에 의해 채워집니다 -->
      </div>
    </div>

    <div class="task-details-section">
      <h4>${translate("task_detail_notes_title")}</h4>
      <p id="detail-notes"></p>
    </div>
  `;

  // 2. 대응하는 요소를 가져와서 안전하게 콘텐츠 채우기
  const detailName = document.getElementById("detail-name");
  const detailStatus = document.getElementById("detail-status");
  const detailDescription = document.getElementById("detail-description");
  const detailImplementationGuide = document.getElementById(
    "detail-implementation-guide"
  );
  const detailVerificationCriteria = document.getElementById(
    "detail-verification-criteria"
  );
  // 새로 추가: 요약 관련 요소 가져오기
  const detailSummarySection = document.getElementById(
    "detail-summary-section"
  );
  const detailSummary = document.getElementById("detail-summary");
  const detailNotes = document.getElementById("detail-notes");
  const detailDependencies = document.getElementById("detail-dependencies");
  const detailRelatedFiles = document.getElementById("detail-related-files");

  if (detailName) detailName.textContent = task.name;
  if (detailStatus) {
    detailStatus.textContent = getStatusText(task.status);
    detailStatus.className = `task-status status-${task.status.replace(
      "_",
      "-"
    )}`;
  }
  if (detailDescription)
    detailDescription.textContent =
      task.description || translate("task_detail_no_description");
  if (detailImplementationGuide)
    detailImplementationGuide.textContent =
      task.implementationGuide ||
      translate("task_detail_no_implementation_guide");
  if (detailVerificationCriteria)
    detailVerificationCriteria.textContent =
      task.verificationCriteria ||
      translate("task_detail_no_verification_criteria");

  // 새로 추가: 요약 채우기 (존재하고 완료된 경우)
  if (task.summary && detailSummarySection && detailSummary) {
    detailSummary.textContent = task.summary;
    detailSummarySection.style.display = "block"; // 섹션 표시
  } else if (detailSummarySection) {
    detailSummarySection.style.display = "none"; // 섹션 숨김
  }

  if (detailNotes)
    detailNotes.textContent = task.notes || translate("task_detail_no_notes");

  // 3. 동적으로 의존성 및 관련 파일 생성 (이러한 것들은 안전한 HTML 구조를 포함할 수 있습니다)
  if (detailDependencies) {
    const dependenciesHtml =
      task.dependencies && task.dependencies.length
        ? task.dependencies
            .map((dep) => {
              const depId =
                typeof dep === "object" && dep !== null && dep.taskId
                  ? dep.taskId
                  : dep;
              const depTask = tasks.find((t) => t.id === depId);
              // 알 수 없는 의존성에 대한 번역 폴백 텍스트
              const depName = depTask
                ? depTask.name
                : `${translate("task_detail_unknown_dependency")}(${depId})`;
              const span = document.createElement("span");
              span.className = "dependency-tag";
              span.dataset.id = depId;
              span.textContent = depName;
              span.onclick = () => highlightNode(depId);
              return span.outerHTML;
            })
            .join("")
        : `<span class="placeholder">${translate(
            "task_detail_no_dependencies"
          )}</span>`; // 번역 플레이스홀더
    detailDependencies.innerHTML = dependenciesHtml;
  }

  if (detailRelatedFiles) {
    const relatedFilesHtml =
      task.relatedFiles && task.relatedFiles.length
        ? task.relatedFiles
            .map((file) => {
              const span = document.createElement("span");
              span.className = "file-tag";
              span.title = file.description || "";
              const pathText = document.createTextNode(`${file.path} `);
              const small = document.createElement("small");
              small.textContent = `(${file.type})`; // 유형은 기술적일 수 있으므로 번역이 필요하지 않을 수 있습니다.
              span.appendChild(pathText);
              span.appendChild(small);
              return span.outerHTML;
            })
            .join("")
        : `<span class="placeholder">${translate(
            "task_detail_no_related_files"
          )}</span>`; // 번역 플레이스홀더
    detailRelatedFiles.innerHTML = relatedFilesHtml;
  }

  // --- 원래의 innerHTML 할당은 제거되었습니다 ---

  // 노드 강조 및 중앙으로 이동
  highlightNode(taskId);
  centerNode(taskId);
}

// 새로 추가: 뷰 재설정 기능
function resetView() {
  if (!svg || !simulation) return;

  // 재설정 애니메이션 효과 추가
  resetViewBtn.classList.add("resetting");

  // 뷰 중앙 계산
  const centerX = width / 2;
  const centerY = height / 2;

  // 확대/축소 및 이동 재설정 (transform 전환 사용)
  svg.transition()
    .duration(750)
    .call(zoom.transform, d3.zoomIdentity);

  // 모든 노드 위치를 중앙 근처로 재설정
  simulation.nodes().forEach(node => {
    node.x = centerX + (Math.random() - 0.5) * 50; // 중앙 근처에서 랜덤 분포
    node.y = centerY + (Math.random() - 0.5) * 50;
    node.fx = null; // 고정 위치 제거
    node.fy = null;
  });

  // 력 방향 시뮬레이션 재설정
  simulation
    .force("center", d3.forceCenter(centerX, centerY))
    .alpha(1) // 완전히 시뮬레이션 재시작
    .restart();

  // 750ms 후 애니메이션 클래스 제거
  setTimeout(() => {
    resetViewBtn.classList.remove("resetting");
  }, 750);
}

// 새로 추가: 줌 동작 초기화
function initZoom() {
  zoom = d3.zoom()
    .scaleExtent([0.1, 4]) // 확대/축소 범위 설정
    .on("zoom", (event) => {
      g.attr("transform", event.transform);
      updateMinimap(); // 확대/축소 시 축소판 업데이트
    });
  
  if (svg) {
    svg.call(zoom);
  }
}

// 의존성 관계 그래프 렌더링 - 전역 뷰 및 enter/update/exit 모드로 변경
function renderDependencyGraph() {
  if (!dependencyGraphElement || !window.d3) {
    console.warn("D3 또는 의존성 그래프 요소를 찾을 수 없습니다.");
    if (dependencyGraphElement) {
      if (!dependencyGraphElement.querySelector("svg")) {
        dependencyGraphElement.innerHTML = `<p class="placeholder">${translate("error_loading_graph_d3")}</p>`;
      }
    }
    return;
  }

  updateDimensions();

  // 작업이 없으면 차트를 비워 플레이스홀더를 표시
  if (tasks.length === 0) {
    dependencyGraphElement.innerHTML = `<p class="placeholder">${translate("dependency_graph_placeholder_empty")}</p>`;
    svg = null;
    g = null;
    simulation = null;
    return;
  }

  // 1. 노드 (Nodes) 및 링크 (Links) 준비
  const nodes = tasks.map((task) => ({
    id: task.id,
    name: task.name,
    status: task.status,
    x: simulation?.nodes().find((n) => n.id === task.id)?.x,
    y: simulation?.nodes().find((n) => n.id === task.id)?.y,
    fx: simulation?.nodes().find((n) => n.id === task.id)?.fx,
    fy: simulation?.nodes().find((n) => n.id === task.id)?.fy,
  }));

  const links = [];
  tasks.forEach((task) => {
    if (task.dependencies && task.dependencies.length > 0) {
      task.dependencies.forEach((dep) => {
        const sourceId = typeof dep === "object" ? dep.taskId : dep;
        const targetId = task.id;
        if (nodes.some((n) => n.id === sourceId) && nodes.some((n) => n.id === targetId)) {
          links.push({ source: sourceId, target: targetId });
        } else {
          console.warn(`Dependency link ignored: Task ${sourceId} or ${targetId} not found in task list.`);
        }
      });
    }
  });

  if (!svg) {
    // --- 첫 렌더링 ---
    console.log("First render of dependency graph");
    dependencyGraphElement.innerHTML = "";

    svg = d3.select(dependencyGraphElement)
      .append("svg")
      .attr("viewBox", [0, 0, width, height])
      .attr("preserveAspectRatio", "xMidYMid meet");

    // 축소판 배경 추가
    const minimapSize = Math.min(width, height) * 0.2; // 축소판 크기를 메인 뷰의 20%로 설정
    const minimapMargin = 40;
    
    // 축소판 컨테이너 생성
    const minimap = svg.append("g")
      .attr("class", "minimap")
      .attr("transform", `translate(${width - minimapSize - minimapMargin}, ${height - minimapSize - minimapMargin*(height/width)})`);

    // 축소판 배경 추가
    minimap.append("rect")
      .attr("width", minimapSize)
      .attr("height", minimapSize)
      .attr("fill", "rgba(0, 0, 0, 0.2)")
      .attr("stroke", "#666")
      .attr("stroke-width", 1)
      .attr("rx", 4)
      .attr("ry", 4);

    // 축소판 내용 그룹 생성
    minimap.append("g")
      .attr("class", "minimap-content");

    // 뷰포트 지시자 추가
    minimap.append("rect")
      .attr("class", "minimap-viewport");

    g = svg.append("g");

    // 줌 동작 초기화
    initZoom();

    // 화살표 정의 추가
    g.append("defs")
      .append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "-0 -5 10 10")
      .attr("refX", 25)
      .attr("refY", 0)
      .attr("orient", "auto")
      .attr("markerWidth", 8)
      .attr("markerHeight", 8)
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#999");

    // 력 방향 시뮬레이션 초기화
    simulation = d3.forceSimulation()
      .force("link", d3.forceLink().id((d) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(30))
      // 새로 추가: 수평 분포 힘, 노드가 수평 방향으로 분포되도록 하여 노드의 입력 및 출력 차수에 따라 노드의 수평 위치를 결정하고, 입력 차수가 0인 노드(시작 노드)는 왼쪽에, 출력 차수가 0인 노드(종료 노드)는 오른쪽에 배치하며, 다른 노드는 중앙에 배치합니다.
      .force("x", d3.forceX().x(d => {
        // 노드의 입력 및 출력 차수 계산
        const inDegree = links.filter(l => (l.target.id || l.target) === d.id).length;
        const outDegree = links.filter(l => (l.source.id || l.source) === d.id).length;
        
        if (inDegree === 0) {
          // 입력 차수가 0인 노드(시작 노드)는 왼쪽에
          return width * 0.2;
        } else if (outDegree === 0) {
          // 출력 차수가 0인 노드(종료 노드)는 오른쪽에
          return width * 0.8;
        } else {
          // 다른 노드는 중앙에
          return width * 0.5;
        }
      }).strength(0.2))
      // 새로 추가: 노드 차수에 따른 수직 분포 힘
      .force("y", d3.forceY().y(height / 2).strength(d => {
        // 노드의 총 차수(입력 + 출력) 계산
        const inDegree = links.filter(l => (l.target.id || l.target) === d.id).length;
        const outDegree = links.filter(l => (l.source.id || l.source) === d.id).length;
        const totalDegree = inDegree + outDegree;
        
        // 차수가 클수록 힘이 커집니다(기본 힘 0.05, 각 연결마다 0.03 증가, 최대 0.3)
        return Math.min(0.05 + totalDegree * 0.03, 0.3);
      }))
      .on("tick", ticked);

    // 연결 및 노드를 저장할 그룹 추가
    g.append("g").attr("class", "links");
    g.append("g").attr("class", "nodes");
  } else {
    // --- 차트 렌더링 업데이트 ---
    console.log("Updating dependency graph");
    svg.attr("viewBox", [0, 0, width, height]);
    simulation.force("center", d3.forceCenter(width / 2, height / 2));
  }

  // --- 안정화된 노드 위치 미리 계산 ---
  // 안정화 계산을 위해 노드 및 링크 복사
  const stableNodes = [...nodes];
  const stableLinks = [...links];
  
  // 임시 시뮬레이터를 만들어 안정된 위치 계산
  const stableSim = d3
    .forceSimulation(stableNodes)
    .force("link", d3.forceLink(stableLinks).id(d => d.id).distance(100))
    .force("charge", d3.forceManyBody().strength(-300))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collide", d3.forceCollide().radius(30));
  
  // 시뮬레이션을 미리 실행하여 안정된 위치 얻기
  for (let i = 0; i < 10; i++) {
    stableSim.tick();
  }
  
  // 안정된 위치를 원래 노드로 복사
  stableNodes.forEach((stableNode) => {
    const originalNode = nodes.find(n => n.id === stableNode.id);
    if (originalNode) {
      originalNode.x = stableNode.x;
      originalNode.y = stableNode.y;
    }
  });
  
  // 임시 시뮬레이터 중지
  stableSim.stop();
  // --- 안정화 종료 ---

  // 3. 링크 업데이트 (애니메이션 없음)
  const linkSelection = g
    .select(".links") // 연결을 배치할 g 요소 선택
    .selectAll("line.link")
    .data(
      links,
      (d) => `${d.source.id || d.source}-${d.target.id || d.target}`
    ); // 키 함수: source/target ID 기반

  // Exit - 이전 링크 직접 제거
  linkSelection.exit().remove();

  // Enter - 새 링크 추가 (애니메이션 없음)
  const linkEnter = linkSelection
    .enter()
    .append("line")
    .attr("class", "link")
    .attr("stroke", "#999")
    .attr("marker-end", "url(#arrowhead)")
    .attr("stroke-opacity", 0.6)
    .attr("stroke-width", 1.5);

  // 즉시 링크 위치 설정
  linkEnter
    .attr("x1", d => d.source.x || 0)
    .attr("y1", d => d.source.y || 0)
    .attr("x2", d => d.target.x || 0)
    .attr("y2", d => d.target.y || 0);

  // 4. 노드 업데이트 (애니메이션 없음)
  const nodeSelection = g
    .select(".nodes") // 노드를 배치할 g 요소 선택
    .selectAll("g.node-item")
    .data(nodes, (d) => d.id); // ID를 키로 사용

  // Exit - 이전 노드 직접 제거
  nodeSelection.exit().remove();

  // Enter - 새 노드 그룹 추가 (애니메이션 없음, 최종 위치에서 직접 생성)
  const nodeEnter = nodeSelection
    .enter()
    .append("g")
    .attr("class", (d) => `node-item status-${getStatusClass(d.status)}`) // 도우미 함수를 사용하여 class 설정
    .attr("data-id", (d) => d.id)
    // 예상된 위치를 직접 사용하고 확대/투명도 전환 제거
    .attr("transform", (d) => `translate(${d.x || 0}, ${d.y || 0})`)
    .call(drag(simulation)); // 드래그 추가

  // Enter 선택 집합에 원형 추가
  nodeEnter
    .append("circle")
    .attr("r", 10)
    .attr("stroke", "#fff")
    .attr("stroke-width", 1.5)
    .attr("fill", getNodeColor); // 직접 색상 설정

  // Enter 선택 집합에 텍스트 추가
  nodeEnter
    .append("text")
    .attr("x", 15)
    .attr("y", 3)
    .text((d) => d.name)
    .attr("font-size", "10px")
    .attr("fill", "#ccc");

  // Enter 선택 집합에 제목 (tooltip) 추가
  nodeEnter
    .append("title")
    .text((d) => `${d.name} (${getStatusText(d.status)})`);

  // Enter 선택 집합에 클릭 이벤트 추가
  nodeEnter.on("click", (event, d) => {
    selectTask(d.id);
    event.stopPropagation();
  });

  // Update - 즉시 기존 노드 업데이트 (애니메이션 없음)
  nodeSelection
    .attr("transform", (d) => `translate(${d.x || 0}, ${d.y || 0})`)
    .attr("class", (d) => `node-item status-${getStatusClass(d.status)}`);

  nodeSelection
    .select("circle")
    .attr("fill", getNodeColor);

  // << 새로 추가: drag 함수 재정의 >>
  function drag(simulation) {
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      // 고정 위치 해제, 노드가 힘에 의해 영향을 받도록 함 (필요한 경우)
      // d.fx = null;
      // d.fy = null;
      // 또는 다시 드래그될 때까지 고정 위치 유지
    }

    return d3
      .drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  }
  // << drag 함수 정의 끝 >>

  // 5. 력 방향 시뮬레이션 업데이트, 시작 안 함
  simulation.nodes(nodes); // 시뮬레이션 노드 업데이트
  simulation.force("link").links(links); // 시뮬레이션 링크 업데이트
  
  // 수평 분포 힘의 목표 위치 업데이트
  simulation.force("x").x(d => {
    const inDegree = links.filter(l => (l.target.id || l.target) === d.id).length;
    const outDegree = links.filter(l => (l.source.id || l.source) === d.id).length;
    
    if (inDegree === 0) {
      return width * 0.2;
    } else if (outDegree === 0) {
      return width * 0.8;
    } else {
      return width * 0.5;
    }
  });
  // 주의: restart() 호출 제거, 새로고침 시 애니메이션 깜박임 방지
}

// Tick 함수: 노드 및 링크 위치 업데이트
function ticked() {
  if (!g) return;

  // 링크 위치 업데이트
  g.select(".links")
    .selectAll("line.link")
    .attr("x1", (d) => d.source.x)
    .attr("y1", (d) => d.source.y)
    .attr("x2", (d) => d.target.x)
    .attr("y2", (d) => d.target.y);

  // 노드 그룹 위치 업데이트
  g.select(".nodes")
    .selectAll("g.node-item")
    // << 수정: 좌표 후보값 추가 >>
    .attr("transform", (d) => `translate(${d.x || 0}, ${d.y || 0})`);

  // 축소판 업데이트
  updateMinimap();
}

// 함수: 노드 데이터에 따라 색상 반환 (예시)
function getNodeColor(nodeData) {
  switch (nodeData.status) {
    case "완료":
    case "completed":
      return "var(--secondary-color)";
    case "진행 중":
    case "in_progress":
      return "var(--primary-color)";
    case "대기 중":
    case "pending":
      return "#f1c40f"; // 진행률 표시줄 및 상태 태그와 일치
    default:
      return "#7f8c8d"; // 알 수 없는 상태
  }
}

// 보조 함수
function getStatusText(status) {
  switch (status) {
    case "pending":
      return translate("status_pending");
    case "in_progress":
      return translate("status_in_progress");
    case "completed":
      return translate("status_completed");
    default:
      return status;
  }
}

function updateCurrentTime() {
  const now = new Date();
  // 원래 형식 유지, 시간이 로컬라이즈되어야 하는 경우 translate 또는 다른 라이브러리 사용
  const timeString = now.toLocaleString(); // 현재 currentLang에 따라 형식화 고려
  if (currentTimeElement) {
    // 정적 텍스트와 동적 시간 분리
    const footerTextElement = currentTimeElement.parentNode.childNodes[0];
    if (footerTextElement && footerTextElement.nodeType === Node.TEXT_NODE) {
      footerTextElement.nodeValue = translate("footer_copyright");
    }
    currentTimeElement.textContent = timeString;
  }
}
// 프로젝트 진행률 표시줄 업데이트
function updateProgressIndicator() {
  const totalTasks = tasks.length;
  if (totalTasks === 0) {
    progressIndicator.style.display = "none"; // 작업이 없으면 숨김
    return;
  }

  progressIndicator.style.display = "block"; // 확실히 표시

  const completedTasks = tasks.filter(
    (task) => task.status === "completed" || task.status === "완료"
  ).length;
  const inProgressTasks = tasks.filter(
    (task) => task.status === "in_progress" || task.status === "진행 중"
  ).length;
  const pendingTasks = tasks.filter(
    (task) => task.status === "pending" || task.status === "대기 중"
  ).length;

  const completedPercent =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const inProgressPercent =
    totalTasks > 0 ? (inProgressTasks / totalTasks) * 100 : 0;
  const pendingPercent = totalTasks > 0 ? (pendingTasks / totalTasks) * 100 : 0;

  progressCompleted.style.width = `${completedPercent}%`;
  progressInProgress.style.width = `${inProgressPercent}%`;
  progressPending.style.width = `${pendingPercent}%`;

  // 레이블 업데이트 (번역 사용)
  progressLabels.innerHTML = `
    <span class="label-completed">${translate(
      "progress_completed"
    )}: ${completedTasks} (${completedPercent.toFixed(1)}%)</span>
    <span class="label-in-progress">${translate(
      "progress_in_progress"
    )}: ${inProgressTasks} (${inProgressPercent.toFixed(1)}%)</span>
    <span class="label-pending">${translate(
      "progress_pending"
    )}: ${pendingTasks} (${pendingPercent.toFixed(1)}%)</span>
    <span class="label-total">${translate(
      "progress_total"
    )}: ${totalTasks}</span>
  `;
}

// 새로 추가: 전역 분석 결과 렌더링
function renderGlobalAnalysisResult() {
  let targetElement = document.getElementById("global-analysis-result");

  // 요소가 존재하지 않으면 생성하고 적절한 위치에 추가 (예: header 또는 main content 앞)
  if (!targetElement) {
    targetElement = document.createElement("div");
    targetElement.id = "global-analysis-result";
    targetElement.className = "global-analysis-section"; // 스타일 클래스 추가
    // header 뒤 또는 main 앞에 삽입 시도
    const header = document.querySelector("header");
    const mainContent = document.querySelector("main");
    if (header && header.parentNode) {
      header.parentNode.insertBefore(targetElement, header.nextSibling);
    } else if (mainContent && mainContent.parentNode) {
      mainContent.parentNode.insertBefore(targetElement, mainContent);
    } else {
      // 마지막 수단으로 body 시작 부분에 추가
      document.body.insertBefore(targetElement, document.body.firstChild);
    }
  }

  if (globalAnalysisResult) {
    targetElement.innerHTML = `
            <h4 data-i18n-key="global_analysis_title">${translate(
              "global_analysis_title"
            )}</h4> 
            <pre>${globalAnalysisResult}</pre> 
        `;
    targetElement.style.display = "block";
  } else {
    targetElement.style.display = "none"; // 결과가 없으면 숨김
    targetElement.innerHTML = ""; // 내용 비우기
  }
}

// 새로 추가: 의존성 그래프에서 노드 강조
function highlightNode(taskId, status = null) {
  if (!g || !window.d3) return;

  // 모든 노드의 강조 해제
  g.select(".nodes") // g에서 시작하여 선택
    .selectAll("g.node-item")
    .classed("highlighted", false);

  if (!taskId) return;

  // 선택된 노드 강조
  const selectedNode = g
    .select(".nodes") // g에서 시작하여 선택
    .select(`g.node-item[data-id="${taskId}"]`);
  if (!selectedNode.empty()) {
    selectedNode.classed("highlighted", true);
    // 선택된 노드를 맨 앞으로 선택할 수 있습니다.
    // selectedNode.raise();
  }
}

// 새로 추가: 상태 class 가져오기 보조 함수 (ticked 함수 뒤 또는 getNodeColor 앞/뒤에 배치 가능)
function getStatusClass(status) {
  return status ? status.replace(/_/g, "-") : "unknown"; // 모든 밑줄 교체
}

// 새로 추가: 너비 및 높이 업데이트 함수
function updateDimensions() {
  if (dependencyGraphElement) {
    width = dependencyGraphElement.clientWidth;
    height = dependencyGraphElement.clientHeight || 400;
  }
}

// 축소판 업데이트 함수
function updateMinimap() {
  if (!svg || !simulation) return;

  const minimapSize = Math.min(width, height) * 0.2;
  const nodes = simulation.nodes();
  const links = simulation.force("link").links();

  // 현재 그래프의 경계(padding 추가) 계산
  const padding = 20; // 내부 여백 추가
  const xExtent = d3.extent(nodes, d => d.x);
  const yExtent = d3.extent(nodes, d => d.y);
  const graphWidth = (xExtent[1] - xExtent[0]) || width;
  const graphHeight = (yExtent[1] - yExtent[0]) || height;

  // 확대/축소 비율 계산, padding 고려
  const scale = Math.min(
    minimapSize / (graphWidth + padding * 2),
    minimapSize / (graphHeight + padding * 2)
  ) * 0.9; // 안전 계수 0.9

  // 확대/축소 함수 생성, padding 추가
  const minimapX = d3.scaleLinear()
    .domain([xExtent[0] - padding, xExtent[1] + padding])
    .range([0, minimapSize]);
  const minimapY = d3.scaleLinear()
    .domain([yExtent[0] - padding, yExtent[1] + padding])
    .range([0, minimapSize]);

  // 축소판의 연결 업데이트
  const minimapContent = svg.select(".minimap-content");
  const minimapLinks = minimapContent.selectAll(".minimap-link")
    .data(links);

  minimapLinks.enter()
    .append("line")
    .attr("class", "minimap-link")
    .merge(minimapLinks)
    .attr("x1", d => minimapX(d.source.x))
    .attr("y1", d => minimapY(d.source.y))
    .attr("x2", d => minimapX(d.target.x))
    .attr("y2", d => minimapY(d.target.y))
    .attr("stroke", "#999")
    .attr("stroke-width", 0.5)
    .attr("stroke-opacity", 0.6);

  minimapLinks.exit().remove();

  // 축소판의 노드 업데이트
  const minimapNodes = minimapContent.selectAll(".minimap-node")
    .data(nodes);

  minimapNodes.enter()
    .append("circle")
    .attr("class", "minimap-node")
    .attr("r", 2)
    .merge(minimapNodes)
    .attr("cx", d => minimapX(d.x))
    .attr("cy", d => minimapY(d.y))
    .attr("fill", getNodeColor);

  minimapNodes.exit().remove();

  // 뷰포트 지시자 업데이트
  const transform = d3.zoomTransform(svg.node());
  const viewportWidth = width / transform.k;
  const viewportHeight = height / transform.k;
  const viewportX = -transform.x / transform.k;
  const viewportY = -transform.y / transform.k;

  svg.select(".minimap-viewport")
    .attr("x", minimapX(viewportX))
    .attr("y", minimapY(viewportY))
    .attr("width", minimapX(viewportX + viewportWidth) - minimapX(viewportX))
    .attr("height", minimapY(viewportY + viewportHeight) - minimapY(viewportY));
}

// 함수: 노드 드래그 활성화 (변경 없음)
// ... drag ...
