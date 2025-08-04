import { z } from "zod";
import { searchTasksWithCommand } from "../../models/taskModel.js";
import { getQueryTaskPrompt } from "../../prompts/index.js";

// 작업 조회 도구
export const queryTaskSchema = z.object({
  query: z
    .string()
    .min(1, {
      message: "조회 내용이 비어있습니다. 작업 ID 또는 검색 키워드를 입력해주세요",
    })
    .describe("검색 쿼리 문자열로, 작업 ID 또는 여러 키워드(공백 구분) 입력 가능"),
  isId: z
    .boolean()
    .optional()
    .default(false)
    .describe("ID 조회 모드 여부 지정, 기본값은 false(키워드 모드)"),
  page: z
    .number()
    .int()
    .positive()
    .optional()
    .default(1)
    .describe("페이지 번호, 기본값 1"),
  pageSize: z
    .number()
    .int()
    .positive()
    .min(1)
    .max(20)
    .optional()
    .default(5)
    .describe("페이지당 작업 수, 기본 5개, 최대 20개"),
});

export async function queryTask({
  query,
  isId = false,
  page = 1,
  pageSize = 3,
}: z.infer<typeof queryTaskSchema>) {
  try {
    // 시스템 명령어 검색 함수 사용
    const results = await searchTasksWithCommand(query, isId, page, pageSize);

    // prompt 생성기를 사용하여 최종 prompt 가져오기
    const prompt = await getQueryTaskPrompt({
      query,
      isId,
      tasks: results.tasks,
      totalTasks: results.pagination.totalResults,
      page: results.pagination.currentPage,
      pageSize,
      totalPages: results.pagination.totalPages,
    });

    return {
      content: [
        {
          type: "text" as const,
          text: prompt,
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text" as const,
          text: `## 시스템 오류\n\n작업 조회 중 오류 발생: ${
            error instanceof Error ? error.message : String(error)
          }`,
        },
      ],
      isError: true,
    };
  }
}
