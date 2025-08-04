import { z } from "zod";
import { getReflectTaskPrompt } from "../../prompts/index.js";

// 회고 아이디어 도구
export const reflectTaskSchema = z.object({
  summary: z
    .string()
    .min(10, {
      message: "작업 요약은 10자 이상이어야 하며, 목표가 명확하도록 더 자세히 작성해주세요",
    })
    .describe("구조화된 작업 요약으로, 분석 단계와 일관성을 유지해야 합니다"),
  analysis: z
    .string()
    .min(100, {
      message: "기술 분석 내용이 충분하지 않습니다. 전체 기술 분석과 구현 방안을 작성해주세요",
    })
    .describe(
      "완전하고 상세한 기술 분석 결과로, 모든 기술 세부사항, 의존 컴포넌트, 구현 방안을 포함해야 하며, 코드가 필요하다면 pseudocode 형식으로 고수준 논리와 핵심 단계만 작성해주세요"
    ),
});

export async function reflectTask({
  summary,
  analysis,
}: z.infer<typeof reflectTaskSchema>) {
  // prompt 생성기를 사용하여 최종 prompt 가져오기
  const prompt = await getReflectTaskPrompt({
    summary,
    analysis,
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
