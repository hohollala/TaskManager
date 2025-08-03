/**
 * deleteTask 프롬프트 생성기
 * 템플릿과 매개변수를 결합하여 최종 프롬프트를 생성하는 역할을 합니다.
 */

import {
  loadPrompt,
  generatePrompt,
  loadPromptFromTemplate,
} from "../loader.js";
import { Task } from "../../types/index.js";

/**
 * deleteTask 프롬프트 매개변수 인터페이스
 */
export interface DeleteTaskPromptParams {
  taskId: string;
  task?: Task;
  success?: boolean;
  message?: string;
  isTaskCompleted?: boolean;
}

/**
 * deleteTask의 전체 프롬프트를 가져옵니다.
 * @param params 프롬프트 매개변수
 * @returns 생성된 프롬프트
 */
export async function getDeleteTaskPrompt(
  params: DeleteTaskPromptParams
): Promise<string> {
  const { taskId, task, success, message, isTaskCompleted } = params;

  // 작업이 존재하지 않는 경우 처리
  if (!task) {
    const notFoundTemplate = await loadPromptFromTemplate(
      "deleteTask/notFound.md"
    );
    return generatePrompt(notFoundTemplate, {
      taskId,
    });
  }

  // 작업이 이미 완료된 경우 처리
  if (isTaskCompleted) {
    const completedTemplate = await loadPromptFromTemplate(
      "deleteTask/completed.md"
    );
    return generatePrompt(completedTemplate, {
      taskId: task.id,
      taskName: task.name,
    });
  }

  // 삭제 성공 또는 실패의 경우 처리
  const responseTitle = success ? "Success" : "Failure";
  const indexTemplate = await loadPromptFromTemplate("deleteTask/index.md");
  const prompt = generatePrompt(indexTemplate, {
    responseTitle,
    message,
  });

  // 가능한 사용자 정의 프롬프트 로드
  return loadPrompt(prompt, "DELETE_TASK");
}
