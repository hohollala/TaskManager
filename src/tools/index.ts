// 모든 작업 도구 내보내기
export * from "./task/index.js";

// 모든 프로젝트 도구 내보내기
export * from "./project/index.js";

// 모든 사고 과정 도구 내보내기
export * from "./thought/index.js";

// 모든 연구 도구 내보내기
export * from "./research/index.js";

// 새 프로젝트 도구 내보내기
export * from "./newProject.js";

// MCP 설치 도구 내보내기
export * from "./installMCP.js";

// MCP 제거 도구 내보내기
export * from "./removeMCP.js";

// URL 조회 도구 내보내기
export * from "./getUrl.js";

import { generateGeminiTOMLFiles } from "../utils/commandGenerator.js";
import { z } from "zod";

// stm-g 도구 추가
const stmGSchema = z.object({
  method: z.literal("stm-g")
});

async function handleStmG() {
  try {
    await generateGeminiTOMLFiles();
    return {
      type: "text",
      text: "✅ Gemini TOML 파일 생성이 완료되었습니다."
    };
  } catch (error) {
    return {
      type: "text", 
      text: `❌ Gemini TOML 파일 생성 중 오류가 발생했습니다: ${error}`
    };
  }
}

export {
  stmGSchema,
  handleStmG,
};
