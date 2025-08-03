import { z } from "zod";
import fs from "fs/promises";
import path from "path";
import { getDataDir } from "../utils/paths.js";

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

export type NewProjectInput = z.infer<typeof newProjectSchema>;

export async function newProject(input: NewProjectInput): Promise<{ content: { type: "text"; text: string }[] }> {
  try {
    // 입력값이 없거나 불완전한 경우 대화형 질문 안내
    const hasInput = input.purpose || input.features || input.design || input.server || 
                    input.externalServices || input.platforms || input.techStack || input.otherRequirements;
    
    if (!hasInput) {
      return {
        content: [
          {
            type: "text",
            text: `🤔 새 프로젝트를 시작하기 위해 몇 가지 질문을 드리겠습니다.

다음 8개 질문에 답변해주시면 프로젝트 요구사항 문서를 생성해드립니다:

1️⃣ **앱의 주요 목적은 무엇인가요?**
   예: 온라인 쇼핑, 할일 관리, 소셜 네트워킹, 교육 앱 등

2️⃣ **필수 기능은 무엇인가요?**
   예: 사용자 로그인, 데이터 저장, 결제 처리, 알림, 검색 등

3️⃣ **디자인 요구사항은 어떻게 되나요?**
   예: 기존 디자인 파일 있음, 간단한 기본 디자인, 완전 커스텀 디자인 필요

4️⃣ **서버/API는 어떻게 구성할 예정인가요?**
   예: 기존 API 서버 있음, 새로 개발 필요, Firebase/Supabase 사용

5️⃣ **외부 서비스 연동이 필요한가요?**
   예: 소셜 로그인, 결제 게이트웨이, 지도 API, 푸시 알림 등

6️⃣ **어떤 플랫폼을 지원할 예정인가요?**
   예: iOS만, Android만, 둘 다, 웹앱도 포함

7️⃣ **기술 스택이나 제한사항이 있나요?**
   예: React Native, Flutter, 네이티브 개발, 특정 라이브러리 사용/금지

8️⃣ **기타 요구사항이 있나요?**
   예: 성능 요구사항, 보안 요구사항, 특별한 기능 등

💡 **사용법**: 각 질문에 구체적이고 상세하게 답변해주시면 더 정확한 요구사항 문서가 생성됩니다.

예시:
\`\`\`
new "앱 목적: 할일 관리, 필수 기능: 사용자 로그인/데이터 저장, 디자인: 기본 디자인, 서버: 새로 개발, 외부 서비스: 푸시 알림, 플랫폼: iOS/Android, 기술 스택: React Native, 기타: 없음"
\`\`\`

또는 각 질문에 하나씩 답변해주세요!`
          }
        ]
      };
    }

    const DATA_DIR = await getDataDir();
    const docsDir = path.join(DATA_DIR, "docs");
    
    // docs 디렉토리 생성
    await fs.mkdir(docsDir, { recursive: true });

    // requirements.md 생성
    const requirementsContent = `# 프로젝트 요구사항 요약

## 1. 목적
${input.purpose || "사용자 입력 필요"}

## 2. 기능
${input.features || "사용자 입력 필요"}

## 3. 디자인
${input.design || "사용자 입력 필요"}

## 4. 서버/API
${input.server || "사용자 입력 필요"}

## 5. 외부 서비스
${input.externalServices || "사용자 입력 필요"}

## 6. 플랫폼
${input.platforms || "사용자 입력 필요"}

## 7. 기술 스택 또는 제한사항
${input.techStack || "사용자 입력 필요"}

## 8. 기타 요구사항
${input.otherRequirements || "사용자 입력 필요"}
`;

    await fs.writeFile(path.join(docsDir, "requirements.md"), requirementsContent, "utf-8");

    // designed.md 생성
    const designedContent = `# UI/UX 디자인 가이드

## UI/UX 원칙
- 접근성: WCAG 2.1 준수
- 직관적인 네비게이션과 피드백

## 색상 팔레트
- Primary: #3B82F6
- Secondary: #64748B
- Accent: #F59E0B

## 폰트
- 기본 폰트: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto
- 제목 폰트: Bold
- 본문 폰트: Regular

## 반응형 디자인
- Mobile: <= 768px
- Tablet: 769px - 991px
- Desktop: >= 992px

## 디자인 요소
### 버튼
- padding: 12px 24px
- border-radius: 8px
- focus 상태: box-shadow

### 입력 필드
- padding: 12px 16px
- border: 1px solid #E2E8F0
- focus: border-color #3B82F6

### 네비게이션 메뉴
- 수평 메뉴 (Desktop)
- 햄버거 메뉴 (Mobile)

## 화면 플로우
### 로그인 화면
- 이메일/비밀번호 입력
- 소셜 로그인 옵션
- 최소 너비: 400px

### 대시보드
- 사이드바 + 메인 콘텐츠
- 사용자 프로필 영역

### 설정 화면
- 설정 카테고리별 분류
- 토글 스위치 및 드롭다운

## 와이어프레임 개요
### 로그인 화면
\`\`\`
┌─────────────────────┐
│     로고/브랜드     │
├─────────────────────┤
│   이메일 입력 필드   │
│   비밀번호 입력 필드  │
│   [로그인 버튼]     │
│   ───────────────   │
│   [Google 로그인]   │
│   [Facebook 로그인] │
└─────────────────────┘
\`\`\`

### 대시보드
\`\`\`
┌─────────┬─────────────────┐
│ 사이드바 │   메인 콘텐츠   │
│         │                 │
│ [메뉴1] │   [카드 그리드]  │
│ [메뉴2] │                 │
│ [메뉴3] │   [차트 영역]   │
│         │                 │
└─────────┴─────────────────┘
\`\`\`
`;

    await fs.writeFile(path.join(docsDir, "designed.md"), designedContent, "utf-8");

    // technical_spec.md 생성
    const technicalSpecContent = `# 프로젝트명 / 기술 명세서

## 아키텍처 개요
- **클라이언트**: React Native (JavaScript/TypeScript)
- **서버**: Node.js REST API (Express)
- **데이터베이스**: PostgreSQL, SQLite (개발/테스트용)
- **통신 프로토콜**: HTTP, WebSocket (실시간 데이터)

## 주요 모듈 & 컴포넌트
### 사용자 인증
- JWT 토큰 기반 인증
- OAuth 2.0 소셜 로그인 (Google, Facebook)

### 데이터 관리
- Redux/Zustand 상태 관리
- React Query 데이터 페칭

### UI 모듈
- 컴포넌트 기반 아키텍처
- 재사용 가능한 UI 라이브러리

## API 명세
| 경로 | 메서드 | 설명 | 요청 파라미터 | 응답 형식 |
|------|--------|------|---------------|-----------|
| /api/login | POST | 사용자 로그인 | email, password | {token, user} |
| /api/profile | GET | 사용자 프로필 조회 | Authorization header | {user} |
| /api/data | GET | 데이터 조회 | query params | {data[]} |

## 데이터베이스 설계
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

## 성능 & 최적화
- 이미지 압축 및 캐싱
- 코드 스플리팅
- 레이지 로딩

## 보안 고려사항
- 입력값 검증
- SQL 인젝션 방지
- HTTPS 강제
- 데이터 암호화 (개인정보, 인증정보)

## 배포 & 운영
- **배포 대상**: AWS EC2, Docker 컨테이너
- **CI/CD**: GitHub Actions를 통한 자동 빌드/배포
- **모니터링**: Prometheus + Grafana 설정

## 제한사항 & 에러 처리
- 최대 동시 사용자: 1000명
- 서버 장애 시 재시도 로직 및 백오프 전략

## 기술 스택 요약
- **언어**: JavaScript/TypeScript
- **프레임워크**: React Native, Express
- **DBMS**: PostgreSQL, SQLite
- **도구**: Git, Docker, VSCode
`;

    await fs.writeFile(path.join(docsDir, "technical_spec.md"), technicalSpecContent, "utf-8");

    return {
      content: [
        {
          type: "text",
          text: `✅ 새 프로젝트 요구사항이 성공적으로 생성되었습니다!

📁 생성된 파일들:
- docs/requirements.md: 프로젝트 요구사항 요약
- docs/designed.md: UI/UX 디자인 가이드
- docs/technical_spec.md: 기술 명세서

💡 다음 단계:
- 'plan' 명령어를 사용하여 생성된 문서들을 수정할 수 있습니다
- 더 정확하고 상세한 요구사항 문서를 원한다면 질문에 더 구체적으로 답변해주세요

📂 파일 위치: ${docsDir}`
        }
      ]
    };

  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `❌ 프로젝트 요구사항 생성 중 오류가 발생했습니다: ${error}`
        }
      ]
    };
  }
} 