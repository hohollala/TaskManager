import { z } from "zod";
import {
  getProcessThoughtPrompt,
  ProcessThoughtPromptParams,
} from "../../prompts/generators/processThought.js";

/**
 * processThought 도구의 매개변수 구조
 */
export const processThoughtSchema = z.object({
  thought: z
    .string()
    .min(1, {
      message: "사고 내용이 비어있을 수 없습니다. 유효한 사고 내용을 제공해주세요",
    })
    .describe("사고 내용"),
  thought_number: z
    .number()
    .int()
    .positive({
      message: "사고 번호는 양의 정수여야 합니다",
    })
    .describe("현재 사고 번호"),
  total_thoughts: z
    .number()
    .int()
    .positive({
      message: "총 사고 수는 양의 정수여야 합니다",
    })
    .describe("예상 총 사고 수량, 더 많은 사고가 필요하면 언제든지 변경 가능"),
  next_thought_needed: z.boolean().describe("다음 단계 사고가 필요한지 여부"),
  stage: z
    .string()
    .min(1, {
      message: "사고 단계가 비어있을 수 없습니다. 유효한 사고 단계를 제공해주세요",
    })
    .describe(
      "Thinking stage. Available stages include: Problem Definition, Information Gathering, Research, Analysis, Synthesis, Conclusion, Critical Questioning, and Planning."
    ),
  tags: z.array(z.string()).optional().describe("사고 태그, 문자열 배열"),
  axioms_used: z
    .array(z.string())
    .optional()
    .describe("사용된 공리, 문자열 배열"),
  assumptions_challenged: z
    .array(z.string())
    .optional()
    .describe("도전한 가정, 문자열 배열"),
});

/**
 * 단일 사고를 처리하고 형식화된 출력 반환
 */
export async function processThought(
  params: z.infer<typeof processThoughtSchema>
) {
  try {
    // 매개변수를 표준 ThoughtData 형식으로 변환
    const thoughtData: ProcessThoughtPromptParams = {
      thought: params.thought,
      thoughtNumber: params.thought_number,
      totalThoughts: params.total_thoughts,
      nextThoughtNeeded: params.next_thought_needed,
      stage: params.stage,
      tags: params.tags || [],
      axioms_used: params.axioms_used || [],
      assumptions_challenged: params.assumptions_challenged || [],
    };

    // 사고 번호가 총 사고 수를 초과하지 않도록 보장
    if (thoughtData.thoughtNumber > thoughtData.totalThoughts) {
      // 총 사고 수량을 자동으로 조정
      thoughtData.totalThoughts = thoughtData.thoughtNumber;
    }

    // 사고 출력 형식화
    const formattedThought = await getProcessThoughtPrompt(thoughtData);

    // 성공 응답 반환
    return {
      content: [
        {
          type: "text" as const,
          text: formattedThought,
        },
      ],
    };
  } catch (error) {
    // 모든 예상치 못한 오류를 포착하고 처리
    const errorMessage = error instanceof Error ? error.message : "알 수 없는 오류";
    return {
      content: [
        {
          type: "text" as const,
          text: `사고 처리 중 오류가 발생했습니다: ${errorMessage}`,
        },
      ],
    };
  }
}
