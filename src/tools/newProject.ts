import { z } from "zod";
import { promises as fs } from "fs";
import path from "path";
import { initProjectRules } from "./project/initProjectRules.js";
import { planTask } from "./task/planTask.js";

// 임시 답변 상태 저장
let tempAnswers: string[] = [];

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

  // CLAUDE.md 생성 - AI 개발 어시스턴트를 위한 프로젝트 컨텍스트
  const claudeContent = `# ${purpose || '프로젝트'} - AI 개발 가이드

Claude와 같은 AI 개발 어시스턴트가 이 프로젝트를 효과적으로 도울 수 있도록 하는 컨텍스트입니다.

## 🎯 프로젝트 개요

**목적**: ${purpose || '미정'}
**핵심 기능**: ${features || '미정'}
**지원 플랫폼**: ${platforms || '미정'}
**기술 스택**: ${techStack || '미정'}

## 🔧 개발 환경 설정

### 필수 도구
${techStack?.includes('React') ? '- Node.js (LTS 버전)\n- npm 또는 yarn\n- VS Code (권장 에디터)' : ''}
${techStack?.includes('Flutter') ? '- Flutter SDK\n- Dart SDK\n- Android Studio 또는 VS Code' : ''}
${techStack?.includes('Python') ? '- Python 3.8+\n- pip\n- 가상환경 (venv 또는 conda)' : ''}

### 개발 서버 실행
\`\`\`bash
# 개발 서버 시작 명령어 예시
${techStack?.includes('React') ? 'npm start' : ''}
${techStack?.includes('Flutter') ? 'flutter run' : ''}
${techStack?.includes('Python') ? 'python app.py' : ''}
\`\`\`

## 📝 핵심 기능 명세

### 주요 기능
${features ? features.split(',').map(f => `- ${f.trim()}`).join('\n') : '- 기능 명세 필요'}

### 비기능 요구사항
${otherRequirements ? otherRequirements.split(',').map(r => `- ${r.trim()}`).join('\n') : '- 성능 및 보안 요구사항 정의 필요'}

## 🎨 UI/UX 가이드라인

${design || '디자인 가이드라인 정의 필요'}

**디자인 시스템**:
- 색상 팔레트: 정의 필요
- 타이포그래피: 정의 필요
- 컴포넌트 라이브러리: 정의 필요

## 🏗️ 아키텍처

### 시스템 구조
${server || '서버 구조 정의 필요'}

### 외부 연동
${externalServices || '외부 서비스 연동 계획 필요'}

## 📋 개발 우선순위

1. **핵심 기능 구현** - ${features?.split(',')[0]?.trim() || '기본 기능'}
2. **사용자 인터페이스** - ${design ? '디자인 시스템 적용' : '기본 UI 구현'}
3. **데이터 관리** - ${server ? '서버 연동' : '로컬 저장소'}
4. **테스트 및 최적화**

## 🔍 AI 어시스턴트 지침

### 코드 생성 시 고려사항
- **기술 스택 준수**: ${techStack || '기술 스택 명시 필요'}
- **플랫폼 호환성**: ${platforms || '플랫폼 명시 필요'}
- **보안 우선**: ${otherRequirements?.includes('보안') ? '보안 요구사항 반영' : '기본 보안 적용'}

### 질문하기 좋은 항목
- "${purpose || '이 앱'}의 [구체적 기능] 구현 방법"
- "${techStack || '기술 스택'}로 [특정 문제] 해결 방법"
- "${platforms || '플랫폼'}에서 [성능/UI] 최적화 방법"

---
*생성일: ${new Date().toLocaleDateString('ko-KR')}*
*AI 개발 어시스턴트용 프로젝트 컨텍스트*
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
  const { questionNumber, answer } = input;
  const currentIndex = questionNumber - 1;
  const isLastQuestion = questionNumber === QUESTIONS.length;

  // 답변이 있는 경우 - 답변 저장 후 다음 질문
  if (answer?.trim()) {
    // tempAnswers 배열 확장 (필요시)
    while (tempAnswers.length <= currentIndex) {
      tempAnswers.push('');
    }
    tempAnswers[currentIndex] = answer;
    
    console.log(`질문 ${questionNumber}: ${answer}`);
    console.log('현재 tempAnswers:', tempAnswers);

    // 마지막 질문이면 완료 및 후속 작업 실행
    if (isLastQuestion) {
      try {
        // 1. 파일 생성
        const fileResult = await createProjectFiles(tempAnswers);
        
        // 2. init 명령 실행
        const initResult = await initProjectRules();
        
        // 3. plan 명령 실행 (수집된 답변을 기반으로)
        const planDescription = `프로젝트 요구사항을 바탕으로 ${tempAnswers[0] || '새 프로젝트'} 개발을 위한 계획을 수립합니다.

핵심 기능: ${tempAnswers[1] || '미정'}
기술 스택: ${tempAnswers[6] || '미정'}
플랫폼: ${tempAnswers[5] || '미정'}`;

        const planResult = await planTask({ 
          description: planDescription,
          existingTasksReference: false 
        });

        // 상태 초기화
        tempAnswers = [];

        return {
          content: [{ 
            type: "text", 
            text: `\n✅ 프로젝트 초기화 완료!\n\n📁 생성된 파일: ${fileResult.files.length}개\n🔧 프로젝트 규칙 설정 완료\n📋 개발 계획 수립 완료\n\n개발을 시작할 수 있습니다.`
          }]
        };
      } catch (error) {
        return {
          content: [{ 
            type: "text", 
            text: `⚠️ 초기화 중 오류 발생: ${error instanceof Error ? error.message : String(error)}

init, plan 명령을 수동 실행해주세요.`
          }]
        };
      }
    }

    // 답변 확인 후 다음 질문
    const nextQuestionNumber = questionNumber + 1;
    const nextQuestionIndex = nextQuestionNumber - 1; // 0-based 인덱스
    
    if (nextQuestionIndex < QUESTIONS.length) {
      const nextQuestion = QUESTIONS[nextQuestionIndex];
      return {
        content: [{ 
          type: "text", 
          text: `\n${nextQuestion}`
        }]
      };
    } else {
      // 모든 질문 완료 (이 경우는 발생하지 않아야 함)
      return {
        content: [{ 
          type: "text", 
          text: "모든 질문이 완료되었습니다."
        }]
      };
    }
  }

  // 답변이 없는 경우 - 현재 질문 출력
  const currentQuestion = QUESTIONS[currentIndex];
  return {
    content: [{ 
      type: "text", 
      text: `\n${currentQuestion}`
    }]
  };
}

// 메인 함수
export async function newProject(input: NewProjectInput = {}) {
  // 새 세션 시작 시 상태 초기화
  tempAnswers = [];
  
  // 모든 입력이 비어있거나 기본값인 경우에만 첫 번째 질문 시작
  const hasRealInput = Object.values(input).some(value => 
    value && 
    value.trim() && 
    !value.includes("to be") && 
    !value.includes("To be") &&
    !value.includes("requirements") &&
    !value.includes("specifications")
  );

  if (!hasRealInput) {
    return {
      content: [{ 
        type: "text", 
        text: `\n📝 프로젝트 요구사항 수집\n\n${QUESTIONS[0]}`
      }]
    };
  }

  const answers = [input.purpose, input.features, input.design, input.server, 
                   input.externalServices, input.platforms, input.techStack, input.otherRequirements];
  
  return {
    content: [{ 
      type: "text", 
      text: `입력된 정보:\n${answers.map((ans, idx) => `${idx + 1}. ${ans || "없음"}`).join('\n')}` 
    }]
  };
}

export type NewProjectInput = z.infer<typeof newProjectSchema>; 