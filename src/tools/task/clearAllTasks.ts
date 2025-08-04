import { z } from "zod";
import {
  getAllTasks,
  clearAllTasks as modelClearAllTasks,
} from "../../models/taskModel.js";
import { getClearAllTasksPrompt } from "../../prompts/index.js";

// 모든 작업 삭제 도구
export const clearAllTasksSchema = z.object({
  confirm: z
    .boolean()
    .refine((val) => val === true, {
      message:
        "삭제 작업을 명시적으로 확인해야 합니다. confirm 매개변수를 true로 설정하여 이 위험한 작업을 확인해주세요",
    })
    .describe("모든 미완료 작업 삭제 확인 (이 작업은 되돌릴 수 없습니다)"),
});

export async function clearAllTasks({
  confirm,
}: z.infer<typeof clearAllTasksSchema>) {
  // 안전 검사: 확인이 없으면 작업 거부
  if (!confirm) {
    return {
      content: [
        {
          type: "text" as const,
          text: await getClearAllTasksPrompt({ confirm: false }),
        },
      ],
    };
  }

  // 정말 삭제할 작업이 있는지 확인
  const allTasks = await getAllTasks();
  if (allTasks.length === 0) {
    return {
      content: [
        {
          type: "text" as const,
          text: await getClearAllTasksPrompt({ isEmpty: true }),
        },
      ],
    };
  }

  // 삭제 작업 실행
  const result = await modelClearAllTasks();

  return {
    content: [
      {
        type: "text" as const,
        text: await getClearAllTasksPrompt({
          success: result.success,
          message: result.message,
          backupFile: result.backupFile,
        }),
      },
    ],
    isError: !result.success,
  };
}
