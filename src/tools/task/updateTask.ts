import { z } from "zod";
import { UUID_V4_REGEX } from "../../utils/regex.js";
import {
  getTaskById,
  updateTaskContent as modelUpdateTaskContent,
} from "../../models/taskModel.js";
import { RelatedFileType } from "../../types/index.js";
import { getUpdateTaskContentPrompt } from "../../prompts/index.js";

// 작업 내용 업데이트 도구
export const updateTaskContentSchema = z.object({
  taskId: z
    .string()
    .regex(UUID_V4_REGEX, {
      message: "작업 ID 형식이 유효하지 않습니다. 유효한 UUID v4 형식을 제공해주세요",
    })
    .describe("업데이트할 작업의 고유 식별자로, 시스템에 존재하고 미완료인 작업 ID여야 합니다"),
  name: z.string().optional().describe("작업의 새 이름 (선택사항)"),
  description: z.string().optional().describe("작업의 새 설명 내용 (선택사항)"),
  notes: z.string().optional().describe("작업의 새 추가 설명 (선택사항)"),
  dependencies: z
    .array(z.string())
    .optional()
    .describe("작업의 새 의존 관계 (선택사항)"),
  relatedFiles: z
    .array(
      z.object({
        path: z
          .string()
          .min(1, { message: "파일 경로가 비어있습니다. 유효한 파일 경로를 제공해주세요" })
          .describe("파일 경로로, 프로젝트 루트 디렉토리 기준 상대 경로 또는 절대 경로"),
        type: z
          .nativeEnum(RelatedFileType)
          .describe(
            "파일과 작업의 관계 유형 (TO_MODIFY, REFERENCE, CREATE, DEPENDENCY, OTHER)"
          ),
        description: z.string().optional().describe("파일의 추가 설명 (선택사항)"),
        lineStart: z
          .number()
          .int()
          .positive()
          .optional()
          .describe("관련 코드 블록의 시작 줄 (선택사항)"),
        lineEnd: z
          .number()
          .int()
          .positive()
          .optional()
          .describe("관련 코드 블록의 끝 줄 (선택사항)"),
      })
    )
    .optional()
    .describe(
      "작업과 관련된 파일 목록으로, 작업과 관련된 코드 파일, 참조 자료, 생성할 파일 등을 기록하는 데 사용 (선택사항)"
    ),
  implementationGuide: z
    .string()
    .optional()
    .describe("작업의 새 구현 가이드 (선택사항)"),
  verificationCriteria: z
    .string()
    .optional()
    .describe("작업의 새 검증 기준 (선택사항)"),
});

export async function updateTaskContent({
  taskId,
  name,
  description,
  notes,
  relatedFiles,
  dependencies,
  implementationGuide,
  verificationCriteria,
}: z.infer<typeof updateTaskContentSchema>) {
  if (relatedFiles) {
    for (const file of relatedFiles) {
      if (
        (file.lineStart && !file.lineEnd) ||
        (!file.lineStart && file.lineEnd) ||
        (file.lineStart && file.lineEnd && file.lineStart > file.lineEnd)
      ) {
        return {
          content: [
            {
              type: "text" as const,
              text: await getUpdateTaskContentPrompt({
                taskId,
                validationError:
                  "줄 번호 설정이 유효하지 않습니다: 시작 줄과 끝 줄을 동시에 설정해야 하며, 시작 줄은 끝 줄보다 작아야 합니다",
              }),
            },
          ],
        };
      }
    }
  }

  if (
    !(
      name ||
      description ||
      notes ||
      dependencies ||
      implementationGuide ||
      verificationCriteria ||
      relatedFiles
    )
  ) {
    return {
      content: [
        {
          type: "text" as const,
          text: await getUpdateTaskContentPrompt({
            taskId,
            emptyUpdate: true,
          }),
        },
      ],
    };
  }

  // 작업이 존재하는지 확인하기 위해 작업 가져오기
  const task = await getTaskById(taskId);

  if (!task) {
    return {
      content: [
        {
          type: "text" as const,
          text: await getUpdateTaskContentPrompt({
            taskId,
          }),
        },
      ],
      isError: true,
    };
  }

  // 업데이트할 작업과 내용 기록
  let updateSummary = `작업 업데이트 준비: ${task.name} (ID: ${task.id})`;
  if (name) updateSummary += `, 새 이름: ${name}`;
  if (description) updateSummary += `, 설명 업데이트`;
  if (notes) updateSummary += `, 메모 업데이트`;
  if (relatedFiles)
    updateSummary += `, 관련 파일 업데이트 (${relatedFiles.length}개)`;
  if (dependencies)
    updateSummary += `, 의존 관계 업데이트 (${dependencies.length}개)`;
  if (implementationGuide) updateSummary += `, 구현 가이드 업데이트`;
  if (verificationCriteria) updateSummary += `, 검증 기준 업데이트`;

  // 업데이트 작업 실행
  const result = await modelUpdateTaskContent(taskId, {
    name,
    description,
    notes,
    relatedFiles,
    dependencies,
    implementationGuide,
    verificationCriteria,
  });

  return {
    content: [
      {
        type: "text" as const,
        text: await getUpdateTaskContentPrompt({
          taskId,
          task,
          success: result.success,
          message: result.message,
          updatedTask: result.task,
        }),
      },
    ],
    isError: !result.success,
  };
}
