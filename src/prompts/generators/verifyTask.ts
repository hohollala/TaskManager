/**
 * verifyTask 프롬프트 생성기
 * 템플릿과 매개변수를 결합하여 최종 프롬프트를 생성하는 역할을 합니다.
 */

import {
  loadPrompt,
  generatePrompt,
  loadPromptFromTemplate,
} from "../loader.js";
import { Task } from "../../types/index.js";

/**
 * verifyTask 프롬프트 매개변수 인터페이스
 */
export interface VerifyTaskPromptParams {
  task: Task;
  score: number;
  summary: string;
}

/**
 * 요약 내용 추출
 * @param content 원본 내용
 * @param maxLength 최대 길이
 * @returns 추출된 요약
 */
function extractSummary(
  content: string | undefined,
  maxLength: number
): string {
  if (!content) return "";

  if (content.length <= maxLength) {
    return content;
  }

  // 간단한 요약 추출: maxLength 문자열을 자르고 생략 부호 추가
  return content.substring(0, maxLength) + "...";
}

/**
 * verifyTask의 전체 프롬프트를 가져옵니다.
 * @param params 프롬프트 매개변수
 * @returns 생성된 프롬프트
 */
export async function getVerifyTaskPrompt(
  params: VerifyTaskPromptParams
): Promise<string> {
  const { task, score, summary } = params;
  if (score < 80) {
    const noPassTemplate = await loadPromptFromTemplate("verifyTask/noPass.md");
    const prompt = generatePrompt(noPassTemplate, {
      name: task.name,
      id: task.id,
      summary,
    });
    return prompt;
  }
  const indexTemplate = await loadPromptFromTemplate("verifyTask/index.md");
  const prompt = generatePrompt(indexTemplate, {
    name: task.name,
    id: task.id,
    description: task.description,
    notes: task.notes || "메모 없음",
    verificationCriteria:
      task.verificationCriteria || "검증 기준 없음",
    implementationGuideSummary:
      extractSummary(task.implementationGuide, 200) ||
      "구현 가이드 없음",
    analysisResult:
      extractSummary(task.analysisResult, 300) || "분석 결과 없음",
  });

  // 가능한 사용자 정의 프롬프트 로드
  return loadPrompt(prompt, "VERIFY_TASK");
}
