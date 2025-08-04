import { z } from "zod";
import path from "path";
import { fileURLToPath } from "url";
import { getResearchModePrompt } from "../../prompts/index.js";
import { getMemoryDir } from "../../utils/paths.js";

// 연구 모드 도구
export const researchModeSchema = z.object({
  topic: z
    .string()
    .min(5, {
      message: "연구 주제는 5자 이상이어야 하며, 명확한 연구 주제를 제공해주세요",
    })
    .describe("연구할 프로그래밍 주제 내용으로, 명확하고 구체적이어야 합니다"),
  previousState: z
    .string()
    .optional()
    .default("")
    .describe(
      "이전 연구 상태와 내용 요약으로, 첫 실행 시에는 비어있고, 이후에는 이전의 상세하고 중요한 연구 결과를 포함하며, 이는 후속 연구에 도움이 됩니다"
    ),
  currentState: z
    .string()
    .describe(
      "현재 Agent가 주로 실행해야 할 내용으로, 예를 들어 네트워크 도구를 사용하여 특정 키워드를 검색하거나 특정 코드를 분석하는 등이며, 연구 완료 후 research_mode를 호출하여 상태를 기록하고 이전 `previousState`와 통합해야 하며, 이는 연구 내용을 더 잘 저장하고 실행하는 데 도움이 됩니다"
    ),
  nextSteps: z
    .string()
    .describe(
      "후속 계획, 단계 또는 연구 방향으로, Agent가 주제에서 벗어나거나 잘못된 방향으로 가지 않도록 제약하며, 연구 과정에서 연구 방향을 조정해야 한다고 판단되면 이 필드를 업데이트해주세요"
    ),
});

export async function researchMode({
  topic,
  previousState = "",
  currentState,
  nextSteps,
}: z.infer<typeof researchModeSchema>) {
  // 기본 디렉토리 경로 가져오기
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const PROJECT_ROOT = path.resolve(__dirname, "../../..");
  const MEMORY_DIR = await getMemoryDir();

  // prompt 생성기를 사용하여 최종 prompt 가져오기
  const prompt = await getResearchModePrompt({
    topic,
    previousState,
    currentState,
    nextSteps,
    memoryDir: MEMORY_DIR,
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
