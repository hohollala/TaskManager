// 작업 상태 열거형: 작업이 워크플로우에서 현재 위치하는 단계를 정의
export enum TaskStatus {
  PENDING = "pending", // 생성되었지만 아직 실행되지 않은 작업
  IN_PROGRESS = "in_progress", // 현재 실행 중인 작업
  COMPLETED = "completed", // 성공적으로 완료되고 검증된 작업
  BLOCKED = "blocked", // 의존성으로 인해 임시로 실행할 수 없는 작업
}

// 작업 의존성: 작업 간의 전제 조건 관계를 정의
export interface TaskDependency {
  taskId: string; // 선행 작업의 고유 식별자, 현재 작업 실행 전에 이 의존성 작업을 완료해야 함
}

// 관련 파일 유형: 파일과 작업의 관계 유형을 정의
export enum RelatedFileType {
  TO_MODIFY = "TO_MODIFY", // 작업에서 수정해야 하는 파일
  REFERENCE = "REFERENCE", // 작업의 참조 자료 또는 관련 문서
  CREATE = "CREATE", // 작업에서 생성해야 하는 파일
  DEPENDENCY = "DEPENDENCY", // 작업이 의존하는 구성 요소 또는 라이브러리 파일
  OTHER = "OTHER", // 기타 유형의 관련 파일
}

// 관련 파일: 작업과 관련된 파일 정보를 정의
export interface RelatedFile {
  path: string; // 파일 경로, 프로젝트 루트 디렉토리 기준의 상대 경로 또는 절대 경로일 수 있음
  type: RelatedFileType; // 파일과 작업의 관계 유형
  description?: string; // 파일의 보충 설명, 작업과의 구체적인 관계나 용도를 설명
  lineStart?: number; // 관련 코드 블록의 시작 줄 (선택사항)
  lineEnd?: number; // 관련 코드 블록의 끝 줄 (선택사항)
}

// 작업 인터페이스: 작업의 완전한 데이터 구조를 정의
export interface Task {
  id: string; // 작업의 고유 식별자
  name: string; // 간결하고 명확한 작업 이름
  description: string; // 상세한 작업 설명, 구현 요점과 검수 기준을 포함
  notes?: string; // 보충 설명, 특별한 처리 요구사항 또는 구현 제안 (선택사항)
  status: TaskStatus; // 작업의 현재 실행 상태
  dependencies: TaskDependency[]; // 작업의 선행 의존성 관계 목록
  createdAt: Date; // 작업 생성 타임스탬프
  updatedAt: Date; // 작업 마지막 업데이트 타임스탬프
  completedAt?: Date; // 작업 완료 타임스탬프 (완료된 작업에만 적용)
  summary?: string; // 작업 완료 요약, 구현 결과와 중요한 결정사항을 간결하게 설명 (완료된 작업에만 적용)
  relatedFiles?: RelatedFile[]; // 작업과 관련된 파일 목록 (선택사항)

  // 새 필드: 완전한 기술 분석 결과 저장
  analysisResult?: string; // analyze_task와 reflect_task 단계에서 온 완전한 분석 결과

  // 새 필드: 구체적인 구현 가이드 저장
  implementationGuide?: string; // 구체적인 구현 방법, 단계 및 제안

  // 새 필드: 검증 기준과 검사 방법 저장
  verificationCriteria?: string; // 명확한 검증 기준, 테스트 요점 및 검수 조건
}

// 작업 복잡도 수준: 작업의 복잡한 정도 분류를 정의
export enum TaskComplexityLevel {
  LOW = "낮은 복잡도", // 간단하고 직접적인 작업, 보통 특별한 처리가 필요하지 않음
  MEDIUM = "중간 복잡도", // 어느 정도 복잡성은 있지만 여전히 관리 가능한 작업
  HIGH = "높은 복잡도", // 복잡하고 시간이 많이 걸리는 작업, 특별한 주의가 필요
  VERY_HIGH = "매우 높은 복잡도", // 극도로 복잡한 작업, 분할 처리를 권장
}

// 작업 복잡도 임계값: 작업 복잡도 평가의 참조 기준을 정의
export const TaskComplexityThresholds = {
  DESCRIPTION_LENGTH: {
    MEDIUM: 500, // 이 글자 수를 초과하면 중간 복잡도로 판정
    HIGH: 1000, // 이 글자 수를 초과하면 높은 복잡도로 판정
    VERY_HIGH: 2000, // 이 글자 수를 초과하면 매우 높은 복잡도로 판정
  },
  DEPENDENCIES_COUNT: {
    MEDIUM: 2, // 이 의존성 수를 초과하면 중간 복잡도로 판정
    HIGH: 5, // 이 의존성 수를 초과하면 높은 복잡도로 판정
    VERY_HIGH: 10, // 이 의존성 수를 초과하면 매우 높은 복잡도로 판정
  },
  NOTES_LENGTH: {
    MEDIUM: 200, // 이 글자 수를 초과하면 중간 복잡도로 판정
    HIGH: 500, // 이 글자 수를 초과하면 높은 복잡도로 판정
    VERY_HIGH: 1000, // 이 글자 수를 초과하면 매우 높은 복잡도로 판정
  },
};

// 작업 복잡도 평가 결과: 작업 복잡도 분석의 상세 결과를 기록
export interface TaskComplexityAssessment {
  level: TaskComplexityLevel; // 전체 복잡도 수준
  metrics: {
    // 각 평가 지표의 상세 데이터
    descriptionLength: number; // 설명 길이
    dependenciesCount: number; // 의존성 수
    notesLength: number; // 메모 길이
    hasNotes: boolean; // 메모가 있는지 여부
  };
  recommendations: string[]; // 처리 제안 목록
}
