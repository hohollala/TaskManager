@echo off
echo 🚀 Shrimp Task Manager - Gemini CLI Version
echo.

REM Python이 설치되어 있는지 확인
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo 📦 Python 서버를 시작합니다...
    python serve-gemini.py
    goto :end
)

REM Node.js가 설치되어 있는지 확인
node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo 📦 Node.js 서버를 시작합니다...
    node serve-gemini.js
    goto :end
)

REM 둘 다 없으면 브라우저에서 직접 열기
echo 🌐 브라우저에서 직접 HTML 파일을 엽니다...
start gemini-cli-version.html

:end
pause 