@echo off
echo 🚀 MCP Shrimp Task Manager 설치를 시작합니다...

REM 1. 의존성 설치
echo 📦 의존성 설치 중...
npm install

REM 2. 프로젝트 빌드
echo 🔨 프로젝트 빌드 중...
npm run build

REM 3. 글로벌 설치
echo 🌐 글로벌 설치 중...
npm install -g .

REM 4. 명령어 파일 생성
echo 📝 명령어 파일 생성 중...
npm run generate-commands

REM 5. Claude MCP 서버 추가
echo 🔌 Claude MCP 서버 추가 중...
where claude >nul 2>&1
if %errorlevel% equ 0 (
    claude mcp add shrimp-task-manager -- node dist/index.js
    echo ✅ Claude MCP 서버가 성공적으로 추가되었습니다!
    echo 📋 설치된 MCP 서버 목록:
    claude mcp list
) else (
    echo ⚠️  Claude CLI가 설치되어 있지 않습니다.
    echo    다음 명령어로 Claude MCP 서버를 수동으로 추가하세요:
    echo    claude mcp add shrimp-task-manager -- node dist/index.js
)

echo 🎉 설치가 완료되었습니다!
echo 📖 사용법: claude mcp list
pause 