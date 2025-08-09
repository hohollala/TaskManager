import { z } from "zod";
import { UUID_V4_REGEX } from "../../utils/regex.js";
import {
  getTaskById,
  updateTaskStatus,
  updateTaskSummary,
} from "../../models/taskModel.js";
import { TaskStatus } from "../../types/index.js";
import { getVerifyTaskPrompt } from "../../prompts/index.js";

// 작업 검증 도구
export const verifyTaskSchema = z.object({
  taskId: z
    .string()
    .regex(UUID_V4_REGEX, {
      message: "작업 ID 형식이 유효하지 않습니다. 유효한 UUID v4 형식을 제공해주세요",
    })
    .describe("검증할 작업의 고유 식별자로, 시스템에 존재하는 유효한 작업 ID여야 합니다"),
  summary: z
    .string()
    .min(30, {
      message: "최소 30자 이상",
    })
    .describe(
      "점수가 80점 이상일 때는 작업 완료 요약으로, 간결하게 구현 결과와 중요 결정사항을 설명하고, 점수가 80점 미만일 때는 누락되거나 수정이 필요한 부분을 설명하며, 최소 30자 이상"
    ),
  score: z
    .number()
    .min(0, { message: "점수는 0보다 작을 수 없습니다" })
    .max(100, { message: "점수는 100보다 클 수 없습니다" })
    .describe("작업에 대한 평가 점수로, 80점 이상일 때 자동으로 작업이 완료됩니다"),
});

export async function verifyTask({
  taskId,
  summary,
  score,
}: z.infer<typeof verifyTaskSchema>) {
  const task = await getTaskById(taskId);

  if (!task) {
    return {
      content: [
        {
          type: "text" as const,
          text: `## 시스템 오류\n\nID가 \`${taskId}\`인 작업을 찾을 수 없습니다. 'list_tasks' 도구를 사용하여 유효한 작업 ID를 확인한 후 다시 시도해주세요.`,
        },
      ],
      isError: true,
    };
  }

  if (task.status !== TaskStatus.IN_PROGRESS) {
    return {
      content: [
        {
          type: "text" as const,
          text: `## 상태 오류\n\n작업 "${task.name}" (ID: \`${task.id}\`)의 현재 상태가 "${task.status}"로, 진행 중 상태가 아니어서 검증할 수 없습니다.\n\n진행 중 상태의 작업만 검증할 수 있습니다. 먼저 'execute_task' 도구를 사용하여 작업 실행을 시작해주세요.`,
        },
      ],
      isError: true,
    };
  }

  if (score >= 80) {
    // 작업 상태를 완료로 업데이트하고 요약 추가
    await updateTaskSummary(taskId, summary);
    await updateTaskStatus(taskId, TaskStatus.COMPLETED);
    
    // TodoWrite 연동: 작업 완료 시 체크리스트 업데이트
    console.log(`✅ 작업 완료: ${task.name}`);
    console.log(`☑ ${task.name} (완료됨) - 점수: ${score}/100`);
  } else {
    // TodoWrite 연동: 작업 실패 시 체크리스트 업데이트
    console.log(`❌ 작업 검증 실패: ${task.name}`);
    console.log(`☐ ${task.name} (수정 필요) - 점수: ${score}/100`);
  }

  // prompt 생성기를 사용하여 최종 prompt 가져오기
  const prompt = await getVerifyTaskPrompt({ task, score, summary });

  return {
    content: [
      {
        type: "text" as const,
        text: prompt,
      },
    ],
  };
}
