import {
  Task,
  TaskStatus,
  TaskDependency,
  TaskComplexityLevel,
  TaskComplexityThresholds,
  TaskComplexityAssessment,
  RelatedFile,
} from "../types/index.js";
import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";
import { exec } from "child_process";
import { promisify } from "util";
import { getTasksFilePath, getMemoryDir } from "../utils/paths.js";

// 모든 도구 함수 및 스키마 가져오기
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, "../..");

// 데이터 파일 경로 (비동기 가져오기로 변경)
// const DATA_DIR = getDataDir();
// const TASKS_FILE = getTasksFilePath();

// exec을 Promise 형태로 변환
const execPromise = promisify(exec);

// 데이터 디렉토리가 존재하는지 확인
async function ensureDataDir() {
  const TASKS_FILE = await getTasksFilePath();

  try {
    await fs.access(TASKS_FILE);
  } catch (error) {
    await fs.writeFile(TASKS_FILE, JSON.stringify({ tasks: [] }));
  }
}

// 모든 작업 읽기
async function readTasks(): Promise<Task[]> {
  await ensureDataDir();
  const TASKS_FILE = await getTasksFilePath();
  const data = await fs.readFile(TASKS_FILE, "utf-8");
  const tasks = JSON.parse(data).tasks;

  // 날짜 문자열을 Date 객체로 변환
  return tasks.map((task: any) => ({
    ...task,
    createdAt: task.createdAt ? new Date(task.createdAt) : new Date(),
    updatedAt: task.updatedAt ? new Date(task.updatedAt) : new Date(),
    completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
  }));
}

// 모든 작업 쓰기
async function writeTasks(tasks: Task[]): Promise<void> {
  await ensureDataDir();
  const TASKS_FILE = await getTasksFilePath();
  await fs.writeFile(TASKS_FILE, JSON.stringify({ tasks }, null, 2));
}

// 모든 작업 가져오기
export async function getAllTasks(): Promise<Task[]> {
  return await readTasks();
}

// ID로 작업 가져오기
export async function getTaskById(taskId: string): Promise<Task | null> {
  const tasks = await readTasks();
  return tasks.find((task) => task.id === taskId) || null;
}

// 새 작업 생성
export async function createTask(
  name: string,
  description: string,
  notes?: string,
  dependencies: string[] = [],
  relatedFiles?: RelatedFile[]
): Promise<Task> {
  const tasks = await readTasks();

  const dependencyObjects: TaskDependency[] = dependencies.map((taskId) => ({
    taskId,
  }));

  const newTask: Task = {
    id: uuidv4(),
    name,
    description,
    notes,
    status: TaskStatus.PENDING,
    dependencies: dependencyObjects,
    createdAt: new Date(),
    updatedAt: new Date(),
    relatedFiles,
  };

  tasks.push(newTask);
  await writeTasks(tasks);

  return newTask;
}

// 작업 업데이트
export async function updateTask(
  taskId: string,
  updates: Partial<Task>
): Promise<Task | null> {
  const tasks = await readTasks();
  const taskIndex = tasks.findIndex((task) => task.id === taskId);

  if (taskIndex === -1) {
    return null;
  }

  // 작업이 완료되었는지 확인하고, 완료된 작업은 업데이트를 허용하지 않음 (명시적으로 허용된 필드 제외)
  if (tasks[taskIndex].status === TaskStatus.COMPLETED) {
    // summary 필드(작업 요약)와 relatedFiles 필드만 업데이트 허용
    const allowedFields = ["summary", "relatedFiles"];
    const attemptedFields = Object.keys(updates);

    const disallowedFields = attemptedFields.filter(
      (field) => !allowedFields.includes(field)
    );

    if (disallowedFields.length > 0) {
      return null;
    }
  }

  tasks[taskIndex] = {
    ...tasks[taskIndex],
    ...updates,
    updatedAt: new Date(),
  };

  await writeTasks(tasks);

  return tasks[taskIndex];
}

// 작업 상태 업데이트
export async function updateTaskStatus(
  taskId: string,
  status: TaskStatus
): Promise<Task | null> {
  const updates: Partial<Task> = { status };

  if (status === TaskStatus.COMPLETED) {
    updates.completedAt = new Date();
  }

  return await updateTask(taskId, updates);
}

// 작업 요약 업데이트
export async function updateTaskSummary(
  taskId: string,
  summary: string
): Promise<Task | null> {
  return await updateTask(taskId, { summary });
}

// 작업 내용 업데이트
export async function updateTaskContent(
  taskId: string,
  updates: {
    name?: string;
    description?: string;
    notes?: string;
    relatedFiles?: RelatedFile[];
    dependencies?: string[];
    implementationGuide?: string;
    verificationCriteria?: string;
  }
): Promise<{ success: boolean; message: string; task?: Task }> {
  // 작업을 가져와서 존재하는지 확인
  const task = await getTaskById(taskId);

  if (!task) {
    return { success: false, message: "지정된 작업을 찾을 수 없습니다" };
  }

  // 작업이 완료되었는지 확인
  if (task.status === TaskStatus.COMPLETED) {
    return { success: false, message: "완료된 작업은 업데이트할 수 없습니다" };
  }

  // 업데이트 객체 구성, 실제로 업데이트해야 하는 필드만 포함
  const updateObj: Partial<Task> = {};

  if (updates.name !== undefined) {
    updateObj.name = updates.name;
  }

  if (updates.description !== undefined) {
    updateObj.description = updates.description;
  }

  if (updates.notes !== undefined) {
    updateObj.notes = updates.notes;
  }

  if (updates.relatedFiles !== undefined) {
    updateObj.relatedFiles = updates.relatedFiles;
  }

  if (updates.dependencies !== undefined) {
    updateObj.dependencies = updates.dependencies.map((dep) => ({
      taskId: dep,
    }));
  }

  if (updates.implementationGuide !== undefined) {
    updateObj.implementationGuide = updates.implementationGuide;
  }

  if (updates.verificationCriteria !== undefined) {
    updateObj.verificationCriteria = updates.verificationCriteria;
  }

  // 업데이트할 내용이 없으면 조기 반환
  if (Object.keys(updateObj).length === 0) {
    return { success: true, message: "업데이트할 내용이 제공되지 않았습니다", task };
  }

  // 업데이트 실행
  const updatedTask = await updateTask(taskId, updateObj);

  if (updatedTask) {
    return { success: true, message: "작업이 성공적으로 업데이트되었습니다", task: updatedTask };
  } else {
    return { success: false, message: "작업 업데이트에 실패했습니다" };
  }
}

// 작업 관련 파일 업데이트
export async function updateTaskRelatedFiles(
  taskId: string,
  relatedFiles: RelatedFile[]
): Promise<{ success: boolean; message: string; task?: Task }> {
  // 작업을 가져와서 존재하는지 확인
  const task = await getTaskById(taskId);

  if (!task) {
    return { success: false, message: "지정된 작업을 찾을 수 없습니다" };
  }

  // 작업이 완료되었는지 확인
  if (task.status === TaskStatus.COMPLETED) {
    return { success: false, message: "완료된 작업은 업데이트할 수 없습니다" };
  }

  // 업데이트 실행
  const updatedTask = await updateTask(taskId, { relatedFiles });

  if (!updatedTask) {
    return { success: false, message: "작업 관련 파일 업데이트 중 오류가 발생했습니다" };
  }

  return {
    success: true,
    message: `작업 관련 파일이 성공적으로 업데이트되었습니다. 총 ${relatedFiles.length}개 파일`,
    task: updatedTask,
  };
}

// 배치 작업 생성 또는 업데이트
export async function batchCreateOrUpdateTasks(
  taskDataList: Array<{
    name: string;
    description: string;
    notes?: string;
    dependencies?: string[];
    relatedFiles?: RelatedFile[];
    implementationGuide?: string; // 추가: 구현 가이드
    verificationCriteria?: string; // 추가: 검증 기준
  }>,
  updateMode: "append" | "overwrite" | "selective" | "clearAllTasks", // 필수 매개변수, 작업 업데이트 전략 지정
  globalAnalysisResult?: string // 추가: 전역 분석 결과
): Promise<Task[]> {
  // 작업을 가져와서 존재하는지 확인
  const existingTasks = await readTasks();

  // 따라서 현재 작업 목록에서 유지할 작업
  let tasksToKeep: Task[] = [];

  if (updateMode === "append") {
    // 추가 모드: 모든 기존 작업 유지
    tasksToKeep = [...existingTasks];
  } else if (updateMode === "overwrite") {
    // 덮어쓰기 모드: 완료된 작업만 유지하고 모든 미완료 작업 제거
    tasksToKeep = existingTasks.filter(
      (task) => task.status === TaskStatus.COMPLETED
    );
  } else if (updateMode === "selective") {
    // 선택적 업데이트 모드: 작업 이름에 따라 선택적 업데이트, 업데이트 목록에 없는 작업 유지
    // 1. 업데이트할 작업 이름 목록 추출
    const updateTaskNames = new Set(taskDataList.map((task) => task.name));

    // 2. 업데이트 목록에 없는 작업 모두 유지
    tasksToKeep = existingTasks.filter(
      (task) => !updateTaskNames.has(task.name)
    );
  } else if (updateMode === "clearAllTasks") {
    // 모든 작업 모드: 작업 목록 비우기
    tasksToKeep = [];
  }

  // 이 맵은 작업 이름에서 작업 ID로의 맵을 저장하는 데 사용되며, 작업 이름을 통해 작업을 참조할 때 사용됩니다.
  const taskNameToIdMap = new Map<string, string>();

  // 선택적 업데이트 모드에서 먼저 기존 작업의 이름과 ID를 기록합니다.
  if (updateMode === "selective") {
    existingTasks.forEach((task) => {
      taskNameToIdMap.set(task.name, task.id);
    });
  }

  // 모든 작업의 이름과 ID를 기록하며, 유지할 작업이나 새로 생성할 작업 모두 포함
  // 이는 나중에 의존성을 확인하는 데 사용됩니다.
  tasksToKeep.forEach((task) => {
    taskNameToIdMap.set(task.name, task.id);
  });

  // 새 작업 생성 목록
  const newTasks: Task[] = [];

  for (const taskData of taskDataList) {
    // 선택적 업데이트 모드이고 해당 작업 이름이 이미 존재하는지 확인
    if (updateMode === "selective" && taskNameToIdMap.has(taskData.name)) {
      // 기존 작업의 ID 가져오기
      const existingTaskId = taskNameToIdMap.get(taskData.name)!;

      // 기존 작업 찾기
      const existingTaskIndex = existingTasks.findIndex(
        (task) => task.id === existingTaskId
      );

      // 기존 작업을 찾았고 해당 작업이 완료되지 않았다면 업데이트
      if (
        existingTaskIndex !== -1 &&
        existingTasks[existingTaskIndex].status !== TaskStatus.COMPLETED
      ) {
        const taskToUpdate = existingTasks[existingTaskIndex];

        // 작업의 기본 정보를 업데이트하지만 원래 ID, 생성 시간 등은 유지
        const updatedTask: Task = {
          ...taskToUpdate,
          name: taskData.name,
          description: taskData.description,
          notes: taskData.notes,
          // 의존성은 나중에 처리
          updatedAt: new Date(),
          // 추가: 구현 가이드 저장 (있는 경우)
          implementationGuide: taskData.implementationGuide,
          // 추가: 검증 기준 저장 (있는 경우)
          verificationCriteria: taskData.verificationCriteria,
          // 추가: 전역 분석 결과 저장 (있는 경우)
          analysisResult: globalAnalysisResult,
        };

        // 관련 파일 처리 (있는 경우)
        if (taskData.relatedFiles) {
          updatedTask.relatedFiles = taskData.relatedFiles;
        }

        // 업데이트된 작업을 새 작업 목록에 추가
        newTasks.push(updatedTask);

        // tasksToKeep에서 해당 작업 제거, 이미 업데이트되고 newTasks에 추가되었기 때문
        tasksToKeep = tasksToKeep.filter((task) => task.id !== existingTaskId);
      }
    } else {
      // 새 작업 생성
      const newTaskId = uuidv4();

      // 새 작업의 이름과 ID를 맵에 추가
      taskNameToIdMap.set(taskData.name, newTaskId);

      const newTask: Task = {
        id: newTaskId,
        name: taskData.name,
        description: taskData.description,
        notes: taskData.notes,
        status: TaskStatus.PENDING,
        dependencies: [], // 나중에 채우기
        createdAt: new Date(),
        updatedAt: new Date(),
        relatedFiles: taskData.relatedFiles,
        // 추가: 구현 가이드 저장 (있는 경우)
        implementationGuide: taskData.implementationGuide,
        // 추가: 검증 기준 저장 (있는 경우)
        verificationCriteria: taskData.verificationCriteria,
        // 추가: 전역 분석 결과 저장 (있는 경우)
        analysisResult: globalAnalysisResult,
      };

      newTasks.push(newTask);
    }
  }

  // 작업 간의 의존성 처리
  for (let i = 0; i < taskDataList.length; i++) {
    const taskData = taskDataList[i];
    const newTask = newTasks[i];

    // 의존성이 있으면 처리
    if (taskData.dependencies && taskData.dependencies.length > 0) {
      const resolvedDependencies: TaskDependency[] = [];

      for (const dependencyName of taskData.dependencies) {
        // 먼저 의존성을 작업 ID로 해석하려고 시도
        let dependencyTaskId = dependencyName;

        // 의존성이 UUID 형식이 아니면 작업 이름으로 해석하려고 시도
        if (
          !dependencyName.match(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
          )
        ) {
          // 맵에 해당 이름이 있으면 해당 ID 사용
          if (taskNameToIdMap.has(dependencyName)) {
            dependencyTaskId = taskNameToIdMap.get(dependencyName)!;
          } else {
            continue; // 이 의존성 건너뛰기
          }
        } else {
          // UUID 형식이지만 이 ID가 실제로 존재하는 작업과 일치하는지 확인
          const idExists = [...tasksToKeep, ...newTasks].some(
            (task) => task.id === dependencyTaskId
          );
          if (!idExists) {
            continue; // 이 의존성 건너뛰기
          }
        }

        resolvedDependencies.push({ taskId: dependencyTaskId });
      }

      newTask.dependencies = resolvedDependencies;
    }
  }

  // 유지된 작업과 새 작업 병합
  const allTasks = [...tasksToKeep, ...newTasks];

  // 업데이트된 작업 목록 쓰기
  await writeTasks(allTasks);

  return newTasks;
}

// 작업 실행 가능 여부 확인 (모든 의존성이 완료되었는지)
export async function canExecuteTask(
  taskId: string
): Promise<{ canExecute: boolean; blockedBy?: string[] }> {
  const task = await getTaskById(taskId);

  if (!task) {
    return { canExecute: false };
  }

  if (task.status === TaskStatus.COMPLETED) {
    return { canExecute: false }; // 완료된 작업은 다시 실행할 필요가 없습니다.
  }

  if (task.dependencies.length === 0) {
    return { canExecute: true }; // 의존성이 없는 작업은 직접 실행할 수 있습니다.
  }

  const allTasks = await readTasks();
  const blockedBy: string[] = [];

  for (const dependency of task.dependencies) {
    const dependencyTask = allTasks.find((t) => t.id === dependency.taskId);

    if (!dependencyTask || dependencyTask.status !== TaskStatus.COMPLETED) {
      blockedBy.push(dependency.taskId);
    }
  }

  return {
    canExecute: blockedBy.length === 0,
    blockedBy: blockedBy.length > 0 ? blockedBy : undefined,
  };
}

// 작업 삭제
export async function deleteTask(
  taskId: string
): Promise<{ success: boolean; message: string }> {
  const tasks = await readTasks();
  const taskIndex = tasks.findIndex((task) => task.id === taskId);

  if (taskIndex === -1) {
    return { success: false, message: "지정된 작업을 찾을 수 없습니다" };
  }

  // 작업 상태 확인, 완료된 작업은 삭제할 수 없습니다.
  if (tasks[taskIndex].status === TaskStatus.COMPLETED) {
    return { success: false, message: "완료된 작업은 삭제할 수 없습니다" };
  }

  // 이 작업을 종속하는 다른 작업이 있는지 확인
  const allTasks = tasks.filter((_, index) => index !== taskIndex);
  const dependentTasks = allTasks.filter((task) =>
    task.dependencies.some((dep) => dep.taskId === taskId)
  );

  if (dependentTasks.length > 0) {
    const dependentTaskNames = dependentTasks
      .map((task) => `"${task.name}" (ID: ${task.id})`)
      .join(", ");
    return {
      success: false,
      message: `이 작업을 삭제할 수 없습니다. 다음 작업이 이 작업을 종속합니다: ${dependentTaskNames}`,
    };
  }

  // 삭제 작업 실행
  tasks.splice(taskIndex, 1);
  await writeTasks(tasks);

  return { success: true, message: "작업 삭제 성공" };
}

// 작업 복잡도 평가
export async function assessTaskComplexity(
  taskId: string
): Promise<TaskComplexityAssessment | null> {
  const task = await getTaskById(taskId);

  if (!task) {
    return null;
  }

  // 각 지표 평가
  const descriptionLength = task.description.length;
  const dependenciesCount = task.dependencies.length;
  const notesLength = task.notes ? task.notes.length : 0;
  const hasNotes = !!task.notes;

  // 각 지표에 따라 복잡도 레벨 평가
  let level = TaskComplexityLevel.LOW;

  // 설명 길이 평가
  if (
    descriptionLength >= TaskComplexityThresholds.DESCRIPTION_LENGTH.VERY_HIGH
  ) {
    level = TaskComplexityLevel.VERY_HIGH;
  } else if (
    descriptionLength >= TaskComplexityThresholds.DESCRIPTION_LENGTH.HIGH
  ) {
    level = TaskComplexityLevel.HIGH;
  } else if (
    descriptionLength >= TaskComplexityThresholds.DESCRIPTION_LENGTH.MEDIUM
  ) {
    level = TaskComplexityLevel.MEDIUM;
  }

  // 의존성 수량 평가 (최고 레벨 사용)
  if (
    dependenciesCount >= TaskComplexityThresholds.DEPENDENCIES_COUNT.VERY_HIGH
  ) {
    level = TaskComplexityLevel.VERY_HIGH;
  } else if (
    dependenciesCount >= TaskComplexityThresholds.DEPENDENCIES_COUNT.HIGH &&
    level !== TaskComplexityLevel.VERY_HIGH
  ) {
    level = TaskComplexityLevel.HIGH;
  } else if (
    dependenciesCount >= TaskComplexityThresholds.DEPENDENCIES_COUNT.MEDIUM &&
    level !== TaskComplexityLevel.HIGH &&
    level !== TaskComplexityLevel.VERY_HIGH
  ) {
    level = TaskComplexityLevel.MEDIUM;
  }

  // 메모 길이 평가 (최고 레벨 사용)
  if (notesLength >= TaskComplexityThresholds.NOTES_LENGTH.VERY_HIGH) {
    level = TaskComplexityLevel.VERY_HIGH;
  } else if (
    notesLength >= TaskComplexityThresholds.NOTES_LENGTH.HIGH &&
    level !== TaskComplexityLevel.VERY_HIGH
  ) {
    level = TaskComplexityLevel.HIGH;
  } else if (
    notesLength >= TaskComplexityThresholds.NOTES_LENGTH.MEDIUM &&
    level !== TaskComplexityLevel.HIGH &&
    level !== TaskComplexityLevel.VERY_HIGH
  ) {
    level = TaskComplexityLevel.MEDIUM;
  }

  // 복잡도 레벨에 따른 처리 권고
  const recommendations: string[] = [];

  // 낮은 복잡도 작업 권고
  if (level === TaskComplexityLevel.LOW) {
    recommendations.push("이 작업의 복잡도가 낮으므로 직접 실행할 수 있습니다.");
    recommendations.push("완료 기준을 명확히 설정하여 검증에 명확한 근거를 제공하세요.");
  }
  // 중간 복잡도 작업 권고
  else if (level === TaskComplexityLevel.MEDIUM) {
    recommendations.push("이 작업은 일부 복잡성을 가지고 있으므로 실행 단계를 상세히 계획하세요.");
    recommendations.push("단계별로 실행하고 정기적으로 진행 상황을 확인하여 이해를 정확히 하고 완료하세요.");
    if (dependenciesCount > 0) {
      recommendations.push("모든 의존성 작업의 완료 상태와 출력 품질을 확인하세요.");
    }
  }
  // 높은 복잡도 작업 권고
  else if (level === TaskComplexityLevel.HIGH) {
    recommendations.push("이 작업의 복잡도가 높으므로 충분한 분석과 계획을 먼저 수행하세요.");
    recommendations.push("작업을 더 작은 독립적인 하위 작업으로 분할하여 실행하세요.");
    recommendations.push("명확한 마일스톤과 검사점을 설정하여 진행 상황과 품질을 추적하세요.");
    if (
      dependenciesCount > TaskComplexityThresholds.DEPENDENCIES_COUNT.MEDIUM
    ) {
      recommendations.push(
        "의존성 작업이 많으므로 의존성 관계도를 작성하여 실행 순서를 올바르게 보장하세요."
      );
    }
  }
  // 매우 높은 복잡도 작업 권고
  else if (level === TaskComplexityLevel.VERY_HIGH) {
    recommendations.push("⚠️ 이 작업의 복잡도가 매우 높으므로 여러 개의 독립적인 작업으로 분할하는 것을 강력히 권장합니다.");
    recommendations.push(
      "실행 전에 상세한 분석과 계획을 수행하여 각 하위 작업의 범위와 인터페이스를 명확히 정의하세요."
    );
    recommendations.push(
      "작업에 대한 위험 평가를 수행하여 잠재적인 장애 요인을 식별하고 대응 전략을 수립하세요."
    );
    recommendations.push("구체적인 테스트와 검증 기준을 설정하여 각 하위 작업의 출력 품질을 보장하세요.");
    if (
      descriptionLength >= TaskComplexityThresholds.DESCRIPTION_LENGTH.VERY_HIGH
    ) {
      recommendations.push(
        "작업 설명이 매우 길므로 중요 포인트를 정리하고 구조화된 실행 목록을 작성하세요."
      );
    }
    if (dependenciesCount >= TaskComplexityThresholds.DEPENDENCIES_COUNT.HIGH) {
      recommendations.push(
        "의존성 작업 수가 많으므로 작업 경계를 다시 평가하여 적절한 분할을 확인하세요."
      );
    }
  }

  return {
    level,
    metrics: {
      descriptionLength,
      dependenciesCount,
      notesLength,
      hasNotes,
    },
    recommendations,
  };
}

// 모든 작업 삭제
export async function clearAllTasks(): Promise<{
  success: boolean;
  message: string;
  backupFile?: string;
}> {
  try {
    // 데이터 디렉토리가 존재하는지 확인
    await ensureDataDir();

    // 현재 작업 읽기
    const allTasks = await readTasks();

    // 작업이 없으면 직접 반환
    if (allTasks.length === 0) {
      return { success: true, message: "삭제할 작업이 없습니다" };
    }

    // 완료된 작업 필터링
    const completedTasks = allTasks.filter(
      (task) => task.status === TaskStatus.COMPLETED
    );

    // 백업 파일 이름 생성
    const timestamp = new Date()
      .toISOString()
      .replace(/:/g, "-")
      .replace(/\..+/, "");
    const backupFileName = `tasks_memory_${timestamp}.json`;

    // memory 디렉토리가 존재하는지 확인
    const MEMORY_DIR = await getMemoryDir();
    try {
      await fs.access(MEMORY_DIR);
    } catch (error) {
      await fs.mkdir(MEMORY_DIR, { recursive: true });
    }

    // memory 디렉토리 아래에 백업 경로 생성
    const memoryFilePath = path.join(MEMORY_DIR, backupFileName);

    // memory 디렉토리에도 동시에 쓰기 (완료된 작업만 포함)
    await fs.writeFile(
      memoryFilePath,
      JSON.stringify({ tasks: completedTasks }, null, 2)
    );

    // 작업 파일 비우기
    await writeTasks([]);

    return {
      success: true,
      message: `모든 작업이 성공적으로 삭제되었습니다. 총 ${allTasks.length}개 작업이 삭제되었으며, memory 디렉토리에 ${completedTasks.length}개 완료된 작업이 백업되었습니다.`,
      backupFile: backupFileName,
    };
  } catch (error) {
    return {
      success: false,
      message: `작업 삭제 중 오류가 발생했습니다: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}

// 시스템 명령어를 사용하여 작업 메모리 검색
export async function searchTasksWithCommand(
  query: string,
  isId: boolean = false,
  page: number = 1,
  pageSize: number = 5
): Promise<{
  tasks: Task[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalResults: number;
    hasMore: boolean;
  };
}> {
  // 현재 작업 파일에서 작업 읽기
  const currentTasks = await readTasks();
  let memoryTasks: Task[] = [];

  // 메모리 폴더에서 작업 검색
  const MEMORY_DIR = await getMemoryDir();

  try {
    // 메모리 폴더가 존재하는지 확인
    await fs.access(MEMORY_DIR);

    // 검색 명령 생성
    const cmd = generateSearchCommand(query, isId, MEMORY_DIR);

    // 검색 명령이 있으면 실행
    if (cmd) {
      try {
        const { stdout } = await execPromise(cmd, {
          maxBuffer: 1024 * 1024 * 10,
        });

        if (stdout) {
          // 검색 결과 파싱, 일치하는 파일 경로 추출
          const matchedFiles = new Set<string>();

          stdout.split("\n").forEach((line) => {
            if (line.trim()) {
              // 형식은 일반적으로: 파일 경로:일치 내용
              const filePath = line.split(":")[0];
              if (filePath) {
                matchedFiles.add(filePath);
              }
            }
          });

          // 읽을 파일 수 제한
          const MAX_FILES_TO_READ = 10;
          const sortedFiles = Array.from(matchedFiles)
            .sort()
            .reverse()
            .slice(0, MAX_FILES_TO_READ);

          // 조건에 맞는 파일만 처리
          for (const filePath of sortedFiles) {
            try {
              const data = await fs.readFile(filePath, "utf-8");
              const tasks = JSON.parse(data).tasks || [];

              // 날짜 필드 형식 변환
              const formattedTasks = tasks.map((task: any) => ({
                ...task,
                createdAt: task.createdAt
                  ? new Date(task.createdAt)
                  : new Date(),
                updatedAt: task.updatedAt
                  ? new Date(task.updatedAt)
                  : new Date(),
                completedAt: task.completedAt
                  ? new Date(task.completedAt)
                  : undefined,
              }));

              // 추가로 작업 필터링하여 조건에 맞게 보장
              const filteredTasks = isId
                ? formattedTasks.filter((task: Task) => task.id === query)
                : formattedTasks.filter((task: Task) => {
                    const keywords = query
                      .split(/\s+/)
                      .filter((k) => k.length > 0);
                    if (keywords.length === 0) return true;

                    return keywords.every((keyword) => {
                      const lowerKeyword = keyword.toLowerCase();
                      return (
                        task.name.toLowerCase().includes(lowerKeyword) ||
                        task.description.toLowerCase().includes(lowerKeyword) ||
                        (task.notes &&
                          task.notes.toLowerCase().includes(lowerKeyword)) ||
                        (task.implementationGuide &&
                          task.implementationGuide
                            .toLowerCase()
                            .includes(lowerKeyword)) ||
                        (task.summary &&
                          task.summary.toLowerCase().includes(lowerKeyword))
                      );
                    });
                  });

              memoryTasks.push(...filteredTasks);
            } catch (error: unknown) {}
          }
        }
      } catch (error: unknown) {}
    }
  } catch (error: unknown) {}

  // 현재 작업에서 조건에 맞는 작업 필터링
  const filteredCurrentTasks = filterCurrentTasks(currentTasks, query, isId);

  // 결과 병합 및 중복 제거
  const taskMap = new Map<string, Task>();

  // 현재 작업 우선
  filteredCurrentTasks.forEach((task) => {
    taskMap.set(task.id, task);
  });

  // 메모리 작업 추가, 중복 방지
  memoryTasks.forEach((task) => {
    if (!taskMap.has(task.id)) {
      taskMap.set(task.id, task);
    }
  });

  // 병합된 결과
  const allTasks = Array.from(taskMap.values());

  // 정렬 - 업데이트 또는 완료 시간 내림차순
  allTasks.sort((a, b) => {
    // 먼저 완료 시간으로 정렬
    if (a.completedAt && b.completedAt) {
      return b.completedAt.getTime() - a.completedAt.getTime();
    } else if (a.completedAt) {
      return -1; // a가 완료되었지만 b는 아니므로 a가 앞에
    } else if (b.completedAt) {
      return 1; // b가 완료되었지만 a는 아니므로 b가 앞에
    }

    // 그렇지 않으면 업데이트 시간으로 정렬
    return b.updatedAt.getTime() - a.updatedAt.getTime();
  });

  // 페이지 처리
  const totalResults = allTasks.length;
  const totalPages = Math.ceil(totalResults / pageSize);
  const safePage = Math.max(1, Math.min(page, totalPages || 1)); // 페이지 번호 유효성 검사
  const startIndex = (safePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalResults);
  const paginatedTasks = allTasks.slice(startIndex, endIndex);

  return {
    tasks: paginatedTasks,
    pagination: {
      currentPage: safePage,
      totalPages: totalPages || 1,
      totalResults,
      hasMore: safePage < totalPages,
    },
  };
}

// 플랫폼에 맞게 적절한 검색 명령 생성
function generateSearchCommand(
  query: string,
  isId: boolean,
  memoryDir: string
): string {
  // 사용자 입력 안전하게 이스케이프
  const safeQuery = escapeShellArg(query);
  const keywords = safeQuery.split(/\s+/).filter((k) => k.length > 0);

  // 운영 체제 유형 감지
  const isWindows = process.platform === "win32";

  if (isWindows) {
    // Windows 환경, findstr 명령 사용
    if (isId) {
      // ID 검색
      return `findstr /s /i /c:"${safeQuery}" "${memoryDir}\\*.json"`;
    } else if (keywords.length === 1) {
      // 단일 키워드
      return `findstr /s /i /c:"${safeQuery}" "${memoryDir}\\*.json"`;
    } else {
      // 다중 키워드 검색 - Windows에서는 PowerShell 사용
      const keywordPatterns = keywords.map((k) => `'${k}'`).join(" -and ");
      return `powershell -Command "Get-ChildItem -Path '${memoryDir}' -Filter *.json -Recurse | Select-String -Pattern ${keywordPatterns} | ForEach-Object { $_.Path }"`;
    }
  } else {
    // Unix/Linux/MacOS 환경, grep 명령 사용
    if (isId) {
      return `grep -r --include="*.json" "${safeQuery}" "${memoryDir}"`;
    } else if (keywords.length === 1) {
      return `grep -r --include="*.json" "${safeQuery}" "${memoryDir}"`;
    } else {
      // 다중 키워드는 파이프라인을 통해 여러 grep 명령어 연결
      const firstKeyword = escapeShellArg(keywords[0]);
      const otherKeywords = keywords.slice(1).map((k) => escapeShellArg(k));

      let cmd = `grep -r --include="*.json" "${firstKeyword}" "${memoryDir}"`;
      for (const keyword of otherKeywords) {
        cmd += ` | grep "${keyword}"`;
      }
      return cmd;
    }
  }
}

/**
 * 안전하게 shell 매개변수를 이스케이프하여 명령 주입 방지
 */
function escapeShellArg(arg: string): string {
  if (!arg) return "";

  // 모든 제어 문자와 특수 문자 제거
  return arg
    .replace(/[\x00-\x1F\x7F]/g, "") // 제어 문자
    .replace(/[&;`$"'<>|]/g, ""); // Shell 특수 문자
}

// 현재 작업 목록 필터링
function filterCurrentTasks(
  tasks: Task[],
  query: string,
  isId: boolean
): Task[] {
  if (isId) {
    return tasks.filter((task) => task.id === query);
  } else {
    const keywords = query.split(/\s+/).filter((k) => k.length > 0);
    if (keywords.length === 0) return tasks;

    return tasks.filter((task) => {
      return keywords.every((keyword) => {
        const lowerKeyword = keyword.toLowerCase();
        return (
          task.name.toLowerCase().includes(lowerKeyword) ||
          task.description.toLowerCase().includes(lowerKeyword) ||
          (task.notes && task.notes.toLowerCase().includes(lowerKeyword)) ||
          (task.implementationGuide &&
            task.implementationGuide.toLowerCase().includes(lowerKeyword)) ||
          (task.summary && task.summary.toLowerCase().includes(lowerKeyword))
        );
      });
    });
  }
}
