/**
 * queryTask 프롬프트 생성기
 * 템플릿과 매개변수를 결합하여 최종 프롬프트를 생성하는 역할을 합니다.
 */

import {
  loadPrompt,
  generatePrompt,
  loadPromptFromTemplate,
} from "../loader.js";
import { Task } from "../../types/index.js";

/**
 * queryTask 프롬프트 매개변수 인터페이스
 */
export interface QueryTaskPromptParams {
  query: string;
  isId: boolean;
  tasks: Task[];
  totalTasks: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * queryTask의 전체 프롬프트를 가져옵니다.
 * @param params 프롬프트 매개변수
 * @returns 생성된 프롬프트
 */
export async function getQueryTaskPrompt(
  params: QueryTaskPromptParams
): Promise<string> {
  const { query, isId, tasks, totalTasks, page, pageSize, totalPages } = params;

  if (tasks.length === 0) {
    const notFoundTemplate = await loadPromptFromTemplate(
      "queryTask/notFound.md"
    );
    return generatePrompt(notFoundTemplate, {
      query,
    });
  }

  const taskDetailsTemplate = await loadPromptFromTemplate(
    "queryTask/taskDetails.md"
  );
  let tasksContent = "";
  for (const task of tasks) {
    tasksContent += generatePrompt(taskDetailsTemplate, {
      taskId: task.id,
      taskName: task.name,
      taskStatus: task.status,
      taskDescription:
        task.description.length > 100
          ? `${task.description.substring(0, 100)}...`
          : task.description,
      createdAt: new Date(task.createdAt).toLocaleString(),
    });
  }

  const indexTemplate = await loadPromptFromTemplate("queryTask/index.md");
  const prompt = generatePrompt(indexTemplate, {
    tasksContent,
    page,
    totalPages,
    pageSize,
    totalTasks,
    query,
  });

  // 가능한 사용자 정의 프롬프트 로드
  return loadPrompt(prompt, "QUERY_TASK");
}
