import { RelatedFile, RelatedFileType } from "../types/index.js";

/**
 * 작업 관련 파일의 내용 요약 생성
 *
 * 이 함수는 제공된 RelatedFile 객체 목록을 기반으로 파일의 요약 정보를 생성하며, 실제 파일 내용을 읽지 않습니다.
 * 이는 경량 구현으로, 파일 메타데이터(경로, 유형, 설명 등)만을 기반으로 형식화된 요약을 생성합니다.
 * 실제 파일 내용에 접근할 필요가 없지만 파일 컨텍스트 정보를 제공해야 하는 상황에 적합합니다.
 *
 * @param relatedFiles 관련 파일 목록 - 파일 경로, 유형, 설명 등의 정보를 포함한 RelatedFile 객체 배열
 * @param maxTotalLength 요약 내용의 최대 총 길이 - 생성된 요약의 총 문자 수를 제어하여 너무 큰 반환 내용을 방지
 * @returns 두 필드를 포함한 객체:
 *   - content: 각 파일의 기본 정보와 안내 메시지를 포함한 상세한 파일 정보
 *   - summary: 빠른 검토에 적합한 간결한 파일 목록 개요
 */
export async function loadTaskRelatedFiles(
  relatedFiles: RelatedFile[],
  maxTotalLength: number = 15000 // 생성 내용의 총 길이 제어
): Promise<{ content: string; summary: string }> {
  if (!relatedFiles || relatedFiles.length === 0) {
    return {
      content: "",
      summary: "관련 파일 없음",
    };
  }

  let totalContent = "";
  let filesSummary = `## 관련 파일 내용 요약 (총 ${relatedFiles.length}개 파일)\n\n`;
  let totalLength = 0;

  // 파일 유형 우선순위별 정렬 (먼저 수정할 파일 처리)
  const priorityOrder: Record<RelatedFileType, number> = {
    [RelatedFileType.TO_MODIFY]: 1,
    [RelatedFileType.REFERENCE]: 2,
    [RelatedFileType.DEPENDENCY]: 3,
    [RelatedFileType.CREATE]: 4,
    [RelatedFileType.OTHER]: 5,
  };

  const sortedFiles = [...relatedFiles].sort(
    (a, b) => priorityOrder[a.type] - priorityOrder[b.type]
  );

  // 각 파일 처리
  for (const file of sortedFiles) {
    if (totalLength >= maxTotalLength) {
      filesSummary += `\n### 컨텍스트 길이 제한에 도달하여 일부 파일이 로드되지 않았습니다\n`;
      break;
    }

    // 파일 기본 정보 생성
    const fileInfo = generateFileInfo(file);

    // 총 내용에 추가
    const fileHeader = `\n### ${file.type}: ${file.path}${
      file.description ? ` - ${file.description}` : ""
    }${
      file.lineStart && file.lineEnd
        ? ` (줄 ${file.lineStart}-${file.lineEnd})`
        : ""
    }\n\n`;

    totalContent += fileHeader + "```\n" + fileInfo + "\n```\n\n";
    filesSummary += `- **${file.path}**${
      file.description ? ` - ${file.description}` : ""
    } (${fileInfo.length} 문자)\n`;

    totalLength += fileInfo.length + fileHeader.length + 8; // 8 for "```\n" and "\n```"
  }

  return {
    content: totalContent,
    summary: filesSummary,
  };
}

/**
 * 파일 기본 정보 요약 생성
 *
 * 파일의 메타데이터를 기반으로 형식화된 정보 요약을 생성하며, 파일 경로, 유형 및 관련 안내를 포함합니다.
 * 실제 파일 내용을 읽지 않고 제공된 RelatedFile 객체만을 기반으로 정보를 생성합니다.
 *
 * @param file 관련 파일 객체 - 파일 경로, 유형, 설명 등의 기본 정보를 포함
 * @returns 형식화된 파일 정보 요약 텍스트
 */
function generateFileInfo(file: RelatedFile): string {
  let fileInfo = `파일: ${file.path}\n`;
  fileInfo += `유형: ${file.type}\n`;

  if (file.description) {
    fileInfo += `설명: ${file.description}\n`;
  }

  if (file.lineStart && file.lineEnd) {
    fileInfo += `줄 범위: ${file.lineStart}-${file.lineEnd}\n`;
  }

  fileInfo += `실제 내용을 보려면 파일을 직접 확인하세요: ${file.path}\n`;

  return fileInfo;
}
