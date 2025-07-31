/**
 * MCP Shrimp Task Manager 웹사이트 메인 스크립트
 */

// 페이지 로드 완료 후 실행
document.addEventListener("DOMContentLoaded", function () {
  // 스크롤 애니메이션 초기화
  initAOS();

  // 모바일 메뉴 초기화
  initMobileMenu();

  // 코드 하이라이트와 복사 기능 초기화
  initCodeBlocks();

  // 부드러운 스크롤 기능
  initSmoothScroll();

  // 히어로 섹션 효과
  initHeroEffects();

  // 문제점과 해결방안 섹션 효과
  initPainPointsEffects();

  // 핵심 기능 전시 섹션 효과
  initFeaturesEffects();

  // 작업 흐름 전시 섹션 효과
  initWorkflowEffects();

  // 설치와 설정 섹션 기능 초기화
  initInstallationSection();

  // 페이지 스크롤 위치를 감지하여 맨 위로 가기 버튼 표시
  initScrollToTopButton();

  // 반응형 이미지 지연 로딩 초기화
  initLazyLoading();

  // 페이지 진입 애니메이션 초기화
  initPageEntranceAnimation();

  // 다국어 기능
  initMultiLanguage();
});

/**
 * AOS 스크롤 애니메이션 라이브러리 초기화
 */
function initAOS() {
  AOS.init({
    duration: 800,
    easing: "ease-in-out",
    once: true,
    mirror: true,
    disable: function () {
      // 사용자 선호 설정에 따라 저성능 기기에서만 애니메이션 비활성화
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    },
  });

  // 창 크기 조정 시 AOS를 다시 초기화하여 올바른 트리거 위치 보장
  window.addEventListener("resize", function () {
    AOS.refresh();
  });
}

/**
 * 모바일 메뉴 초기화
 */
function initMobileMenu() {
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", function (e) {
      e.preventDefault();

      // 전환 효과를 지원하기 위해 먼저 hidden 클래스 제거
      if (mobileMenu.classList.contains("hidden")) {
        mobileMenu.classList.remove("hidden");

        // DOM 업데이트를 기다린 후 visible 클래스 추가하여 전환 효과 시작
        setTimeout(() => {
          mobileMenu.classList.add("visible");
        }, 10);
      } else {
        // 먼저 visible 클래스 제거하여 전환 효과 트리거
        mobileMenu.classList.remove("visible");

        // 전환이 완료된 후 메뉴 숨기기
        setTimeout(() => {
          mobileMenu.classList.add("hidden");
        }, 300); // 300ms는 CSS 전환 시간과 일치
      }
    });

    // 메뉴 항목 클릭 후 메뉴 닫기
    const menuLinks = mobileMenu.querySelectorAll("a");
    menuLinks.forEach((link) => {
      link.addEventListener("click", function () {
        mobileMenu.classList.remove("visible");

        // 전환이 완료된 후 메뉴 숨기기
        setTimeout(() => {
          mobileMenu.classList.add("hidden");
        }, 300);
      });
    });

    // 메뉴 외부 영역 클릭 시 메뉴 닫기
    document.addEventListener("click", function (e) {
      if (
        !menuToggle.contains(e.target) &&
        !mobileMenu.contains(e.target) &&
        !mobileMenu.classList.contains("hidden")
      ) {
        mobileMenu.classList.remove("visible");

        setTimeout(() => {
          mobileMenu.classList.add("hidden");
        }, 300);
      }
    });
  }
}

/**
 * 히어로 섹션 효과 초기화
 */
function initHeroEffects() {
  // 히어로 섹션 가져오기
  const heroSection = document.getElementById("hero");
  if (!heroSection) return;

  // 부동 요소에 애니메이션 추가
  const decorElements = heroSection.querySelectorAll(".absolute");
  decorElements.forEach((elem, index) => {
    elem.style.setProperty("--animation-order", index + 1);

    // 페이지 로드 후 요소를 하나씩 보여주는 애니메이션
    setTimeout(() => {
      elem.style.opacity = "0.8";
    }, (index + 1) * 200);
  });

  // 시차 스크롤 효과 추가
  window.addEventListener("scroll", function () {
    const scrollTop = window.pageYOffset;
    const heroHeight = heroSection.offsetHeight;

    // 사용자가 히어로 섹션을 스크롤 할 때 효과 적용
    if (scrollTop <= heroHeight) {
      const scrollPercentage = scrollTop / heroHeight;

      // 히어로 섹션 투명도 조절
      heroSection.style.opacity = 1 - scrollPercentage * 0.8;

      // 제목 이동 효과
      const heroTitle = heroSection.querySelector("h1");
      if (heroTitle) {
        heroTitle.style.transform = `translateY(${scrollPercentage * 50}px)`;
      }
    }
  });

  // 마우스 움직임에 따른 시차 효과 추가
  heroSection.addEventListener("mousemove", function (e) {
    // 큰 화면에서만 효과 적용
    if (window.innerWidth >= 768) {
      const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
      const moveY = (e.clientY - window.innerHeight / 2) * 0.01;

      // 히어로 섹션 내의 이미지 요소 가져오기
      const heroImage = heroSection.querySelector("img");
      if (heroImage) {
        heroImage.style.transform = `translate(${moveX * 2}px, ${
          moveY * 2
        }px) scale(1.02)`;
      }

      // 히어로 섹션 내의 장식 요소 가져오기
      decorElements.forEach((elem, index) => {
        // 다른 이동 비율을 사용하여 계층감 추가
        const factorX = (index + 1) * 0.03;
        const factorY = (index + 1) * 0.02;
        elem.style.transform = `translate(${moveX * factorX}px, ${
          moveY * factorY
        }px)`;
      });
    }
  });

  // 마우스 떠날 때 요소 위치 재설정
  heroSection.addEventListener("mouseleave", function () {
    const heroImage = heroSection.querySelector("img");
    if (heroImage) {
      heroImage.style.transform = "";
    }

    decorElements.forEach((elem) => {
      elem.style.transform = "";
    });
  });

  // 로고 애니메이션 효과
  const logo = document.querySelector("header nav img");
  if (logo) {
    // 네비게이션 로고가 페이지 로드 시 약간의 회전 애니메이션
    logo.style.transition = "transform 1s ease-out";
    logo.style.transform = "rotate(0deg)";

    setTimeout(() => {
      logo.style.transform = "rotate(5deg)";
      setTimeout(() => {
        logo.style.transform = "rotate(0deg)";
      }, 500);
    }, 1500);
  }
}

/**
 * 문제점과 해결방안 섹션 효과 초기화
 */
function initPainPointsEffects() {
  const painPointsSection = document.getElementById("pain-points");
  if (!painPointsSection) return;

  // 모든 카드 가져오기
  const cards = painPointsSection.querySelectorAll(
    ".rounded-lg.overflow-hidden"
  );

  // 각 카드에 지연 나타나는 애니메이션 추가
  cards.forEach((card, index) => {
    card.setAttribute("data-aos", "fade-up");
    card.setAttribute("data-aos-delay", (index * 150).toString());
  });

  // 각 카드에 마우스 진입과 떠날 때 효과 추가
  cards.forEach((card, index) => {
    // 문제점과 해결방안 섹션 블록 가져오기
    const painIcon = card.querySelector(".p-6 img");
    const solutionIcon = card.querySelector(".p-4 img");
    const arrowIcon = card.querySelector(".h-8.w-8.text-green-500");

    // 마우스 진입 효과
    card.addEventListener("mouseenter", function () {
      // 지연된 애니메이션으로 시퀀스 애니메이션 효과 추가
      if (painIcon) {
        setTimeout(() => {
          painIcon.style.transform = "scale(1.1) rotate(5deg)";
        }, 100);
      }

      if (arrowIcon) {
        setTimeout(() => {
          arrowIcon.style.transform = "translateY(8px)";
        }, 200);
      }

      if (solutionIcon) {
        setTimeout(() => {
          solutionIcon.style.transform = "scale(1.1) rotate(-5deg)";
        }, 300);
      }

      // 발광 효과 추가
      card.style.boxShadow =
        "0 20px 30px rgba(0, 0, 0, 0.15), 0 0 15px rgba(59, 130, 246, 0.3)";
    });

    // 마우스 떠날 때 효과
    card.addEventListener("mouseleave", function () {
      if (painIcon) painIcon.style.transform = "";
      if (arrowIcon) arrowIcon.style.transform = "";
      if (solutionIcon) solutionIcon.style.transform = "";

      // 발광 효과 제거
      card.style.boxShadow = "";
    });
  });

  // 시차 스크롤 효과 추가
  window.addEventListener("scroll", function () {
    // 큰 화면에서만 효과 적용
    if (window.innerWidth >= 768) {
      const scrollPosition = window.scrollY;
      const sectionTop = painPointsSection.offsetTop;
      const sectionHeight = painPointsSection.offsetHeight;

      // 사용자가 해당 섹션을 스크롤 할 때 효과 적용
      if (
        scrollPosition > sectionTop - window.innerHeight &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        cards.forEach((card, index) => {
          // 부분적인 스크롤 위치에 따른 상대적인 위치
          const relativeScroll =
            (scrollPosition - (sectionTop - window.innerHeight)) /
            (sectionHeight + window.innerHeight);
          // 카드 위치에 따른 오프셋 계산
          const offset = Math.sin(relativeScroll * Math.PI + index * 0.5) * 15;

          // 인덱스에 따른 다른 오프셋 방향 설정
          if (index % 2 === 0) {
            card.style.transform = `translateY(${offset}px)`;
          } else {
            card.style.transform = `translateY(${-offset}px)`;
          }
        });
      }
    }
  });
}

/**
 * 코드 블록 기능 초기화
 */
function initCodeBlocks() {
  // Prism.js가 로드되었는지 확인
  if (typeof Prism !== "undefined") {
    // 코드 하이라이트 적용
    Prism.highlightAll();
  }

  // 코드 예제 탭 전환 기능 초기화
  initCodeTabSwitcher();

  // 선택 가능: 타이핑 효과 추가
  initTypingEffect();
}

/**
 * 코드 예제 탭 전환 기능 초기화
 */
function initCodeTabSwitcher() {
  const tabButtons = document.querySelectorAll(".code-tab-btn");
  const contentSections = document.querySelectorAll(".code-content-section");

  if (!tabButtons.length || !contentSections.length) return;

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      // 목표 콘텐츠 ID 가져오기
      const targetId = btn.getAttribute("data-target");

      // 모든 버튼의 활성 상태 제거
      tabButtons.forEach((b) => {
        b.classList.remove("active", "bg-blue-50", "text-blue-600");
        b.classList.add("hover:bg-blue-50");
      });

      // 현재 버튼 활성 상태 추가
      btn.classList.add("active", "bg-blue-50", "text-blue-600");

      // 모든 콘텐츠 숨기기
      contentSections.forEach((section) => {
        section.classList.add("hidden");
      });

      // 목표 콘텐츠 표시
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.classList.remove("hidden");

        // 활성 콘텐츠 영역의 코드 하이라이트 보장
        const codeBlocks = targetSection.querySelectorAll("code");
        if (typeof Prism !== "undefined" && codeBlocks.length) {
          codeBlocks.forEach((block) => {
            Prism.highlightElement(block);
          });
        }
      }
    });
  });
}

/**
 * 타이핑 효과 초기화 (선택 기능)
 */
function initTypingEffect() {
  // 타이핑 효과 활성화 여부를 확인 (URL 매개변수를 통해 제어 가능)
  const urlParams = new URLSearchParams(window.location.search);
  const enableTyping = urlParams.get("typing") === "true";

  if (!enableTyping) return;

  const codeBlocks = document.querySelectorAll("#examples code");
  if (!codeBlocks.length) return;

  codeBlocks.forEach((codeBlock) => {
    const originalText = codeBlock.textContent;
    codeBlock.textContent = "";

    let charIndex = 0;
    const typingSpeed = 30; // 각 문자 사이 간격(밀리초)

    // 먼저 원본 코드를 숨기고 타이핑 효과 시작
    codeBlock.parentElement.classList.add("typing-in-progress");

    // 창 진입 시 타이핑 효과 시작
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          startTyping();
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(codeBlock.parentElement);

    function startTyping() {
      const typingInterval = setInterval(() => {
        if (charIndex < originalText.length) {
          codeBlock.textContent += originalText.charAt(charIndex);
          charIndex++;

          // 코드 블록을 자동으로 스크롤링하여 커서 위치 트래킹
          codeBlock.parentElement.scrollTop =
            codeBlock.parentElement.scrollHeight;

          // 동적으로 문법 하이라이트 적용
          if (typeof Prism !== "undefined") {
            Prism.highlightElement(codeBlock);
          }
        } else {
          clearInterval(typingInterval);
          codeBlock.parentElement.classList.remove("typing-in-progress");
        }
      }, typingSpeed);
    }
  });
}

/**
 * 부드러운 스크롤 초기화
 */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      // 단순 "#" 링크가 아닌 경우에만 적용
      if (href !== "#") {
        e.preventDefault();
        const target = document.querySelector(href);

        if (target) {
          // 목표 요소의 위치와 고정 네비게이션 높이를 고려하여 계산
          const headerHeight = document.querySelector("header").offsetHeight;
          const targetPosition =
            target.getBoundingClientRect().top +
            window.pageYOffset -
            headerHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        }
      }
    });
  });
}

/**
 * 핵심 기능 전시 섹션 효과 초기화
 */
function initFeaturesEffects() {
  const featuresSection = document.getElementById("features");
  if (!featuresSection) return;

  // 모든 기능 카드 가져오기
  const featureCards = featuresSection.querySelectorAll(".rounded-lg");

  // 각 카드에 마우스 오버 효과 추가
  featureCards.forEach((card, index) => {
    // 카드 내의 아이콘과 제목 가져오기
    const featureIcon = card.querySelector(".p-6 img");
    const featureTitle = card.querySelector("h3");

    // 마우스 진입 효과
    card.addEventListener("mouseenter", function () {
      if (featureIcon) {
        featureIcon.style.transform = "scale(1.2) rotate(5deg)";
        featureIcon.style.transition = "transform 0.5s ease";
      }

      if (featureTitle) {
        featureTitle.style.transform = "translateY(-5px)";
        featureTitle.style.transition = "transform 0.3s ease";
      }
    });

    // 마우스 떠날 때 효과
    card.addEventListener("mouseleave", function () {
      if (featureIcon) {
        featureIcon.style.transform = "";
      }

      if (featureTitle) {
        featureTitle.style.transform = "";
      }
    });

    // 클릭 효과 - 약간의 튕김 효과 추가
    card.addEventListener("click", function () {
      card.style.transform = "scale(0.95)";
      setTimeout(() => {
        card.style.transform = "";
      }, 200);
    });
  });

  // 스크롤 시차 효과 추가
  window.addEventListener("scroll", function () {
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;

    // 효과 발동 범위 계산
    const sectionTop = featuresSection.offsetTop;
    const sectionHeight = featuresSection.offsetHeight;
    const triggerStart = sectionTop - windowHeight;
    const triggerEnd = sectionTop + sectionHeight;

    // 스크롤 위치에 따른 시차 효과 계산
    if (scrollPosition > triggerStart && scrollPosition < triggerEnd) {
      const scrollProgress =
        (scrollPosition - triggerStart) / (triggerEnd - triggerStart);

      // 다양한 시차 효과 적용
      featureCards.forEach((card, index) => {
        const delayFactor = (index % 3) * 0.1;
        const moveY = Math.sin((scrollProgress + delayFactor) * Math.PI) * 15;

        // 시차 효과 적용
        card.style.transform = `translateY(${moveY}px)`;
      });
    }
  });
}

/**
 * 작업 흐름 전시 섹션 효과 초기화
 */
function initWorkflowEffects() {
  // 단계 상세 팝업 기능
  initWorkflowModal();

  // 데스크탑 버전 시간 프레임에 연결선 애니메이션 추가
  animateWorkflowConnections();

  // 단계 아이콘에 상호작용 효과 추가
  addWorkflowIconInteractions();
}

/**
 * 작업 흐름 상세 팝업 초기화
 */
function initWorkflowModal() {
  const modal = document.getElementById("workflow-detail-modal");
  const closeBtn = document.getElementById("close-modal");
  const closeBtnAlt = document.getElementById("close-modal-btn");
  const detailLinks = document.querySelectorAll(
    ".workflow-detail-link, .workflow-step"
  );
  const modalTitle = document.getElementById("modal-title");
  const modalContent = document.getElementById("modal-content");

  if (!modal || !closeBtn || !detailLinks.length) return;

  // 작업 흐름 단계 상세 데이터
  const workflowDetails = {
    en: {
      1: {
        title: "Task Planning",
        content: `
          <p>The task planning stage is the initial phase where AI assistants define project scope, set goals, and establish success criteria.</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">Key Activities:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Clarify project requirements and constraints</li>
            <li>Set clear objectives and define measurable success criteria</li>
            <li>Establish project boundaries and identify stakeholders</li>
            <li>Create a high-level plan with timeline estimates</li>
            <li>Optionally reference existing tasks for continuous planning</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">Outputs:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Comprehensive task description</li>
            <li>Clear success criteria</li>
            <li>Technical requirements and constraints</li>
          </ul>
          <p class="mt-4">This stage lays the foundation for all subsequent work, ensuring that both the AI assistant and the user have a shared understanding of what needs to be accomplished.</p>
        `,
      },
      2: {
        title: "In-depth Analysis",
        content: `
          <p>The in-depth analysis stage involves a thorough examination of the requirements and technical landscape to develop a viable implementation strategy.</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">Key Activities:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Analyze requirements and identify technical challenges</li>
            <li>Evaluate technical feasibility and potential risks</li>
            <li>Research best practices and available solutions</li>
            <li>Systematically review existing codebase if applicable</li>
            <li>Develop initial implementation concepts</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">Outputs:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Technical feasibility assessment</li>
            <li>Risk identification and mitigation strategies</li>
            <li>Initial implementation approach</li>
            <li>Pseudocode or architectural diagrams where appropriate</li>
          </ul>
          <p class="mt-4">This stage ensures that the proposed solution is technically sound and addresses all requirements before proceeding to implementation.</p>
        `,
      },
      3: {
        title: "Solution Reflection",
        content: `
          <p>The solution reflection stage involves critical review and optimization of the proposed approach before implementation.</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">Key Activities:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Critically review the analysis results and proposed solutions</li>
            <li>Identify potential gaps, edge cases, or inefficiencies</li>
            <li>Consider alternative approaches and their trade-offs</li>
            <li>Evaluate solution against best practices and design principles</li>
            <li>Refine implementation strategy based on insights</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">Outputs:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Optimized solution design</li>
            <li>Documented considerations and trade-offs</li>
            <li>Refined implementation strategy</li>
          </ul>
          <p class="mt-4">This reflective process helps catch potential issues early and ensures the chosen approach is optimal before investing in implementation.</p>
        `,
      },
      4: {
        title: "Task Decomposition",
        content: `
          <p>The task decomposition stage breaks down complex tasks into manageable, atomic subtasks with clear dependencies and execution order.</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">Key Activities:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Break down complex tasks into smaller, manageable units</li>
            <li>Establish clear dependencies between subtasks</li>
            <li>Define scope and acceptance criteria for each subtask</li>
            <li>Assign priority levels and estimate complexity</li>
            <li>Create a logical execution sequence</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">Supported Update Modes:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li><strong>Append:</strong> Keep all existing tasks and add new ones</li>
            <li><strong>Overwrite:</strong> Clear all uncompleted tasks and completely replace them, while preserving completed tasks</li>
            <li><strong>Selective:</strong> Intelligently update existing tasks based on task names, preserving tasks not in the list</li>
            <li><strong>Clear All Tasks:</strong> Remove all tasks and create a backup</li>
          </ul>
          <p class="mt-4">This structured approach makes complex projects manageable by creating a clear roadmap of small, achievable steps.</p>
        `,
      },
      5: {
        title: "Task Execution",
        content: `
          <p>The task execution stage involves implementing specific tasks according to the predetermined plan, with a focus on quality and adherence to requirements.</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">Key Activities:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Select tasks for execution based on dependencies and priorities</li>
            <li>Implement solutions following the implementation guide</li>
            <li>Follow coding standards and best practices</li>
            <li>Handle edge cases and error conditions</li>
            <li>Document implementation decisions and rationale</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">Execution Process:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Prepare necessary resources and environment</li>
            <li>Follow the implementation guide step by step</li>
            <li>Monitor progress and handle any unexpected issues</li>
            <li>Maintain code quality and documentation</li>
          </ul>
          <p class="mt-4">This stage transforms plans into concrete results, implementing the solutions designed in earlier stages.</p>
        `,
      },
      6: {
        title: "Result Verification",
        content: `
          <p>The result verification stage ensures that implemented tasks meet all requirements and quality standards before being marked as complete.</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">Key Activities:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Verify that all requirements have been implemented</li>
            <li>Check for adherence to technical standards and best practices</li>
            <li>Test edge cases and error handling</li>
            <li>Review code quality and documentation</li>
            <li>Validate against the verification criteria defined for the task</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">Verification Checklist:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Functional correctness: Does it work as expected?</li>
            <li>Completeness: Are all requirements addressed?</li>
            <li>Quality: Does it meet coding standards and best practices?</li>
            <li>Performance: Does it operate efficiently?</li>
            <li>Documentation: Is the implementation well-documented?</li>
          </ul>
          <p class="mt-4">This thorough verification process ensures high-quality deliverables that fully satisfy requirements.</p>
        `,
      },
      7: {
        title: "Task Completion",
        content: `
          <p>The task completion stage formally marks tasks as complete, generates detailed completion reports, and updates the status of dependent tasks.</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">Key Activities:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Formally mark task as completed after successful verification</li>
            <li>Generate a comprehensive completion report</li>
            <li>Update the status of dependent tasks</li>
            <li>Archive relevant information for future reference</li>
            <li>Communicate completion to stakeholders</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">Completion Report Contents:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Summary of completed work</li>
            <li>Implementation highlights and key decisions</li>
            <li>Any notable challenges encountered and their solutions</li>
            <li>Recommendations for future work or improvements</li>
          </ul>
          <p class="mt-4">The completion stage ensures proper closure of tasks, maintains workflow continuity, and builds institutional knowledge for future projects.</p>
        `,
      },
    },
    "zh-TW": {
      1: {
        title: "任務規劃",
        content: `
          <p>任務規劃階段是初始階段，AI助手定義項目範圍、設定目標，並建立成功標準。</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">主要活動：</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>釐清項目需求和約束條件</li>
            <li>設定明確目標和定義可衡量的成功標準</li>
            <li>確立項目界限和識別相關利益方</li>
            <li>創建高級計劃及時間估算</li>
            <li>可選擇參考現有任務進行持續規劃</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">輸出成果：</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>全面的任務描述</li>
            <li>明確的成功標準</li>
            <li>技術需求和約束條件</li>
          </ul>
          <p class="mt-4">此階段為所有後續工作奠定基礎，確保AI助手和用戶對需要完成的工作有共同理解。</p>
        `,
      },
      2: {
        title: "深入分析",
        content: `
          <p>深入分析階段涉及對需求和技術環境的徹底檢查，以制定可行的實施策略。</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">主要活動：</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>分析需求並識別技術挑戰</li>
            <li>評估技術可行性和潛在風險</li>
            <li>研究最佳實踐和可用解決方案</li>
            <li>系統性地審查現有代碼庫（如適用）</li>
            <li>開發初步實施概念</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">輸出成果：</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>技術可行性評估</li>
            <li>風險識別和緩解策略</li>
            <li>初步實施方法</li>
            <li>適當的偽代碼或架構圖</li>
          </ul>
          <p class="mt-4">此階段確保在進行實施前，提出的解決方案在技術上是合理的，並能處理所有需求。</p>
        `,
      },
      3: {
        title: "方案反思",
        content: `
          <p>方案反思階段涉及在實施前對提出的方法進行批判性審查和優化。</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">主要活動：</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>批判性審查分析結果和提出的解決方案</li>
            <li>識別潛在差距、邊緣情況或低效問題</li>
            <li>考慮替代方法及其權衡</li>
            <li>根據最佳實踐和設計原則評估解決方案</li>
            <li>根據洞察優化實施策略</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">輸出成果：</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>優化後的解決方案設計</li>
            <li>記錄的考慮事項和權衡</li>
            <li>改進的實施策略</li>
          </ul>
          <p class="mt-4">這種反思過程有助於及早發現潛在問題，並確保在投入實施前所選方法是最佳選擇。</p>
        `,
      },
      4: {
        title: "任務分解",
        content: `
          <p>任務分解階段將複雜任務分解為可管理的原子子任務，並建立明確的依賴關係和執行順序。</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">主要活動：</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>將複雜任務分解為更小、可管理的單元</li>
            <li>建立子任務之間的明確依賴關係</li>
            <li>為每個子任務定義範圍和驗收標準</li>
            <li>分配優先級別並評估複雜度</li>
            <li>創建邏輯執行順序</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">支持的更新模式：</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li><strong>追加(append)：</strong>保留所有現有任務並添加新任務</li>
            <li><strong>覆蓋(overwrite)：</strong>清除所有未完成的任務並完全替換，同時保留已完成的任務</li>
            <li><strong>選擇性更新(selective)：</strong>根據任務名稱智能匹配更新現有任務，同時保留其他任務</li>
            <li><strong>清除所有任務(clearAllTasks)：</strong>移除所有任務並創建備份</li>
          </ul>
          <p class="mt-4">這種結構化方法通過創建由小型、可實現步驟組成的清晰路線圖，使複雜項目變得可管理。</p>
        `,
      },
      5: {
        title: "任務執行",
        content: `
          <p>任務執行階段涉及按照預定計劃實施特定任務，重點關注質量和需求遵從。</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">主要活動：</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>根據依賴和優先順序選擇要執行的任務</li>
            <li>按照實施指南實施解決方案</li>
            <li>遵循編碼標準和最佳實踐</li>
            <li>處理邊緣情況和錯誤條件</li>
            <li>記錄實施決策和理由</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">Execution Process:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>準備必要的資源和環境</li>
            <li>逐步遵循實施指南</li>
            <li>監控進度並處理任何意外問題</li>
            <li>維護代碼質量和文檔</li>
          </ul>
          <p class="mt-4">該階段將計劃轉化為具體結果，實施早期階段設計的解決方案。</p>
        `,
      },
      6: {
        title: "結果驗證",
        content: `
          <p>結果驗證階段確保已實施的任務在標記為完成前滿足所有需求和質量標準。</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">Key Activities:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>驗證是否已實施所有需求</li>
            <li>檢查是否遵循技術標準和最佳實踐</li>
            <li>測試邊緣情況和錯誤處理</li>
            <li>審查代碼質量和文檔</li>
            <li>根據為任務定義的驗證標準進行驗證</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">驗證清單：</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>功能正確性：是否按預期工作？</li>
            <li>完整性：是否涵蓋所有需求？</li>
            <li>質量：是否符合編碼標準和最佳實踐？</li>
            <li>性能：是否高效運行？</li>
            <li>文檔：實施是否有良好的文檔？</li>
          </ul>
          <p class="mt-4">這種徹底的驗證過程確保交付高質量的成果，完全滿足需求。</p>
        `,
      },
      7: {
        title: "任務完成",
        content: `
          <p>任務完成階段正式將任務標記為已完成，生成詳細的完成報告，並更新相關依賴任務的狀態。</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">Key Activities:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>成功驗證後正式將任務標記為已完成</li>
            <li>生成全面的完成報告</li>
            <li>更新依賴任務的狀態</li>
            <li>歸檔相關信息以供將來參考</li>
            <li>向利益相關者傳達完成情況</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">完成報告內容：</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>已完成工作摘要</li>
            <li>實施亮點和關鍵決策</li>
            <li>遇到的任何值得注意的挑戰及其解決方案</li>
            <li>對未來工作或改進的建議</li>
          </ul>
          <p class="mt-4">完成階段確保任務適當結束，維持工作流程連續性，並為未來項目建立機構知識。</p>
        `,
      },
    },
  };

  // 詳情鏈接 클릭 시 팝업 열기
  detailLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const stepIndex = parseInt(this.getAttribute("data-step"));
      const lang = localStorage.getItem("preferred-language") || "en";
      if (stepIndex >= 0 && workflowDetails[lang][stepIndex]) {
        modalTitle.textContent = workflowDetails[lang][stepIndex].title;
        modalContent.innerHTML = workflowDetails[lang][stepIndex].content;
        modal.classList.remove("hidden");
        modal.classList.add("active");
      }
    });
  });

  // 팝업 닫기
  function closeModal() {
    modal.classList.add("hidden");
    modal.classList.remove("active");
  }

  closeBtn.addEventListener("click", closeModal);
  closeBtnAlt.addEventListener("click", closeModal);

  // 팝업 외부 클릭 시 닫기
  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      closeModal();
    }
  });
}

/**
 * 작업 흐름 시간 프레임에 연결선 애니메이션 추가
 */
function animateWorkflowConnections() {
  const desktopTimeline = document.querySelector(
    "#workflow .hidden.md\\:block"
  );
  if (!desktopTimeline) return;

  // 시간 프레임이 화면에 진입할 때 애니메이션 트리거
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const steps = entry.target.querySelectorAll(".workflow-step");

          steps.forEach((step, index) => {
            setTimeout(() => {
              step.classList.add("animated");
            }, index * 200);
          });

          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  observer.observe(desktopTimeline);
}

/**
 * 작업 흐름 단계 아이콘에 상호작용 효과 추가
 */
function addWorkflowIconInteractions() {
  const workflowIcons = document.querySelectorAll(
    ".workflow-icon, .workflow-icon-mobile"
  );

  workflowIcons.forEach((icon) => {
    icon.addEventListener("mouseenter", function () {
      const img = this.querySelector("img");
      if (img) {
        img.style.transform = "scale(1.2) rotate(5deg)";
        img.style.transition = "transform 0.3s ease";
      }
    });

    icon.addEventListener("mouseleave", function () {
      const img = this.querySelector("img");
      if (img) {
        img.style.transform = "";
      }
    });

    // 클릭 효과 추가
    icon.addEventListener("click", function () {
      const link =
        this.parentNode.querySelector(".workflow-detail-link") ||
        this.closest(".flex").querySelector(".workflow-detail-link");

      if (link) {
        link.click();
      }
    });
  });
}

/**
 * 설치와 설정 섹션 기능 초기화
 */
function initInstallationSection() {
  // 설치 방식 탭 전환 초기화
  initInstallTabs();

  // 커서 IDE 설정 탭 전환 초기화
  initCursorTabs();

  // 명령행 복사 버튼 초기화
  initCommandCopyButtons();

  // 설치 카드 애니메이션 효과 추가
  initInstallCardsAnimation();
}

/**
 * 설치 방식 탭 전환 초기화
 */
function initInstallTabs() {
  const tabButtons = document.querySelectorAll(".install-tab-btn");
  const contentSections = document.querySelectorAll(".install-content-section");

  if (!tabButtons.length || !contentSections.length) return;

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // 모든 활성 상태 제거
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      contentSections.forEach((section) => section.classList.add("hidden"));

      // 현재 활성 상태 설정
      button.classList.add("active");
      const targetId = button.getAttribute("data-target");
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.classList.remove("hidden");
      }
    });
  });
}

/**
 * 커서 IDE 설정 탭 전환 초기화
 */
function initCursorTabs() {
  const tabButtons = document.querySelectorAll(".cursor-tab-btn");
  const contentSections = document.querySelectorAll(".cursor-content-section");

  if (!tabButtons.length || !contentSections.length) return;

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // 모든 활성 상태 제거
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      contentSections.forEach((section) => section.classList.add("hidden"));

      // 현재 활성 상태 설정
      button.classList.add("active");
      const targetId = button.getAttribute("data-target");
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.classList.remove("hidden");
      }
    });
  });
}

/**
 * 명령행 복사 버튼 초기화
 */
function initCommandCopyButtons() {
  const copyButtons = document.querySelectorAll(".copy-cmd-btn");

  copyButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const command = button.getAttribute("data-command");
      if (!command) return;

      try {
        await navigator.clipboard.writeText(command);

        // 버튼 텍스트 업데이트
        const originalText = button.textContent.trim();
        button.textContent = "복사됨!";
        button.classList.add("bg-gray-600");
        button.classList.remove(
          "bg-blue-600",
          "bg-green-600",
          "bg-purple-600",
          "hover:bg-blue-700",
          "hover:bg-green-700",
          "hover:bg-purple-700"
        );

        // 원래 상태로 복귀
        setTimeout(() => {
          button.textContent = originalText;
          button.classList.remove("bg-gray-600");

          // 버튼 색상에 따라 스타일 복귀
          if (button.classList.contains("copy-cmd-btn")) {
            if (button.closest("#smithery-install")) {
              button.classList.add("bg-blue-600", "hover:bg-blue-700");
            } else if (button.closest("#manual-install")) {
              button.classList.add("bg-green-600", "hover:bg-green-700");
            } else if (button.closest("#cursor-config")) {
              button.classList.add("bg-purple-600", "hover:bg-purple-700");
            }
          }
        }, 2000);
      } catch (err) {
        console.error("복사 명령 실패:", err);
        button.textContent = "복사 실패";
      }
    });
  });
}

/**
 * 설치 카드 애니메이션 효과 추가
 */
function initInstallCardsAnimation() {
  const installCards = document.querySelectorAll("#installation .grid > div");

  installCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.style.transform = "translateY(-10px)";
      card.style.boxShadow =
        "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)";

      // 카드 내의 아이콘 찾아 애니메이션 추가
      const icon = card.querySelector("svg");
      if (icon) {
        icon.style.transform = "scale(1.2)";
        icon.style.transition = "transform 0.3s ease";
      }
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
      card.style.boxShadow = "";

      // 아이콘 복귀
      const icon = card.querySelector("svg");
      if (icon) {
        icon.style.transform = "";
      }
    });
  });
}

/**
 * 페이지 스크롤 위치를 감지하여 맨 위로 가기 버튼 표시
 */
function initScrollToTopButton() {
  // 맨 위로 가기 버튼 요소 생성
  const scrollToTopBtn = document.createElement("button");
  scrollToTopBtn.id = "scrollToTop";
  scrollToTopBtn.innerHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 11l7-7 7 7M5 19l7-7 7 7" /></svg>';
  scrollToTopBtn.className =
    "fixed bottom-5 right-5 bg-blue-600 text-white p-2 rounded-full shadow-lg transform scale-0 transition-transform duration-300";
  scrollToTopBtn.setAttribute("aria-label", "맨 위로 가기");

  // 버튼을 문서에 추가
  document.body.appendChild(scrollToTopBtn);

  // 클릭 이벤트 - 부드러운 스크롤로 맨 위로 이동
  scrollToTopBtn.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  // 스크롤 위치에 따라 버튼 표시 또는 숨기기
  window.addEventListener("scroll", function () {
    if (window.scrollY > 500) {
      scrollToTopBtn.style.transform = "scale(1)";
    } else {
      scrollToTopBtn.style.transform = "scale(0)";
    }
  });
}

/**
 * 반응형 이미지 지연 로딩 초기화
 */
function initLazyLoading() {
  if ("loading" in HTMLImageElement.prototype) {
    // 브라우저가 네이티브 지연 로딩 지원
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach((img) => {
      img.src = img.dataset.src;
    });
  } else {
    // 폴백 솔루션 - Intersection Observer API 사용
    const imgObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.add("loaded");
          observer.unobserve(img);
        }
      });
    });

    const lazyImages = document.querySelectorAll("img[data-src]");
    lazyImages.forEach((img) => {
      imgObserver.observe(img);
    });
  }
}

/**
 * 페이지 진입 애니메이션 초기화
 */
function initPageEntranceAnimation() {
  // 페이지 로드 완료 후 애니메이션 효과
  document.body.classList.add("page-loaded");

  // 약간의 지연 후 시퀀스 애니메이션 시작
  setTimeout(() => {
    const header = document.querySelector("header");
    if (header) {
      header.style.opacity = "1";
      header.style.transform = "translateY(0)";
    }

    const heroContent = document.querySelector("#hero .container");
    if (heroContent) {
      setTimeout(() => {
        heroContent.style.opacity = "1";
        heroContent.style.transform = "translateY(0)";
      }, 200);
    }
  }, 100);
}

/**
 * 요소에 애니메이션 클래스 추가
 * @param {Element} element - 애니메이션을 추가할 요소
 * @param {string} animationClass - 추가할 애니메이션 클래스 이름
 * @param {number} delay - 지연 시간(밀리초)
 */
function addAnimation(element, animationClass, delay = 0) {
  if (!element) return;

  setTimeout(() => {
    element.classList.add(animationClass);

    // 애니메이션 종료 후 클래스 제거
    element.addEventListener(
      "animationend",
      () => {
        element.classList.remove(animationClass);
      },
      { once: true }
    );
  }, delay);
}

/**
 * 요소가 화면에 있는지 확인
 * @param {Element} element - 확인할 요소
 * @returns {boolean} - 요소가 화면에 있는지 여부
 */
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.bottom >= 0 &&
    rect.left <= (window.innerWidth || document.documentElement.clientWidth) &&
    rect.right >= 0
  );
}

/**
 * 다국어 기능 초기화
 */
function initMultiLanguage() {
  // i18n.js가 로드되었는지 확인
  if (typeof i18n !== "undefined") {
    // 먼저 강화된 초기화 함수 사용
    if (typeof enhancedInitializeLanguage === "function") {
      enhancedInitializeLanguage();
    } else if (typeof initializeLanguage === "function") {
      // 호환성 처리, 강화된 함수가 없으면 기본 방식 사용
      initializeLanguage();
    } else {
      console.warn("다국어 초기화 함수 사용 불가, 기본 초기화 사용");
      // 기본 초기화 - i18n.js가 정확하게 로드되지 않을 때 기본 기능 제공
      try {
        const currentLang =
          localStorage.getItem("preferred-language") ||
          (navigator.language && navigator.language.startsWith("zh")
            ? "zh-TW"
            : "en");
        document.documentElement.setAttribute("lang", currentLang);
      } catch (e) {
        console.error("기본 언어 초기화 실패:", e);
      }
    }

    // 언어 전환 추가 사용자 정의 이벤트 추가
    try {
      document.querySelectorAll(".lang-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
          const lang = this.getAttribute("data-lang");

          // 먼저 강화된 언어 전환 함수 사용
          if (typeof enhancedSetLanguage === "function") {
            enhancedSetLanguage(lang);
          } else if (typeof setLanguageWithAnimation === "function") {
            // 다음으로 멋진 애니메이션 효과가 있는 언어 전환
            setLanguageWithAnimation(lang);
          } else if (typeof setLanguage === "function") {
            // 호환성 처리, 기본 언어 전환 함수 사용
            setLanguage(lang);
          } else {
            console.warn("언어 전환 함수 사용 불가");
            // 최소한의 처리 - HTML lang 속성 업데이트 및 선호도 저장
            try {
              localStorage.setItem("preferred-language", lang);
              document.documentElement.setAttribute("lang", lang);
            } catch (e) {
              console.error("기본 언어 전환 실패:", e);
            }
          }
        });
      });
    } catch (e) {
      console.error("언어 버튼에 이벤트 리스너 추가 중 오류:", e);
    }

    // 초기화 시 일괄 번역 수행, 성능 최적화
    if (typeof batchApplyTranslations === "function") {
      batchApplyTranslations();
    }
  } else {
    console.warn("i18n.js가 로드되지 않았습니다. 완전한 다국어 기능 사용 불가");
    // 기본적인 다국어 지원 시도
    try {
      const basicLanguageSupport = function () {
        const langBtns = document.querySelectorAll(".lang-btn");
        if (langBtns.length === 0) return;

        langBtns.forEach((btn) => {
          btn.addEventListener("click", function () {
            const lang = this.getAttribute("data-lang");
            try {
              localStorage.setItem("preferred-language", lang);
              document.documentElement.setAttribute("lang", lang);

              // 버튼 상태 업데이트
              langBtns.forEach((b) => {
                if (b.getAttribute("data-lang") === lang) {
                  b.classList.add("active");
                } else {
                  b.classList.remove("active");
                }
              });
            } catch (e) {
              console.error("기본 언어 전환 실패:", e);
            }
          });
        });

        // 초기화 버튼 상태
        try {
          const savedLang =
            localStorage.getItem("preferred-language") ||
            (navigator.language && navigator.language.startsWith("zh")
              ? "zh-TW"
              : "en");

          langBtns.forEach((btn) => {
            if (btn.getAttribute("data-lang") === savedLang) {
              btn.classList.add("active");
            } else {
              btn.classList.remove("active");
            }
          });

          document.documentElement.setAttribute("lang", savedLang);
        } catch (e) {
          console.error("초기화 언어 버튼 상태 실패:", e);
        }
      };

      basicLanguageSupport();
    } catch (e) {
      console.error("기본 다국어 지원 초기화 실패:", e);
    }
  }

  // 언어 전환 이벤트 수신
  try {
    document.addEventListener("languageChanged", function (event) {
      const lang = event.detail.language;
      console.log("Language changed to:", lang);

      // translateText 함수를 사용하여 특수 요소 업데이트
      const updateSpecialElements = function () {
        // 안전하게 번역 함수 가져오기
        const getTranslation = (key, defaultText) => {
          if (typeof safeTranslate === "function") {
            return safeTranslate(key, defaultText);
          } else if (typeof translateText === "function") {
            return translateText(key, defaultText);
          } else {
            return lang === "en" ? defaultText.en : defaultText.zh;
          }
        };

        try {
          // 복사 버튼 텍스트 업데이트
          const copyBtns = document.querySelectorAll(".copy-cmd-btn");
          const copyText = getTranslation("common.copy", {
            en: "Copy",
            zh: "복사",
          });

          copyBtns.forEach((btn) => {
            // 아직 "복사됨"이 표시되지 않은 버튼만 업데이트
            if (
              btn.textContent !== "Copied!" &&
              btn.textContent !== "복사됨!"
            ) {
              btn.textContent = copyText;
            }
          });
        } catch (e) {
          console.warn("복사 버튼 텍스트 업데이트 실패:", e);
        }

        try {
          // 모달 창의 닫기 버튼 텍스트 업데이트
          const closeModalBtn = document.getElementById("close-modal-btn");
          if (closeModalBtn) {
            closeModalBtn.textContent = getTranslation("common.close", {
              en: "Close",
              zh: "닫기",
            });
          }
        } catch (e) {
          console.warn("닫기 버튼 텍스트 업데이트 실패:", e);
        }
      };

      // setTimeout을 사용하여 UI 블로킹 방지
      setTimeout(updateSpecialElements, 0);

      // 현재 언어에 따라 작업 흐름 모달 내용 업데이트
      try {
        updateWorkflowModalContent(lang);
      } catch (e) {
        console.warn("작업 흐름 모달 내용 업데이트 실패:", e);
      }
    });
  } catch (e) {
    console.error("언어 변경 이벤트 수신자 추가 실패:", e);
  }
}

/**
 * 현재 언어에 따라 작업 흐름 모달 창 내용 업데이트
 * @param {string} lang - 현재 언어 코드 ("en" 또는 "zh-TW")
 */
function updateWorkflowModalContent(lang) {
  const modal = document.getElementById("workflow-detail-modal");
  if (!modal) return;

  // 현재 표시되는 단계 가져오기
  const modalTitle = document.getElementById("modal-title");
  const modalContent = document.getElementById("modal-content");
  const currentStep = modal.getAttribute("data-current-step");

  if (currentStep && modalTitle && modalContent) {
    // 작업 흐름 상세 데이터에서 해당 언어의 내용 가져오기
    const workflowDetails = getWorkflowDetails();
    const langKey = lang === "en" ? "en" : "zh-TW";

    if (workflowDetails[langKey] && workflowDetails[langKey][currentStep]) {
      const stepData = workflowDetails[langKey][currentStep];

      // requestAnimationFrame을 사용하여 렌더링 성능 최적화
      requestAnimationFrame(function () {
        modalTitle.textContent = stepData.title;
        modalContent.innerHTML = stepData.content;

        // 동적으로 생성된 내용에 data-i18n 속성 추가
        const dynamicElements = modalContent.querySelectorAll("h4, p, li");
        dynamicElements.forEach(function (el, index) {
          const key = `workflow.step${currentStep}.content.${index}`;
          el.setAttribute("data-i18n-dynamic", key);
        });
      });
    }
  }
}

/**
 * 작업 흐름 상세 데이터 가져오기
 * @returns {Object} 작업 흐름 상세 객체
 */
function getWorkflowDetails() {
  // 작업 흐름 상세 데이터 반환
  return {
    // 기존 데이터 유지
    en: {
      1: {
        title: "Task Planning",
        content: `
          <p>The task planning stage is the initial phase where AI assistants define project scope, set goals, and establish success criteria.</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">Key Activities:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Clarify project requirements and constraints</li>
            <li>Set clear objectives and define measurable success criteria</li>
            <li>Establish project boundaries and identify stakeholders</li>
            <li>Create a high-level plan with timeline estimates</li>
            <li>Optionally reference existing tasks for continuous planning</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">Outputs:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Comprehensive task description</li>
            <li>Clear success criteria</li>
            <li>Technical requirements and constraints</li>
          </ul>
          <p class="mt-4">This stage lays the foundation for all subsequent work, ensuring that both the AI assistant and the user have a shared understanding of what needs to be accomplished.</p>
        `,
      },
      2: {
        title: "In-depth Analysis",
        content: `
          <p>The in-depth analysis stage involves a thorough examination of the requirements and technical landscape to develop a viable implementation strategy.</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">Key Activities:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Analyze requirements and identify technical challenges</li>
            <li>Evaluate technical feasibility and potential risks</li>
            <li>Research best practices and available solutions</li>
            <li>Systematically review existing codebase if applicable</li>
            <li>Develop initial implementation concepts</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">Outputs:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Technical feasibility assessment</li>
            <li>Risk identification and mitigation strategies</li>
            <li>Initial implementation approach</li>
            <li>Pseudocode or architectural diagrams where appropriate</li>
          </ul>
          <p class="mt-4">This stage ensures that the proposed solution is technically sound and addresses all requirements before proceeding to implementation.</p>
        `,
      },
      3: {
        title: "Solution Reflection",
        content: `
          <p>The solution reflection stage involves critical review and optimization of the proposed approach before implementation.</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">Key Activities:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Critically review the analysis results and proposed solutions</li>
            <li>Identify potential gaps, edge cases, or inefficiencies</li>
            <li>Consider alternative approaches and their trade-offs</li>
            <li>Evaluate solution against best practices and design principles</li>
            <li>Refine implementation strategy based on insights</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">Outputs:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Optimized solution design</li>
            <li>Documented considerations and trade-offs</li>
            <li>Refined implementation strategy</li>
          </ul>
          <p class="mt-4">This reflective process helps catch potential issues early and ensures the chosen approach is optimal before investing in implementation.</p>
        `,
      },
      4: {
        title: "Task Decomposition",
        content: `
          <p>The task decomposition stage breaks down complex tasks into manageable, atomic subtasks with clear dependencies and execution order.</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">Key Activities:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Break down complex tasks into smaller, manageable units</li>
            <li>Establish clear dependencies between subtasks</li>
            <li>Define scope and acceptance criteria for each subtask</li>
            <li>Assign priority levels and estimate complexity</li>
            <li>Create a logical execution sequence</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">Supported Update Modes:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li><strong>Append:</strong> Keep all existing tasks and add new ones</li>
            <li><strong>Overwrite:</strong> Clear all uncompleted tasks and completely replace them, while preserving completed tasks</li>
            <li><strong>Selective:</strong> Intelligently update existing tasks based on task names, preserving tasks not in the list</li>
            <li><strong>Clear All Tasks:</strong> Remove all tasks and create a backup</li>
          </ul>
          <p class="mt-4">This structured approach makes complex projects manageable by creating a clear roadmap of small, achievable steps.</p>
        `,
      },
      5: {
        title: "Task Execution",
        content: `
          <p>The task execution stage involves implementing specific tasks according to the predetermined plan, with a focus on quality and adherence to requirements.</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">Key Activities:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Select tasks for execution based on dependencies and priorities</li>
            <li>Implement solutions following the implementation guide</li>
            <li>Follow coding standards and best practices</li>
            <li>Handle edge cases and error conditions</li>
            <li>Document implementation decisions and rationale</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">Execution Process:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Prepare necessary resources and environment</li>
            <li>Follow the implementation guide step by step</li>
            <li>Monitor progress and handle any unexpected issues</li>
            <li>Maintain code quality and documentation</li>
          </ul>
          <p class="mt-4">This stage transforms plans into concrete results, implementing the solutions designed in earlier stages.</p>
        `,
      },
      6: {
        title: "Result Verification",
        content: `
          <p>The result verification stage ensures that implemented tasks meet all requirements and quality standards before being marked as complete.</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">Key Activities:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Verify that all requirements have been implemented</li>
            <li>Check for adherence to technical standards and best practices</li>
            <li>Test edge cases and error handling</li>
            <li>Review code quality and documentation</li>
            <li>Validate against the verification criteria defined for the task</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">Verification Checklist:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Functional correctness: Does it work as expected?</li>
            <li>Completeness: Are all requirements addressed?</li>
            <li>Quality: Does it meet coding standards and best practices?</li>
            <li>Performance: Does it operate efficiently?</li>
            <li>Documentation: Is the implementation well-documented?</li>
          </ul>
          <p class="mt-4">This thorough verification process ensures high-quality deliverables that fully satisfy requirements.</p>
        `,
      },
      7: {
        title: "Task Completion",
        content: `
          <p>The task completion stage formally marks tasks as complete, generates detailed completion reports, and updates the status of dependent tasks.</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">Key Activities:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Formally mark task as completed after successful verification</li>
            <li>Generate a comprehensive completion report</li>
            <li>Update the status of dependent tasks</li>
            <li>Archive relevant information for future reference</li>
            <li>Communicate completion to stakeholders</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">Completion Report Contents:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Summary of completed work</li>
            <li>Implementation highlights and key decisions</li>
            <li>Any notable challenges encountered and their solutions</li>
            <li>Recommendations for future work or improvements</li>
          </ul>
          <p class="mt-4">The completion stage ensures proper closure of tasks, maintains workflow continuity, and builds institutional knowledge for future projects.</p>
        `,
      },
    },
    "zh-TW": {
      1: {
        title: "任務規劃",
        content: `
          <p>任務規劃階段是初始階段，AI助手定義項目範圍、設定目標，並建立成功標準。</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">主要活動：</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>釐清項目需求和約束條件</li>
            <li>設定明確目標和定義可衡量的成功標準</li>
            <li>確立項目界限和識別相關利益方</li>
            <li>創建高級計劃及時間估算</li>
            <li>可選擇參考現有任務進行持續規劃</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">輸出成果：</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>全面的任務描述</li>
            <li>明確的成功標準</li>
            <li>技術需求和約束條件</li>
          </ul>
          <p class="mt-4">此階段為所有後續工作奠定基礎，確保AI助手和用戶對需要完成的工作有共同理解。</p>
        `,
      },
      2: {
        title: "深入分析",
        content: `
          <p>深入分析階段涉及對需求和技術環境的徹底檢查，以制定可行的實施策略。</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">主要活動：</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>分析需求並識別技術挑戰</li>
            <li>評估技術可行性和潛在風險</li>
            <li>研究最佳實踐和可用解決方案</li>
            <li>系統性地審查現有代碼庫（如適用）</li>
            <li>開發初步實施概念</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">輸出成果：</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>技術可行性評估</li>
            <li>風險識別和緩解策略</li>
            <li>初步實施方法</li>
            <li>適當的偽代碼或架構圖</li>
          </ul>
          <p class="mt-4">此階段確保在進行實施前，提出的解決方案在技術上是合理的，並能處理所有需求。</p>
        `,
      },
      3: {
        title: "方案反思",
        content: `
          <p>方案反思階段涉及在實施前對提出的方法進行批判性審查和優化。</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">主要活動：</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>批判性審查分析結果和提出的解決方案</li>
            <li>識別潛在差距、邊緣情況或低效問題</li>
            <li>考慮替代方法及其權衡</li>
            <li>根據最佳實踐和設計原則評估解決方案</li>
            <li>根據洞察優化實施策略</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">輸出成果：</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>優化後的解決方案設計</li>
            <li>記錄的考慮事項和權衡</li>
            <li>改進的實施策略</li>
          </ul>
          <p class="mt-4">這種反思過程有助於及早發現潛在問題，並確保在投入實施前所選方法是最佳選擇。</p>
        `,
      },
      4: {
        title: "任務分解",
        content: `
          <p>任務分解階段將複雜任務分解為可管理的原子子任務，並建立明確的依賴關係和執行順序。</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">主要活動：</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>將複雜任務分解為更小、可管理的單元</li>
            <li>建立子任務之間的明確依賴關係</li>
            <li>為每個子任務定義範圍和驗收標準</li>
            <li>分配優先級別並評估複雜度</li>
            <li>創建邏輯執行順序</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">支持的更新模式：</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li><strong>追加(append)：</strong>保留所有現有任務並添加新任務</li>
            <li><strong>覆蓋(overwrite)：</strong>清除所有未完成的任務並完全替換，同時保留已完成的任務</li>
            <li><strong>選擇性更新(selective)：</strong>根據任務名稱智能匹配更新現有任務，同時保留其他任務</li>
            <li><strong>清除所有任務(clearAllTasks)：</strong>移除所有任務並創建備份</li>
          </ul>
          <p class="mt-4">這種結構化方法通過創建由小型、可實現步驟組成的清晰路線圖，使複雜項目變得可管理。</p>
        `,
      },
      5: {
        title: "任務執行",
        content: `
          <p>任務執行階段涉及按照預定計劃實施特定任務，重點關注質量和需求遵從。</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">主要活動：</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>根據依賴和優先順序選擇要執行的任務</li>
            <li>按照實施指南實施解決方案</li>
            <li>遵循編碼標準和最佳實踐</li>
            <li>處理邊緣情況和錯誤條件</li>
            <li>記錄實施決策和理由</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">Execution Process:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>準備必要的資源和環境</li>
            <li>逐步遵循實施指南</li>
            <li>監控進度並處理任何意外問題</li>
            <li>維護代碼質量和文檔</li>
          </ul>
          <p class="mt-4">該階段將計劃轉化為具體結果，實施早期階段設計的解決方案。</p>
        `,
      },
      6: {
        title: "結果驗證",
        content: `
          <p>結果驗證階段確保已實施的任務在標記為完成前滿足所有需求和質量標準。</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">Key Activities:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>驗證是否已實施所有需求</li>
            <li>檢查是否遵循技術標準和最佳實踐</li>
            <li>測試邊緣情況和錯誤處理</li>
            <li>審查代碼質量和文檔</li>
            <li>根據為任務定義的驗證標準進行驗證</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">驗證清單：</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>功能正確性：是否按預期工作？</li>
            <li>完整性：是否涵蓋所有需求？</li>
            <li>質量：是否符合編碼標準和最佳實踐？</li>
            <li>性能：是否高效運行？</li>
            <li>文檔：實施是否有良好的文檔？</li>
          </ul>
          <p class="mt-4">這種徹底的驗證過程確保交付高質量的成果，完全滿足需求。</p>
        `,
      },
      7: {
        title: "任務完成",
        content: `
          <p>任務完成階段正式將任務標記為已完成，生成詳細的完成報告，並更新相關依賴任務的狀態。</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">Key Activities:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>成功驗證後正式將任務標記為已完成</li>
            <li>生成全面的完成報告</li>
            <li>更新依賴任務的狀態</li>
            <li>歸檔相關信息以供將來參考</li>
            <li>向利益相關者傳達完成情況</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">完成報告內容：</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>已完成工作摘要</li>
            <li>實施亮點和關鍵決策</li>
            <li>遇到的任何值得注意的挑戰及其解決方案</li>
            <li>對未來工作或改進的建議</li>
          </ul>
          <p class="mt-4">完成階段確保任務適當結束，維持工作流程連續性，並為未來項目建立機構知識。</p>
        `,
      },
    },
  };
}
