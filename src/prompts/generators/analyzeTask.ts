/**
 * analyzeTask 프롬프트 생성기
 * 템플릿과 매개변수를 결합하여 최종 프롬프트를 생성하는 역할을 합니다.
 */

import {
  loadPrompt,
  generatePrompt,
  loadPromptFromTemplate,
} from "../loader.js";

/**
 * analyzeTask 프롬프트 매개변수 인터페이스
 */
export interface AnalyzeTaskPromptParams {
  summary: string;
  initialConcept: string;
  previousAnalysis?: string;
}

/**
 * analyzeTask의 전체 프롬프트를 가져옵니다.
 * @param params 프롬프트 매개변수
 * @returns 생성된 프롬프트
 */
export async function getAnalyzeTaskPrompt(
  params: AnalyzeTaskPromptParams
): Promise<string> {
  const indexTemplate = await loadPromptFromTemplate("analyzeTask/index.md");

  const iterationTemplate = await loadPromptFromTemplate(
    "analyzeTask/iteration.md"
  );

  let iterationPrompt = "";
  if (params.previousAnalysis) {
    iterationPrompt = generatePrompt(iterationTemplate, {
      previousAnalysis: params.previousAnalysis,
    });
  }

  let prompt = generatePrompt(indexTemplate, {
    summary: params.summary,
    initialConcept: params.initialConcept,
    iterationPrompt: iterationPrompt,
  });

  // 가능한 사용자 정의 프롬프트 로드
  return loadPrompt(prompt, "ANALYZE_TASK");
}
