import { z } from "zod";
import { UUID_V4_REGEX } from "../../utils/regex.js";
import {
  getTaskById,
  deleteTask as modelDeleteTask,
} from "../../models/taskModel.js";
import { TaskStatus } from "../../types/index.js";
import { getDeleteTaskPrompt } from "../../prompts/index.js";

// 작업 삭제 도구
export const deleteTaskSchema = z.object({
  taskId: z
    .string()
    .regex(UUID_V4_REGEX, {
      message: "작업 ID 형식이 유효하지 않습니다. 유효한 UUID v4 형식을 제공해주세요",
    })
    .describe("삭제할 작업의 고유 식별자로, 시스템에 존재하고 미완료인 작업 ID여야 합니다"),
});

export async function deleteTask({ taskId }: z.infer<typeof deleteTaskSchema>) {
  const task = await getTaskById(taskId);

  if (!task) {
    return {
      content: [
        {
          type: "text" as const,
          text: await getDeleteTaskPrompt({ taskId }),
        },
      ],
      isError: true,
    };
  }

  if (task.status === TaskStatus.COMPLETED) {
    return {
      content: [
        {
          type: "text" as const,
          text: await getDeleteTaskPrompt({
            taskId,
            task,
            isTaskCompleted: true,
          }),
        },
      ],
      isError: true,
    };
  }

  const result = await modelDeleteTask(taskId);

  return {
    content: [
      {
        type: "text" as const,
        text: await getDeleteTaskPrompt({
          taskId,
          task,
          success: result.success,
          message: result.message,
        }),
      },
    ],
    isError: !result.success,
  };
}
