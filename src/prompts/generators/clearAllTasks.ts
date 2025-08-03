/**
 * clearAllTasks 프롬프트 생성기
 * 템플릿과 매개변수를 결합하여 최종 프롬프트를 생성하는 역할을 합니다.
 */

import {
  loadPrompt,
  generatePrompt,
  loadPromptFromTemplate,
} from "../loader.js";

/**
 * clearAllTasks 프롬프트 매개변수 인터페이스
 */
export interface ClearAllTasksPromptParams {
  confirm?: boolean;
  success?: boolean;
  message?: string;
  backupFile?: string;
  isEmpty?: boolean;
}

/**
 * clearAllTasks의 전체 프롬프트를 가져옵니다.
 * @param params 프롬프트 매개변수
 * @returns 생성된 프롬프트
 */
export async function getClearAllTasksPrompt(
  params: ClearAllTasksPromptParams
): Promise<string> {
  const { confirm, success, message, backupFile, isEmpty } = params;

  // 확인되지 않은 경우 처리
  if (confirm === false) {
    const cancelTemplate = await loadPromptFromTemplate(
      "clearAllTasks/cancel.md"
    );
    return generatePrompt(cancelTemplate, {});
  }

  // 지울 작업이 없는 경우 처리
  if (isEmpty) {
    const emptyTemplate = await loadPromptFromTemplate(
      "clearAllTasks/empty.md"
    );
    return generatePrompt(emptyTemplate, {});
  }

  // 지우기 성공 또는 실패의 경우 처리
  const responseTitle = success ? "Success" : "Failure";

  // 템플릿을 사용하여 backupInfo 생성
  const backupInfo = backupFile
    ? generatePrompt(
        await loadPromptFromTemplate("clearAllTasks/backupInfo.md"),
        {
          backupFile,
        }
      )
    : "";

  const indexTemplate = await loadPromptFromTemplate("clearAllTasks/index.md");
  const prompt = generatePrompt(indexTemplate, {
    responseTitle,
    message,
    backupInfo,
  });

  // 가능한 사용자 정의 프롬프트 로드
  return loadPrompt(prompt, "CLEAR_ALL_TASKS");
}
