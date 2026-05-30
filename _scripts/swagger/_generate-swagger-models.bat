@echo off
setlocal enabledelayedexpansion

SET "LOG_FILE=%~1"
set "PROJECT_NAME=%~2"
SET "DOT_SEPARATED_MODULE=%~3"
SET "MODULE_TYPE=%~4"
SET "SUB_MODULE_NAME=%~5"

REM Validate required parameters
if "!LOG_FILE!"=="" (
    echo [%time%] [ERROR] Log file parameter is required
    exit /b 1
)
if "!PROJECT_NAME!"=="" (
    echo [%time%] [ERROR] Project name parameter is required
    exit /b 1
)
if "!DOT_SEPARATED_MODULE!"=="" (
    echo [%time%] [ERROR] Module name parameter is required
    exit /b 1
)
if "!MODULE_TYPE!"=="" (
    echo [%time%] [ERROR] Module type parameter is required
    exit /b 1
)

REM Get script root path
for %%I in ("%~dp0.") do set "SCRIPT_ROOT=%%~fI"

SET "DELETE_GENERATED_MODELS_BAT_FILE=%SCRIPT_ROOT%/_delete-generated-models.bat"
set "DASH_SEP_MODULE_NAME=!DOT_SEPARATED_MODULE:.=-!"
set "SLASH_SEP_MODULE_NAME=!DOT_SEPARATED_MODULE:.=\!"

REM Determine module folder path based on project type
if /i "!PROJECT_NAME!" == "lib" (
    SET "MODULE_FOLDER_PATH=!SCRIPT_ROOT!\..\..\!PROJECT_NAME!"
) else if /i "!PROJECT_NAME!" == "olympic" (
    SET "MODULE_FOLDER_PATH=!SCRIPT_ROOT!\..\..\service"
) else (
    if /i "!MODULE_TYPE!" == "adapter" (
        SET "MODULE_FOLDER_PATH=!SCRIPT_ROOT!\..\..\!PROJECT_NAME!\adapter"
    ) else (
        SET "MODULE_FOLDER_PATH=!SCRIPT_ROOT!\..\..\!PROJECT_NAME!\service"
    )
)


if /i "!PROJECT_NAME!" == "olympic" (
    SET "MODULE_FOLDER_PATH=!MODULE_FOLDER_PATH!\!DASH_SEP_MODULE_NAME!\olympic-!DASH_SEP_MODULE_NAME!-model"
) else (
    if /i "!MODULE_TYPE!" == "adapter" (
        SET "MODULE_FOLDER_PATH=!MODULE_FOLDER_PATH!\!DASH_SEP_MODULE_NAME!\!SUB_MODULE_NAME!"
    ) else (
        SET "MODULE_FOLDER_PATH=!MODULE_FOLDER_PATH!\!DASH_SEP_MODULE_NAME!\!DASH_SEP_MODULE_NAME!-model"
    )
)

if /i "!MODULE_TYPE!" == "adapter" (
    SET "GENERATED_PACKAGE_PATH=!MODULE_FOLDER_PATH!\src\main\java\bs\!PROJECT_NAME!\!SLASH_SEP_MODULE_NAME!\adapter\model\generated"
) else (
    SET "GENERATED_PACKAGE_PATH=!MODULE_FOLDER_PATH!\src\main\java\bs\!PROJECT_NAME!\!SLASH_SEP_MODULE_NAME!\model\generated"
)
call :log "N/A" ""
call :log "N/A" ""
call :log "N/A" "============================================="
call :log "N/A" "           Start Generating Models           "
call :log "N/A" "============================================="
call :log "N/A" ""

if exist "!MODULE_FOLDER_PATH!" (
    call :log "INFO" "Entering directory..."
    cd /d "!MODULE_FOLDER_PATH!"
    
    if exist "pom.xml" (
        call :log "INFO" "Clearing generated model package..."
        
        if exist "!GENERATED_PACKAGE_PATH!" (
            rmdir /s /q "!GENERATED_PACKAGE_PATH!" 2>nul
            if exist "!GENERATED_PACKAGE_PATH!" (
                call :log "WARN" "Failed to delete: !GENERATED_PACKAGE_PATH!"
            ) else (
                call :log "INFO" "✓ Generated directory cleared"
            )
        ) else (
            call :log "INFO" "Generated directory does not exist, will create new"
        )
        
        REM Build the Maven command
        set "MAVEN_CMD=mvn generate-sources -Pservice-swagger-models"
        set "MAVEN_CMD=!MAVEN_CMD! -Dproject-name.dot-separated=!PROJECT_NAME!"
        set "MAVEN_CMD=!MAVEN_CMD! -Dservice-name.dot-separated=!DOT_SEPARATED_MODULE!"
        set "MAVEN_CMD=!MAVEN_CMD! -Dservice-name.dash-separated=!DASH_SEP_MODULE_NAME!"
        set "MAVEN_CMD=!MAVEN_CMD! -Dservice-name.slash-separated=!SLASH_SEP_MODULE_NAME!"
        
        call :log "INFO" "Found pom.xml, executing Maven..."
        call :log "INFO" "Command: !MAVEN_CMD!"
        call :log "N/A" ""
        
        REM Maven output to console
        call :log "N/A" "--- MAVEN OUTPUT ---"
        call !MAVEN_CMD!
        
        if errorlevel 1 (
            call :log "ERROR" "Maven execution failed with error code: !errorlevel!"
        ) else (
            call :log "INFO" "Maven execution successful"
        )
        
        if exist "!GENERATED_PACKAGE_PATH!" (
            cd /d "!GENERATED_PACKAGE_PATH!"
            call "!DELETE_GENERATED_MODELS_BAT_FILE!" "!LOG_FILE!" "!PROJECT_NAME!" "!DASH_SEP_MODULE_NAME!" "!GENERATED_PACKAGE_PATH!"
        ) else (
            call :log "WARN" "Generated directory not found: !GENERATED_PACKAGE_PATH!"
        )
    ) else (
        call :log "ERROR" "pom.xml not found in !MODULE_FOLDER_PATH!"
    )
) else (
    call :log "ERROR" "Directory not found: !MODULE_FOLDER_PATH!"
    call :log "INFO" "Please create the directory first"
    call :log "INFO" "Expected path: !MODULE_FOLDER_PATH!"
)

endlocal
exit /b 0

REM ============================================
REM Logging Function (console + file)
REM ============================================

:log
REM Log to both console and file
SET "LOG_LEVEL=%~1"
SET "LOG_MESSAGE=%~2"

if "!LOG_MESSAGE!"=="" (
    echo.
    echo. >> "!LOG_FILE!"
) else (
    if "!LOG_LEVEL!" == "N/A" (
        echo !LOG_MESSAGE!
        echo !LOG_MESSAGE! >> "!LOG_FILE!"
    ) else (
        echo [%time%] [!LOG_LEVEL!] !LOG_MESSAGE!
        echo [%time%] [!LOG_LEVEL!] !LOG_MESSAGE! >> "!LOG_FILE!"
    )
)
goto :eof