/**
 * updateTaskContent 프롬프트 생성기
 * 템플릿과 매개변수를 결합하여 최종 프롬프트를 생성하는 역할을 합니다.
 */

import {
  loadPrompt,
  generatePrompt,
  loadPromptFromTemplate,
} from "../loader.js";
import { Task, RelatedFile } from "../../types/index.js";

/**
 * updateTaskContent 프롬프트 매개변수 인터페이스
 */
export interface UpdateTaskContentPromptParams {
  taskId: string;
  task?: Task;
  success?: boolean;
  message?: string;
  validationError?: string;
  emptyUpdate?: boolean;
  updatedTask?: Task;
}

/**
 * updateTaskContent의 전체 프롬프트를 가져옵니다.
 * @param params 프롬프트 매개변수
 * @returns 생성된 프롬프트
 */
export async function getUpdateTaskContentPrompt(
  params: UpdateTaskContentPromptParams
): Promise<string> {
  const {
    taskId,
    task,
    success,
    message,
    validationError,
    emptyUpdate,
    updatedTask,
  } = params;

  // 작업이 존재하지 않는 경우 처리
  if (!task) {
    const notFoundTemplate = await loadPromptFromTemplate(
      "updateTaskContent/notFound.md"
    );
    return generatePrompt(notFoundTemplate, {
      taskId,
    });
  }

  // 유효성 검사 오류 처리
  if (validationError) {
    const validationTemplate = await loadPromptFromTemplate(
      "updateTaskContent/validation.md"
    );
    return generatePrompt(validationTemplate, {
      error: validationError,
    });
  }

  // 빈 업데이트 처리
  if (emptyUpdate) {
    const emptyUpdateTemplate = await loadPromptFromTemplate(
      "updateTaskContent/emptyUpdate.md"
    );
    return generatePrompt(emptyUpdateTemplate, {});
  }

  // 업데이트 성공 또는 실패 처리
  const responseTitle = success ? "Success" : "Failure";
  let content = message || "";

  // 업데이트 성공 및 업데이트된 작업 세부 정보가 있는 경우
  if (success && updatedTask) {
    const successTemplate = await loadPromptFromTemplate(
      "updateTaskContent/success.md"
    );

    // 관련 파일 정보 컴파일
    let filesContent = "";
    if (updatedTask.relatedFiles && updatedTask.relatedFiles.length > 0) {
      const fileDetailsTemplate = await loadPromptFromTemplate(
        "updateTaskContent/fileDetails.md"
      );

      // 파일 유형별 그룹화
      const filesByType = updatedTask.relatedFiles.reduce((acc, file) => {
        if (!acc[file.type]) {
          acc[file.type] = [];
        }
        acc[file.type].push(file);
        return acc;
      }, {} as Record<string, RelatedFile[]>);

      // 각 파일 유형에 대한 콘텐츠 생성
      for (const [type, files] of Object.entries(filesByType)) {
        const filesList = files.map((file) => `\`${file.path}\``).join(", ");
        filesContent += generatePrompt(fileDetailsTemplate, {
          fileType: type,
          fileCount: files.length,
          filesList,
        });
      }
    }

    // 작업 메모 처리
    const taskNotesPrefix = "- **메모:** ";
    const taskNotes = updatedTask.notes
      ? `${taskNotesPrefix}` +
        (
          updatedTask.notes.length > 100
            ? `${updatedTask.notes.substring(0, 100)}...` 
            : updatedTask.notes
        )
      : "";

    // 성공적인 업데이트에 대한 세부 정보 생성
    content += generatePrompt(successTemplate, {
      taskName: updatedTask.name,
      taskDescription:
        updatedTask.description.length > 100
          ? `${updatedTask.description.substring(0, 100)}...` 
          : updatedTask.description,
      taskNotes: taskNotes,
      taskStatus: updatedTask.status,
      taskUpdatedAt: new Date(updatedTask.updatedAt).toISOString(),
      filesContent,
    });
  }

  const indexTemplate = await loadPromptFromTemplate(
    "updateTaskContent/index.md"
  );
  const prompt = generatePrompt(indexTemplate, {
    responseTitle,
    message: content,
  });

  // 가능한 사용자 정의 프롬프트 로드
  return loadPrompt(prompt, "UPDATE_TASK_CONTENT");
}
