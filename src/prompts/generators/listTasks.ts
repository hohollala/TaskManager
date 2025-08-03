/**
 * listTasks 프롬프트 생성기
 * 템플릿과 매개변수를 결합하여 최종 프롬프트를 생성하는 역할을 합니다.
 */

import {
  loadPrompt,
  generatePrompt,
  loadPromptFromTemplate,
} from "../loader.js";
import { Task, TaskStatus } from "../../types/index.js";

/**
 * listTasks 프롬프트 매개변수 인터페이스
 */
export interface ListTasksPromptParams {
  status: string;
  tasks: Record<string, Task[]>;
  allTasks: Task[];
}

/**
 * listTasks의 전체 프롬프트를 가져옵니다.
 * @param params 프롬프트 매개변수
 * @returns 생성된 프롬프트
 */
export async function getListTasksPrompt(
  params: ListTasksPromptParams
): Promise<string> {
  const { status, tasks, allTasks } = params;

  // 작업이 없으면 알림 표시
  if (allTasks.length === 0) {
    const notFoundTemplate = await loadPromptFromTemplate(
      "listTasks/notFound.md"
    );
    const statusText = status === "all" ? "어떤" : `${status} 상태의`;
    return generatePrompt(notFoundTemplate, {
      statusText: statusText,
    });
  }

  // 모든 상태의 개수 가져오기
  const statusCounts = Object.values(TaskStatus)
    .map((statusType) => {
      const count = tasks[statusType]?.length || 0;
      return `- **${statusType}**: ${count} 개 작업`;
    })
    .join("\n");

  let filterStatus = "all";
  switch (status) {
    case "pending":
      filterStatus = TaskStatus.PENDING;
      break;
    case "in_progress":
      filterStatus = TaskStatus.IN_PROGRESS;
      break;
    case "completed":
      filterStatus = TaskStatus.COMPLETED;
      break;
  }

  let taskDetails = "";
  let taskDetailsTemplate = await loadPromptFromTemplate(
    "listTasks/taskDetails.md"
  );
  // 각 상태별 상세 작업 추가
  for (const statusType of Object.values(TaskStatus)) {
    const tasksWithStatus = tasks[statusType] || [];
    if (
      tasksWithStatus.length > 0 &&
      (filterStatus === "all" || filterStatus === statusType)
    ) {
      for (const task of tasksWithStatus) {
        let dependencies = "의존성 없음";
        if (task.dependencies && task.dependencies.length > 0) {
          dependencies = task.dependencies
            .map((d) => `\`${d.taskId}\``)
            .join(", ");
        }
        taskDetails += generatePrompt(taskDetailsTemplate, {
          name: task.name,
          id: task.id,
          description: task.description,
          createAt: task.createdAt,
          complatedSummary:
            (task.summary || "").substring(0, 100) +
            ((task.summary || "").length > 100 ? "..." : ""),
          dependencies: dependencies,
          complatedAt: task.completedAt,
        });
      }
    }
  }

  const indexTemplate = await loadPromptFromTemplate("listTasks/index.md");
  let prompt = generatePrompt(indexTemplate, {
    statusCount: statusCounts,
    taskDetailsTemplate: taskDetails,
  });

  // 가능한 사용자 정의 프롬프트 로드
  return loadPrompt(prompt, "LIST_TASKS");
}
