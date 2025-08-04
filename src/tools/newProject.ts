import { z } from "zod";
import fs from "fs/promises";
import path from "path";
import * as readline from 'readline';

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

// 단계별 질문을 위한 스키마
export const askProjectQuestionSchema = z.object({
  questionNumber: z.number().describe("질문 번호 (1-8)"),
  currentAnswer: z.string().optional().describe("현재 질문에 대한 답변"),
  answers: z.array(z.string()).optional().describe("지금까지 수집된 답변들")
});

function askQuestion(rl: readline.Interface, query: string): Promise<string> {
  return new Promise(resolve => rl.question(query, ans => {
    resolve(ans);
  }));
}

// 파일 생성 로직을 별도 함수로 분리
async function createProjectFiles(answers: string[]): Promise<{ content: { type: "text"; text: string }[] }> {
  try {
    // 프로젝트 루트의 docs 폴더 사용
    const PROJECT_ROOT = path.resolve(process.cwd());
    const docsDir = path.join(PROJECT_ROOT, "docs");
    
    // docs 디렉토리 생성
    await fs.mkdir(docsDir, { recursive: true });

    // requirements.md 생성 - 사용자 답변에 따라 동적 생성
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

### 디자인 시스템
- **색상 팔레트**: Primary, Secondary, Accent, Neutral
- **타이포그래피**: 헤딩, 본문, 버튼 텍스트
- **컴포넌트**: 버튼, 입력 필드, 카드, 네비게이션
- **레이아웃**: 그리드 시스템, 반응형 브레이크포인트

### 접근성 요구사항
- WCAG 2.1 AA 준수
- 키보드 네비게이션 지원
- 스크린 리더 호환성
- 색상 대비 최소 4.5:1

## ⚙️ 기술 아키텍처
### 백엔드 구성
${answers[3] || "사용자 입력 필요"}

### 데이터베이스 설계
- **주요 엔티티**: 사용자, 세션, 핵심 데이터
- **관계**: 1:N, N:M 관계 정의
- **인덱싱**: 성능 최적화를 위한 인덱스 전략
- **백업**: 자동 백업 및 복구 전략

### API 설계
- **RESTful API**: 표준 HTTP 메서드 사용
- **인증**: JWT 토큰 기반 인증
- **에러 처리**: 표준화된 에러 응답 형식
- **문서화**: Swagger/OpenAPI 명세

## 🔗 외부 서비스 연동
### 통합 서비스
${answers[4] || "사용자 입력 필요"}

### API 키 관리
- 환경변수를 통한 민감 정보 관리
- API 키 로테이션 정책
- 요청 제한 및 모니터링

## 📱 플랫폼 지원
### 대상 플랫폼
${answers[5] || "사용자 입력 필요"}

### 플랫폼별 고려사항
- **웹**: 브라우저 호환성, PWA 지원
- **모바일**: 네이티브 기능 활용, 푸시 알림
- **데스크톱**: 오프라인 지원, 시스템 통합

## 🛠️ 기술 스택 및 제약사항
### 개발 환경
${answers[6] || "사용자 입력 필요"}

### 개발 도구
- **버전 관리**: Git, GitHub/GitLab
- **CI/CD**: GitHub Actions, 자동 배포
- **테스팅**: Unit, Integration, E2E 테스트
- **모니터링**: 로그 수집, 성능 모니터링

### 성능 요구사항
- **로딩 시간**: 초기 로딩 < 3초
- **반응성**: 사용자 액션 < 100ms
- **가용성**: 99.9% 이상
- **확장성**: 동시 사용자 1000명 지원

## 🔒 보안 요구사항
### 인증 및 권한
- 다중 인증 (MFA) 지원
- 역할 기반 접근 제어 (RBAC)
- 세션 관리 및 자동 로그아웃

### 데이터 보안
- 전송 중 암호화 (HTTPS/TLS)
- 저장 데이터 암호화
- 개인정보 보호 (GDPR 준수)

### 취약점 대응
- 정기적인 보안 스캔
- 의존성 취약점 모니터링
- 보안 패치 자동화

## 📊 기타 요구사항
### 비기능적 요구사항
${answers[7] || "사용자 입력 필요"}

### 운영 요구사항
- **배포**: Docker 컨테이너화
- **스케일링**: 수평 확장 지원
- **백업**: 자동 백업 및 복구
- **모니터링**: 실시간 알림 및 대시보드

### 유지보수 요구사항
- 코드 품질 관리 (ESLint, Prettier)
- 문서화 (API 문서, 사용자 가이드)
- 버그 추적 및 이슈 관리

## 📈 성공 지표
### 기술적 지표
- 페이지 로딩 시간 < 3초
- API 응답 시간 < 200ms
- 에러율 < 1%

### 비즈니스 지표
- 사용자 만족도 > 4.5/5
- 기능 사용률 > 80%
- 사용자 이탈률 < 10%

---
**문서 버전**: 1.0  
**최종 수정일**: ${new Date().toISOString().split('T')[0]}  
**작성자**: AI Assistant  
*이 문서는 사용자와의 대화를 통해 수집된 정보를 바탕으로 생성되었습니다.*`

    await fs.writeFile(path.join(docsDir, "requirements.md"), requirementsContent, "utf-8");

    // designed.md 생성 - 사용자 답변에 따라 동적 생성
    const designRequirements = answers[2] || "";
    const designPlatform = answers[5] || "";
    
    // 플랫폼에 따른 디자인 가이드 생성
    let platformSpecificDesign = "";
    if (designPlatform.includes("웹") || designPlatform.includes("웹앱")) {
      platformSpecificDesign = `
## 웹 플랫폼 디자인 가이드
- 반응형 디자인 필수
- 브라우저 호환성 고려
- PWA(Progressive Web App) 지원 고려
`;
    } else if (designPlatform.includes("iOS") || designPlatform.includes("Android")) {
      platformSpecificDesign = `
## 모바일 플랫폼 디자인 가이드
- 네이티브 UI/UX 가이드라인 준수
- 터치 인터페이스 최적화
- 화면 크기별 대응
`;
    }

    const designedContent = `# UI/UX 디자인 가이드

## 프로젝트 디자인 요구사항
${designRequirements || "사용자 입력 필요"}

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

${platformSpecificDesign}

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

## 화면 플로우
### 로그인 화면
- 이메일/비밀번호 입력
- 소셜 로그인 옵션
- 최소 너비: 400px
- 에러 메시지 표시

### 대시보드
- 사이드바 + 메인 콘텐츠
- 사용자 프로필 영역
- 알림 섹션

### 설정 화면
- 설정 카테고리별 분류
- 토글 스위치 및 드롭다운
- 저장 버튼

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

---
*이 디자인 가이드는 사용자의 요구사항을 바탕으로 생성되었습니다.*
`;

    await fs.writeFile(path.join(docsDir, "designed.md"), designedContent, "utf-8");

    // technical_spec.md 생성 - 사용자 답변에 따라 동적 생성
    const serverAPI = answers[3] || "";
    const techStack = answers[6] || "";
    const externalServices = answers[4] || "";
    const platform = answers[5] || "";
    
    // 기술 스택에 따른 아키텍처 결정
    let architecture = "";
    let techStackDetails = "";
    let database = "";
    
    if (serverAPI.includes("Firebase") || techStack.includes("Firebase")) {
      architecture = `
## 아키텍처 개요
- **클라이언트**: React/React Native/Flutter (사용자 선택)
- **백엔드**: Firebase (Authentication, Firestore, Functions)
- **데이터베이스**: Firestore (NoSQL)
- **통신 프로토콜**: HTTP, WebSocket (실시간 데이터)
- **호스팅**: Firebase Hosting
`;
      techStackDetails = `
## Firebase 서비스 구성
- **Authentication**: 사용자 인증
- **Firestore**: 실시간 데이터베이스
- **Functions**: 서버리스 함수
- **Hosting**: 정적 웹 호스팅
- **Storage**: 파일 저장소
`;
      database = `
## Firestore 데이터베이스 설계
### 주요 컬렉션
- \`users\`: 사용자 정보
- \`sessions\`: 로그인 세션 관리
- \`data\`: 주요 데이터

### 보안 규칙
- 사용자별 데이터 접근 제어
- 인증된 사용자만 읽기/쓰기 허용
`;
    } else if (serverAPI.includes("Supabase") || techStack.includes("Supabase")) {
      architecture = `
## 아키텍처 개요
- **클라이언트**: React/React Native/Flutter (사용자 선택)
- **백엔드**: Supabase (PostgreSQL 기반)
- **데이터베이스**: PostgreSQL
- **통신 프로토콜**: HTTP, WebSocket (실시간 데이터)
- **호스팅**: Supabase Hosting
`;
      techStackDetails = `
## Supabase 서비스 구성
- **Authentication**: 사용자 인증
- **Database**: PostgreSQL 데이터베이스
- **Functions**: Edge Functions
- **Storage**: 파일 저장소
- **Realtime**: 실시간 데이터 동기화
`;
      database = `
## PostgreSQL 데이터베이스 설계
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
`;
    } else {
      architecture = `
## 아키텍처 개요
- **클라이언트**: React/React Native/Flutter (사용자 선택)
- **서버**: Node.js REST API (Express)
- **데이터베이스**: PostgreSQL, SQLite (개발/테스트용)
- **통신 프로토콜**: HTTP, WebSocket (실시간 데이터)
`;
      techStackDetails = `
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
`;
      database = `
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
`;
    }

    // 플랫폼별 API 명세
    let apiSpec = "";
    if (platform.includes("웹")) {
      apiSpec = `
## REST API 명세
| 경로 | 메서드 | 설명 | 요청 파라미터 | 응답 형식 |
|------|--------|------|---------------|-----------|
| /api/auth/login | POST | 사용자 로그인 | email, password | {token, user} |
| /api/auth/register | POST | 사용자 등록 | email, password, name | {token, user} |
| /api/user/profile | GET | 사용자 프로필 조회 | Authorization header | {user} |
| /api/data | GET | 데이터 조회 | query params | {data[]} |
`;
    } else if (platform.includes("모바일") || platform.includes("iOS") || platform.includes("Android")) {
      apiSpec = `
## 모바일 API 명세
| 경로 | 메서드 | 설명 | 요청 파라미터 | 응답 형식 |
|------|--------|------|---------------|-----------|
| /api/auth/login | POST | 사용자 로그인 | email, password | {token, user} |
| /api/auth/register | POST | 사용자 등록 | email, password, name | {token, user} |
| /api/user/profile | GET | 사용자 프로필 조회 | Authorization header | {user} |
| /api/data | GET | 데이터 조회 | query params | {data[]} |
| /api/push/token | POST | 푸시 토큰 등록 | token, device_id | {success} |
`;
    }

    const technicalSpecContent = `# 기술 명세서 (Technical Specification)

## 📋 프로젝트 개요
**프로젝트명**: ${answers[0]?.split(' ')[0] || "새 프로젝트"}
**개발 목적**: ${answers[0] || "사용자 입력 필요"}
**기술 스택**: ${techStack || "사용자 입력 필요"}
**외부 서비스**: ${externalServices || "사용자 입력 필요"}

## 🏗️ 시스템 아키텍처
### 전체 아키텍처 개요
${architecture}

### 마이크로서비스 구성 (선택적)
- **API Gateway**: 요청 라우팅, 인증, 로드 밸런싱
- **User Service**: 사용자 관리, 인증, 권한
- **Data Service**: 핵심 비즈니스 로직
- **Notification Service**: 알림, 이메일, 푸시
- **File Service**: 파일 업로드, 이미지 처리
- **Analytics Service**: 사용자 행동 분석

### 데이터 플로우
1. **클라이언트 요청** → API Gateway
2. **인증/권한 확인** → User Service
3. **비즈니스 로직 처리** → Data Service
4. **응답 반환** → 클라이언트
5. **비동기 처리** → Notification, Analytics

## 🛠️ 기술 스택 상세
### 프론트엔드 기술
${techStackDetails}

### 백엔드 기술
- **런타임**: Node.js 18+ 또는 Python 3.11+
- **웹 프레임워크**: Express.js 또는 FastAPI
- **ORM**: Prisma 또는 SQLAlchemy
- **인증**: JWT, OAuth 2.0, Passport.js
- **API 문서**: Swagger/OpenAPI 3.0

### 인프라 기술
- **컨테이너**: Docker, Docker Compose
- **오케스트레이션**: Kubernetes (선택적)
- **CI/CD**: GitHub Actions, GitLab CI
- **모니터링**: Prometheus, Grafana, ELK Stack
- **로깅**: Winston, Pino, 또는 구조화된 로깅

### 개발 도구
- **버전 관리**: Git, GitHub/GitLab
- **코드 품질**: ESLint, Prettier, SonarQube
- **테스팅**: Jest, Cypress, Playwright
- **문서화**: JSDoc, TypeDoc, Storybook

## 📊 데이터베이스 설계
### 데이터 모델링
${database}

### 데이터 마이그레이션
- **버전 관리**: Flyway 또는 Knex.js
- **롤백 전략**: 각 마이그레이션의 롤백 스크립트
- **테스트 데이터**: 개발/테스트 환경용 시드 데이터

### 성능 최적화
- **인덱싱 전략**: 복합 인덱스, 부분 인덱스
- **쿼리 최적화**: N+1 문제 방지, 페이징
- **캐싱**: Redis를 통한 세션 및 데이터 캐싱
- **분산 처리**: 대용량 데이터 처리를 위한 배치 작업

## 🔌 API 설계
### RESTful API 원칙
- **리소스 중심**: 명사 기반 URL 구조
- **HTTP 메서드**: GET, POST, PUT, DELETE, PATCH
- **상태 코드**: 표준 HTTP 상태 코드 사용
- **버전 관리**: URL 경로 또는 헤더를 통한 버전 관리

### API 엔드포인트 설계
${apiSpec}

### API 응답 형식
\`\`\`json
{
  "success": true,
  "data": {
    // 실제 데이터
  },
  "meta": {
    "timestamp": "2024-01-01T00:00:00Z",
    "version": "1.0.0"
  },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
\`\`\`

### 에러 처리
\`\`\`json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "입력값이 유효하지 않습니다",
    "details": [
      {
        "field": "email",
        "message": "올바른 이메일 형식이 아닙니다"
      }
    ]
  }
}
\`\`\`

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

### API 보안
- **Rate Limiting**: IP당 요청 제한 (100/분)
- **Input Validation**: 모든 입력값 검증
- **SQL Injection 방지**: 파라미터화된 쿼리
- **XSS 방지**: 입력값 이스케이프, CSP 헤더

## 📱 클라이언트 아키텍처
### 웹 애플리케이션
- **프레임워크**: React 18+ 또는 Vue 3+
- **상태 관리**: Redux Toolkit 또는 Pinia
- **라우팅**: React Router 또는 Vue Router
- **UI 라이브러리**: Material-UI, Ant Design, 또는 Tailwind CSS
- **API 클라이언트**: Axios, React Query, SWR

### 모바일 애플리케이션
- **크로스 플랫폼**: React Native 또는 Flutter
- **네이티브 기능**: 카메라, GPS, 푸시 알림
- **오프라인 지원**: 로컬 저장소, 동기화
- **성능 최적화**: 이미지 압축, 지연 로딩

### PWA (Progressive Web App)
- **서비스 워커**: 오프라인 캐싱, 백그라운드 동기화
- **매니페스트**: 앱 아이콘, 스플래시 스크린
- **설치 가능**: 홈 화면에 추가 가능

## 🚀 배포 및 운영
### 배포 환경
- **개발**: 로컬 Docker 환경
- **스테이징**: 클라우드 스테이징 환경
- **프로덕션**: 클라우드 프로덕션 환경

### 인프라 구성
- **웹 서버**: Nginx (리버스 프록시, 정적 파일)
- **애플리케이션 서버**: PM2 또는 systemd
- **데이터베이스**: PostgreSQL (마스터-슬레이브)
- **캐시**: Redis (세션, 데이터 캐싱)
- **파일 저장소**: AWS S3 또는 클라우드 스토리지

### CI/CD 파이프라인
\`\`\`yaml
# .github/workflows/deploy.yml
name: Deploy to Production
on:
  push:
    branches: [main]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
      - name: Build application
        run: npm run build
  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to server
        run: |
          # 배포 스크립트
\`\`\`

## 📈 성능 최적화
### 프론트엔드 최적화
- **번들 최적화**: 코드 스플리팅, 트리 쉐이킹
- **이미지 최적화**: WebP 포맷, 지연 로딩
- **캐싱 전략**: 브라우저 캐싱, CDN 활용
- **코어 웹 바이탈**: LCP, FID, CLS 최적화

### 백엔드 최적화
- **데이터베이스**: 쿼리 최적화, 인덱싱
- **캐싱**: Redis를 통한 응답 캐싱
- **비동기 처리**: 큐 시스템, 웹훅
- **로드 밸런싱**: 트래픽 분산

### 모니터링 및 알림
- **애플리케이션 모니터링**: New Relic, DataDog
- **인프라 모니터링**: AWS CloudWatch, Grafana
- **로그 관리**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **알림**: Slack, 이메일, SMS

## 🧪 테스팅 전략
### 테스트 피라미드
- **Unit Tests**: 70% - 개별 함수/컴포넌트 테스트
- **Integration Tests**: 20% - API, 데이터베이스 통합 테스트
- **E2E Tests**: 10% - 전체 사용자 플로우 테스트

### 테스트 도구
- **Unit Testing**: Jest, Vitest
- **Integration Testing**: Supertest, Pact
- **E2E Testing**: Cypress, Playwright
- **API Testing**: Postman, Insomnia

### 테스트 자동화
- **프리커밋 훅**: 코드 품질 검사
- **CI/CD 파이프라인**: 자동 테스트 실행
- **코버리지**: 최소 80% 코드 커버리지
- **성능 테스트**: Lighthouse CI, k6

## 🔧 개발 환경 설정
### 필수 소프트웨어
- **Node.js**: 18.0.0 이상
- **데이터베이스**: PostgreSQL 14 이상
- **Redis**: 6.0 이상
- **Docker**: 20.0 이상
- **Git**: 2.30 이상

### 환경 변수 설정
\`\`\`bash
# .env.example
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_S3_BUCKET=your-s3-bucket
\`\`\`

### 개발 서버 실행
\`\`\`bash
# 의존성 설치
npm install

# 데이터베이스 마이그레이션
npm run migrate

# 개발 서버 시작
npm run dev

# 테스트 실행
npm test

# 빌드
npm run build
\`\`\`

## 📚 문서화
### 기술 문서
- **API 문서**: Swagger UI, Postman Collection
- **아키텍처 문서**: C4 모델, 시퀀스 다이어그램
- **데이터베이스 문서**: ERD, 스키마 문서
- **배포 가이드**: 환경별 배포 절차

### 사용자 문서
- **사용자 가이드**: 기능별 사용법
- **관리자 가이드**: 시스템 관리 방법
- **트러블슈팅**: 일반적인 문제 해결 방법
- **FAQ**: 자주 묻는 질문과 답변

## 🔄 유지보수 계획
### 코드 품질 관리
- **코드 리뷰**: 모든 PR에 대한 리뷰 필수
- **정적 분석**: ESLint, SonarQube
- **의존성 관리**: 정기적인 보안 업데이트
- **아키텍처 리뷰**: 분기별 아키텍처 검토

### 운영 관리
- **백업 전략**: 일일 자동 백업, 월간 전체 백업
- **모니터링**: 24/7 시스템 모니터링
- **장애 대응**: 장애 발생 시 30분 내 대응
- **성능 튜닝**: 월간 성능 분석 및 최적화

### 보안 관리
- **보안 스캔**: 주간 자동 보안 스캔
- **취약점 패치**: 발견 즉시 패치 적용
- **접근 권한**: 정기적인 권한 검토
- **감사 로그**: 모든 접근 로그 보관

---
**문서 버전**: 1.0  
**최종 수정일**: ${new Date().toISOString().split('T')[0]}  
**작성자**: AI Assistant  
**검토자**: 개발팀  
*이 기술 명세서는 사용자의 요구사항을 바탕으로 생성되었습니다.*`

    await fs.writeFile(path.join(docsDir, "technical_spec.md"), technicalSpecContent, "utf-8");

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
2. 'plan' 명령어로 개발 작업 계획 수립
3. 'execute' 명령어로 실제 개발 시작`
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

export async function askProjectQuestion(input: { questionNumber: number; currentAnswer?: string; answers?: string[] }): Promise<{ content: { type: "text"; text: string }[] }> {
  const questions = [
    "1. 앱의 주요 목적은 무엇인가요? (예: 온라인 쇼핑, 할일 관리, 소셜 네트워킹 등)",
    "2. 필수 기능은 무엇인가요? (예: 사용자 로그인, 데이터 저장, 결제 처리, 알림 등)",
    "3. 디자인 요구사항은 어떻게 되나요? (예: 기존 디자인 파일 있음, 간단한 기본 디자인, 완전 커스텀 디자인 필요)",
    "4. 서버/API는 어떻게 구성할 예정인가요? (예: 기존 API 서버 있음, 새로 개발 필요, Firebase/Supabase 사용)",
    "5. 외부 서비스 연동이 필요한가요? (예: 소셜 로그인, 결제 게이트웨이, 지도 API, 푸시 알림 등)",
    "6. 어떤 플랫폼을 지원할 예정인가요? (예: iOS만, Android만, 둘 다, 웹앱도 포함)",
    "7. 기술 스택이나 제한사항이 있나요? (예: React Native, Flutter, 네이티브 개발, 특정 라이브러리 사용/금지)",
    "8. 기타 요구사항이 있나요? (예: 성능 요구사항, 보안 요구사항, 특별한 기능 등)"
  ];

  const questionNumber = input.questionNumber;
  const currentAnswer = input.currentAnswer;
  const answers = input.answers || [];

  // 디버깅 정보 추가
  console.log(`🔍 askProjectQuestion 호출: questionNumber=${questionNumber}, currentAnswer="${currentAnswer}", answers=${JSON.stringify(answers)}`);

  // 질문 번호 유효성 검사 (1-8)
  if (questionNumber < 1 || questionNumber > 8) {
    return {
      content: [
        {
          type: "text",
          text: "❌ 잘못된 질문 번호입니다. 1-8 사이의 숫자를 입력해주세요."
        }
      ]
    };
  }

  // 순차 검증: 이전 질문들이 모두 답변되었는지 확인 (더 유연하게)
  const expectedNextQuestion = answers.length + 1;
  
  // 건너뛰기 방지 (하지만 너무 엄격하지 않게)
  if (questionNumber > expectedNextQuestion + 1 && questionNumber !== 1) {
    return {
      content: [
        {
          type: "text",
          text: `⚠️ 순서 오류: 질문을 너무 많이 건너뛰었습니다.\n\n**올바른 순서**: ${expectedNextQuestion}번 질문부터 진행해야 합니다.\n\n**해결 방법**: ask-project-question 도구를 questionNumber: ${expectedNextQuestion}로 호출하세요.`
        }
      ]
    };
  }
  
  // 이전 질문이 비어있으면 경고만 표시하고 계속 진행
  if (questionNumber > expectedNextQuestion && questionNumber !== 1) {
    console.log(`⚠️ 경고: 질문 ${expectedNextQuestion}번이 비어있지만 계속 진행합니다.`);
  }

  const question = questions[questionNumber - 1];
  
  // 답변이 있는 경우
  if (currentAnswer && currentAnswer.trim() !== "") {
    // 답변을 answers 배열에 저장
    const updatedAnswers = [...answers];
    updatedAnswers[questionNumber - 1] = currentAnswer;
    
    // 마지막 질문인 경우에만 파일 생성
    if (questionNumber === 8) {
      try {
        // 파일 생성 로직을 별도 함수로 분리하여 호출
        const result = await createProjectFiles(updatedAnswers);
        return result;
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
    } else {
      // 다음 질문으로 진행
      const nextQuestionNumber = questionNumber + 1;
      const nextQuestion = questions[nextQuestionNumber - 1];
      
      return {
        content: [
          {
            type: "text",
            text: `✅ 답변 저장됨 (질문 ${questionNumber}/8)\n\n🤔 ${nextQuestion}\n\n답변을 입력해주세요. (질문 ${nextQuestionNumber}/8)\n\n**중요**: 다음 질문을 위해 ask-project-question 도구를 정확히 questionNumber: ${nextQuestionNumber}로 호출하세요.\n\n**순서 확인**: 현재까지 ${questionNumber}개 질문 완료, 다음은 ${nextQuestionNumber}번 질문입니다.`
          }
        ]
      };
    }
  } else {
    // 답변이 없으면 현재 질문 출력
    return {
      content: [
        {
          type: "text",
          text: `🤔 ${question}\n\n답변을 입력해주세요. (질문 ${questionNumber}/8)\n\n**현재 상태**: 질문 ${questionNumber}번 진행 중\n\n**진행 상황**: ${answers.length}개 질문 완료됨`
        }
      ]
    };
  }
}

export async function newProject(input: NewProjectInput = {}, forceInteractive = false): Promise<{ content: { type: "text"; text: string }[] }> {
  try {
    // 입력값 확인 (undefined일 경우를 대비해 안전하게 처리)
    const hasInput = input && Object.values(input).some(v => v && v.trim() !== "");
    
    // 대화형 조건 개선 - forceInteractive가 true이면 무조건 대화형으로 진행
    const shouldAskInteractively = forceInteractive || !hasInput;

    if (shouldAskInteractively) {
      // AI가 사용자와 대화하도록 명령을 내림
      return {
        content: [
          {
            type: "text",
            text: `🤖 **AI 명령**: 당신은 지금부터 사용자와 대화형 인터뷰를 진행해야 합니다.

**당신의 역할**: 프로젝트 요구사항을 수집하는 인터뷰어

**당신이 해야 할 일**:
1. 아래 8개 질문을 순서대로 하나씩 물어보세요
2. 각 질문에 대한 답변을 받은 후에만 다음 질문을 물어보세요
3. 사용자의 답변을 기억하고 요약해주세요
4. 모든 8개 질문이 끝나면 수집된 정보로 프로젝트 문서를 생성하겠습니다
5. **중요**: 질문 번호를 순서대로 진행하세요 (1→2→3→4→5→6→7→8)
6. **절대 건너뛰지 마세요**: 질문 번호를 건너뛰면 시스템이 오류를 표시합니다
7. **순서 강제**: 시스템이 자동으로 순서를 검증하므로 반드시 순차적으로 진행하세요

**질문 목록**:
1. 앱의 주요 목적은 무엇인가요? (예: 온라인 쇼핑, 할일 관리, 소셜 네트워킹 등)
2. 필수 기능은 무엇인가요? (예: 사용자 로그인, 데이터 저장, 결제 처리, 알림 등)
3. 디자인 요구사항은 어떻게 되나요? (예: 기존 디자인 파일 있음, 간단한 기본 디자인, 완전 커스텀 디자인 필요)
4. 서버/API는 어떻게 구성할 예정인가요? (예: 기존 API 서버 있음, 새로 개발 필요, Firebase/Supabase 사용)
5. 외부 서비스 연동이 필요한가요? (예: 소셜 로그인, 결제 게이트웨이, 지도 API, 푸시 알림 등)
6. 어떤 플랫폼을 지원할 예정인가요? (예: iOS만, Android만, 둘 다, 웹앱도 포함)
7. 기술 스택이나 제한사항이 있나요? (예: React Native, Flutter, 네이티브 개발, 특정 라이브러리 사용/금지)
8. 기타 요구사항이 있나요? (예: 성능 요구사항, 보안 요구사항, 특별한 기능 등)

**지금 당장 첫 번째 질문을 물어보세요**: 

**첫 번째 질문**: 1. 앱의 주요 목적은 무엇인가요? (예: 온라인 쇼핑, 할일 관리, 소셜 네트워킹 등)

**중요**: ask-project-question 도구를 정확히 questionNumber: 1로 호출하세요. 질문 번호를 건너뛰지 마세요.`
          }
        ]
      };
    }

    // 프로젝트 루트의 docs 폴더 사용
    const PROJECT_ROOT = path.resolve(process.cwd());
    const docsDir = path.join(PROJECT_ROOT, "docs");
    
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