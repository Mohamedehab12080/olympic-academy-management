@echo off
title Olympic Academy Management System
chcp 65001 >nul

echo ========================================
echo   Olympic Academy Management System
echo   Version 1.0
echo ========================================
echo.

REM Get the folder where this batch file is located
set "APP_DIR=%~dp0"
cd /d "%APP_DIR%"

echo Application Directory: %CD%
echo.

REM Check if dist folder exists
if not exist "%CD%\dist\olympic-academy-working\index.html" (
    echo [ERROR] Application files not found!
    echo.
    echo Expected: %CD%\dist\olympic-academy-working\index.html
    echo.
    echo Please make sure the dist folder is in the same location as this batch file.
    echo.
    pause
    exit /b 1
)

echo [OK] Application files found.
echo.

REM Check Python
where python >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed!
    echo.
    echo Please install Python from: https://www.python.org/downloads/
    echo Make sure to check "Add Python to PATH" during installation.
    echo.
    start https://www.python.org/downloads/
    pause
    exit /b 1
)

echo [OK] Python found.
python --version
echo.

echo ========================================
echo   Starting the application...
echo   Open http://localhost:4200 in your browser
echo   Press Ctrl+C to stop the server
echo ========================================
echo.

REM Open browser after a short delay
start /b "" cmd /c "timeout /t 2 >nul && start http://localhost:4200"

REM Start Python HTTP server
cd dist\olympic-academy-working
python -m http.server 4200

pause