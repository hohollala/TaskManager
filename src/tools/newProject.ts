import { z } from "zod";
import { promises as fs } from "fs";
import path from "path";
import { initProjectRules } from "./initProjectRules.js";
import { planTask } from "./planTask.js";

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

// 파일 생성 함수들
async function createProjectFiles(answers: string[]) {
  const [purpose, features, design, server, externalServices, platforms, techStack, otherRequirements] = answers;
  
  // docs 디렉토리 생성
  const docsDir = path.join(process.cwd(), 'docs');
  await fs.mkdir(docsDir, { recursive: true });

  // requirements.md 생성
  const requirementsContent = `# 프로젝트 요구사항 요약

## 프로젝트 개요
**목적**: ${purpose || '미정'}

## 핵심 기능 요구사항
${features || '미정'}

## 디자인 요구사항
${design || '미정'}

## 서버/API 요구사항
${server || '미정'}

## 외부 서비스 연동
${externalServices || '미정'}

## 지원 플랫폼
${platforms || '미정'}

## 기술 스택 및 제한사항
${techStack || '미정'}

## 기타 요구사항
${otherRequirements || '미정'}

---
*생성일: ${new Date().toLocaleDateString('ko-KR')}*
`;

  // designed.md 생성
  const designedContent = `# UI/UX 디자인 가이드

## 디자인 방향성
${design || '미정'}

## 플랫폼별 고려사항
${platforms || '미정'}

## 사용자 경험 (UX) 요구사항
- 직관적이고 사용하기 쉬운 인터페이스
- 일관된 디자인 패턴 적용
- 접근성 고려 (WCAG 2.1 준수)

## 디자인 시스템
- 컬러 스키마: TBD
- 타이포그래피: TBD
- 컴포넌트 라이브러리: TBD

## 반응형 디자인
- 모바일 우선 접근법
- 다양한 화면 크기 지원
- 터치 친화적 인터페이스

---
*생성일: ${new Date().toLocaleDateString('ko-KR')}*
`;

  // technical_spec.md 생성
  const technicalSpecContent = `# 기술 명세서

## 아키텍처 개요
**목적**: ${purpose || '미정'}

## 기술 스택
${techStack || '미정'}

## 서버 구성
${server || '미정'}

## 외부 API 및 서비스
${externalServices || '미정'}

## 플랫폼 지원
${platforms || '미정'}

## 보안 요구사항
- 데이터 암화화 (전송 중/저장 중)
- 사용자 인증 및 권한 관리
- API 보안 (HTTPS, 토큰 기반 인증)

## 성능 요구사항
- 페이지 로딩 시간: < 3초
- API 응답 시간: < 500ms
- 모바일 최적화

## 확장성 고려사항
- 클라우드 기반 인프라
- 마이크로서비스 아키텍처 (필요시)
- 데이터베이스 확장성

## 개발 환경
- 버전 관리: Git
- CI/CD 파이프라인
- 테스트 자동화

## 기타 기술적 요구사항
${otherRequirements || '미정'}

---
*생성일: ${new Date().toLocaleDateString('ko-KR')}*
`;

  // CLAUDE.md 생성
  const claudeContent = `# 프로젝트 컨텍스트 및 가이드라인

## 프로젝트 개요
${purpose || '미정'}

## 핵심 기능
${features || '미정'}

## 기술 스택
${techStack || '미정'}

## 개발 가이드라인

### 코딩 컨벤션
- ESLint + Prettier 사용
- TypeScript 엄격 모드
- 컴포넌트 단위 개발

### 브랜치 전략
- main: 프로덕션 배포용
- develop: 개발용 통합 브랜치
- feature/: 기능 개발용

### 커밋 메시지 규칙
- feat: 새로운 기능 추가
- fix: 버그 수정
- docs: 문서 수정
- style: 코드 스타일 변경
- refactor: 코드 리팩토링
- test: 테스트 추가/수정

### 폴더 구조
\`\`\`
src/
├── components/     # 재사용 가능한 컴포넌트
├── pages/         # 페이지 컴포넌트
├── services/      # API 서비스
├── utils/         # 유틸리티 함수
├── styles/        # 스타일 파일
└── types/         # TypeScript 타입 정의
\`\`\`

## 품질 관리
- 코드 리뷰 필수
- 단위 테스트 커버리지 > 80%
- E2E 테스트 자동화

## 배포 프로세스
1. 개발 환경 테스트
2. 스테이징 환경 검증
3. 프로덕션 배포

---
*생성일: ${new Date().toLocaleDateString('ko-KR')}*
*마지막 업데이트: ${new Date().toLocaleDateString('ko-KR')}*
`;

  // 파일들 생성
  await fs.writeFile(path.join(docsDir, 'requirements.md'), requirementsContent, 'utf-8');
  await fs.writeFile(path.join(docsDir, 'designed.md'), designedContent, 'utf-8');
  await fs.writeFile(path.join(docsDir, 'technical_spec.md'), technicalSpecContent, 'utf-8');
  await fs.writeFile(path.join(process.cwd(), 'CLAUDE.md'), claudeContent, 'utf-8');

  return {
    files: ['docs/requirements.md', 'docs/designed.md', 'docs/technical_spec.md', 'CLAUDE.md'],
    docsDir
  };
}

// 질문 처리 함수
export async function askProjectQuestion(input: { questionNumber: number; answer?: string; answers?: string[] }) {
  const { questionNumber, answer, answers = [] } = input;
  const currentIndex = questionNumber - 1;
  const isLastQuestion = questionNumber === QUESTIONS.length;

  // 답변이 있는 경우 - 답변 확인 후 다음 질문
  if (answer?.trim()) {
    const updatedAnswers = [...answers];
    updatedAnswers[currentIndex] = answer;

    // 마지막 질문이면 완료 및 후속 작업 실행
    if (isLastQuestion) {
      try {
        // 1. 파일 생성
        const fileResult = await createProjectFiles(updatedAnswers);
        
        // 2. init 명령 실행
        const initResult = await initProjectRules();
        
        // 3. plan 명령 실행 (수집된 답변을 기반으로)
        const planDescription = `프로젝트 요구사항을 바탕으로 ${updatedAnswers[0] || '새 프로젝트'} 개발을 위한 계획을 수립합니다.

핵심 기능: ${updatedAnswers[1] || '미정'}
기술 스택: ${updatedAnswers[6] || '미정'}
플랫폼: ${updatedAnswers[5] || '미정'}`;

        const planResult = await planTask({ 
          description: planDescription,
          existingTasksReference: false 
        });

        return {
          content: [{ 
            type: "text", 
            text: `✅ 모든 질문 완료!

📝 수집된 답변:
${updatedAnswers.map((ans, idx) => `${idx + 1}. ${ans}`).join('\n')}

🎉 프로젝트 초기화 완료!

📁 생성된 파일들:
${fileResult.files.map(file => `- ${file}`).join('\n')}

🔧 프로젝트 규칙 초기화 완료
📋 프로젝트 계획 수립 완료

✨ 이제 개발을 시작할 수 있습니다!`
          }]
        };
      } catch (error) {
        return {
          content: [{ 
            type: "text", 
            text: `✅ 모든 질문 완료!

📝 수집된 답변:
${updatedAnswers.map((ans, idx) => `${idx + 1}. ${ans}`).join('\n')}

⚠️ 후속 작업 중 오류 발생: ${error instanceof Error ? error.message : String(error)}

수동으로 다음 명령을 실행해주세요:
1. init 명령으로 프로젝트 규칙 초기화
2. plan 명령으로 프로젝트 계획 수립`
          }]
        };
      }
    }

    // 답변 확인 후 다음 질문
    const nextQuestionIndex = questionNumber;
    const nextQuestion = QUESTIONS[nextQuestionIndex];
    return {
      content: [{ 
        type: "text", 
        text: `✅ 답변: ${answer}\n\n${nextQuestion}` 
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

// 메인 함수
export async function newProject(input: NewProjectInput = {}, forceInteractive = false) {
  // 입력이 없으면 첫 번째 질문 시작
  if (!input.purpose && !input.features && !input.design && !input.server && 
      !input.externalServices && !input.platforms && !input.techStack && !input.otherRequirements) {
    return {
      content: [{ 
        type: "text", 
        text: `🚀 새 프로젝트 요구사항 수집을 시작합니다!\n\n${QUESTIONS[0]}\n\n💡 답변 후 ask-project-question 도구로 계속 진행됩니다.` 
      }]
    };
  }

  const answers = [input.purpose, input.features, input.design, input.server, 
                   input.externalServices, input.platforms, input.techStack, input.otherRequirements];
  
  return {
    content: [{ 
      type: "text", 
      text: `📝 입력된 정보:\n${answers.map((ans, idx) => `${idx + 1}. ${ans || "없음"}`).join('\n')}` 
    }]
  };
}

export type NewProjectInput = z.infer<typeof newProjectSchema>; 