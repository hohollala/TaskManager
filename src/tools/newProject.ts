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

  // 답변이 있는 경우 - 답변 확인 후 다음 질문
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

// 메인 함수
export async function newProject(input: NewProjectInput = {}, forceInteractive = false) {
  const hasInput = input.purpose || input.features || input.design;
  
  if (hasInput) {
    const answers = [input.purpose, input.features, input.design];
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