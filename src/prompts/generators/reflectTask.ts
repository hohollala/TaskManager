/**
 * reflectTask 프롬프트 생성기
 * 템플릿과 매개변수를 결합하여 최종 프롬프트를 생성하는 역할을 합니다.
 */

import {
  loadPrompt,
  generatePrompt,
  loadPromptFromTemplate,
} from "../loader.js";

/**
 * reflectTask 프롬프트 매개변수 인터페이스
 */
export interface ReflectTaskPromptParams {
  summary: string;
  analysis: string;
}

/**
 * reflectTask의 전체 프롬프트를 가져옵니다.
 * @param params 프롬프트 매개변수
 * @returns 생성된 프롬프트
 */
export async function getReflectTaskPrompt(
  params: ReflectTaskPromptParams
): Promise<string> {
  const indexTemplate = await loadPromptFromTemplate("reflectTask/index.md");
  const prompt = generatePrompt(indexTemplate, {
    summary: params.summary,
    analysis: params.analysis,
  });

  // 가능한 사용자 정의 프롬프트 로드
  return loadPrompt(prompt, "REFLECT_TASK");
}
