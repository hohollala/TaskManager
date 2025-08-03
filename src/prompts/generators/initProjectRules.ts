/**
 * initProjectRules 프롬프트 생성기
 * 템플릿과 매개변수를 결합하여 최종 프롬프트를 생성하는 역할을 합니다.
 */

import { loadPrompt, loadPromptFromTemplate } from "../loader.js";
/**
 * initProjectRules 프롬프트 매개변수 인터페이스
 */
export interface InitProjectRulesPromptParams {
  // 현재 추가 매개변수 없음, 필요에 따라 확장 가능
}

/**
 * initProjectRules의 전체 프롬프트를 가져옵니다.
 * @param params 프롬프트 매개변수 (선택 사항)
 * @returns 생성된 프롬프트
 */
export async function getInitProjectRulesPrompt(
  params?: InitProjectRulesPromptParams
): Promise<string> {
  const indexTemplate = await loadPromptFromTemplate(
    "initProjectRules/index.md"
  );

  // 가능한 사용자 정의 프롬프트 로드 (환경 변수를 통해 덮어쓰거나 추가)
  return loadPrompt(indexTemplate, "INIT_PROJECT_RULES");
}
