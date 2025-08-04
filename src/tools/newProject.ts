import { z } from "zod";
import fs from "fs/promises";
import path from "path";

// 스키마 정의
export const newProjectSchema = z.object({
  purpose: z.string().optional().describe("앱의 주요 목적 (예: 온라인 쇼핑, 할일 관리, 소셜 네트워킹 등)"),
  features: z.string().optional().describe("필수 기능들 (예: 사용자 로그인, 데이터 저장, 결제 처리, 알림 등)"),
  design: z.string().optional().describe("디자인 요구사항 (예: 기존 디자인 파일 있음, 간단한 기본 디자인, 완전 커스텀 디자인 필요)"),
  server: z.string().optional().describe("서버/API 요구사항 (예: 기존 API 서버 있음, 새로 개발 필요, Firebase/Supabase 사용)"),
  externalServices: z.string().optional().describe("외부 서비스 연동 (예: 소셜 로그인, 결제 게이트웨이, 지도 API, 푸시 알림 등)"),
  platforms: z.string().optional().describe("필요한 플랫폼 (예: iOS만, Android만, 둘 다, 웹앱도 포함)"),
  techStack: z.string().optional().describe("기술 스택이나 제한사항 (예: React Native, Flutter, 네이티브 개발, 특정 라이브러리 사용/금지)"),
  otherRequirements: z.string().optional().describe("기타 요구사항")
});

export const askProjectQuestionSchema = z.object({
  questionNumber: z.number(),
  answer: z.string().optional(),
  answers: z.array(z.string()).optional()
});

// 질문 목록
const QUESTIONS = [
  "1. 앱의 주요 목적은 무엇인가요? (예: 온라인 쇼핑, 할일 관리, 소셜 네트워킹 등)",
  "2. 필수 기능은 무엇인가요? (예: 사용자 로그인, 데이터 저장, 결제 처리, 알림 등)",
  "3. 디자인 요구사항은 어떻게 되나요? (예: 기존 디자인 파일 있음, 간단한 기본 디자인, 완전 커스텀 디자인 필요)",
  "4. 서버/API는 어떻게 구성할 예정인가요? (예: 기존 API 서버 있음, 새로 개발 필요, Firebase/Supabase 사용)",
  "5. 외부 서비스 연동이 필요한가요? (예: 소셜 로그인, 결제 게이트웨이, 지도 API, 푸시 알림 등)",
  "6. 어떤 플랫폼을 지원할 예정인가요? (예: iOS만, Android만, 둘 다, 웹앱도 포함)",
  "7. 기술 스택이나 제한사항이 있나요? (예: React Native, Flutter, 네이티브 개발, 특정 라이브러리 사용/금지)",
  "8. 기타 요구사항이 있나요? (예: 성능 요구사항, 보안 요구사항, 특별한 기능 등)"
] as const;

// 질문 처리 함수
export async function askProjectQuestion(input: { questionNumber: number; answer?: string; answers?: string[] }) {
  const { questionNumber, answer, answers = [] } = input;
  const currentIndex = questionNumber - 1;
  const isLastQuestion = questionNumber === QUESTIONS.length;

  // 답변이 있는 경우 - 답변 확인 후 다음 질문
  if (answer?.trim()) {
    const updatedAnswers = [...answers];
    updatedAnswers[currentIndex] = answer;

    // 마지막 질문이면 파일 생성
    if (isLastQuestion) {
      return await createProjectFiles(updatedAnswers);
    }

    // 답변 확인 후 다음 질문
    const nextQuestionIndex = questionNumber;
    const nextQuestion = QUESTIONS[nextQuestionIndex];
    return {
      content: [{ 
        type: "text", 
        text: `✅ 답변: ${answer}` 
      }]
    };
  }

  // 답변이 없는 경우 - 현재 질문 출력
  const currentQuestion = QUESTIONS[currentIndex];
  return {
    content: [{ 
      type: "text", 
      text: currentQuestion
    }]
  };
}

// 파일 생성 로직을 별도 함수로 분리
async function createProjectFiles(answers: string[]): Promise<{ content: { type: "text"; text: string }[] }> {
  try {
    // 프로젝트 루트의 docs 폴더 사용
    const PROJECT_ROOT = path.resolve(process.cwd());
    const docsDir = path.join(PROJECT_ROOT, "docs");
    
    // docs 디렉토리 생성
    await fs.mkdir(docsDir, { recursive: true });

    // requirements.md 생성
    const requirementsContent = `# 프로젝트 요구사항 명세서

## 📋 프로젝트 개요
**프로젝트명**: ${answers[0]?.split(' ')[0] || "새 프로젝트"}
**개발 목적**: ${answers[0] || "사용자 입력 필요"}
**개발 기간**: 2-4주 (예상)
**팀 구성**: 개발자 1-2명

## 🎯 핵심 기능 요구사항
### 필수 기능
${answers[1] || "사용자 입력 필요"}

### 우선순위별 기능 분류
#### 🔴 High Priority (MVP)
- 사용자 인증 시스템
- 기본 CRUD 기능
- 반응형 UI/UX

#### 🟡 Medium Priority (v2.0)
- 고급 기능들
- 성능 최적화
- 추가 통합 기능

#### 🟢 Low Priority (v3.0)
- 부가 기능들
- 확장성 고려사항

## 🎨 디자인 요구사항
### UI/UX 가이드라인
${answers[2] || "사용자 입력 필요"}

## ⚙️ 기술 아키텍처
### 백엔드 구성
${answers[3] || "사용자 입력 필요"}

## 🔗 외부 서비스 연동
### 통합 서비스
${answers[4] || "사용자 입력 필요"}

## 📱 플랫폼 지원
### 대상 플랫폼
${answers[5] || "사용자 입력 필요"}

## 🛠️ 기술 스택 및 제약사항
### 개발 환경
${answers[6] || "사용자 입력 필요"}

## 📊 기타 요구사항
### 비기능적 요구사항
${answers[7] || "사용자 입력 필요"}

---
**문서 버전**: 1.0  
**최종 수정일**: ${new Date().toISOString().split('T')[0]}  
**작성자**: AI Assistant  
*이 문서는 사용자와의 대화를 통해 수집된 정보를 바탕으로 생성되었습니다.*`;

    await fs.writeFile(path.join(docsDir, "requirements.md"), requirementsContent, "utf-8");

    // designed.md 생성
    const designedContent = `# UI/UX 디자인 가이드

## 프로젝트 디자인 요구사항
${answers[2] || "사용자 입력 필요"}

## UI/UX 원칙
- 접근성: WCAG 2.1 준수
- 직관적인 네비게이션과 피드백
- 사용자 중심의 디자인

## 색상 팔레트
- Primary: #3B82F6
- Secondary: #64748B
- Accent: #F59E0B
- Background: #FFFFFF
- Text: #1F2937

## 폰트
- 기본 폰트: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
- 제목 폰트: Bold (700)
- 본문 폰트: Regular (400)

## 반응형 디자인
- Mobile: <= 768px
- Tablet: 769px - 991px
- Desktop: >= 992px

## 디자인 요소
### 버튼
- padding: 12px 24px
- border-radius: 8px
- focus 상태: box-shadow
- hover 효과

### 입력 필드
- padding: 12px 16px
- border: 1px solid #E2E8F0
- focus: border-color #3B82F6
- placeholder 스타일

### 네비게이션 메뉴
- 수평 메뉴 (Desktop)
- 햄버거 메뉴 (Mobile)
- 드롭다운 메뉴

---
*이 디자인 가이드는 사용자의 요구사항을 바탕으로 생성되었습니다.*`;

    await fs.writeFile(path.join(docsDir, "designed.md"), designedContent, "utf-8");

    // technical_spec.md 생성
    const technicalSpecContent = `# 기술 명세서 (Technical Specification)

## 📋 프로젝트 개요
**프로젝트명**: ${answers[0]?.split(' ')[0] || "새 프로젝트"}
**개발 목적**: ${answers[0] || "사용자 입력 필요"}
**기술 스택**: ${answers[6] || "사용자 입력 필요"}
**외부 서비스**: ${answers[4] || "사용자 입력 필요"}

## 🏗️ 시스템 아키텍처
### 전체 아키텍처 개요
- **클라이언트**: React/React Native/Flutter (사용자 선택)
- **서버**: Node.js REST API (Express)
- **데이터베이스**: PostgreSQL, SQLite (개발/테스트용)
- **통신 프로토콜**: HTTP, WebSocket (실시간 데이터)

## 🛠️ 기술 스택 상세
### 프론트엔드 기술
- **프레임워크**: React 18+ 또는 Vue 3+
- **상태 관리**: Redux Toolkit 또는 Pinia
- **라우팅**: React Router 또는 Vue Router
- **UI 라이브러리**: Material-UI, Ant Design, 또는 Tailwind CSS
- **API 클라이언트**: Axios, React Query, SWR

### 백엔드 기술
- **런타임**: Node.js 18+ 또는 Python 3.11+
- **웹 프레임워크**: Express.js 또는 FastAPI
- **ORM**: Prisma 또는 SQLAlchemy
- **인증**: JWT, OAuth 2.0, Passport.js
- **API 문서**: Swagger/OpenAPI 3.0

## 📊 데이터베이스 설계
### 주요 테이블
- \`users\`: 사용자 정보
- \`sessions\`: 로그인 세션 관리
- \`data\`: 주요 데이터

### 인덱싱
- \`users.email\` (unique)
- \`sessions.user_id\`

### 무결성 제약
- 외래키 제약조건
- 트랜잭션 관리

## 🔐 보안 설계
### 인증 및 권한 관리
- **JWT 토큰**: Access Token (15분) + Refresh Token (7일)
- **OAuth 2.0**: Google, Facebook, GitHub 소셜 로그인
- **RBAC**: 역할 기반 접근 제어
- **MFA**: 다중 인증 (SMS, 이메일, TOTP)

### 데이터 보안
- **암호화**: 전송 중 (TLS 1.3), 저장 시 (AES-256)
- **해싱**: bcrypt (비밀번호), SHA-256 (파일 해시)
- **세션 관리**: Redis를 통한 세션 저장
- **CSRF 보호**: CSRF 토큰 사용

---
**문서 버전**: 1.0  
**최종 수정일**: ${new Date().toISOString().split('T')[0]}  
**작성자**: AI Assistant  
*이 기술 명세서는 사용자의 요구사항을 바탕으로 생성되었습니다.*`;

    await fs.writeFile(path.join(docsDir, "technical_spec.md"), technicalSpecContent, "utf-8");

    // init 호출을 위한 메시지 추가
    return {
      content: [
        {
          type: "text",
          text: `✅ 프로젝트 문서 생성 완료!

📁 생성된 파일들:
- docs/requirements.md: 상세한 프로젝트 요구사항 명세서
- docs/designed.md: 완전한 UI/UX 디자인 시스템 가이드
- docs/technical_spec.md: 포괄적인 기술 명세서

🚀 바로 개발을 시작하겠습니다!

📂 파일 위치: ${docsDir}

💡 다음 단계:
1. 생성된 문서들을 검토하고 수정
2. 'init' 명령어로 프로젝트 초기화
3. 'plan' 명령어로 개발 작업 계획 수립
4. 'execute' 명령어로 실제 개발 시작`
        }
      ]
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `❌ 파일 생성 중 오류가 발생했습니다: ${error}`
        }
      ]
    };
  }
}

// 메인 함수
export async function newProject(input: NewProjectInput = {}, forceInteractive = false) {
  const hasInput = input.purpose || input.features || input.design || input.server || input.externalServices || input.platforms || input.techStack || input.otherRequirements;
  
  if (hasInput) {
    const answers = [input.purpose, input.features, input.design, input.server, input.externalServices, input.platforms, input.techStack, input.otherRequirements];
    return {
      content: [{ 
        type: "text", 
        text: `📝 입력된 정보:\n${answers.map((ans, idx) => `${idx + 1}. ${ans || "없음"}`).join('\n')}` 
      }]
    };
  }

  // 대화형 모드 - 첫 번째 질문 시작
  return await askProjectQuestion({
    questionNumber: 1,
    answer: undefined,
    answers: []
  });
}

export type NewProjectInput = z.infer<typeof newProjectSchema>; 