@echo off
setlocal

if "%~1"=="" (
    echo ❌ 사용법: add-mcp.bat [서버이름]
    echo 예시: add-mcp.bat shrimp-task-manager
    exit /b 1
)

set SERVER_NAME=%~1
set CURRENT_DIR=%~dp0
set DIST_PATH=%CURRENT_DIR%dist\index.js

echo 🔧 MCP 서버 '%SERVER_NAME%' 추가 중...
echo 📁 경로: %DIST_PATH%

claude mcp remove %SERVER_NAME% -s user 2>nul
claude mcp add %SERVER_NAME% -s user -- node "%DIST_PATH%"

if %ERRORLEVEL% EQU 0 (
    echo ✅ MCP 서버 '%SERVER_NAME%' 추가 완료!
    echo.
    echo 📊 현재 MCP 서버 상태:
    claude mcp list
) else (
    echo ❌ MCP 서버 추가 실패
    exit /b 1
) 