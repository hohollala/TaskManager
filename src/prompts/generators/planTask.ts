/**
 * planTask 프롬프트 생성기
 * 템플릿과 매개변수를 결합하여 최종 프롬프트를 생성하는 역할을 합니다.
 */

import {
  loadPrompt,
  generatePrompt,
  loadPromptFromTemplate,
} from "../loader.js";
import { Task, TaskDependency } from "../../types/index.js";

/**
 * planTask 프롬프트 매개변수 인터페이스
 */
export interface PlanTaskPromptParams {
  description: string;
  requirements?: string;
  existingTasksReference?: boolean;
  completedTasks?: Task[];
  pendingTasks?: Task[];
  memoryDir: string;
}

/**
 * planTask의 전체 프롬프트를 가져옵니다.
 * @param params 프롬프트 매개변수
 * @returns 생성된 프롬프트
 */
export async function getPlanTaskPrompt(
  params: PlanTaskPromptParams
): Promise<string> {
  let tasksContent = "";
  if (
    params.existingTasksReference &&
    params.completedTasks &&
    params.pendingTasks
  ) {
    const allTasks = [...params.completedTasks, ...params.pendingTasks];
    // 작업이 존재하면 관련 정보 추가
    if (allTasks.length > 0) {
      let completeTasksContent = "완료된 작업 없음";

      // 완료된 작업 처리
      if (params.completedTasks.length > 0) {
        completeTasksContent = "";
        // 프롬프트가 너무 길어지는 것을 방지하기 위해 최대 10개의 완료된 작업만 표시
        const tasksToShow =
          params.completedTasks.length > 10
            ? params.completedTasks.slice(0, 10)
            : params.completedTasks;

        tasksToShow.forEach((task, index) => {
          // 완료 시간 정보 생성 (있는 경우)
          const completedTimeText = task.completedAt
            ? `   - completedAt：${task.completedAt.toLocaleString()}\n`
            : "";

          completeTasksContent += `{index}. **${task.name}** (ID: \`${
            task.id
          }\`)\n   - description：${
            task.description.length > 100
              ? task.description.substring(0, 100) + "..."
              : task.description
          }\n${completedTimeText}`;
          // 마지막 작업이 아니면 줄 바꿈 추가
          if (index < tasksToShow.length - 1) {
            completeTasksContent += "\n\n";
          }
        });

        // 더 많은 작업이 있으면 힌트 표시
        if (params.completedTasks.length > 10) {
          completeTasksContent += `\n\n*（앞의 10개만 표시, 총 ${params.completedTasks.length}개）*\n`;
        }
      }

      let unfinishedTasksContent = "대기 중인 작업 없음";
      // 미완료 작업 처리
      if (params.pendingTasks && params.pendingTasks.length > 0) {
        unfinishedTasksContent = "";

        params.pendingTasks.forEach((task, index) => {
          const dependenciesText =
            task.dependencies && task.dependencies.length > 0
              ? `   - dependence：${task.dependencies
                  .map((dep: TaskDependency) => `\`${dep.taskId}\``)
                  .join(", ")}\n`
              : "";

          unfinishedTasksContent += `${index + 1}. **${task.name}** (ID: \`${
            task.id
          }\`)\n   - description：${
            task.description.length > 150
              ? task.description.substring(0, 150) + "..."
              : task.description
          }\n   - status：${task.status}\n${dependenciesText}`;

          // 마지막 작업이 아니면 줄 바꿈 추가
          if (index < (params.pendingTasks?.length ?? 0) - 1) {
            unfinishedTasksContent += "\n\n";
          }
        });
      }

      const tasksTemplate = await loadPromptFromTemplate("planTask/tasks.md");
      tasksContent = generatePrompt(tasksTemplate, {
        completedTasks: completeTasksContent,
        unfinishedTasks: unfinishedTasksContent,
      });
    }
  }

  let thoughtTemplate = "";
  if (process.env.ENABLE_THOUGHT_CHAIN !== "false") {
    thoughtTemplate = await loadPromptFromTemplate("planTask/hasThought.md");
  } else {
    thoughtTemplate = await loadPromptFromTemplate("planTask/noThought.md");
  }
  const indexTemplate = await loadPromptFromTemplate("planTask/index.md");
  let prompt = generatePrompt(indexTemplate, {
    description: params.description,
    requirements: params.requirements || "요구 사항 없음",
    tasksTemplate: tasksContent,
    rulesPath: "shrimp-rules.md",
    memoryDir: params.memoryDir,
    thoughtTemplate: thoughtTemplate,
  });

  // 가능한 사용자 정의 프롬프트 로드
  return loadPrompt(prompt, "PLAN_TASK");
}
