// 전역 변수
let tasks = [];
let currentDataPath = '';
let autoRefreshInterval = null;

// DOM 요소들
const tasksList = document.getElementById('tasksList');
const searchInput = document.getElementById('searchInput');
const statusFilter = document.getElementById('statusFilter');
const refreshBtn = document.getElementById('refreshBtn');
const settingsBtn = document.getElementById('settingsBtn');
const taskModal = document.getElementById('taskModal');
const settingsModal = document.getElementById('settingsModal');
const dataPathInput = document.getElementById('dataPath');
const autoRefreshSelect = document.getElementById('autoRefresh');
const saveSettingsBtn = document.getElementById('saveSettings');
const browseBtn = document.getElementById('browseBtn');

// 통계 요소들
const totalTasksEl = document.getElementById('totalTasks');
const completedTasksEl = document.getElementById('completedTasks');
const inProgressTasksEl = document.getElementById('inProgressTasks');
const pendingTasksEl = document.getElementById('pendingTasks');

// 초기화
document.addEventListener('DOMContentLoaded', function() {
    loadSettings();
    setupEventListeners();
    loadTasks();
});

// 이벤트 리스너 설정
function setupEventListeners() {
    // 새로고침 버튼
    refreshBtn.addEventListener('click', loadTasks);
    
    // 검색 입력
    searchInput.addEventListener('input', filterTasks);
    
    // 상태 필터
    statusFilter.addEventListener('change', filterTasks);
    
    // 설정 버튼
    settingsBtn.addEventListener('click', openSettingsModal);
    
    // 모달 닫기
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            taskModal.style.display = 'none';
            settingsModal.style.display = 'none';
        });
    });
    
    // 모달 외부 클릭 시 닫기
    window.addEventListener('click', function(event) {
        if (event.target === taskModal) {
            taskModal.style.display = 'none';
        }
        if (event.target === settingsModal) {
            settingsModal.style.display = 'none';
        }
    });
    
    // 설정 저장
    saveSettingsBtn.addEventListener('click', saveSettings);
    
    // 파일 선택
    browseBtn.addEventListener('click', selectFile);
}

// 설정 로드
function loadSettings() {
    const savedDataPath = localStorage.getItem('taskViewerDataPath');
    const savedAutoRefresh = localStorage.getItem('taskViewerAutoRefresh') || '0';
    
    if (savedDataPath) {
        currentDataPath = savedDataPath;
        dataPathInput.value = savedDataPath;
    }
    
    autoRefreshSelect.value = savedAutoRefresh;
    setupAutoRefresh(parseInt(savedAutoRefresh));
}

// 설정 저장
function saveSettings() {
    const dataPath = dataPathInput.value.trim();
    const autoRefresh = autoRefreshSelect.value;
    
    if (dataPath) {
        localStorage.setItem('taskViewerDataPath', dataPath);
        currentDataPath = dataPath;
    }
    
    localStorage.setItem('taskViewerAutoRefresh', autoRefresh);
    setupAutoRefresh(parseInt(autoRefresh));
    
    settingsModal.style.display = 'none';
    loadTasks();
}

// 자동 새로고침 설정
function setupAutoRefresh(interval) {
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
    }
    
    if (interval > 0) {
        autoRefreshInterval = setInterval(loadTasks, interval * 1000);
    }
}

// 파일 선택
function selectFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            dataPathInput.value = file.path || file.name;
        }
    };
    
    input.click();
}

// 설정 모달 열기
function openSettingsModal() {
    settingsModal.style.display = 'block';
}

// 작업 데이터 로드
async function loadTasks() {
    try {
        showLoading();
        
        if (!currentDataPath) {
            showEmptyState('데이터 파일 경로를 설정해주세요.');
            return;
        }
        
        const response = await fetch(currentDataPath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        tasks = data.tasks || [];
        
        updateStats();
        renderTasks();
        
    } catch (error) {
        console.error('작업 데이터 로드 실패:', error);
        showEmptyState('작업 데이터를 불러올 수 없습니다. 파일 경로를 확인해주세요.');
    }
}

// 통계 업데이트
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.status === 'COMPLETED').length;
    const inProgress = tasks.filter(task => task.status === 'IN_PROGRESS').length;
    const pending = tasks.filter(task => task.status === 'PENDING').length;
    
    totalTasksEl.textContent = total;
    completedTasksEl.textContent = completed;
    inProgressTasksEl.textContent = inProgress;
    pendingTasksEl.textContent = pending;
}

// 작업 목록 렌더링
function renderTasks(filteredTasks = null) {
    const tasksToRender = filteredTasks || tasks;
    
    if (tasksToRender.length === 0) {
        showEmptyState('작업이 없습니다.');
        return;
    }
    
    tasksList.innerHTML = tasksToRender.map(task => createTaskCard(task)).join('');
    
    // 작업 카드 클릭 이벤트 추가
    document.querySelectorAll('.task-card').forEach(card => {
        card.addEventListener('click', function() {
            const taskId = this.dataset.taskId;
            const task = tasks.find(t => t.id === taskId);
            if (task) {
                showTaskDetail(task);
            }
        });
    });
}

// 작업 카드 생성
function createTaskCard(task) {
    const statusClass = getStatusClass(task.status);
    const statusText = getStatusText(task.status);
    const createdAt = formatDate(task.createdAt);
    const updatedAt = formatDate(task.updatedAt);
    
    return `
        <div class="task-card ${statusClass}" data-task-id="${task.id}">
            <div class="task-header">
                <div>
                    <div class="task-title">${escapeHtml(task.name)}</div>
                    <div class="task-description">${escapeHtml(task.description.substring(0, 100))}${task.description.length > 100 ? '...' : ''}</div>
                </div>
                <div class="task-status ${statusClass}">${statusText}</div>
            </div>
            <div class="task-meta">
                <span><i class="fas fa-calendar-plus"></i> 생성: ${createdAt}</span>
                <span><i class="fas fa-calendar-check"></i> 수정: ${updatedAt}</span>
                ${task.dependencies && task.dependencies.length > 0 ? 
                    `<span><i class="fas fa-link"></i> 의존성: ${task.dependencies.length}개</span>` : ''}
            </div>
        </div>
    `;
}

// 상태 클래스 가져오기
function getStatusClass(status) {
    switch (status) {
        case 'COMPLETED': return 'completed';
        case 'IN_PROGRESS': return 'in-progress';
        case 'FAILED': return 'failed';
        default: return 'pending';
    }
}

// 상태 텍스트 가져오기
function getStatusText(status) {
    switch (status) {
        case 'COMPLETED': return '완료';
        case 'IN_PROGRESS': return '진행 중';
        case 'FAILED': return '실패';
        default: return '대기 중';
    }
}

// 날짜 포맷팅
function formatDate(dateString) {
    if (!dateString) return '알 수 없음';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// HTML 이스케이프
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 작업 필터링
function filterTasks() {
    const searchTerm = searchInput.value.toLowerCase();
    const statusFilterValue = statusFilter.value;
    
    let filteredTasks = tasks;
    
    // 검색 필터
    if (searchTerm) {
        filteredTasks = filteredTasks.filter(task => 
            task.name.toLowerCase().includes(searchTerm) ||
            task.description.toLowerCase().includes(searchTerm) ||
            task.id.toLowerCase().includes(searchTerm)
        );
    }
    
    // 상태 필터
    if (statusFilterValue) {
        filteredTasks = filteredTasks.filter(task => task.status === statusFilterValue);
    }
    
    renderTasks(filteredTasks);
}

// 작업 상세 정보 표시
function showTaskDetail(task) {
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    modalTitle.textContent = task.name;
    
    modalBody.innerHTML = `
        <div class="task-detail-section">
            <h3><i class="fas fa-info-circle"></i> 기본 정보</h3>
            <div class="task-detail-content">
                <p><strong>ID:</strong> ${task.id}</p>
                <p><strong>상태:</strong> <span class="task-status ${getStatusClass(task.status)}">${getStatusText(task.status)}</span></p>
                <p><strong>생성일:</strong> ${formatDate(task.createdAt)}</p>
                <p><strong>수정일:</strong> ${formatDate(task.updatedAt)}</p>
                ${task.completedAt ? `<p><strong>완료일:</strong> ${formatDate(task.completedAt)}</p>` : ''}
            </div>
        </div>
        
        <div class="task-detail-section">
            <h3><i class="fas fa-align-left"></i> 설명</h3>
            <div class="task-detail-content">
                ${task.description.replace(/\n/g, '<br>')}
            </div>
        </div>
        
        ${task.notes ? `
        <div class="task-detail-section">
            <h3><i class="fas fa-sticky-note"></i> 노트</h3>
            <div class="task-detail-content">
                ${task.notes.replace(/\n/g, '<br>')}
            </div>
        </div>
        ` : ''}
        
        ${task.dependencies && task.dependencies.length > 0 ? `
        <div class="task-detail-section">
            <h3><i class="fas fa-link"></i> 의존성</h3>
            <div class="task-detail-content">
                <ul>
                    ${task.dependencies.map(dep => `<li>${dep.taskId || dep}</li>`).join('')}
                </ul>
            </div>
        </div>
        ` : ''}
        
        ${task.relatedFiles && task.relatedFiles.length > 0 ? `
        <div class="task-detail-section">
            <h3><i class="fas fa-file"></i> 관련 파일</h3>
            <div class="task-detail-content">
                <ul>
                    ${task.relatedFiles.map(file => `
                        <li>
                            <strong>${file.path}</strong> (${file.type})
                            ${file.description ? `<br><small>${file.description}</small>` : ''}
                        </li>
                    `).join('')}
                </ul>
            </div>
        </div>
        ` : ''}
        
        ${task.analysisResult ? `
        <div class="task-detail-section">
            <h3><i class="fas fa-search"></i> 분석 결과</h3>
            <div class="task-detail-content">
                <pre>${escapeHtml(task.analysisResult)}</pre>
            </div>
        </div>
        ` : ''}
        
        ${task.implementationGuide ? `
        <div class="task-detail-section">
            <h3><i class="fas fa-code"></i> 구현 가이드</h3>
            <div class="task-detail-content">
                <pre>${escapeHtml(task.implementationGuide)}</pre>
            </div>
        </div>
        ` : ''}
        
        ${task.verificationCriteria ? `
        <div class="task-detail-section">
            <h3><i class="fas fa-check-circle"></i> 검증 기준</h3>
            <div class="task-detail-content">
                <pre>${escapeHtml(task.verificationCriteria)}</pre>
            </div>
        </div>
        ` : ''}
        
        ${task.summary ? `
        <div class="task-detail-section">
            <h3><i class="fas fa-clipboard-check"></i> 완료 요약</h3>
            <div class="task-detail-content">
                ${task.summary.replace(/\n/g, '<br>')}
            </div>
        </div>
        ` : ''}
    `;
    
    taskModal.style.display = 'block';
}

// 로딩 상태 표시
function showLoading() {
    tasksList.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
        </div>
    `;
}

// 빈 상태 표시
function showEmptyState(message) {
    tasksList.innerHTML = `
        <div class="empty-state">
            <i class="fas fa-inbox"></i>
            <h3>작업이 없습니다</h3>
            <p>${message}</p>
        </div>
    `;
} 