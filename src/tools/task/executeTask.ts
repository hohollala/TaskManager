import { z } from "zod";
import { UUID_V4_REGEX } from "../../utils/regex.js";
import {
  getTaskById,
  updateTaskStatus,
  canExecuteTask,
  assessTaskComplexity,
} from "../../models/taskModel.js";
import { TaskStatus, Task } from "../../types/index.js";
import { getExecuteTaskPrompt } from "../../prompts/index.js";
import { loadTaskRelatedFiles } from "../../utils/fileLoader.js";

// 작업 실행 도구
export const executeTaskSchema = z.object({
  taskId: z
    .string()
    .regex(UUID_V4_REGEX, {
      message: "작업 ID 형식이 유효하지 않습니다. 유효한 UUID v4 형식을 제공해주세요",
    })
    .describe("실행할 작업의 고유 식별자, 시스템에 존재하는 유효한 작업 ID여야 함"),
});

export async function executeTask({
  taskId,
}: z.infer<typeof executeTaskSchema>) {
  try {
    // 작업이 존재하는지 확인
    const task = await getTaskById(taskId);
    if (!task) {
      return {
        content: [
          {
            type: "text" as const,
            text: `ID가 \`${taskId}\`인 작업을 찾을 수 없습니다. ID가 올바른지 확인해주세요.`,
          },
        ],
      };
    }

    // 작업이 실행 가능한지 확인 (의존성 작업이 모두 완료됨)
    const executionCheck = await canExecuteTask(taskId);
    if (!executionCheck.canExecute) {
      const blockedByTasksText =
        executionCheck.blockedBy && executionCheck.blockedBy.length > 0
          ? `다음 미완료 의존성 작업에 의해 차단됨: ${executionCheck.blockedBy.join(", ")}`
          : "차단 원인을 확인할 수 없음";

      return {
        content: [
          {
            type: "text" as const,
            text: `작업 "${task.name}" (ID: \`${taskId}\`)은 현재 실행할 수 없습니다.${blockedByTasksText}`,
          },
        ],
      };
    }

    // 작업이 이미 "진행 중"으로 표시된 경우 사용자에게 알림
    if (task.status === TaskStatus.IN_PROGRESS) {
      return {
        content: [
          {
            type: "text" as const,
            text: `작업 "${task.name}" (ID: \`${taskId}\`)은 이미 진행 중 상태입니다.`,
          },
        ],
      };
    }

    // 작업이 이미 "완료"로 표시된 경우 사용자에게 알림
    if (task.status === TaskStatus.COMPLETED) {
      return {
        content: [
          {
            type: "text" as const,
            text: `작업 "${task.name}" (ID: \`${taskId}\`)은 이미 완료로 표시되었습니다. 다시 실행하려면 먼저 delete_task를 사용하여 해당 작업을 삭제하고 다시 생성해주세요.`,
          },
        ],
      };
    }

    // 작업 상태를 "진행 중"으로 업데이트
    await updateTaskStatus(taskId, TaskStatus.IN_PROGRESS);

    // 작업 복잡도 평가
    const complexityResult = await assessTaskComplexity(taskId);

    // 복잡도 결과를 적절한 형식으로 변환
    const complexityAssessment = complexityResult
      ? {
          level: complexityResult.level,
          metrics: {
            descriptionLength: complexityResult.metrics.descriptionLength,
            dependenciesCount: complexityResult.metrics.dependenciesCount,
          },
          recommendations: complexityResult.recommendations,
        }
      : undefined;

    // 완료 요약 표시를 위한 의존성 작업 가져오기
    const dependencyTasks: Task[] = [];
    if (task.dependencies && task.dependencies.length > 0) {
      for (const dep of task.dependencies) {
        const depTask = await getTaskById(dep.taskId);
        if (depTask) {
          dependencyTasks.push(depTask);
        }
      }
    }

    // 작업 관련 파일 내용 로드
    let relatedFilesSummary = "";
    if (task.relatedFiles && task.relatedFiles.length > 0) {
      try {
        const relatedFilesResult = await loadTaskRelatedFiles(
          task.relatedFiles
        );
        relatedFilesSummary =
          typeof relatedFilesResult === "string"
            ? relatedFilesResult
            : relatedFilesResult.summary || "";
      } catch (error) {
        relatedFilesSummary =
          "Error loading related files, please check the files manually.";
      }
    }

    // prompt 생성기를 사용하여 최종 prompt 가져오기
    const prompt = await getExecuteTaskPrompt({
      task,
      complexityAssessment,
      relatedFilesSummary,
      dependencyTasks,
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
    return {
      content: [
        {
          type: "text" as const,
          text: `작업 실행 중 오류가 발생했습니다: ${
            error instanceof Error ? error.message : String(error)
          }`,
        },
      ],
    };
  }
}
