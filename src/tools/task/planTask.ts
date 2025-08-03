import { z } from "zod";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { getAllTasks } from "../../models/taskModel.js";
import { TaskStatus, Task } from "../../types/index.js";
import { getPlanTaskPrompt } from "../../prompts/index.js";
import { getMemoryDir } from "../../utils/paths.js";

// 작업 계획 도구 시작
export const planTaskSchema = z.object({
  description: z
    .string()
    .min(10, {
      message: "작업 설명은 10자 이상이어야 합니다. 작업 목표가 명확하도록 더 자세한 설명을 제공해주세요",
    })
    .describe("완전하고 상세한 작업 문제 설명, 작업 목표, 배경 및 예상 결과를 포함해야 함"),
  requirements: z
    .string()
    .optional()
    .describe("작업의 특정 기술 요구사항, 비즈니스 제약 조건 또는 품질 표준 (선택사항)"),
  existingTasksReference: z
    .boolean()
    .optional()
    .default(false)
    .describe("기존 작업을 계획 기반으로 참조할지 여부, 작업 조정 및 연속성 계획에 사용"),
});

// 프로젝트 파일들을 확인하고 읽는 함수
async function getProjectFiles(PROJECT_ROOT: string) {
  const projectFiles: { [key: string]: string } = {};
  
  // 확인할 파일 목록
  const filesToCheck = [
    "docs/requirements.md",
    "docs/designed.md", 
    "docs/task.md",
    "package.json",
    ".env",
    "README.md",
    "docs/patterns/singleton.md"
  ];

  for (const filePath of filesToCheck) {
    const fullPath = path.join(PROJECT_ROOT, filePath);
    try {
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        projectFiles[filePath] = content;
        console.log(`📋 ${filePath} 파일을 찾았습니다.`);
      }
    } catch (error) {
      console.warn(`⚠️ ${filePath} 파일 읽기 실패:`, error);
    }
  }

  return projectFiles;
}

export async function planTask({
  description,
  requirements,
  existingTasksReference = false,
}: z.infer<typeof planTaskSchema>) {
  // 기본 디렉토리 경로 가져오기
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const PROJECT_ROOT = path.resolve(__dirname, "../../..");
  const MEMORY_DIR = await getMemoryDir();

  // 프로젝트 파일들 확인 및 읽기
  const projectFiles = await getProjectFiles(PROJECT_ROOT);
  
  // 프로젝트 파일 정보를 requirements에 추가
  let projectContext = "";
  if (Object.keys(projectFiles).length > 0) {
    projectContext = "\n\n## 프로젝트 파일 정보\n\n";
    
    for (const [filePath, content] of Object.entries(projectFiles)) {
      projectContext += `### ${filePath}\n\`\`\`\n${content}\n\`\`\`\n\n`;
    }
  }

  // requirements.md 내용이 있으면 requirements 매개변수에 추가
  if (projectFiles["docs/requirements.md"]) {
    requirements = requirements 
      ? `${requirements}\n\n## 프로젝트 요구사항 문서\n\n${projectFiles["docs/requirements.md"]}`
      : `## 프로젝트 요구사항 문서\n\n${projectFiles["docs/requirements.md"]}`;
  }

  // 프로젝트 컨텍스트를 requirements에 추가
  if (projectContext) {
    requirements = requirements 
      ? `${requirements}\n${projectContext}`
      : projectContext;
  }

  // 필요한 매개변수 준비
  let completedTasks: Task[] = [];
  let pendingTasks: Task[] = [];

  // existingTasksReference가 true일 때 데이터베이스에서 모든 작업을 참조로 로드
  if (existingTasksReference) {
    try {
      const allTasks = await getAllTasks();

      // 작업을 완료된 것과 미완료된 것으로 분류
      completedTasks = allTasks.filter(
        (task) => task.status === TaskStatus.COMPLETED
      );
      pendingTasks = allTasks.filter(
        (task) => task.status !== TaskStatus.COMPLETED
      );
    } catch (error) {}
  }

  // prompt 생성기를 사용하여 최종 prompt 가져오기
  const prompt = await getPlanTaskPrompt({
    description,
    requirements,
    existingTasksReference,
    completedTasks,
    pendingTasks,
    memoryDir: MEMORY_DIR,
  });

  return {
    content: [
      {
        type: "text" as const,
        text: prompt,
      },
    ],
  };
}
