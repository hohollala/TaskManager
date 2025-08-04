import { z } from "zod";

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

// 중복 호출 방지를 위한 캐시
let lastInput: string | null = null;
let lastOutput: string | null = null;
let lastCallTime: number = 0;
const DUPLICATE_THRESHOLD = 5000; // 5초 내 동일 입력은 중복으로 간주

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

  // 답변이 있는 경우
  if (answer?.trim()) {
    const updatedAnswers = [...answers];
    updatedAnswers[currentIndex] = answer;

    // 마지막 질문이면 완료
    if (isLastQuestion) {
      return {
        content: [{ 
          type: "text", 
          text: `✅ 모든 질문 완료!\n\n📝 수집된 답변:\n${updatedAnswers.map((ans, idx) => `${idx + 1}. ${ans}`).join('\n')}` 
        }]
      };
    }

    // 답변을 받았으므로 다음 질문으로 진행
    const nextQuestionIndex = questionNumber; // 다음 질문 번호 (1부터 시작하므로 배열 인덱스로 사용 가능)
    const nextQuestion = QUESTIONS[nextQuestionIndex];
    return {
      content: [{ 
        type: "text", 
        text: `${nextQuestion}` 
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
export async function newProject(input: NewProjectInput = {}, forceInteractive = false) {
  const hasInput = input.purpose || input.features || input.design;
  
  if (hasInput) {
    // 중복 호출 방지 로직
    const currentInput = JSON.stringify(input);
    const currentTime = Date.now();
    
    // 동일한 입력이 5초 내에 다시 호출되면 이전 결과 반환
    if (currentInput === lastInput && 
        currentTime - lastCallTime < DUPLICATE_THRESHOLD && 
        lastOutput) {
      console.log("🔄 중복 호출 감지 - 이전 결과 반환");
      return {
        content: [{ 
          type: "text", 
          text: lastOutput
        }]
      };
    }
    
    const answers = [input.purpose, input.features, input.design];
    const outputText = `📝 입력된 정보:\n${answers.map((ans, idx) => `${idx + 1}. ${ans || "없음"}`).join('\n')}`;
    
    // 캐시 업데이트
    lastInput = currentInput;
    lastOutput = outputText;
    lastCallTime = currentTime;
    
    return {
      content: [{ 
        type: "text", 
        text: outputText
      }]
    };
  }

  // 대화형 모드 - 첫 번째 질문 시작 (중복 체크 없이)
  // 중복 체크 변수 초기화
  lastInput = null;
  lastOutput = null;
  lastCallTime = 0;
  
  return await askProjectQuestion({
    questionNumber: 1,
    answer: undefined,
    answers: []
  });
}

export type NewProjectInput = z.infer<typeof newProjectSchema>; 