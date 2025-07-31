# 자주 묻는 질문 (FAQ)

## 일반적인 질문

### Q: Shrimp Task Manager란 무엇인가요?
A: Shrimp Task Manager는 AI 프로그래밍 어시스턴트를 위한 지능형 작업 관리 시스템입니다. 복잡한 작업을 자동으로 분해하고, 의존성을 관리하며, 실행을 추적하여 효율적인 프로그래밍 워크플로우를 제공합니다.

### Q: MCP란 무엇인가요?
A: MCP(Model Context Protocol)는 AI 모델과 도구 간의 표준화된 통신 프로토콜입니다. 이를 통해 AI 어시스턴트가 다양한 도구와 안전하고 효율적으로 상호작용할 수 있습니다.

### Q: 어떤 AI 모델을 사용할 수 있나요?
A: Claude 3.7, Gemini 2.5 등 대부분의 최신 AI 모델을 사용할 수 있습니다. 프로젝트는 Claude 3.7과 Gemini 2.5에 최적화되어 있습니다.

## 설치 및 설정

### Q: 설치 방법은 어떻게 되나요?
A: 다음 명령어로 설치할 수 있습니다:
```bash
git clone https://github.com/hohollala/TaskManager.git
cd mcp-shrimp-task-manager
npm install
npm run build
```

### Q: Cursor IDE에서 어떻게 설정하나요?
A: Cursor IDE의 설정에서 MCP 서버를 추가하고, 프로젝트의 `dist/index.js` 파일을 실행하도록 설정하면 됩니다.

### Q: 환경 변수는 어떻게 설정하나요?
A: `.env` 파일을 생성하거나 `mcp.json` 설정에서 환경 변수를 직접 설정할 수 있습니다.

## 사용법

### Q: 작업을 어떻게 계획하나요?
A: `plan` 명령어를 사용하여 작업을 계획할 수 있습니다. AI가 작업을 분석하고 세부 작업으로 분해해줍니다.

### Q: 작업을 어떻게 실행하나요?
A: `execute` 명령어를 사용하여 특정 작업을 실행할 수 있습니다. AI가 작업을 단계별로 수행합니다.

### Q: 작업 상태를 어떻게 확인하나요?
A: `list` 명령어를 사용하여 모든 작업의 상태를 확인할 수 있습니다.

## 문제 해결

### Q: "ts-node가 인식되지 않습니다" 오류가 발생합니다.
A: `npm install`을 실행하여 모든 의존성을 설치하세요.

### Q: 환경 변수가 적용되지 않습니다.
A: 애플리케이션을 재시작하고 환경 변수가 올바르게 설정되었는지 확인하세요.

### Q: 작업이 저장되지 않습니다.
A: `DATA_DIR` 환경 변수가 올바르게 설정되었는지 확인하세요.

## 고급 기능

### Q: 프롬프트를 커스터마이징할 수 있나요?
A: 네, 환경 변수를 통해 각 도구의 프롬프트를 커스터마이징할 수 있습니다. 자세한 내용은 [프롬프트 커스터마이제이션 가이드](en/prompt-customization.md)를 참조하세요.

### Q: 다국어를 지원하나요?
A: 네, 영어와 중국어(번체)를 지원합니다. `TEMPLATES_USE` 환경 변수로 언어를 설정할 수 있습니다.

### Q: 웹 GUI를 사용할 수 있나요?
A: 네, `ENABLE_GUI=true` 환경 변수를 설정하여 웹 기반 그래픽 인터페이스를 사용할 수 있습니다.

## 지원 및 기여

### Q: 버그를 신고하려면 어떻게 해야 하나요?
A: [GitHub Issues](https://github.com/hohollala/TaskManager/issues)에서 버그를 신고할 수 있습니다.

### Q: 기능 제안은 어떻게 하나요?
A: [GitHub Issues](https://github.com/hohollala/TaskManager/issues)에서 기능 제안을 할 수 있습니다.

### Q: 프로젝트에 기여하고 싶습니다.
A: [GitHub 저장소](https://github.com/hohollala/TaskManager)에서 Pull Request를 보내주세요.

## 추가 리소스

- [프롬프트 커스터마이제이션 가이드](en/prompt-customization.md)
- [GitHub 저장소](https://github.com/hohollala/TaskManager)
- [GitHub Issues](https://github.com/hohollala/TaskManager/issues) 