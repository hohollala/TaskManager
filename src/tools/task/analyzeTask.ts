import { z } from "zod";
import { getAnalyzeTaskPrompt } from "../../prompts/index.js";

// 문제 분석 도구
export const analyzeTaskSchema = z.object({
  summary: z
    .string()
    .min(10, {
      message: "작업 요약은 10자 이상이어야 하며, 목표가 명확하도록 더 자세히 작성해주세요",
    })
    .describe(
      "구조화된 작업 요약으로, 작업 목표, 범위 및 핵심 기술 과제를 포함하며, 최소 10자"
    ),
  initialConcept: z
    .string()
    .min(50, {
      message:
        "초기 해결 아이디어는 50자 이상이어야 하며, 기술 방안이 명확하도록 더 자세한 내용을 제공해주세요",
    })
    .describe(
      "최소 50자의 초기 해결 아이디어로, 기술 방안, 아키텍처 설계 및 구현 전략을 포함하며, 코드가 필요하다면 pseudocode 형식으로 고수준 논리와 핵심 단계만 제공해주세요"
    ),
  previousAnalysis: z
    .string()
    .optional()
    .describe("이전 반복의 분석 결과로, 지속적인 개선을 위해 사용 (재분석 시에만 필요)"),
});

export async function analyzeTask({
  summary,
  initialConcept,
  previousAnalysis,
}: z.infer<typeof analyzeTaskSchema>) {
  // prompt 생성기를 사용하여 최종 prompt 가져오기
  const prompt = await getAnalyzeTaskPrompt({
    summary,
    initialConcept,
    previousAnalysis,
  });

  return {
    content: [
      {
        type: "text" as const,
        text: prompt,
      },
    ],
  };
}
