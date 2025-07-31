# MCP Shrimp Task Manager 빠른 시작 가이드

## 🚀 시작하기

MCP Shrimp Task Manager를 사용하여 AI 프로그래밍 어시스턴트의 작업을 효율적으로 관리해보세요.

## 📋 설치

### 1. 저장소 클론
```bash
git clone https://github.com/hohollala/TaskManager.git
cd TaskManager
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 프로젝트 빌드
```bash
npm run build
```

### 4. 글로벌 설치
```bash
npm install -g
```

## 🔧 Cursor IDE 설정

### 전역 설정
`~/.cursor/mcp.json` 파일에 다음을 추가하세요:

```json
{
  "mcpServers": {
    "shrimp-task-manager": {
      "command": "node",
      "args": ["/path/to/TaskManager/dist/index.js"],
      "env": {
        "DATA_DIR": "/Users/username/ShrimpData",
        "TEMPLATES_USE": "ko",
        "ENABLE_GUI": "false"
      }
    }
  }
}
```

### 프로젝트별 설정
프로젝트 루트에 `.cursor/mcp.json` 파일을 생성하세요:

```json
{
  "mcpServers": {
    "shrimp-task-manager": {
      "command": "node",
      "args": ["./node_modules/.bin/mcp-shrimp-task-manager"],
      "env": {
        "DATA_DIR": "./.shrimp-data",
        "TEMPLATES_USE": "ko",
        "ENABLE_GUI": "false"
      }
    }
  }
}
```

## 🎯 기본 사용법

### 1. 프로젝트 규칙 초기화
```
init project rules
```

### 2. 작업 계획
```
plan task [작업 설명]
```

### 3. 작업 실행
```
execute task [작업 이름 또는 ID]
```

### 4. 작업 목록 확인
```
list
```

### 5. 작업 분석
```
analyze [작업 ID]
```

## 📚 주요 명령어

| 명령어 | 기능 | 설명 |
|--------|------|------|
| `plan` | 작업 계획 | 새 작업을 계획하고 생성 |
| `analyze` | 작업 분석 | 작업 요구사항을 깊이 분석 |
| `reflect` | 작업 검토 | 작업 접근 방식을 검토하고 개선 |
| `split` | 작업 분할 | 큰 작업을 작은 단위로 분할 |
| `list` | 작업 목록 | 모든 작업 보기 |
| `execute` | 작업 실행 | 선택된 작업 실행 |
| `verify` | 작업 확인 | 작업 완료 검증 |
| `delete` | 작업 삭제 | 개별 작업 삭제 |
| `clear_all` | 전체 삭제 | 모든 작업 삭제 |
| `update` | 작업 업데이트 | 작업 내용 수정 |
| `query` | 작업 검색 | 작업 검색 |
| `detail` | 작업 세부사항 | 작업 세부 정보 보기 |
| `process` | 사고 과정 | 단계별 사고 |
| `init` | 규칙 설정 | 프로젝트 개발 규칙 설정 |
| `research` | 연구 모드 | 기술 연구 모드 |

## 🔍 환경 변수

| 변수 | 기본값 | 설명 |
|------|--------|------|
| `DATA_DIR` | `./data` | 작업 데이터 저장 디렉토리 |
| `TEMPLATES_USE` | `en` | 사용할 프롬프트 템플릿 언어 (`en` 또는 `ko`) |
| `ENABLE_GUI` | `false` | 웹 GUI 활성화 여부 |
| `WEB_PORT` | 자동 선택 | 웹 GUI 포트 (ENABLE_GUI=true일 때) |

## 💡 팁

1. **작업 계획**: 복잡한 작업을 시작하기 전에 `plan` 명령어로 체계적으로 계획하세요.
2. **작업 분할**: 큰 작업은 `split` 명령어로 작은 단위로 나누어 관리하세요.
3. **실행 추적**: `list` 명령어로 현재 작업 상태를 확인하세요.
4. **완성도 검증**: 작업 완료 후 `verify` 명령어로 결과를 검증하세요.

## 🆘 문제 해결

### 설치 문제
- Node.js 18 이상이 설치되어 있는지 확인하세요
- npm 캐시를 정리해보세요: `npm cache clean --force`

### Cursor IDE 연결 문제
- MCP 설정 파일의 경로가 올바른지 확인하세요
- Cursor IDE를 재시작해보세요

### 작업 데이터 문제
- `DATA_DIR` 환경 변수가 올바르게 설정되어 있는지 확인하세요
- 데이터 디렉토리에 쓰기 권한이 있는지 확인하세요

## 📞 지원

문제가 발생하면 다음을 확인하세요:
- [FAQ](faq.md) 페이지
- [GitHub Issues](https://github.com/hohollala/TaskManager/issues)

---

**즐거운 코딩 되세요! 🎉** 