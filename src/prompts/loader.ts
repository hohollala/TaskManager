/**
 * 환경 변수와 사용자 정의 prompt 로더
 * 
 * 이 모듈은 환경 변수에서 사용자 정의 prompt를 로드하는 기능을 제공하며, 두 가지 모드를 지원합니다:
 * 1. 대체 모드: MCP_PROMPT_{KEY}를 사용하여 원본 prompt를 완전히 대체
 * 2. 추가 모드: MCP_PROMPT_{KEY}_APPEND를 사용하여 원본 prompt 뒤에 내용 추가
 * 
 * 사용 예시:
 * - 대체 모드: MCP_PROMPT_PLAN_TASK="Your custom planning prompt"
 * - 추가 모드: MCP_PROMPT_PLAN_TASK_APPEND="Additional instructions"
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getProjectRoot } from "../utils/paths.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 환경 변수 문자열 처리, 기본 이스케이프 지원
 * @param input 환경 변수 문자열
 * @returns 처리된 문자열
 */
function processEnvString(input: string | undefined): string {
  if (!input) return "";
  return input.replace(/\\n/g, "\n").replace(/\\t/g, "\t");
}

/**
 * prompt 로드, 환경 변수 사용자 정의 지원
 * @param basePrompt 기본 prompt 내용
 * @param promptKey prompt의 키 이름, 환경 변수 이름 생성에 사용
 * @returns 최종 prompt 내용
 */
export function loadPrompt(basePrompt: string, promptKey: string): string {
  // 대문자로 변환하여 환경 변수의 일부로 사용
  const envKey = promptKey.toUpperCase();

  // 대체 모드 환경 변수가 있는지 확인
  const overrideEnvVar = `MCP_PROMPT_${envKey}`;
  if (process.env[overrideEnvVar]) {
    // 환경 변수를 사용하여 원본 prompt 완전 대체
    return processEnvString(process.env[overrideEnvVar]);
  }

  // 추가 모드 환경 변수가 있는지 확인
  const appendEnvVar = `MCP_PROMPT_${envKey}_APPEND`;
  if (process.env[appendEnvVar]) {
    // 환경 변수 내용을 원본 prompt 뒤에 추가
    return `${basePrompt}\n\n${processEnvString(process.env[appendEnvVar])}`;
  }

  // 사용자 정의가 없으면 원본 prompt 사용
  return basePrompt;
}

/**
 * 동적 매개변수가 포함된 prompt 생성
 * @param promptTemplate prompt 템플릿
 * @param params 동적 매개변수
 * @returns 매개변수가 채워진 prompt
 */
export function generatePrompt(
  promptTemplate: string,
  params: Record<string, any> = {}
): string {
  // 간단한 템플릿 대체 방법을 사용하여 {paramName}을 해당 매개변수 값으로 대체
  let result = promptTemplate;

  Object.entries(params).forEach(([key, value]) => {
    // 값이 undefined 또는 null이면 빈 문자열로 대체
    const replacementValue =
      value !== undefined && value !== null ? String(value) : "";

    // 정규식을 사용하여 모든 일치하는 자리 표시자 대체
    const placeholder = new RegExp(`\\{${key}\\}`, "g");
    result = result.replace(placeholder, replacementValue);
  });

  return result;
}

/**
 * 템플릿에서 prompt 로드
 * @param templatePath 템플릿 세트 루트 디렉토리 기준의 템플릿 경로 (예: 'chat/basic.md')
 * @returns 템플릿 내용
 * @throws Error 템플릿 파일을 찾을 수 없는 경우
 */
export async function loadPromptFromTemplate(
  templatePath: string
): Promise<string> {
  const templateSetName = process.env.TEMPLATES_USE || "ko";
  const builtInTemplatesBaseDir = __dirname;

  let finalPath = "";
  const checkedPaths: string[] = []; // 더 자세한 오류 보고를 위해

  // 1. 사용자 정의 경로 확인 (docs 폴더 사용)
  const customFilePath = path.resolve(getProjectRoot(), "docs", templateSetName, templatePath);
  checkedPaths.push(`Custom: ${customFilePath}`);
  if (fs.existsSync(customFilePath)) {
    finalPath = customFilePath;
  }

  // 2. 사용자 정의 경로를 찾지 못한 경우 특정 내장 템플릿 디렉토리 확인
  if (!finalPath) {
    // templateSetName이 내장 템플릿의 경우 'en', 'zh' 등이라고 가정
    const specificBuiltInFilePath = path.join(
      builtInTemplatesBaseDir,
      `templates_${templateSetName}`,
      templatePath
    );
    checkedPaths.push(`Specific Built-in: ${specificBuiltInFilePath}`);
    if (fs.existsSync(specificBuiltInFilePath)) {
      finalPath = specificBuiltInFilePath;
    }
  }

  // 3. 특정 내장 템플릿도 찾지 못하고 'en'이 아닌 경우 (중복 확인 방지)
  if (!finalPath && templateSetName !== "en") {
    const defaultBuiltInFilePath = path.join(
      builtInTemplatesBaseDir,
      "templates_en",
      templatePath
    );
    checkedPaths.push(`Default Built-in ('en'): ${defaultBuiltInFilePath}`);
    if (fs.existsSync(defaultBuiltInFilePath)) {
      finalPath = defaultBuiltInFilePath;
    }
  }

  // 4. 모든 경로를 확인했지만 파일을 찾지 못한 경우
  if (!finalPath) {
    const errorMessage = `템플릿 파일을 찾을 수 없습니다: ${templatePath}\n확인된 경로:\n${checkedPaths.join("\n")}`;
    throw new Error(errorMessage);
  }

  // 파일 읽기 및 반환
  try {
    const content = await fs.promises.readFile(finalPath, "utf-8");
    return content;
  } catch (error) {
    throw new Error(`템플릿 파일 읽기 실패: ${finalPath} - ${error}`);
  }
}
