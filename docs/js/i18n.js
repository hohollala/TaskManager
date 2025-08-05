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
    "installation.gemini.title": "Gemini CLI 설정",
    "installation.gemini.description": "Gemini CLI를 사용하는 경우 다음 설정을 추가하세요.",
    "installation.gemini.config-file": "Gemini CLI 설정 파일",
    "installation.gemini.note.title": "참고사항",
    "installation.gemini.note.description": "Gemini CLI에서는 default_api. 접두사를 사용하여 MCP 도구에 접근합니다. 각 명령어는 함수 형태로 호출됩니다.",
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
    "nav.pain-points": "문제점",
    "nav.features": "기능",
    "nav.workflow": "작업 흐름",
    "nav.installation": "설치",
    "nav.github": "GitHub",
    "nav.menu-button": "메뉴",
    "nav.logo.alt": "Shrimp Task Manager 로고",
    "nav.prompt-custom": "프롬프트 설정",
    // 히어로 섹션
    "hero.title": "Shrimp Task Manager",
    "hero.subtitle": "AI 프로그래밍 어시스턴트를 위한 구조화된 작업 관리 지능형 시스템",
    "hero.description": "AI 어시스턴트에게 장기 메모리 기능, 효율적인 복잡 작업 관리, 구조화된 작업 분해 및 실행 추적 기능을 제공하여 프로그래밍 경험을 더욱 원활하고 효율적으로 만듭니다.",
    "hero.start": "시작하기",
    "hero.learn-more": "더 알아보기",
    "hero.workflow-image.alt": "지능형 작업 관리 워크플로우",
    // 문제점 해결 섹션
    "pain-points.title": "문제점 및 해결책",
    "pain-points.subtitle": "Shrimp Task Manager는 AI 프로그래밍 어시스턴트가 작업 관리에서 직면하는 세 가지 핵심 문제점을 해결하기 위해 설계되었습니다.",
    "pain-points.memory-loss.title": "메모리 손실",
    "pain-points.memory-loss.description": "AI 어시스턴트는 대화 간 작업 메모리 기능이 부족하여 장기 작업 진행 상황을 추적할 수 없고, 동일한 요구사항을 반복적으로 설명하여 시간과 자원을 낭비합니다.",
    "pain-points.memory-loss.solution.title": "작업 메모리 기능",
    "pain-points.memory-loss.solution.description": "실행 기록을 자동으로 저장하여 장기 메모리 기능을 제공하고, AI 어시스턴트가 이전 작업 진행 상황을 기억하여 미완성 작업을 원활하게 계속할 수 있도록 합니다.",
    "pain-points.memory-loss.icon.alt": "메모리 손실",
    "pain-points.structure-chaos.title": "구조적 혼란",
    "pain-points.structure-chaos.description": "복잡한 작업의 체계적 관리 부족으로 인한 비효율성, 의존성 관계 관리 부재, 하위 작업 실행 혼란, 전체 진행 상황 추적의 어려움.",
    "pain-points.structure-chaos.solution.title": "구조화된 작업 분해",
    "pain-points.structure-chaos.solution.description": "복잡한 작업을 관리 가능한 하위 작업으로 자동 분해하고, 명확한 의존성 관계를 구축하며, 순서가 있는 실행 경로를 제공하여 효율적인 완료를 보장합니다.",
    "pain-points.structure-chaos.icon.alt": "구조적 혼란",
    "pain-points.structure-chaos.solution.icon.alt": "구조화된 작업 분해",
    "pain-points.repeat-work.title": "반복 작업",
    "pain-points.repeat-work.description": "과거 경험과 해결책을 효과적으로 활용할 수 없어, 매번 대화마다 처음부터 시작해야 하며, 지식 축적과 경험 참조 시스템이 부족합니다.",
    "pain-points.repeat-work.solution.title": "지식 축적 및 경험 참조",
    "pain-points.repeat-work.solution.description": "성공적인 해결책을 자동으로 기록하고, 작업 지식베이스를 구축하며, 유사한 작업의 빠른 참조를 지원하여 경험 축적과 지식 재사용을 실현합니다.",
    "pain-points.repeat-work.icon.alt": "반복 작업",
    "pain-points.repeat-work.solution.icon.alt": "지식 축적 및 경험 참조",
    "pain-points.explore": "핵심 기능 탐색",
    // 기능 블록
    "features.title": "핵심 기능",
    "features.subtitle": "Shrimp Task Manager는 복잡한 작업을 효율적으로 관리, 실행 및 추적할 수 있도록 도와주는 여섯 가지 핵심 기능을 제공합니다.",
    "features.planning.title": "지능형 작업 계획 및 분석",
    "features.planning.description": "요구사항과 제약 조건을 깊이 있게 분석하여 구조화된 작업 계획을 생성합니다. 범위, 위험 및 우선순위를 자동으로 평가하고, 합리적이고 포괄적인 구현 전략을 제공합니다.",
    "features.planning.icon.alt": "지능형 작업 계획 및 분석",
    "features.decomposition.title": "자동 작업 분해 및 의존성 관리",
    "features.decomposition.description": "복잡한 작업을 관리 가능한 작은 작업으로 지능적으로 분해하고, 작업 간 의존성을 식별하며, 최적화된 실행 경로를 구축하여 자원 충돌과 실행 병목을 방지합니다.",
    "features.decomposition.icon.alt": "자동 작업 분해 및 의존성 관리",
    "features.tracking.title": "실행 상태 추적",
    "features.tracking.description": "각 작업의 실행 상태를 실시간으로 모니터링하고, 진행 상황을 시각적으로 표시하며, 의존성 상태를 자동으로 업데이트하고, 작업 완료 시 상세한 실행 보고서를 제공합니다.",
    "features.tracking.icon.alt": "실행 상태 추적",
    "features.verification.title": "작업 무결성 검증",
    "features.verification.description": "작업 완성도를 포괄적으로 검사하고, 모든 요구사항과 표준이 충족되었는지 확인하며, 검증 보고서와 품질 평가를 제공하여 산출물이 예상 요구사항을 충족하도록 보장합니다.",
    "features.verification.icon.alt": "작업 무결성 검증",
    "features.complexity.title": "작업 복잡도 평가",
    "features.complexity.description": "다차원 기준을 기반으로 작업 복잡도를 평가하고, 자원 요구사항을 추정하며, 고위험 구성 요소를 식별하여 자원과 시간의 합리적인 배분을 도와줍니다.",
    "features.complexity.icon.alt": "작업 복잡도 평가",
    "features.memory.title": "작업 메모리 기능",
    "features.memory.description": "세션 간 작업 메모리 기능을 제공하고, 실행 기록과 컨텍스트를 자동으로 저장하며, 언제든지 작업을 복원하고 계속 실행할 수 있도록 하여 요구사항을 반복적으로 설명할 필요가 없습니다.",
    "features.memory.icon.alt": "작업 메모리 기능",
    "features.learn-workflow": "작업 흐름 알아보기",
    // 작업 흐름 블록
    "workflow.title": "작업 흐름",
    "workflow.subtitle": "Shrimp Task Manager는 작업 계획부터 작업 완료까지의 모든 단계가 세심하게 설계된 완전한 작업 흐름을 제공합니다.",
    "workflow.step1.title": "작업 계획",
    "workflow.step1.description": "작업 흐름 초기화 및 상세 계획",
    "workflow.step2.title": "심층 분석",
    "workflow.step2.description": "요구사항 분석 및 기술적 타당성 평가",
    "workflow.step3.title": "솔루션 반영",
    "workflow.step3.description": "분석 결과 비판적 검토 및 솔루션 최적화",
    "workflow.step4.title": "작업 분해",
    "workflow.step4.description": "복잡한 작업을 관리 가능한 하위 작업으로 분해",
    "workflow.step5.title": "작업 실행",
    "workflow.step5.description": "사전 정의된 계획에 따라 특정 작업 실행",
    "workflow.step6.title": "결과 검증",
    "workflow.step6.description": "작업 완료 및 품질 철저히 검증",
    "workflow.step7.title": "작업 완료",
    "workflow.step7.description": "작업 완료로 표시 및 보고서 생성",
    "workflow.learn-more-link": "더 알아보기 →",
    "workflow.mobile.step1.full-description": "작업 흐름 초기화 및 상세 계획, 명확한 목표와 성공 기준 설정, 지속적인 계획을 위해 기존 작업을 참조할 수 있습니다.",
    "workflow.mobile.step2.full-description": "작업 요구사항을 심층적으로 분석하고 코드베이스를 체계적으로 검토하여 기술적 타당성과 잠재적 위험을 평가하고 초기 솔루션 권장 사항을 제공합니다.",
    "workflow.mobile.step3.full-description": "분석 결과를 비판적으로 검토하고, 솔루션의 완전성을 평가하며, 최적화 기회를 식별하여 솔루션이 모범 사례를 따르도록 합니다.",
    "workflow.mobile.step4.full-description": "복잡한 작업을 독립적이고 추적 가능한 하위 작업으로 분해하고, 명확한 의존성 및 우선순위를 설정하며, 여러 업데이트 모드를 지원합니다.",
    "workflow.mobile.step5.full-description": "사전 정의된 계획에 따라 특정 작업을 실행하고, 각 단계의 출력이 품질 표준을 충족하는지 확인하며, 실행 중 예외를 처리합니다.",
    "workflow.mobile.step6.full-description": "작업 완료를 포괄적으로 확인하고, 모든 요구사항과 기술 표준이 누락 없이 충족되었는지 확인하며, 품질 평가 보고서를 제공합니다.",
    "workflow.mobile.step7.full-description": "작업을 공식적으로 완료로 표시하고, 상세한 완료 보고서를 생성하며, 워크플로우 연속성을 보장하기 위해 관련 작업의 종속성 상태를 업데이트합니다.",
    // 설치 구성 섹션
    "installation.title": "설치 및 구성",
    "installation.subtitle": "Shrimp Task Manager는 다양한 설치 방법을 제공하며, 빠르게 시작하거나 고급 구성이 필요한 경우에도 쉽게 설정할 수 있습니다.",
    "installation.manual.title": "수동 설치",
    "installation.step1": "저장소 복제",
    "installation.step2": "종속성 설치",
    "installation.step3": "프로젝트 빌드",
    "installation.cursor.title": "Cursor IDE 구성",
    "installation.cursor.description": "Cursor IDE를 사용하는 경우, Shrimp Task Manager를 개발 환경에 통합할 수 있습니다.",
    "installation.quickstart.title": "빠른 시작",
    "installation.quickstart.description": "설치 후, MCP Shrimp Task Manager 사용 방법을 배우려면 빠른 시작 가이드를 확인하세요.",
    "installation.faq.title": "자주 묻는 질문",
    "installation.faq.description": "문제가 있나요? 자주 묻는 질문을 확인하거나 GitHub에 문제를 제출하세요.",
    "installation.copy-button": "복사",
    "installation.important-note.title": "중요 참고 사항",
    "installation.important-note.description": "절대 경로 사용 필수: DATA_DIR 구성이 상대 경로가 아닌 절대 경로를 사용해야 합니다. 그렇지 않으면 데이터가 올바르게 로드되지 않을 수 있습니다.",
    "installation.prompt-config.title": "프롬프트 구성 가이드",
    "installation.prompt-config.intro": "Shrimp Task Manager는 두 가지 모드를 지원합니다:",
    "installation.prompt-config.mode1.title": "TaskPlanner:",
    "installation.prompt-config.mode1.description": "초기 작업 계획 및 복잡한 작업 분해에 적합하며, AI 어시스턴트가 작업 계획자 역할을 합니다.",
    "installation.prompt-config.mode2.title": "TaskExecutor:",
    "installation.prompt-config.mode2.description": "사전 정의된 작업 실행에 적합하며, AI 어시스턴트가 실행 전문가 역할을 합니다.",
    "installation.prompt-config.tip": "Cursor 설정에서 사용자 정의 모드를 사용하여 다양한 작업 시나리오에 맞게 모드를 사용자 정의할 수 있습니다.",
    // CTA 블록
    "cta.title": "지금 지능형 작업 관리를 경험하세요",
    "cta.description": "AI 프로그래밍 경험을 향상시키고, 무질서한 작업 관리에 작별을 고하며, 더 효율적인 워크플로우를 받아들이세요.",
    "cta.github": "GitHub 저장소로 이동",
    "cta.start": "설치 시작",
    // 푸터 블록
    "footer.copyright": "© 2023 MCP Task Manager. 모든 권리 보유.",
    "footer.developer": "Siage가 ❤️로 만들었습니다.",

    // 공통 UI 요소
    "common.close": "닫기",
    "common.back": "뒤로",
    "common.next": "다음",
    "common.submit": "제출",
    "common.cancel": "취소",
    "common.confirm": "확인",
    "common.copy": "복사",
    "common.copied": "복사됨!",
    "common.yes": "예",
    "common.no": "아니요",
    "common.more": "더 보기",
    "common.less": "간략히",
    "common.loading": "로딩 중...",
    "common.error": "오류",
    "common.success": "성공",
    "common.warning": "경고",
    "common.info": "정보",
    "common.search": "검색",
    "common.filter": "필터",
    "common.sort": "정렬",
    "common.ascending": "오름차순",
    "common.descending": "내림차순",
    "common.lang.ko": "한국어",
    "common.lang.en": "영어",
    "modal.close-button": "닫기",
    "modal.close-button-aria": "닫기",

    // 작업 흐름 상세 내용
    "workflow.step1.content.title": "작업 계획 단계",
    "workflow.step1.content.description": "작업 계획 단계는 AI 어시스턴트가 프로젝트 범위, 목표를 정의하고 성공 기준을 설정하는 초기 단계입니다.",
    "workflow.step1.content.activities": "주요 활동:",
    "workflow.step1.content.activity1": "프로젝트 요구사항 및 제약 조건 명확화",
    "workflow.step1.content.activity2": "명확한 목표 설정 및 측정 가능한 성공 기준 정의",
    "workflow.step1.content.activity3": "프로젝트 경계 설정 및 이해 관계자 식별",
    "workflow.step1.content.activity4": "타임라인 추정치를 포함한 상위 수준 계획 생성",
    "workflow.step1.content.activity5": "지속적인 계획을 위해 기존 작업을 선택적으로 참조",
    "workflow.step1.content.outputs": "산출물:",
    "workflow.step1.content.output1": "포괄적인 작업 설명",
    "workflow.step1.content.output2": "명확한 성공 기준",
    "workflow.step1.content.output3": "기술 요구사항 및 제약 조건",
    "workflow.step1.content.summary": "이 단계는 모든 후속 작업의 기반을 마련하여 AI 어시스턴트와 사용자 모두가 달성해야 할 사항을 공유하도록 합니다.",

    "workflow.step2.content.title": "심층 분석 단계",
    "workflow.step2.content.description": "심층 분석 단계는 실행 가능한 구현 전략을 개발하기 위해 요구사항 및 기술 환경을 철저히 검토하는 것을 포함합니다.",
    "workflow.step2.content.activities": "주요 활동:",
    "workflow.step2.content.activity1": "요구사항 분석 및 기술적 과제 식별",
    "workflow.step2.content.activity2": "기술적 타당성 및 잠재적 위험 평가",
    "workflow.step2.content.activity3": "모범 사례 및 사용 가능한 솔루션 연구",
    "workflow.step2.content.activity4": "해당하는 경우 기존 코드베이스 체계적으로 검토",
    "workflow.step2.content.activity5": "초기 구현 개념 개발",
    "workflow.step2.content.outputs": "산출물:",
    "workflow.step2.content.output1": "기술적 타당성 평가",
    "workflow.step2.content.output2": "위험 식별 및 완화 전략",
    "workflow.step2.content.output3": "초기 구현 접근 방식",
    "workflow.step2.content.output4": "적절한 경우 의사 코드 또는 아키텍처 다이어그램",
    "workflow.step2.content.summary": "이 단계는 제안된 솔루션이 기술적으로 건전하고 구현을 진행하기 전에 모든 요구사항을 충족하는지 확인합니다.",

    // 오류 및 경고 메시지
    "error.storage": "로컬 저장소에 접근할 수 없습니다. 언어 기본 설정이 저장되지 않습니다.",
    "error.translation": "번역 오류: 번역 데이터를 로드할 수 없습니다.",
    "error.network": "네트워크 오류: 서버에 연결할 수 없습니다.",
    "warning.browser": "브라우저가 모든 기능을 지원하지 않을 수 있습니다. 최신 버전의 Chrome, Firefox 또는 Safari를 사용하는 것을 권장합니다.",
    "warning.mobile": "일부 기능은 모바일 장치에서 제한될 수 있습니다.",

    // 코드 예제 블록
    "examples.planning.title": "작업 계획 및 분해 프로세스",
    "examples.planning.intro": "이 예제는 MCP Shrimp Task Manager를 사용하여 복잡한 작업을 계획하고 분해하는 방법을 보여줍니다. 전체 프로세스는 네 가지 주요 단계를 포함합니다:",
    "examples.planning.step1": "명확한 목표와 성공 기준을 설정하여 작업을 초기화하고 상세하게 계획합니다.",
    "examples.planning.step2": "작업을 깊이 이해하고, 기술적 타당성 및 잠재적 과제를 분석합니다.",
    "examples.planning.step3": "분석 결과를 비판적으로 검토하고 제안을 최적화합니다.",
    "examples.planning.step4": "복잡한 작업을 관리 가능한 하위 작업으로 분해합니다.",
    "examples.planning.conclusion": "이 접근 방식을 통해 복잡하고 큰 작업을 구조화되고 실행 가능한 작업 단위로 변환하면서 전체적인 관점을 유지할 수 있습니다.",
    "examples.execution.title": "작업 실행 및 완료 프로세스",
    "examples.execution.intro": "이 예제는 계획된 작업을 실행하고 완료하는 방법을 보여줍니다. 전체 프로세스는 네 가지 주요 단계를 포함합니다:",
    "examples.execution.step1.title": "작업 목록",
    "examples.execution.step1": "현재 상태를 이해하기 위해 보류 중인 작업 목록을 쿼리합니다.",
    "examples.execution.step2": "사전 정의된 계획에 따라 선택된 작업을 실행합니다.",
    "examples.execution.step3": "품질 표준이 충족되는지 확인하기 위해 작업 완료를 검증합니다.",
    "examples.execution.step4": "공식적으로 작업을 완료로 표시하고 보고서를 생성합니다.",
    "examples.execution.conclusion": "이 접근 방식을 통해 작업을 체계적으로 실행하고 각 단계가 예상 품질 표준을 충족하는지 확인하여 궁극적으로 전체 워크플로우를 완료할 수 있습니다.",
    "examples.tip.title": "💡 팁",
    "examples.tip.description": "위의 워크플로우는 고정되어 있지 않습니다. 에이전트는 분석을 기반으로 예상되는 효과가 달성될 때까지 다양한 단계를 반복합니다.",

    // 빠른 시작 및 자주 묻는 질문 블록
    "quickstart.title": "빠른 시작",
    "quickstart.description": "설치 후, MCP Shrimp Task Manager 사용 방법을 배우려면 빠른 시작 가이드를 확인하세요.",
    "quickstart.view-code-link": "코드 보기 →",
    "faq.title": "자주 묻는 질문",
    "faq.description": "문제가 있나요? 자주 묻는 질문을 확인하거나 GitHub에 문제를 제출하세요.",
    "faq.view-faq-link": "FAQ 보기 →",
    "installation.cursor.mcp-servers": "to/your/project/.cursor/mcp.jsonn",
    "task.planner.prompt": `당신은 전문적인 작업 계획 전문가입니다. 사용자들과 상호 작용하고, 그들의 요구 사항을 분석하며, 프로젝트 관련 정보를 수집해야 합니다. 마지막으로, "plan_task"를 사용하여 작업을 생성해야 합니다. 작업이 생성되면, 요약하여 사용자에게 "TaskExecutor" 모드를 사용하여 작업을 실행하도록 알려야 합니다.
당신은 작업 계획에 집중해야 합니다. "execute_task"를 사용하여 작업을 실행하지 마십시오.
심각한 경고: 당신은 작업 계획 전문가이며, 프로그램 코드를 직접 수정할 수 없으며, 작업을 계획할 수만 있습니다.`,
    "task.executor.prompt": `당신은 전문적인 작업 실행 전문가입니다. 사용자가 실행할 작업을 지정하면, "execute_task"를 사용하여 작업을 실행하십시오.
작업이 지정되지 않은 경우, "list_tasks"를 사용하여 실행되지 않은 작업을 찾아 실행하십시오.
실행이 완료되면, 사용자에게 결론을 알리는 요약을 제공해야 합니다.
당신은 한 번에 하나의 작업만 수행할 수 있으며, 작업이 완료되면 사용자가 명시적으로 지시하지 않는 한 다음 작업을 수행하는 것이 금지됩니다.
사용자가 "연속 모드"를 요청하면, 모든 작업이 순서대로 실행됩니다.`,
    // 프롬프트 사용자 정의 기능 블록
    "prompt-custom.title": "프롬프트 사용자 정의",
    "prompt-custom.subtitle": "환경 변수를 통해 AI 어시스턴트 동작을 사용자 정의하세요. 코드 수정 없이도 가능합니다.",

    "prompt-custom.overview.title": "기능 개요",
    "prompt-custom.overview.description": "프롬프트 사용자 정의를 통해 사용자는 환경 변수를 통해 AI 어시스턴트 동작을 조정할 수 있으며, 두 가지 사용자 정의 방법을 제공합니다: 원본 프롬프트를 완전히 재정의하거나 기존 프롬프트에 내용을 추가합니다.",

    "prompt-custom.benefits.title": "주요 장점",
    "prompt-custom.benefits.item1": "개인화된 사용자 정의: 특정 프로젝트나 도메인에 맞게 시스템 동작 조정",
    "prompt-custom.benefits.item2": "효율성 향상: 반복적인 작업 유형에 최적화하여 중복 지침 감소",
    "prompt-custom.benefits.item3": "브랜드 일관성: 출력 내용이 조직의 스타일 가이드와 표준을 준수하도록 보장",
    "prompt-custom.benefits.item4": "전문적 적응성: 특정 기술 분야나 산업에 맞게 용어와 표준 조정",
    "prompt-custom.benefits.item5": "팀 협업: 팀 구성원이 사용하는 프롬프트를 통일하여 일관된 워크플로우 보장",

    "prompt-custom.usage.title": "사용 가이드",
    "prompt-custom.usage.env.title": "환경 변수 구성",
    "prompt-custom.usage.env.description": "환경 변수를 설정하여 각 함수의 프롬프트를 사용자 정의하세요. 특정 명명 규칙을 사용합니다:",
    "prompt-custom.usage.more": "더 자세한 구성 방법과 매개변수 사용법은 상세 문서를 참조하세요.",
    "prompt-custom.view-docs": "전체 문서 보기",
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
  // 강제로 한국어 설정
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
  // 강제로 한국어 설정
  document.documentElement.setAttribute("lang", "ko");
  applyTranslations("ko");
  
  // LocalStorage에도 한국어 저장
  try {
    if (storageAvailable("localStorage")) {
      localStorage.setItem("preferred-language", "ko");
    }
  } catch (e) {
    console.warn("LocalStorage 저장 실패:", e);
  }
  
  // 언어 버튼 상태도 한국어로 설정
  document.querySelectorAll(".lang-btn").forEach(function (btn) {
    if (btn.getAttribute("data-lang") === "ko") {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
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