import { z } from "zod";
import { getInitProjectRulesPrompt } from "../../prompts/index.js";

// 스키마 정의
export const initProjectRulesSchema = z.object({});

/**
 * 프로젝트 규칙 초기화 도구 함수
 * 규칙 문서 생성 가이드 제공
 */
export async function initProjectRules() {
  try {
    // 생성기에서 프롬프트 가져오기
    const promptContent = await getInitProjectRulesPrompt();

    // 성공 응답 반환
    return {
      content: [
        {
          type: "text" as const,
          text: promptContent,
        },
      ],
    };
  } catch (error) {
    // 오류 처리
    const errorMessage = error instanceof Error ? error.message : "알 수 없는 오류";
    return {
      content: [
        {
          type: "text" as const,
          text: `프로젝트 규칙 초기화 중 오류 발생: ${errorMessage}`,
        },
      ],
    };
  }
}
