// i18n.js - 다국어 지원 기능
// 번역 데이터 구조
const i18n = {
  "ko": {
    // 네비게이션
    "nav.pain-points": "문제점",
    "nav.features": "기능",
    "nav.workflow": "작업 흐름",
    "nav.installation": "설치 구성",
    "nav.github": "GitHub",
    "nav.menu-button": "메뉴",
    "nav.logo.alt": "Shrimp Task Manager 로고",
    "nav.prompt-custom": "프롬프트 구성",
    // 히어로 섹션
    "hero.title": "Shrimp Task Manager",
    "hero.subtitle": "AI 프로그래밍 어시스턴트를 위한 구조화된 작업 관리의 지능형 시스템",
    "hero.description":
      "AI 어시스턴트에게 장기 메모리 기능을 제공하여 복잡한 작업을 효율적으로 관리하고, 구조화된 작업 분해와 실행 추적을 제공하여 프로그래밍 경험을 더욱 원활하고 효율적으로 만듭니다.",
    "hero.start": "시작하기",
    "hero.learn-more": "더 알아보기",
    "hero.workflow-image.alt": "지능형 작업 관리 워크플로우",
    // 문제점 해결 섹션
    "pain-points.title": "문제점과 해결책",
    "pain-points.subtitle":
      "Shrimp Task Manager는 AI 프로그래밍 어시스턴트가 작업 관리에서 직면하는 세 가지 핵심 문제점을 해결하기 위해 설계되었습니다.",
    "pain-points.memory-loss.title": "메모리 손실",
    "pain-points.memory-loss.description":
      "AI 어시스턴트는 대화 간 작업 메모리 기능이 부족하여 장기 작업 진행 상황을 추적할 수 없고, 동일한 요구사항을 반복적으로 설명하여 시간과 자원을 낭비합니다.",
    "pain-points.memory-loss.solution.title": "작업 메모리 기능",
    "pain-points.memory-loss.solution.description":
      "실행 기록을 자동으로 저장하여 장기 메모리 기능을 제공하고, AI 어시스턴트가 이전 작업 진행 상황을 기억하여 미완성 작업을 원활하게 계속할 수 있도록 합니다.",
    "pain-points.memory-loss.icon.alt": "메모리 손실",
    "pain-points.structure-chaos.title": "구조 혼란",
    "pain-points.structure-chaos.description":
      "복잡한 작업의 체계적 관리 부족으로 인한 비효율성, 의존성 관계 관리 부재, 하위 작업 실행 혼란, 전체 진행 상황 추적의 어려움.",
    "pain-points.structure-chaos.solution.title": "구조화된 작업 분해",
    "pain-points.structure-chaos.solution.description":
      "복잡한 작업을 관리 가능한 하위 작업으로 자동 분해하고, 명확한 의존성 관계를 구축하며, 순서가 있는 실행 경로를 제공하여 효율적인 완료를 보장합니다.",
    "pain-points.structure-chaos.icon.alt": "구조 혼란",
    "pain-points.structure-chaos.solution.icon.alt": "구조화된 작업 분해",
    "pain-points.repeat-work.title": "반복 작업",
    "pain-points.repeat-work.description":
      "과거 경험과 해결책을 효과적으로 활용할 수 없어, 매번 대화마다 처음부터 시작해야 하며, 지식 축적과 경험 참조 시스템이 부족합니다.",
    "pain-points.repeat-work.solution.title": "지식 축적과 경험 참조",
    "pain-points.repeat-work.solution.description":
      "성공적인 해결책을 자동으로 기록하고, 작업 지식베이스를 구축하며, 유사한 작업의 빠른 참조를 지원하여 경험 축적과 지식 재사용을 실현합니다.",
    "pain-points.repeat-work.icon.alt": "반복 작업",
    "pain-points.repeat-work.solution.icon.alt": "지식 축적과 경험 참조",
    "pain-points.explore": "핵심 기능 탐색",
    // 기능 블록
    "features.title": "핵심 기능",
    "features.subtitle":
      "Shrimp Task Manager는 복잡한 작업을 효율적으로 관리, 실행 및 추적할 수 있도록 도와주는 여섯 가지 핵심 기능을 제공합니다.",
    "features.planning.title": "지능형 작업 계획 및 분석",
    "features.planning.description":
      "요구사항과 제약 조건을 깊이 있게 분석하여 구조화된 작업 계획을 생성합니다. 범위, 위험 및 우선순위를 자동으로 평가하고, 합리적이고 포괄적인 구현 전략을 제공합니다.",
    "features.planning.icon.alt": "지능형 작업 계획 및 분석",
    "features.decomposition.title": "자동 작업 분해 및 의존성 관리",
    "features.decomposition.description":
      "복잡한 작업을 관리 가능한 작은 작업으로 지능적으로 분해하고, 작업 간 의존성을 식별하며, 최적화된 실행 경로를 구축하여 자원 충돌과 실행 병목을 방지합니다.",
    "features.decomposition.icon.alt": "자동 작업 분해 및 의존성 관리",
    "features.tracking.title": "실행 상태 추적",
    "features.tracking.description":
      "각 작업의 실행 상태를 실시간으로 모니터링하고, 진행 상황을 시각적으로 표시하며, 의존성 상태를 자동으로 업데이트하고, 작업 완료 시 상세한 실행 보고서를 제공합니다.",
    "features.tracking.icon.alt": "실행 상태 추적",
    "features.verification.title": "작업 완성도 검증",
    "features.verification.description":
      "작업 완성도를 포괄적으로 검사하고, 모든 요구사항과 표준이 충족되었는지 확인하며, 검증 보고서와 품질 평가를 제공하여 산출물이 예상 요구사항을 충족하도록 보장합니다.",
    "features.verification.icon.alt": "작업 완성도 검증",
    "features.complexity.title": "작업 복잡도 평가",
    "features.complexity.description":
      "다차원 기준을 기반으로 작업 복잡도를 평가하고, 자원 요구사항을 추정하며, 고위험 구성 요소를 식별하여 자원과 시간의 합리적인 배분을 도와줍니다.",
    "features.complexity.icon.alt": "작업 복잡도 평가",
    "features.memory.title": "작업 메모리 기능",
    "features.memory.description":
      "세션 간 작업 메모리 기능을 제공하고, 실행 기록과 컨텍스트를 자동으로 저장하며, 언제든지 작업을 복원하고 계속 실행할 수 있도록 하여 요구사항을 반복적으로 설명할 필요가 없습니다.",
    "features.memory.icon.alt": "작업 메모리 기능",
    "features.learn-workflow": "작업 흐름 알아보기",
    // 작업 흐름 블록
    "workflow.title": "작업 흐름",
    "workflow.subtitle":
      "Shrimp Task Manager는 작업 계획부터 작업 완료까지의 모든 단계가 세심하게 설계된 완전한 작업 흐름을 제공합니다.",
    "workflow.step1.title": "작업 계획",
    "workflow.step1.description": "초기화 및 작업 흐름의 상세 계획",
    "workflow.step2.title": "깊이 있는 분석",
    "workflow.step2.description": "요구사항을 깊이 있게 분석하고 기술적 실현 가능성 평가",
    "workflow.step3.title": "방안 반성",
    "workflow.step3.description": "분석 결과를 비판적으로 검토하고 방안 최적화",
    "workflow.step4.title": "작업 분해",
    "workflow.step4.description": "복잡한 작업을 관리 가능한 하위 작업으로 분해",
    "workflow.step5.title": "작업 실행",
    "workflow.step5.description": "미리 정한 계획에 따라 특정 작업 실행",
    "workflow.step6.title": "결과 검증",
    "workflow.step6.description": "작업 완성도와 품질을 포괄적으로 검증",
    "workflow.step7.title": "작업 완료",
    "workflow.step7.description": "작업을 완료 상태로 표시하고 보고서 생성",
    "workflow.learn-more-link": "더 알아보기 →",
    "workflow.mobile.step1.full-description":
      "초기화 및 작업 흐름의 상세 계획, 명확한 목표와 성공 기준 구축, 기존 작업을 참조하여 연속 계획을 선택할 수 있습니다.",
    "workflow.mobile.step2.full-description":
      "요구사항을 깊이 있게 분석하고 기술적 실현 가능성을 평가하여 최적의 구현 방안을 결정합니다.",
    "workflow.mobile.step3.full-description":
      "분석 결과를 비판적으로 검토하고 방안을 최적화하여 더 나은 해결책을 찾습니다.",
    "workflow.mobile.step4.full-description":
      "복잡한 작업을 관리 가능한 하위 작업으로 분해하고 의존성 관계를 구축합니다.",
    "workflow.mobile.step5.full-description":
      "미리 정한 계획에 따라 특정 작업을 실행하고 진행 상황을 추적합니다.",
    "workflow.mobile.step6.full-description":
      "작업 완성도와 품질을 포괄적으로 검증하여 요구사항 충족을 확인합니다.",
    "workflow.mobile.step7.full-description":
      "작업을 완료 상태로 표시하고 상세한 실행 보고서를 생성합니다.",
    // 프롬프트 사용자 정의 섹션
    "prompt-customization.title": "프롬프트 사용자 정의",
    "prompt-customization.subtitle":
      "Shrimp Task Manager는 다양한 환경에서 사용할 수 있도록 유연한 프롬프트 사용자 정의 기능을 제공합니다.",
    "prompt-customization.env-vars.title": "환경 변수 설정",
    "prompt-customization.env-vars.description":
      "환경 변수를 통해 프롬프트 동작을 사용자 정의할 수 있습니다:",
    "prompt-customization.template-custom.title": "템플릿 사용자 정의",
    "prompt-customization.template-custom.description":
      "기존 템플릿을 복사하고 수정하여 프로젝트에 맞는 맞춤형 프롬프트를 만들 수 있습니다:",
    "prompt-customization.learn-more": "사용자 정의 가이드 보기",
    // 설치 구성 섹션
    "installation.title": "설치 및 구성",
    "installation.subtitle":
      "Shrimp Task Manager를 다양한 환경에 설치하고 구성하는 방법을 알아보세요.",
    "installation.smithery.title": "Smithery를 통한 설치",
    "installation.smithery.description":
      "Claude Desktop용 Shrimp Task Manager를 자동으로 설치하려면:",
    "installation.manual.title": "수동 설치",
    "installation.manual.description": "수동으로 설치하려면:",
    "installation.cursor.title": "Cursor IDE 구성",
    "installation.cursor.description":
      "Cursor IDE에서 Shrimp Task Manager를 구성하는 방법:",
    "installation.env-vars.title": "환경 변수",
    "installation.env-vars.description":
      "다음 환경 변수를 사용하여 Shrimp Task Manager의 동작을 사용자 정의할 수 있습니다:",
    // 공통
    "common.lang.ko": "한국어",
    "common.lang.en": "영어",
    "common.loading": "로딩 중...",
    "common.error": "오류",
    "common.success": "성공",
    "common.cancel": "취소",
    "common.confirm": "확인",
    "common.back": "뒤로",
    "common.next": "다음",
    "common.previous": "이전",
    "common.close": "닫기",
    "common.open": "열기",
    "common.save": "저장",
    "common.edit": "편집",
    "common.delete": "삭제",
    "common.copy": "복사",
    "common.paste": "붙여넣기",
    "common.search": "검색",
    "common.filter": "필터",
    "common.sort": "정렬",
    "common.refresh": "새로고침",
    "common.export": "내보내기",
    "common.import": "가져오기",
    "common.download": "다운로드",
    "common.upload": "업로드",
    "common.print": "인쇄",
    "common.share": "공유",
    "common.help": "도움말",
    "common.about": "정보",
    "common.contact": "연락처",
    "common.feedback": "피드백",
    "common.report": "보고",
    "common.settings": "설정",
    "common.profile": "프로필",
    "common.logout": "로그아웃",
    "common.login": "로그인",
    "common.register": "등록",
    "common.forgot-password": "비밀번호 찾기",
    "common.reset-password": "비밀번호 재설정",
    "common.change-password": "비밀번호 변경",
    "common.remember-me": "로그인 상태 유지",
    "common.terms": "이용약관",
    "common.privacy": "개인정보처리방침",
    "common.cookies": "쿠키 정책",
    "common.accessibility": "접근성",
    "common.sitemap": "사이트맵",
    "common.faq": "자주 묻는 질문",
    "common.support": "지원",
    "common.documentation": "문서",
    "common.api": "API",
    "common.developers": "개발자",
    "common.partners": "파트너",
    "common.careers": "채용",
    "common.press": "보도자료",
    "common.blog": "블로그",
    "common.news": "뉴스",
    "common.events": "이벤트",
    "common.webinars": "웨비나",
    "common.training": "교육",
    "common.certification": "인증",
    "common.community": "커뮤니티",
    "common.forum": "포럼",
    "common.discord": "Discord",
    "common.slack": "Slack",
    "common.twitter": "Twitter",
    "common.facebook": "Facebook",
    "common.linkedin": "LinkedIn",
    "common.youtube": "YouTube",
    "common.github": "GitHub",
    "common.gitlab": "GitLab",
    "common.bitbucket": "Bitbucket",
    "common.stackoverflow": "Stack Overflow",
    "common.reddit": "Reddit",
    "common.hackernews": "Hacker News",
    "common.producthunt": "Product Hunt",
    "common.indiehackers": "Indie Hackers",
    "common.dev": "Dev.to",
    "common.medium": "Medium",
    "common.substack": "Substack",
    "common.hashnode": "Hashnode",
    "common.devto": "Dev.to",
    "common.hashnode": "Hashnode",
    "common.substack": "Substack",
    "common.medium": "Medium",
    "common.dev": "Dev.to",
    "common.indiehackers": "Indie Hackers",
    "common.producthunt": "Product Hunt",
    "common.hackernews": "Hacker News",
    "common.reddit": "Reddit",
    "common.stackoverflow": "Stack Overflow",
    "common.bitbucket": "Bitbucket",
    "common.gitlab": "GitLab",
    "common.github": "GitHub",
    "common.youtube": "YouTube",
    "common.linkedin": "LinkedIn",
    "common.facebook": "Facebook",
    "common.twitter": "Twitter",
    "common.slack": "Slack",
    "common.discord": "Discord",
    "common.forum": "포럼",
    "common.community": "커뮤니티",
    "common.certification": "인증",
    "common.training": "교육",
    "common.webinars": "웨비나",
    "common.events": "이벤트",
    "common.news": "뉴스",
    "common.blog": "블로그",
    "common.press": "보도자료",
    "common.careers": "채용",
    "common.partners": "파트너",
    "common.developers": "개발자",
    "common.api": "API",
    "common.documentation": "문서",
    "common.support": "지원",
    "common.faq": "자주 묻는 질문",
    "common.sitemap": "사이트맵",
    "common.accessibility": "접근성",
    "common.cookies": "쿠키 정책",
    "common.privacy": "개인정보처리방침",
    "common.terms": "이용약관",
    "common.remember-me": "로그인 상태 유지",
    "common.change-password": "비밀번호 변경",
    "common.reset-password": "비밀번호 재설정",
    "common.forgot-password": "비밀번호 찾기",
    "common.register": "등록",
    "common.login": "로그인",
    "common.logout": "로그아웃",
    "common.profile": "프로필",
    "common.settings": "설정",
    "common.report": "보고",
    "common.feedback": "피드백",
    "common.contact": "연락처",
    "common.about": "정보",
    "common.help": "도움말",
    "common.share": "공유",
    "common.print": "인쇄",
    "common.upload": "업로드",
    "common.download": "다운로드",
    "common.import": "가져오기",
    "common.export": "내보내기",
    "common.refresh": "새로고침",
    "common.sort": "정렬",
    "common.filter": "필터",
    "common.search": "검색",
    "common.paste": "붙여넣기",
    "common.copy": "복사",
    "common.delete": "삭제",
    "common.edit": "편집",
    "common.save": "저장",
    "common.open": "열기",
    "common.close": "닫기",
    "common.previous": "이전",
    "common.next": "다음",
    "common.back": "뒤로",
    "common.confirm": "확인",
    "common.cancel": "취소",
    "common.success": "성공",
    "common.error": "오류",
    "common.loading": "로딩 중..."
  },
  en: {
    // 네비게이션
    "nav.pain-points": "Pain Points",
    "nav.features": "Features",
    "nav.workflow": "Workflow",
    "nav.installation": "Installation",
    "nav.github": "GitHub",
    "nav.menu-button": "Menu",
    "nav.logo.alt": "Shrimp Task Manager Logo",
    "nav.prompt-custom": "Prompt Config",
    // 히어로 섹션
    "hero.title": "Shrimp Task Manager",
    "hero.subtitle":
      "Intelligent System for Structured Task Management in AI Programming Assistants",
    "hero.description":
      "Empower your AI assistant with long-term memory capabilities, efficient complex task management, and structured task decomposition and execution tracking, making your programming experience smoother and more efficient.",
    "hero.start": "Get Started",
    "hero.learn-more": "Learn More",
    "hero.workflow-image.alt": "Intelligent Task Management Workflow",
    // 문제점 해결 섹션
    "pain-points.title": "Pain Points & Solutions",
    "pain-points.subtitle":
      "Shrimp Task Manager is designed to solve three core pain points faced by AI programming assistants in task management.",
    "pain-points.memory-loss.title": "Memory Loss",
    "pain-points.memory-loss.description":
      "AI assistants lack cross-conversation task memory capability, resulting in inability to track long-term task progress, repeated explanation of the same requirements, and wasted time and resources.",
    "pain-points.memory-loss.solution.title": "Task Memory Function",
    "pain-points.memory-loss.solution.description":
      "Automatically save execution history, provide long-term memory capability, allowing AI assistants to remember previous task progress and seamlessly continue unfinished tasks.",
    "pain-points.memory-loss.icon.alt": "Memory Loss",
    "pain-points.structure-chaos.title": "Structural Chaos",
    "pain-points.structure-chaos.description":
      "Complex tasks lack systematic management leading to inefficiency, missing dependency management, chaotic subtask execution, and difficulty tracking overall progress.",
    "pain-points.structure-chaos.solution.title": "Structured Task Decomposition",
    "pain-points.structure-chaos.solution.description":
      "Automatically decompose complex tasks into manageable subtasks, establish clear dependencies, provide ordered execution paths, and ensure efficient completion.",
    "pain-points.structure-chaos.icon.alt": "Structural Chaos",
    "pain-points.structure-chaos.solution.icon.alt":
      "Structured Task Decomposition",
    "pain-points.repeat-work.title": "Repetitive Work",
    "pain-points.repeat-work.description":
      "Unable to effectively utilize past experience and solutions, each conversation starts from scratch, lacking knowledge accumulation and experience reference systems.",
    "pain-points.repeat-work.solution.title": "Knowledge Accumulation & Experience Reference",
    "pain-points.repeat-work.solution.description":
      "Automatically records successful solutions, builds a task knowledge base, supports quick reference for similar tasks, achieving experience accumulation and knowledge reuse.",
    "pain-points.repeat-work.icon.alt": "Repetitive Work",
    "pain-points.repeat-work.solution.icon.alt":
      "Knowledge Accumulation and Experience Reference",
    "pain-points.explore": "Explore Core Features",
    // 기능 블록
    "features.title": "Core Features",
    "features.subtitle":
      "Shrimp Task Manager provides six core features to help you efficiently manage, execute, and track complex tasks.",
    "features.planning.title": "Intelligent Task Planning & Analysis",
    "features.planning.description":
      "Through in-depth analysis of requirements and constraints, generate structured task plans. Automatically assess scope, risks, and priorities to provide rational and comprehensive implementation strategies.",
    "features.planning.icon.alt": "Intelligent Task Planning and Analysis",
    "features.decomposition.title":
      "Automatic Task Decomposition & Dependency Management",
    "features.decomposition.description":
      "Intelligently break down complex tasks into manageable smaller tasks, identify dependencies between tasks, establish optimized execution paths, and avoid resource conflicts and execution bottlenecks.",
    "features.decomposition.icon.alt":
      "Automatic Task Decomposition and Dependency Management",
    "features.tracking.title": "Execution Status Tracking",
    "features.tracking.description":
      "Monitor the execution status of each task in real-time, provide progress visualization, automatically update dependency status, and provide detailed execution reports upon task completion.",
    "features.tracking.icon.alt": "Execution Status Tracking",
    "features.verification.title": "Task Integrity Verification",
    "features.verification.description":
      "Thoroughly check task completion, ensure all requirements and standards have been met, provide verification reports and quality assessments, and ensure output meets expected requirements.",
    "features.verification.icon.alt": "Task Integrity Verification",
    "features.complexity.title": "Task Complexity Assessment",
    "features.complexity.description":
      "Evaluate task complexity based on multi-dimensional standards, provide resource requirement estimates, identify high-risk components, and help reasonably allocate resources and time.",
    "features.complexity.icon.alt": "Task Complexity Assessment",
    "features.memory.title": "Task Memory Function",
    "features.memory.description":
      "Provide cross-session task memory capabilities, automatically save execution history and context, allow task resumption and continuation at any time, without the need to re-explain requirements.",
    "features.memory.icon.alt": "Task Memory Function",
    "features.learn-workflow": "Learn about the Workflow",
    // 작업 흐름 블록
    "workflow.title": "Workflow",
    "workflow.subtitle":
      "Shrimp Task Manager provides a complete workflow, with each step from task planning to task completion carefully designed.",
    "workflow.step1.title": "Task Planning",
    "workflow.step1.description": "Initialize and plan task flow in detail",
    "workflow.step2.title": "In-depth Analysis",
    "workflow.step2.description":
      "Analyze requirements and assess technical feasibility",
    "workflow.step3.title": "Solution Reflection",
    "workflow.step3.description":
      "Critically review analysis results and optimize solutions",
    "workflow.step4.title": "Task Decomposition",
    "workflow.step4.description":
      "Break down complex tasks into manageable subtasks",
    "workflow.step5.title": "Task Execution",
    "workflow.step5.description":
      "Execute specific tasks according to predetermined plans",
    "workflow.step6.title": "Result Verification",
    "workflow.step6.description":
      "Thoroughly verify task completion and quality",
    "workflow.step7.title": "Task Completion",
    "workflow.step7.description":
      "Mark tasks as completed and generate reports",
    "workflow.learn-more-link": "Learn More →",
    "workflow.mobile.step1.full-description":
      "Initialize and plan task flow in detail, establish clear goals and success criteria, with the option to reference existing tasks for continued planning.",
    "workflow.mobile.step2.full-description":
      "Analyze task requirements in depth and systematically review codebase, assess technical feasibility and potential risks, and provide initial solution recommendations.",
    "workflow.mobile.step3.full-description":
      "Critically review analysis results, evaluate solution completeness and identify optimization opportunities, ensuring solutions follow best practices.",
    "workflow.mobile.step4.full-description":
      "Break complex tasks into independent and trackable subtasks, establish clear dependencies and priorities, support multiple update modes.",
    "workflow.mobile.step5.full-description":
      "Execute specific tasks according to the predefined plan, ensure each step's output meets quality standards, and handle exceptions during execution.",
    "workflow.mobile.step6.full-description":
      "Comprehensively verify task completion, ensure all requirements and technical standards are met with no missing details, provide quality assessment reports.",
    "workflow.mobile.step7.full-description":
      "Formally mark tasks as completed, generate detailed completion reports, and update dependency status of related tasks to ensure workflow continuity.",
    // 설치 구성 섹션
    "installation.title": "Installation & Configuration",
    "installation.subtitle":
      "Shrimp Task Manager offers multiple installation methods, whether you want to get started quickly or need advanced configuration, it's easy to set up.",
    "installation.manual.title": "Manual Installation",
    "installation.step1": "Clone Repository",
    "installation.step2": "Install Dependencies",
    "installation.step3": "Build Project",
    "installation.cursor.title": "Cursor IDE Configuration",
    "installation.cursor.description":
      "If you use Cursor IDE, you can integrate Shrimp Task Manager into your development environment.",
    "installation.quickstart.title": "Quick Start",
    "installation.quickstart.description":
      "After installation, check our quick start guide to learn how to use MCP Shrimp Task Manager.",
    "installation.faq.title": "FAQ",
    "installation.faq.description":
      "Having issues? Check our frequently asked questions or submit an issue on GitHub.",
    "installation.copy-button": "Copy",
    "installation.important-note.title": "Important Note",
    "installation.important-note.description":
      "Must use absolute path: Please ensure the DATA_DIR configuration uses absolute paths rather than relative paths, otherwise data may not load correctly",
    "installation.prompt-config.title": "Prompt Configuration Guide",
    "installation.prompt-config.intro":
      "Shrimp Task Manager supports two modes:",
    "installation.prompt-config.mode1.title": "TaskPlanner:",
    "installation.prompt-config.mode1.description":
      "Suitable for initial task planning and complex task decomposition, where the AI assistant plays the role of a task planner.",
    "installation.prompt-config.mode2.title": "TaskExecutor:",
    "installation.prompt-config.mode2.description":
      "Suitable for executing predefined tasks, where the AI assistant plays the role of an execution expert.",
    "installation.prompt-config.tip":
      "You can use Custom modes in Cursor settings to customize modes to suit different work scenarios.",
    // CTA 블록
    "cta.title": "Experience Intelligent Task Management Now",
    "cta.description":
      "Enhance your AI programming experience, say goodbye to disorganized task management, and embrace a more efficient workflow.",
    "cta.github": "Go to GitHub Repository",
    "cta.start": "Start Installation",
    // 푸터 블록
    "footer.copyright": "© 2023 MCP Task Manager. All Rights Reserved.",
    "footer.developer": "Made with ❤️ by Siage",

    // 공통 UI 요소
    "common.close": "Close",
    "common.back": "Back",
    "common.next": "Next",
    "common.submit": "Submit",
    "common.cancel": "Cancel",
    "common.confirm": "Confirm",
    "common.copy": "Copy",
    "common.copied": "Copied!",
    "common.yes": "Yes",
    "common.no": "No",
    "common.more": "More",
    "common.less": "Less",
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.success": "Success",
    "common.warning": "Warning",
    "common.info": "Info",
    "common.search": "Search",
    "common.filter": "Filter",
    "common.sort": "Sort",
    "common.ascending": "Ascending",
    "common.descending": "Descending",
    "common.lang.ko": "KO",
    "common.lang.en": "EN",
    "modal.close-button": "Close",
    "modal.close-button-aria": "Close",

    // 작업 흐름 상세 내용
    "workflow.step1.content.title": "Task Planning Stage",
    "workflow.step1.content.description":
      "The task planning stage is the initial phase where AI assistants define project scope, set goals, and establish success criteria.",
    "workflow.step1.content.activities": "Key Activities:",
    "workflow.step1.content.activity1":
      "Clarify project requirements and constraints",
    "workflow.step1.content.activity2":
      "Set clear objectives and define measurable success criteria",
    "workflow.step1.content.activity3":
      "Establish project boundaries and identify stakeholders",
    "workflow.step1.content.activity4":
      "Create a high-level plan with timeline estimates",
    "workflow.step1.content.activity5":
      "Optionally reference existing tasks for continuous planning",
    "workflow.step1.content.outputs": "Outputs:",
    "workflow.step1.content.output1": "Comprehensive task description",
    "workflow.step1.content.output2": "Clear success criteria",
    "workflow.step1.content.output3": "Technical requirements and constraints",
    "workflow.step1.content.summary":
      "This stage lays the foundation for all subsequent work, ensuring that both the AI assistant and the user have a shared understanding of what needs to be accomplished.",

    "workflow.step2.content.title": "In-depth Analysis Stage",
    "workflow.step2.content.description":
      "The in-depth analysis stage involves a thorough examination of the requirements and technical landscape to develop a viable implementation strategy.",
    "workflow.step2.content.activities": "Key Activities:",
    "workflow.step2.content.activity1":
      "Analyze requirements and identify technical challenges",
    "workflow.step2.content.activity2":
      "Evaluate technical feasibility and potential risks",
    "workflow.step2.content.activity3":
      "Research best practices and available solutions",
    "workflow.step2.content.activity4":
      "Systematically review existing codebase if applicable",
    "workflow.step2.content.activity5":
      "Develop initial implementation concepts",
    "workflow.step2.content.outputs": "Outputs:",
    "workflow.step2.content.output1": "Technical feasibility assessment",
    "workflow.step2.content.output2":
      "Risk identification and mitigation strategies",
    "workflow.step2.content.output3": "Initial implementation approach",
    "workflow.step2.content.output4":
      "Pseudocode or architectural diagrams where appropriate",
    "workflow.step2.content.summary":
      "This stage ensures that the proposed solution is technically sound and addresses all requirements before proceeding to implementation.",

    // 오류 및 경고 메시지
    "error.storage":
      "Unable to access local storage, language preferences will not be saved.",
    "error.translation": "Translation error: Unable to load translation data.",
    "error.network": "Network error: Unable to connect to the server.",
    "warning.browser":
      "Your browser may not support all features, we recommend using the latest version of Chrome, Firefox, or Safari.",
    "warning.mobile": "Some features may be limited on mobile devices.",

    // 코드 예제 블록
    "examples.planning.title": "Task Planning and Decomposition Process",
    "examples.planning.intro":
      "This example demonstrates how to use MCP Shrimp Task Manager to plan and break down complex tasks. The entire process includes four main steps:",
    "examples.planning.step1":
      "Initialize and plan tasks in detail, establishing clear goals and success criteria",
    "examples.planning.step2":
      "Deeply understand the task, analyze technical feasibility and potential challenges",
    "examples.planning.step3":
      "Critically review analysis results and optimize proposals",
    "examples.planning.step4": "Break complex tasks into manageable subtasks",
    "examples.planning.conclusion":
      "With this approach, you can transform complex, large tasks into structured, executable work units while maintaining an overall perspective.",
    "examples.execution.title": "Task Execution and Completion Process",
    "examples.execution.intro":
      "This example demonstrates how to execute and complete planned tasks. The entire process includes four main steps:",
    "examples.execution.step1.title": "Task List",
    "examples.execution.step1":
      "Query pending task list to understand current status",
    "examples.execution.step2":
      "Execute selected tasks according to the predetermined plan",
    "examples.execution.step3":
      "Verify task completion to ensure quality standards are met",
    "examples.execution.step4":
      "Officially mark tasks as completed and generate reports",
    "examples.execution.conclusion":
      "With this approach, you can systematically execute tasks and ensure each step meets expected quality standards, ultimately completing the entire workflow.",
    "examples.tip.title": "💡 Tip",
    "examples.tip.description":
      "The workflow above is not fixed. The Agent will iterate through different steps based on analysis until the expected effect is achieved.",

    // 빠른 시작 및 자주 묻는 질문 블록
    "quickstart.title": "Quick Start",
    "quickstart.description":
      "After installation, check our quick start guide to learn how to use MCP Shrimp Task Manager.",
    "quickstart.view-code-link": "View Code →",
    "faq.title": "Frequently Asked Questions",
    "faq.description":
      "Having issues? Check our frequently asked questions or submit an issue on GitHub.",
    "faq.view-faq-link": "View FAQ →",
    "installation.cursor.mcp-servers": "to/your/project/.cursor/mcp.jsonn",
    "task.planner.prompt": `You are a professional task planning expert. You must interact with users, analyze their needs, and collect project-related information. Finally, you must use "plan_task" to create tasks. When the task is created, you must summarize it and inform the user to use the "TaskExecutor" mode to execute the task.
You must focus on task planning. Do not use "execute_task" to execute tasks.
Serious warning: you are a task planning expert, you cannot modify the program code directly, you can only plan tasks, and you cannot modify the program code directly, you can only plan tasks.`,
    "task.executor.prompt": `You are a professional task execution expert. When a user specifies a task to execute, use "execute_task" to execute the task.
If no task is specified, use "list_tasks" to find unexecuted tasks and execute them.
When the execution is completed, a summary must be given to inform the user of the conclusion.
You can only perform one task at a time, and when a task is completed, you are prohibited from performing the next task unless the user explicitly tells you to.
If the user requests "continuous mode", all tasks will be executed in sequence.`,
    // 프롬프트 사용자 정의 기능 블록
    "prompt-custom.title": "Prompt Customization",
    "prompt-custom.subtitle":
      "Customize AI assistant behavior through environment variables, without modifying code",

    "prompt-custom.overview.title": "Feature Overview",
    "prompt-custom.overview.description":
      "Prompt customization allows users to adjust AI assistant behavior through environment variables, providing two customization methods: completely override original prompts or append content to existing ones.",

    "prompt-custom.benefits.title": "Key Benefits",
    "prompt-custom.benefits.item1":
      "Personalized customization: Adjust system behavior for specific projects or domains",
    "prompt-custom.benefits.item2":
      "Efficiency improvement: Optimize for repetitive task types, reducing redundant instructions",
    "prompt-custom.benefits.item3":
      "Brand consistency: Ensure output content adheres to organization style guides and standards",
    "prompt-custom.benefits.item4":
      "Professional adaptability: Adjust terminology and standards for specific technical fields or industries",
    "prompt-custom.benefits.item5":
      "Team collaboration: Unify prompts used by team members, ensuring consistent workflow",

    "prompt-custom.usage.title": "Usage Guide",
    "prompt-custom.usage.env.title": "Environment Variables Configuration",
    "prompt-custom.usage.env.description":
      "Set environment variables to customize prompts for each function, using specific naming conventions:",
    "prompt-custom.usage.more":
      "View detailed documentation for more configuration methods and parameter usage.",
    "prompt-custom.view-docs": "View Complete Documentation",
  },
};

// 번역 적용 함수
function applyTranslations(lang) {
  // 언어가 없으면 기본값으로 'ko' 설정
  lang = lang || "ko";
  
  // 번역이 있는지 확인
  if (!i18n[lang]) {
    console.error(`번역을 찾을 수 없습니다: ${lang}`);
    return;
  }

  // data-i18n 속성을 가진 모든 요소에 번역 적용
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");
    if (i18n[lang][key]) {
      element.textContent = i18n[lang][key];
    } else {
      console.warn(`번역 키를 찾을 수 없습니다: ${key}`);
    }
  });

  // 언어별 링크 처리
  document.querySelectorAll(".lang-specific").forEach((element) => {
    if (element.hasAttribute(`data-lang-${lang}`)) {
      const langSpecificHref = element.getAttribute(`data-lang-${lang}`);
      if (langSpecificHref) {
        element.setAttribute("href", langSpecificHref);
      }
    }
  });
}

// 언어 설정 및 사용자 선호도 저장
function setLanguage(lang) {
  // 사용자 선호도 저장
  localStorage.setItem("preferred-language", lang);

  // 번역 적용
  applyTranslations(lang);

  // 언어 버튼 상태 업데이트
  document.querySelectorAll(".lang-btn").forEach(function (btn) {
    if (btn.getAttribute("data-lang") === lang) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  // html 태그의 lang 속성 업데이트
  document.documentElement.setAttribute("lang", lang);
}

// 사용자 선호 언어 또는 브라우저 언어 가져오기
function getPreferredLanguage() {
  // 로컬 스토리지 확인
  const savedLang = localStorage.getItem("preferred-language");
  if (savedLang && i18n[savedLang]) {
    return savedLang;
  }

  // 브라우저 언어 확인
  const browserLang = navigator.language || navigator.userLanguage;
  if (browserLang) {
    // 전체 언어 코드 매칭 시도
    if (i18n[browserLang]) {
      return browserLang;
    }

    // 언어 코드 앞 두 글자 매칭 시도 (예: "ko-KR" -> "ko")
    const langPrefix = browserLang.split("-")[0];
    if (i18n[langPrefix]) {
      return langPrefix;
    }
  }

  // 기본값은 한국어
  return "ko";
}

// 웹사이트 언어 초기화
function initializeLanguage() {
  const preferredLang = getPreferredLanguage();
  setLanguage(preferredLang);
}

// 페이지 로드 완료 후 언어 초기화 및 이벤트 리스너
document.addEventListener("DOMContentLoaded", function () {
  // 언어 초기화
  initializeLanguage();

  // 언어 버튼 이벤트 리스너
  document.querySelectorAll(".lang-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      setLanguage(this.getAttribute("data-lang"));
    });
  });
});

// ==================================================
// 동적 콘텐츠 번역 및 성능 최적화 함수
// ==================================================

/**
 * 번역 속성이 있는 동적 요소 생성
 * @param {string} i18nKey - 번역 키
 * @param {string} defaultText - 기본 텍스트
 * @param {string} elementType - 요소 유형, 기본값은 div
 * @returns {HTMLElement} - 생성된 요소
 */
function createDynamicElement(i18nKey, defaultText, elementType = "div") {
  const element = document.createElement(elementType);
  element.setAttribute("data-i18n", i18nKey);

  // 현재 언어 가져오기
  const currentLang = getPreferredLanguage();

  // 텍스트 내용 설정
  element.textContent =
    i18n[currentLang] && i18n[currentLang][i18nKey]
      ? i18n[currentLang][i18nKey]
      : defaultText;

  return element;
}

/**
 * 번역 유틸리티 함수 - 번역된 텍스트 가져오기
 * @param {string} key - 번역 키
 * @param {string} defaultText - 기본 텍스트
 * @returns {string} - 번역된 텍스트
 */
function translateText(key, defaultText) {
  const currentLang = getPreferredLanguage();
  return i18n[currentLang] && i18n[currentLang][key]
    ? i18n[currentLang][key]
    : defaultText;
}

/**
 * 번역을 일괄 처리하여 성능 향상
 * 페이지에 번역할 요소가 많을 때 사용
 */
function batchApplyTranslations() {
  // 페이지 렌더링을 막지 않도록 번역을 지연 로드
  window.addEventListener("load", function () {
    // 번역 내용이 많으면 일괄 처리
    setTimeout(function () {
      const elements = document.querySelectorAll("[data-i18n]");
      const batchSize = 50; // 각 배치에서 50개 요소 처리
      const currentLang = getPreferredLanguage();

      for (let i = 0; i < elements.length; i += batchSize) {
        setTimeout(function () {
          const batch = Array.prototype.slice.call(elements, i, i + batchSize);
          batch.forEach(function (el) {
            // 처리되지 않은 번역 적용
            const key = el.getAttribute("data-i18n");
            if (i18n[currentLang] && i18n[currentLang][key]) {
              el.textContent = i18n[currentLang][key];
            }
          });
        }, 0);
      }
    }, 0);
  });
}

/**
 * 애니메이션 효과가 있는 언어 전환
 * @param {string} lang - 대상 언어
 */
function setLanguageWithAnimation(lang) {
  // 페이드 아웃 효과 추가
  document.body.classList.add("lang-transition");

  setTimeout(function () {
    // 번역 적용
    setLanguage(lang);

    // 페이드 인 효과 추가
    document.body.classList.remove("lang-transition");
  }, 300);
}

// 페이지 로드 시 성능 최적화된 일괄 번역 실행
batchApplyTranslations();

// 언어 전환 애니메이션 CSS 스타일 추가
const styleElement = document.createElement("style");
styleElement.textContent = `
.lang-btn {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

.lang-btn.active {
  background-color: #3b82f6;
  color: white;
}

.language-switcher {
  display: flex;
  gap: 0.5rem;
  margin-left: 1rem;
}

/* 언어 전환 전환 애니메이션 */
.lang-transition {
  opacity: 0.8;
  transition: opacity 0.3s ease;
}
`;
document.head.appendChild(styleElement);

// ==================================================
// 방어적 프로그래밍 함수, 번역 시스템의 견고성 보장
// ==================================================

/**
 * 안전한 번역 함수 - i18n 객체가 없거나 형식이 잘못되었을 때 충돌하지 않도록 보장
 * @param {string} key - 번역 키
 * @param {string} defaultText - 기본 텍스트
 * @returns {string} - 번역된 텍스트
 */
function safeTranslate(key, defaultText) {
  try {
    const currentLang = getPreferredLanguage();
    if (
      typeof i18n === "undefined" ||
      !i18n[currentLang] ||
      !i18n[currentLang][key]
    ) {
      console.warn(`번역 키 "${key}"가 존재하지 않으므로 기본 텍스트를 사용합니다.`);
      return defaultText;
    }
    return i18n[currentLang][key];
  } catch (e) {
    console.error("번역 오류:", e);
    return defaultText;
  }
}

/**
 * LocalStorage 사용 가능 여부 감지
 * @param {string} type - 스토리지 유형, 일반적으로 'localStorage'
 * @returns {boolean} - 사용 가능 여부
 */
function storageAvailable(type) {
  try {
    const storage = window[type];
    const x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      // Firefox 대상
      (e.code === 22 ||
        // Chrome 대상
        e.code === 1014 ||
        // 이름 필드 테스트
        e.name === "QuotaExceededError" ||
        e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
      // 스토리지가 비어 있지 않은지 확인
      storage &&
      storage.length !== 0
    );
  }
}

/**
 * 향상된 초기화 함수 - 방어 기능 추가
 */
function enhancedInitializeLanguage() {
  try {
    // 브라우저가 LocalStorage를 지원하는지 확인
    if (storageAvailable("localStorage")) {
      let preferredLang = localStorage.getItem("preferred-language");

      if (!preferredLang) {
        const browserLang = navigator.language || navigator.userLanguage;
        preferredLang =
          browserLang && browserLang.startsWith("ko") ? "ko" : "en";
      }

      // 언어 코드가 유효한지 확인
      if (!i18n[preferredLang]) {
        console.warn(`지원되지 않는 언어 코드 ${preferredLang}, 기본 언어 사용`);
        preferredLang = "ko";
      }

      setLanguage(preferredLang);
    } else {
      // LocalStorage를 지원하지 않으면 기본적으로 한국어 사용
      console.warn("LocalStorage를 사용할 수 없으므로 언어 기본 설정이 저장되지 않습니다.");
      setLanguage("ko");
    }
  } catch (error) {
    console.error("언어 초기화 중 오류 발생:", error);
    // 오류 발생 시 기본 언어 사용
    try {
      setLanguage("ko");
    } catch (e) {
      console.error("기본 언어를 설정할 수 없습니다:", e);
    }
  }
}

// 원래 함수를 향상된 언어 전환 함수로 교체
function enhancedSetLanguage(lang) {
  try {
    // 언어 코드가 유효한지 확인
    if (!i18n[lang]) {
      console.warn(`지원되지 않는 언어 코드: ${lang}, 기본 언어 사용`);
      lang = "ko";
    }

    // 사용자 기본 설정 저장 시도
    try {
      if (storageAvailable("localStorage")) {
        localStorage.setItem("preferred-language", lang);
      }
    } catch (e) {
      console.warn("언어 기본 설정을 저장할 수 없습니다:", e);
    }

    // 번역 적용
    applyTranslations(lang);

    // 버튼 상태 업데이트
    try {
      document.querySelectorAll(".lang-btn").forEach(function (btn) {
        if (btn.getAttribute("data-lang") === lang) {
          btn.classList.add("active");
        } else {
          btn.classList.remove("active");
        }
      });
    } catch (e) {
      console.warn("언어 버튼 상태를 업데이트할 수 없습니다:", e);
    }

    // HTML 태그의 lang 속성 업데이트
    try {
      document.documentElement.setAttribute("lang", lang);
    } catch (e) {
      console.warn("HTML lang 속성을 업데이트할 수 없습니다:", e);
    }

    // 언어 변경을 알리는 사용자 정의 이벤트 트리거
    try {
      const event = new CustomEvent("languageChanged", {
        detail: { language: lang },
      });
      document.dispatchEvent(event);
    } catch (e) {
      console.warn("언어 변경 이벤트를 트리거할 수 없습니다:", e);
    }
  } catch (error) {
    console.error("언어 설정 중 오류 발생:", error);
  }
}

/**
 * 호환성 테스트 함수 - 다국어 시스템이 정상적으로 작동하는지 확인
 * 다음 기능 테스트:
 * 1. LocalStorage 사용 가능 여부
 * 2. 언어 전환 기능 정상 작동 여부
 * 3. 번역 적용 정상 작동 여부
 * 4. 동적 콘텐츠 번역 정상 작동 여부
 *
 * @returns {Object} 테스트 결과 객체
 */
function i18nCompatibilityTest() {
  const results = {
    localStorage: false,
    languageSwitch: false,
    translations: false,
    dynamicContent: false,
    details: {
      errors: [],
      warnings: [],
      info: [],
    },
  };

  // LocalStorage 사용 가능 여부 테스트
  try {
    results.localStorage = storageAvailable("localStorage");
    results.details.info.push(
      "LocalStorage " + (results.localStorage ? "사용 가능" : "사용 불가")
    );
  } catch (e) {
    results.details.errors.push("LocalStorage 테스트 중 오류 발생: " + e.message);
  }

  // 언어 전환 기능 테스트
  try {
    // 현재 언어 저장
    const originalLang =
      document.documentElement.lang ||
      localStorage.getItem("preferred-language") ||
      "ko";

    // 언어 전환 시도
    const testLang = originalLang === "en" ? "ko" : "en";

    // 안전한 언어 전환 방식 사용
    if (typeof enhancedSetLanguage === "function") {
      enhancedSetLanguage(testLang);
    } else if (typeof setLanguage === "function") {
      setLanguage(testLang);
    } else {
      throw new Error("언어 전환 함수를 찾을 수 없습니다.");
    }

    // 언어가 성공적으로 전환되었는지 확인
    const newLang =
      document.documentElement.lang ||
      localStorage.getItem("preferred-language");

    results.languageSwitch = newLang === testLang;
    results.details.info.push(
      "언어 전환 " + (results.languageSwitch ? "정상" : "비정상")
    );

    // 원래 언어로 복원
    if (typeof enhancedSetLanguage === "function") {
      enhancedSetLanguage(originalLang);
    } else if (typeof setLanguage === "function") {
      setLanguage(originalLang);
    }
  } catch (e) {
    results.details.errors.push("언어 전환 테스트 중 오류 발생: " + e.message);
  }

  // 번역 적용이 정상적인지 테스트
  try {
    // 페이지에서 data-i18n 속성이 있는 요소 찾기
    const translatedElements = document.querySelectorAll("[data-i18n]");
    if (translatedElements.length > 0) {
      // 내용이 있는지 확인
      let hasContent = false;
      translatedElements.forEach((el) => {
        if (el.textContent && el.textContent.trim() !== "") {
          hasContent = true;
        }
      });

      results.translations = hasContent;
      results.details.info.push(
        "찾음 " +
          translatedElements.length +
          " 개의 번역된 요소, 내용" +
          (hasContent ? "정상" : "비정상")
      );
    } else {
      results.details.warnings.push("페이지에서 data-i18n 속성이 있는 요소를 찾을 수 없습니다.");
    }
  } catch (e) {
    results.details.errors.push("번역 적용 테스트 중 오류 발생: " + e.message);
  }

  // 동적 콘텐츠 번역 테스트
  try {
    if (
      typeof createDynamicElement === "function" &&
      typeof translateText === "function"
    ) {
      // 테스트 요소 생성
      const testKey = "test.dynamic";
      const testDefault = "동적 콘텐츠 테스트";
      const testElement = createDynamicElement(testKey, testDefault);

      // 요소가 올바르게 생성되었는지 확인
      if (
        testElement &&
        testElement.getAttribute("data-i18n") === testKey &&
        testElement.textContent === testDefault
      ) {
        results.dynamicContent = true;
      }

      results.details.info.push(
        "동적 콘텐츠 번역 " + (results.dynamicContent ? "정상" : "비정상")
      );
    } else {
      results.details.warnings.push("동적 콘텐츠 번역 기능을 사용할 수 없습니다.");
    }
  } catch (e) {
    results.details.errors.push("동적 콘텐츠 번역 테스트 중 오류 발생: " + e.message);
  }

  // 테스트 결과 요약 출력
  console.log(
    "다국어 호환성 테스트 결과:",
    results.localStorage && results.languageSwitch && results.translations
      ? "통과 ✅"
      : "일부 기능 비정상 ⚠️"
  );
  console.table({
    "LocalStorage 사용 가능:": results.localStorage ? "✅" : "❌",
    "언어 전환 기능:": results.languageSwitch ? "✅" : "❌",
    "번역 적용:": results.translations ? "✅" : "❌",
    "동적 콘텐츠 번역:": results.dynamicContent ? "✅" : "❌",
  });

  if (results.details.errors.length > 0) {
    console.error("오류:", results.details.errors);
  }

  if (results.details.warnings.length > 0) {
    console.warn("경고:", results.details.warnings);
  }

  return results;
}

// 호환성 테스트를 자동으로 실행하고 결과를 전역 변수에 저장
window.addEventListener("load", function () {
  // 페이지가 완전히 로드되도록 테스트 실행 지연
  setTimeout(function () {
    try {
      window.i18nTestResults = i18nCompatibilityTest();
    } catch (e) {
      console.error("다국어 호환성 테스트 실행 중 오류 발생:", e);
    }
  }, 1000);
});