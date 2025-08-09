import { z } from "zod";
import { getAllTasks } from "../../models/taskModel.js";
import { TaskStatus } from "../../types/index.js";
import { executeTask } from "./executeTask.js";

// 작업 계속하기 도구
export const continueTaskSchema = z.object({
  // 매개변수 없음 - 자동으로 진행 중인 작업을 찾아서 계속
});

export async function continueTask() {
  try {
    // 모든 작업 가져오기
    const allTasks = await getAllTasks();
    
    // 진행 중인 작업 찾기
    const inProgressTasks = allTasks.filter(task => task.status === TaskStatus.IN_PROGRESS);
    
    if (inProgressTasks.length === 0) {
      // 진행 중인 작업이 없으면 가장 최근의 pending 작업 찾기
      const pendingTasks = allTasks
        .filter(task => task.status === TaskStatus.PENDING)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      if (pendingTasks.length === 0) {
        return {
          content: [
            {
              type: "text" as const,
              text: `## 계속할 작업 없음

현재 진행 중인 작업이나 대기 중인 작업이 없습니다.

**다음 단계:**
- \`/stm:list\` - 모든 작업 상태 확인
- \`/stm:plan\` - 새로운 작업 계획 수립`,
            },
          ],
        };
      }
      
      // 가장 최근 pending 작업 실행
      const nextTask = pendingTasks[0];
      console.log(`📋 마지막 작업을 계속합니다: ${nextTask.name}`);
      console.log(`☐ ${nextTask.name} (시작 중...)`);
      
      // executeTask 함수 호출 (관련 파일 로딩 건너뛰기)
      return await executeTask({ taskId: nextTask.id }, { skipFileLoading: true });
    }
    
    if (inProgressTasks.length === 1) {
      // 진행 중인 작업이 하나면 그것을 계속
      const currentTask = inProgressTasks[0];
      console.log(`📋 진행 중인 작업을 계속합니다: ${currentTask.name}`);
      console.log(`🔄 ${currentTask.name} (진행 중)`);
      
      // executeTask 함수 호출 (이미 진행 중이라는 메시지와 함께 작업 가이드 제공, 관련 파일 로딩 건너뛰기)
      return await executeTask({ taskId: currentTask.id }, { skipFileLoading: true });
    }
    
    // 여러 개의 진행 중인 작업이 있는 경우
    const taskList = inProgressTasks
      .map((task, index) => `${index + 1}. **${task.name}** (ID: \`${task.id}\`)`)
      .join('\n');
    
    console.log(`📋 진행 중인 작업이 ${inProgressTasks.length}개 있습니다:`);
    inProgressTasks.forEach((task, index) => {
      console.log(`🔄 ${index + 1}. ${task.name}`);
    });
    
    return {
      content: [
        {
          type: "text" as const,
          text: `## 여러 진행 중인 작업 발견

현재 ${inProgressTasks.length}개의 작업이 진행 중입니다:

${taskList}

**다음 단계:**
- \`/stm:execute [작업ID]\` - 특정 작업 계속하기
- \`/stm:list\` - 전체 작업 상태 확인

**권장:** 한 번에 하나의 작업만 진행하는 것이 좋습니다.`,
        },
      ],
    };
    
  } catch (error) {
    return {
      content: [
        {
          type: "text" as const,
          text: `## 오류 발생

작업을 계속하는 중 오류가 발생했습니다: ${error instanceof Error ? error.message : String(error)}

\`/stm:list\`를 사용해서 작업 상태를 확인해주세요.`,
        },
      ],
    };
  }
}