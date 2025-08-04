import { z } from "zod";
import { searchTasksWithCommand } from "../../models/taskModel.js";
import { getGetTaskDetailPrompt } from "../../prompts/index.js";

// 작업 상세 정보 조회 매개변수
export const getTaskDetailSchema = z.object({
  taskId: z
    .string()
    .min(1, {
      message: "작업 ID가 비어있습니다. 유효한 작업 ID를 제공해주세요",
    })
    .describe("상세 정보를 확인할 작업 ID"),
});

// 작업 상세 정보 조회
export async function getTaskDetail({
  taskId,
}: z.infer<typeof getTaskDetailSchema>) {
  try {
    // getTaskById 대신 searchTasksWithCommand를 사용하여 메모리 영역 작업 검색 구현
    // isId를 true로 설정하여 ID로 검색하고, 페이지는 1, 페이지 크기는 1로 설정
    const result = await searchTasksWithCommand(taskId, true, 1, 1);

    // 작업을 찾았는지 확인
    if (result.tasks.length === 0) {
      return {
        content: [
          {
            type: "text" as const,
            text: `## 오류\n\nID가 \`${taskId}\`인 작업을 찾을 수 없습니다. 작업 ID가 올바른지 확인해주세요.`,
          },
        ],
        isError: true,
      };
    }

    // 찾은 작업 가져오기 (첫 번째이자 유일한 작업)
    const task = result.tasks[0];

    // prompt 생성기를 사용하여 최종 prompt 가져오기
    const prompt = await getGetTaskDetailPrompt({
      taskId,
      task,
    });

    return {
      content: [
        {
          type: "text" as const,
          text: prompt,
        },
      ],
    };
  } catch (error) {
    // prompt 생성기를 사용하여 오류 메시지 가져오기
    const errorPrompt = await getGetTaskDetailPrompt({
      taskId,
      error: error instanceof Error ? error.message : String(error),
    });

    return {
      content: [
        {
          type: "text" as const,
          text: errorPrompt,
        },
      ],
    };
  }
}
