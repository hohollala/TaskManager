/**
 * completeTask 프롬프트 생성기
 * 템플릿과 매개변수를 결합하여 최종 프롬프트를 생성하는 역할을 합니다.
 */

import {
  loadPrompt,
  generatePrompt,
  loadPromptFromTemplate,
} from "../loader.js";
import { Task } from "../../types/index.js";

/**
 * completeTask 프롬프트 매개변수 인터페이스
 */
export interface CompleteTaskPromptParams {
  task: Task;
  completionTime: string;
}

/**
 * completeTask의 전체 프롬프트를 가져옵니다.
 * @param params 프롬프트 매개변수
 * @returns 생성된 프롬프트
 */
export async function getCompleteTaskPrompt(
  params: CompleteTaskPromptParams
): Promise<string> {
  const { task, completionTime } = params;

  const indexTemplate = await loadPromptFromTemplate("completeTask/index.md");

  // 기본 프롬프트 빌드 시작
  let prompt = generatePrompt(indexTemplate, {
    name: task.name,
    id: task.id,
    completionTime: completionTime,
  });

  // 가능한 사용자 정의 프롬프트 로드
  return loadPrompt(prompt, "COMPLETE_TASK");
}
