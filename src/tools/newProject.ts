import { z } from "zod";

// 스키마 정의
export const newProjectSchema = z.object({
  purpose: z.string().optional(),
  features: z.string().optional(),
  design: z.string().optional()
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
  "3. 디자인 요구사항은 어떻게 되나요? (예: 기존 디자인 파일 있음, 간단한 기본 디자인, 완전 커스텀 디자인 필요)"
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
    const nextQuestionIndex = questionNumber;
    const nextQuestion = QUESTIONS[nextQuestionIndex];
    return {
      content: [{ 
        type: "text", 
        text: nextQuestion
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

  // 대화형 모드 - 첫 번째 질문 시작
  return await askProjectQuestion({
    questionNumber: 1,
    answer: undefined,
    answers: []
  });
}

export type NewProjectInput = z.infer<typeof newProjectSchema>; 