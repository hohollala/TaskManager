[English](../en/prompt-customization.md) | [中文](../zh/prompt-customization.md)

# 프롬프트 커스터마이제이션 가이드

## 개요

이 시스템은 환경 변수를 통해 각 도구 함수의 프롬프트 내용을 사용자가 커스터마이징할 수 있도록 합니다. 이를 통해 높은 유연성을 제공하여 코드를 수정하지 않고도 특정 요구사항에 따라 AI 어시스턴트의 동작을 조정할 수 있습니다. 두 가지 커스터마이제이션 방법이 있습니다:

1. **오버라이드 모드**: 원본 프롬프트를 완전히 교체
2. **추가 모드**: 기존 프롬프트에 새로운 내용 추가

## 환경 변수 명명 규칙

- 오버라이드 모드: `MCP_PROMPT_[FUNCTION_NAME]`
- 추가 모드: `MCP_PROMPT_[FUNCTION_NAME]_APPEND`

여기서 `[FUNCTION_NAME]`은 대문자로 된 도구 함수의 이름입니다. 예를 들어, 작업 계획 함수 `planTask`의 경우 해당 환경 변수 이름은 `MCP_PROMPT_PLAN_TASK`입니다.

## 다국어 프롬프트 템플릿

Shrimp Task Manager는 `TEMPLATES_USE` 환경 변수를 통해 설정 가능한 다국어 프롬프트 템플릿을 지원합니다:

- 현재 지원되는 언어: `en` (영어) 및 `zh` (번체 중국어)
- 기본값은 `en` (영어)

### 언어 전환

`mcp.json` 설정에서 설정:

```json
"env": {
  "TEMPLATES_USE": "zh"  // 번체 중국어 템플릿 사용
}
```

또는 `.env` 파일에서:

```
TEMPLATES_USE=zh
```

### 사용자 정의 템플릿

자신만의 템플릿 세트를 만들 수 있습니다:

1. 기존 템플릿 세트(예: `src/prompts/templates_en` 또는 `src/prompts/templates_zh`)를 `DATA_DIR`로 지정된 디렉토리에 복사
2. 복사된 디렉토리 이름 변경(예: `my_templates`)
3. 요구사항에 맞게 템플릿 파일 수정
4. `TEMPLATES_USE` 환경 변수를 템플릿 디렉토리 이름으로 설정:

```json
"env": {
  "DATA_DIR": "/path/to/project/data",
  "TEMPLATES_USE": "my_templates"
}
```

시스템은 사용자 정의 템플릿을 우선시하고 특정 템플릿 파일을 찾을 수 없는 경우 내장된 영어 템플릿으로 폴백합니다.

## 지원되는 도구 함수

시스템의 모든 주요 함수는 환경 변수를 통한 프롬프트 커스터마이제이션을 지원합니다:

| 함수 이름         | 환경 변수 접두사              | 설명                    |
| ----------------- | ----------------------------- | ----------------------- |
| `planTask`        | `MCP_PROMPT_PLAN_TASK`        | 작업 계획               |
| `analyzeTask`     | `MCP_PROMPT_ANALYZE_TASK`     | 작업 분석               |
| `reflectTask`     | `MCP_PROMPT_REFLECT_TASK`     | 솔루션 평가             |
| `splitTasks`      | `MCP_PROMPT_SPLIT_TASKS`      | 작업 분할               |
| `executeTask`     | `MCP_PROMPT_EXECUTE_TASK`     | 작업 실행               |
| `verifyTask`      | `MCP_PROMPT_VERIFY_TASK`      | 작업 검증               |
| `listTasks`       | `MCP_PROMPT_LIST_TASKS`       | 작업 목록               |
| `queryTask`       | `MCP_PROMPT_QUERY_TASK`       | 작업 쿼리               |
| `getTaskDetail`   | `MCP_PROMPT_GET_TASK_DETAIL`  | 작업 세부사항 가져오기  |
| `processThought`  | `MCP_PROMPT_PROCESS_THOUGHT`  | 사고 체인 처리          |
| `initProjectRules`| `MCP_PROMPT_INIT_PROJECT_RULES`| 프로젝트 규칙 초기화    |

## 환경 변수 설정 방법

두 가지 주요 설정 방법이 있습니다:

### 1. `.env` 파일 사용

프로젝트 레벨에서 환경 변수를 설정하기 위해 `.env` 파일을 사용합니다:

1. 프로젝트 루트 디렉토리에서 `.env.example`을 `.env`로 복사
2. 필요한 환경 변수 설정 추가
3. 애플리케이션 시작 시 이러한 환경 변수를 자동으로 로드

```
# .env 파일 예시
MCP_PROMPT_PLAN_TASK=사용자 정의 프롬프트 내용
MCP_PROMPT_ANALYZE_TASK=사용자 정의 분석 프롬프트 내용
```

> 참고: `.env` 파일이 버전 관리에서 무시되도록 하세요(`.gitignore`에 추가), 특히 민감한 정보가 포함된 경우.

### 2. mcp.json에서 직접 설정

별도의 `.env` 파일 없이 Cursor IDE의 `mcp.json` 설정 파일에서 환경 변수를 직접 설정할 수도 있습니다:

```json
{
  "mcpServers": {
    "shrimp-task-manager": {
      "command": "node",
      "args": ["/path/to/mcp-shrimp-task-manager/dist/index.js"],
      "env": {
        "DATA_DIR": "/path/to/project/data",
        "MCP_PROMPT_PLAN_TASK": "사용자 정의 작업 계획 프롬프트",
        "MCP_PROMPT_EXECUTE_TASK_APPEND": "추가 실행 가이드"
      }
    }
  }
}
```

이 방법은 프롬프트 설정을 다른 MCP 설정과 함께 유지할 수 있는 장점이 있어, 다른 프로젝트에서 다른 프롬프트가 필요한 경우에 특히 유용합니다.

## 사용 예시

### 오버라이드 모드 예시

```
# .env 파일에서 - PLAN_TASK 프롬프트를 완전히 교체
MCP_PROMPT_PLAN_TASK=## 사용자 정의 작업 계획\n\n다음 정보를 기반으로 작업을 계획해 주세요:\n\n{description}\n\n요구사항: {requirements}\n
```

또는 mcp.json에서 설정:

```json
"env": {
  "MCP_PROMPT_PLAN_TASK": "## 사용자 정의 작업 계획\n\n다음 정보를 기반으로 작업을 계획해 주세요:\n\n{description}\n\n요구사항: {requirements}\n"
}
```

### 추가 모드 예시

```
# .env 파일에서 - 원본 PLAN_TASK 프롬프트 뒤에 내용 추가
MCP_PROMPT_PLAN_TASK_APPEND=\n\n## 추가 가이드\n\n다음 사항에 특별히 주의해 주세요:\n1. 작업 의존성 우선순위 지정\n2. 작업 결합 최소화
```

또는 mcp.json에서 설정:

```json
"env": {
  "MCP_PROMPT_PLAN_TASK_APPEND": "\n\n## 추가 가이드\n\n다음 사항에 특별히 주의해 주세요:\n1. 작업 의존성 우선순위 지정\n2. 작업 결합 최소화"
}
```

## 동적 매개변수 지원

사용자 정의 프롬프트는 `{paramName}` 구문을 사용하여 정의된 동적 매개변수도 사용할 수 있습니다. 시스템은 처리 중에 이러한 플레이스홀더를 실제 매개변수 값으로 교체합니다.

각 함수에서 지원하는 매개변수는 다음과 같습니다:

### planTask 지원 매개변수

- `{description}` - 작업 설명
- `{requirements}` - 작업 요구사항
- `{existingTasksReference}` - 기존 작업 참조 여부
- `{completedTasks}` - 완료된 작업 목록
- `{pendingTasks}` - 대기 중인 작업 목록
- `{memoryDir}` - 작업 메모리 저장 디렉토리

### analyzeTask 지원 매개변수

- `{summary}` - 작업 요약
- `{initialConcept}` - 초기 개념
- `{previousAnalysis}` - 이전 분석 결과

### reflectTask 지원 매개변수

- `{summary}` - 작업 요약
- `{analysis}` - 분석 결과

### splitTasks 지원 매개변수

- `{updateMode}` - 업데이트 모드
- `{createdTasks}` - 생성된 작업
- `{allTasks}` - 모든 작업

### executeTask 지원 매개변수

- `{task}` - 작업 세부사항
- `{complexityAssessment}` - 복잡성 평가 결과
- `{relatedFilesSummary}` - 관련 파일 요약
- `{dependencyTasks}` - 의존성 작업
- `{potentialFiles}` - 잠재적으로 관련된 파일

### verifyTask 지원 매개변수

- `{task}` - 작업 세부사항

### listTasks 지원 매개변수

- `{status}` - 작업 상태
- `{tasks}` - 상태별로 그룹화된 작업
- `{allTasks}` - 모든 작업

### queryTask 지원 매개변수

- `{query}` - 쿼리 내용
- `{isId}` - ID 쿼리 여부
- `{tasks}` - 쿼리 결과
- `{totalTasks}` - 총 결과 수
- `{page}` - 현재 페이지 번호
- `{pageSize}` - 페이지 크기
- `{totalPages}` - 총 페이지 수

### getTaskDetail 지원 매개변수

- `{taskId}` - 작업 ID
- `{task}` - 작업 세부사항
- `{error}` - 오류 메시지(있는 경우)

## 고급 커스터마이제이션 사례

### 예시 1: 브랜드 커스터마이제이션 프롬프트 추가

모든 작업 실행 가이드에 회사별 브랜드 정보와 지침을 추가하고 싶다고 가정합니다:

```
# .env 파일에서
MCP_PROMPT_EXECUTE_TASK_APPEND=\n\n## 회사별 지침\n\n작업을 실행할 때 다음 원칙을 따르세요:\n1. 회사 스타일 가이드와 일치하는 코드 유지\n2. 모든 새 기능에는 해당 단위 테스트 필요\n3. 문서는 회사 표준 템플릿 사용\n4. 모든 사용자 인터페이스 요소가 브랜드 디자인 사양을 준수하는지 확인
```

또는 mcp.json에서 설정:

```json
"env": {
  "MCP_PROMPT_EXECUTE_TASK_APPEND": "\n\n## 회사별 지침\n\n작업을 실행할 때 다음 원칙을 따르세요:\n1. 회사 스타일 가이드와 일치하는 코드 유지\n2. 모든 새 기능에는 해당 단위 테스트 필요\n3. 문서는 회사 표준 템플릿 사용\n4. 모든 사용자 인터페이스 요소가 브랜드 디자인 사양을 준수하는지 확인"
}
```

### 예시 2: 작업 분석 스타일 조정

작업 분석을 더 보안 중심으로 만들고 싶다고 가정합니다:

```
# .env 파일에서
MCP_PROMPT_ANALYZE_TASK=## 보안 중심 작업 분석\n\n다음 작업에 대한 포괄적인 보안 분석을 수행해 주세요:\n\n**작업 요약:**\n{summary}\n\n**초기 개념:**\n{initialConcept}\n\n분석 중 다음 사항에 특별히 주의해 주세요:\n1. 코드 주입 위험\n2. 권한 관리 문제\n3. 데이터 검증 및 살균\n4. 타사 종속성의 보안 위험\n5. 잠재적 구성 오류\n\n각 잠재적 문제에 대해 다음을 제공해 주세요:\n- 문제 설명\n- 영향 수준 (낮음/중간/높음)\n- 권장 솔루션\n\n{previousAnalysis}
```

또는 mcp.json에서 설정:

```json
"env": {
  "MCP_PROMPT_ANALYZE_TASK": "## 보안 중심 작업 분석\n\n다음 작업에 대한 포괄적인 보안 분석을 수행해 주세요:\n\n**작업 요약:**\n{summary}\n\n**초기 개념:**\n{initialConcept}\n\n분석 중 다음 사항에 특별히 주의해 주세요:\n1. 코드 주입 위험\n2. 권한 관리 문제\n3. 데이터 검증 및 살균\n4. 타사 종속성의 보안 위험\n5. 잠재적 구성 오류\n\n각 잠재적 문제에 대해 다음을 제공해 주세요:\n- 문제 설명\n- 영향 수준 (낮음/중간/높음)\n- 권장 솔루션\n\n{previousAnalysis}"
}
```

### 예시 3: 작업 목록 표시 단순화

기본 작업 목록이 너무 자세하다고 생각하면 표시를 단순화할 수 있습니다:

```
# .env 파일에서
MCP_PROMPT_LIST_TASKS=# 작업 개요\n\n## 대기 중인 작업\n{tasks.pending}\n\n## 진행 중인 작업\n{tasks.in_progress}\n\n## 완료된 작업\n{tasks.completed}
```

또는 mcp.json에서 설정:

```json
"env": {
  "MCP_PROMPT_LIST_TASKS": "# 작업 개요\n\n## 대기 중인 작업\n{tasks.pending}\n\n## 진행 중인 작업\n{tasks.in_progress}\n\n## 완료된 작업\n{tasks.completed}"
}
```

## 모범 사례

1. **점진적 조정**: 작은 변경사항부터 시작하고 각 수정 후 시스템이 여전히 제대로 작동하는지 확인하세요.

2. **설정 저장**: 효과적인 환경 변수 설정을 프로젝트의 `.env.example` 파일에 저장하여 팀원들이 참조할 수 있도록 하세요.

3. **형식 주의**: 프롬프트에서 적절한 줄바꿈과 형식을 보장하세요, 특히 따옴표로 묶인 환경 변수에서.

4. **테스트 및 검증**: 다양한 상황에서 사용자 정의 프롬프트를 테스트하여 다양한 상황에서 제대로 작동하는지 확인하세요.

5. **작업 흐름 고려**: 프롬프트를 수정할 때 전체 작업 흐름을 고려하여 다른 단계 간의 일관성을 보장하세요.

## 문제 해결

- **환경 변수가 적용되지 않음**: 환경 변수를 올바르게 설정했는지 확인하고 설정 후 애플리케이션을 재시작하세요.

- **형식 문제**: 환경 변수의 줄바꿈과 특수 문자가 올바르게 이스케이프되었는지 확인하세요.

- **매개변수 교체 실패**: 사용하는 매개변수 이름이 시스템에서 지원하는 것과 일치하는지 확인하세요(대소문자 구분 포함).

- **기본 설정 복원**: 사용자 정의 프롬프트로 인한 문제가 발생하면 해당 환경 변수를 삭제하여 기본 설정을 복원할 수 있습니다.

## 부록: 기본 프롬프트 참조
