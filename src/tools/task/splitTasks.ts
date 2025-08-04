import { z } from "zod";
import {
  getAllTasks,
  batchCreateOrUpdateTasks,
  clearAllTasks as modelClearAllTasks,
} from "../../models/taskModel.js";
import { RelatedFileType, Task } from "../../types/index.js";
import { getSplitTasksPrompt } from "../../prompts/index.js";

// 작업 분할 도구
export const splitTasksSchema = z.object({
  updateMode: z
    .enum(["append", "overwrite", "selective", "clearAllTasks"])
    .describe(
      "작업 업데이트 모드 선택: 'append'(모든 기존 작업을 유지하고 새 작업 추가), 'overwrite'(모든 미완료 작업을 삭제하고 완전히 교체, 완료된 작업 유지), 'selective'(지능적 업데이트: 작업 이름에 따라 기존 작업을 매칭하여 업데이트, 목록에 없는 작업 유지, 작업 미세 조정에 권장), 'clearAllTasks'(모든 작업 삭제하고 백업 생성).\n기본값은 'clearAllTasks' 모드이며, 사용자가 변경을 요청하거나 계획 내용을 수정할 때만 다른 모드를 사용"
    ),
  tasks: z
    .array(
      z.object({
        name: z
          .string()
          .max(100, {
            message: "작업 이름이 너무 깁니다. 100자 이내로 제한해주세요",
          })
          .describe("간결하고 명확한 작업 이름으로 작업 목적을 명확히 표현해야 함"),
        description: z
          .string()
          .min(10, {
            message: "작업 설명이 너무 짧습니다. 이해를 위해 더 상세한 내용을 제공해주세요",
          })
          .describe("상세한 작업 설명으로 구현 요점, 기술 세부사항 및 검수 기준 포함"),
        implementationGuide: z
          .string()
          .describe(
            "이 특정 작업의 구체적인 구현 방법과 단계로, 이전 분석 결과를 참조하여 간결한 pseudocode 제공"
          ),
        dependencies: z
          .array(z.string())
          .optional()
          .describe(
            "이 작업이 의존하는 선행 작업 ID 또는 작업 이름 목록으로, 두 가지 참조 방식을 지원하며, 이름 참조가 더 직관적이고 문자열 배열입니다"
          ),
        notes: z
          .string()
          .optional()
          .describe("추가 설명, 특별 처리 요구사항 또는 구현 제안 (선택사항)"),
        relatedFiles: z
          .array(
            z.object({
              path: z
                .string()
                .min(1, {
                  message: "파일 경로가 비어있습니다",
                })
                .describe("파일 경로로, 프로젝트 루트 디렉토리 기준 상대 경로 또는 절대 경로"),
              type: z
                .nativeEnum(RelatedFileType)
                .describe(
                  "파일 유형 (TO_MODIFY: 수정 예정, REFERENCE: 참조 자료, CREATE: 생성 예정, DEPENDENCY: 의존 파일, OTHER: 기타)"
                ),
              description: z
                .string()
                .min(1, {
                  message: "파일 설명이 비어있습니다",
                })
                .describe("파일 설명으로, 파일의 용도와 내용을 설명하는 데 사용"),
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
        verificationCriteria: z
          .string()
          .optional()
          .describe("이 특정 작업의 검증 기준과 검사 방법"),
      })
    )
    .min(1, {
      message: "최소 하나의 작업을 제공해주세요",
    })
    .describe(
      "구조화된 작업 목록으로, 각 작업은 원자성을 유지하고 명확한 완료 기준을 가져야 하며, 너무 간단한 작업을 피하고, 간단한 수정은 다른 작업과 통합할 수 있으며, 작업이 너무 많지 않도록 해야 합니다"
    ),
  globalAnalysisResult: z
    .string()
    .optional()
    .describe("작업의 최종 목표로, 이전 분석에서 모든 작업에 적용되는 공통 부분"),
});

export async function splitTasks({
  updateMode,
  tasks,
  globalAnalysisResult,
}: z.infer<typeof splitTasksSchema>) {
  try {
    // tasks 안의 name에 중복이 있는지 확인
    const nameSet = new Set();
    for (const task of tasks) {
      if (nameSet.has(task.name)) {
        return {
          content: [
            {
              type: "text" as const,
              text: "tasks 매개변수에 중복된 작업 이름이 있습니다. 각 작업 이름이 고유한지 확인해주세요",
            },
          ],
        };
      }
      nameSet.add(task.name);
    }

    // 다른 업데이트 모드에 따라 작업 처리
    let message = "";
    let actionSuccess = true;
    let backupFile = null;
    let createdTasks: Task[] = [];
    let allTasks: Task[] = [];

    // 작업 데이터를 batchCreateOrUpdateTasks에 맞는 형식으로 변환
    const convertedTasks = tasks.map((task) => ({
      name: task.name,
      description: task.description,
      notes: task.notes,
      dependencies: task.dependencies,
      implementationGuide: task.implementationGuide,
      verificationCriteria: task.verificationCriteria,
      relatedFiles: task.relatedFiles?.map((file) => ({
        path: file.path,
        type: file.type as RelatedFileType,
        description: file.description,
        lineStart: file.lineStart,
        lineEnd: file.lineEnd,
      })),
    }));

    // clearAllTasks 모드 처리
    if (updateMode === "clearAllTasks") {
      const clearResult = await modelClearAllTasks();

      if (clearResult.success) {
        message = clearResult.message;
        backupFile = clearResult.backupFile;

        try {
          // 작업을 비운 후 새 작업 생성
          createdTasks = await batchCreateOrUpdateTasks(
            convertedTasks,
            "append",
            globalAnalysisResult
          );
          message += `\n${createdTasks.length}개의 새 작업을 성공적으로 생성했습니다.`;
        } catch (error) {
          actionSuccess = false;
          message += `\n새 작업 생성 중 오류 발생: ${
            error instanceof Error ? error.message : String(error)
          }`;
        }
      } else {
        actionSuccess = false;
        message = clearResult.message;
      }
    } else {
      // 다른 모드의 경우 batchCreateOrUpdateTasks 직접 사용
      try {
        createdTasks = await batchCreateOrUpdateTasks(
          convertedTasks,
          updateMode,
          globalAnalysisResult
        );

        // 다른 업데이트 모드에 따라 메시지 생성
        switch (updateMode) {
          case "append":
            message = `${createdTasks.length}개의 새 작업을 성공적으로 추가했습니다.`;
            break;
          case "overwrite":
            message = `미완료 작업을 성공적으로 삭제하고 ${createdTasks.length}개의 새 작업을 생성했습니다.`;
            break;
          case "selective":
            message = `${createdTasks.length}개의 작업을 성공적으로 선택적으로 업데이트/생성했습니다.`;
            break;
        }
      } catch (error) {
        actionSuccess = false;
        message = `작업 생성 실패: ${
          error instanceof Error ? error.message : String(error)
        }`;
      }
    }

    // 의존 관계 표시를 위해 모든 작업 가져오기
    try {
      allTasks = await getAllTasks();
    } catch (error) {
      allTasks = [...createdTasks]; // 가져오기에 실패하면 최소한 방금 생성한 작업 사용
    }

    // prompt 생성기를 사용하여 최종 prompt 가져오기
    const prompt = await getSplitTasksPrompt({
      updateMode,
      createdTasks,
      allTasks,
    });

    return {
      content: [
        {
          type: "text" as const,
          text: prompt,
        },
      ],
      ephemeral: {
        taskCreationResult: {
          success: actionSuccess,
          message,
          backupFilePath: backupFile,
        },
      },
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text" as const,
          text:
            "작업 분할 실행 중 오류 발생: " +
            (error instanceof Error ? error.message : String(error)),
        },
      ],
    };
  }
}
