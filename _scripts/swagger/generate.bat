@echo off
setlocal enabledelayedexpansion

SET ROOT_SCRIPT_PATH=%cd%
SET LOG_FILE=%ROOT_SCRIPT_PATH%\..\..\logs\swagger_generator_%date:~-4,4%%date:~-7,2%%date:~-10,2%.log

REM Clear and initialize log file
echo. > "%LOG_FILE%"

REM Initialize log file
call :log "N/A" ""
call :log "N/A" ""
call :log "N/A" "============================================="
call :log "N/A" "            SWAGGER GENERATOR LOG            "
call :log "N/A" "============================================="
call :log "N/A" "Timestamp: %date% %time%"
call :log "N/A" ""

REM ============================================
REM Swagger Generator
REM Supports both: --project lib AND --project=lib
REM ============================================

SET GENERATE_MODEL_BAT_FILE=./_generate-swagger-models.bat
SET GENERATE_CONTROLLER_BAT_FILE=./_generate-swagger-controllers.bat

set "PROJECT_NAME="
set "MODULE_NAME="
set "TASKS="

REM ============================================
REM Robust argument parsing
REM ============================================

call :log "N/A" ""
call :log "N/A" ""
call :log "N/A" "============================================="
call :log "N/A" "        Start Parsing Generator Input        "
call :log "N/A" "============================================="
call :log "N/A" ""

if "%~1"=="" (
    call :show_help
    exit /b 1
)

:parse_loop
if "%~1"=="" goto parse_done

set "CURRENT_ARG=%~1"
set "NEXT_ARG=%~2"

REM Debug: Show what we're parsing
call :log "DEBUG" "Parsing: !CURRENT_ARG!"

REM Method 1: Check for equals sign format first (--project=value)
set "HAS_EQUALS="
for /f "tokens=1,2 delims==" %%a in ("!CURRENT_ARG!") do (
    if "%%b" neq "" (
        set "HAS_EQUALS=yes"
        set "ARG_NAME=%%a"
        set "ARG_VALUE=%%b"
    )
)

if "!HAS_EQUALS!"=="yes" (
    REM Handle equals sign format
    if /i "!ARG_NAME!"=="--project" (
        set "PROJECT_NAME=!ARG_VALUE!"
        shift
        goto parse_loop
    )
    if /i "!ARG_NAME!"=="--module" (
        set "MODULE_NAME=!ARG_VALUE!"
        shift
		goto parse_loop
    )
)


REM Method 2: Check for flags with separate values (--project value)
if /i "!CURRENT_ARG!"=="--project" (
    if "!NEXT_ARG!"=="" (
        call :log "ERROR" "Argument --project requires a value"
        call :log "N/A" ""
        exit /b 1
    )
    set "PROJECT_NAME=!NEXT_ARG!"
	call :log "INFO" "Project Name	: !PROJECT_NAME!"
	call :log "N/A" ""
    shift
    shift
    goto parse_loop
)

if /i "!CURRENT_ARG!"=="--module" (
    if "!NEXT_ARG!"=="" (
        call :log "ERROR" "Argument --module requires a value"
        call :log "N/A" ""
        exit /b 1
    )
    set "MODULE_NAME=!NEXT_ARG!"
	call :log "INFO" "Module Name	: !MODULE_NAME!"
	call :log "N/A" ""
    shift
    shift
    goto parse_loop
)

if /i "!CURRENT_ARG!"=="--subModule" (
    if "!NEXT_ARG!"=="" (
        call :log "ERROR" "Argument --subModule requires a value"
        call :log "N/A" ""
        exit /b 1
    )
    set "SUB_MODULE_NAME=!NEXT_ARG!"
	call :log "INFO" "Sub Module Name	: !SUB_MODULE_NAME!"
	call :log "N/A" ""
    shift
    shift
    goto parse_loop
)

REM Method 3: Check for flags (no values)
if /i "!CURRENT_ARG!"=="--model" (
    set "TASKS=!TASKS! model"
    shift
    goto parse_loop
) else if /i "!CURRENT_ARG!"=="--interface" (
    set "TASKS=!TASKS! interface"
    shift
    goto parse_loop
) else if /i "!CURRENT_ARG!"=="--core" (
      set "TASKS=!TASKS! core"
      shift
      goto parse_loop
) else if /i "!CURRENT_ARG!"=="--adapter" (
      set "TASKS=!TASKS! adapter"
      shift
      goto parse_loop
) else if /i "!CURRENT_ARG!"=="--help" (
    call :show_help
    exit /b 0
)
call :log "N/A" ""

REM Unknown argument
call :log "WARN" "Ignoring unknown argument: !CURRENT_ARG!"
shift
goto parse_loop

:parse_done

call :log "INFO" "Tasks		: !TASKS!"
call :log "N/A" ""

if "!PROJECT_NAME!"=="" (
    call :log "ERROR" "Project Name is required (use --project=NAME)"
    call :log "N/A" ""
    call :show_usage
    exit /b 1
)

if "!MODULE_NAME!"=="" (
    call :log "ERROR" "Module Name is required (use --module=NAME)"
    call :log "N/A" ""
    call :show_usage
    exit /b 1
)

if "!TASKS!"=="" (
    call :log "INFO" "No tasks specified. Use --adapter, --model, --interface, or --core"
    call :log "N/A" ""
    call :show_usage
    exit /b 0
)

REM Process each task
for %%T in (!TASKS!) do (
    call :log "INFO" "Executing task: %%T"
    if "%%T"=="model" (
        CALL "!GENERATE_MODEL_BAT_FILE!" "!LOG_FILE!" "!PROJECT_NAME!" "!MODULE_NAME!" "%%T"
    )
    if "%%T"=="interface" (
        CALL "!GENERATE_CONTROLLER_BAT_FILE!" "!LOG_FILE!" "!PROJECT_NAME!" "!MODULE_NAME!" "%%T"
    )
    if "%%T"=="core" (
        CALL "!GENERATE_CONTROLLER_BAT_FILE!" "!LOG_FILE!" "!PROJECT_NAME!" "!MODULE_NAME!" "%%T"
    )
    if "%%T"=="adapter" (
        CALL "!GENERATE_MODEL_BAT_FILE!" "!LOG_FILE!" "!PROJECT_NAME!" "!MODULE_NAME!" "%%T" "!SUB_MODULE_NAME!"
        CALL "!GENERATE_CONTROLLER_BAT_FILE!" "!LOG_FILE!" "!PROJECT_NAME!" "!MODULE_NAME!" "%%T" "!SUB_MODULE_NAME!"
    )
    call :log "INFO" "Completed task: %%T"
    call :log "N/A" ""
)

call :log "N/A" ""
call :log "N/A" ""
call :log "N/A" "============================================="
call :log "N/A" "        SWAGGER Generation Completed         "
call :log "N/A" "============================================="
call :log "N/A" "All tasks processed successfully!"
call :log "N/A" "Log file: !LOG_FILE!"

exit /b 0

REM ============================================
REM Logging Function (console + file)
REM ============================================

:log
REM Log to both console and file
SET LOG_LEVEL=%~1
SET LOG_MESSAGE=%~2

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

REM ============================================
REM Help Functions
REM ============================================

:show_help
call :log "N/A" ""
call :log "N/A" ""
call :log "N/A" "============================================="
call :log "N/A" "           SWAGGER Generation Help           "
call :log "N/A" "============================================="
call :log "N/A" ""

:show_usage
call :log "INFO" "USAGE:"
call :log "INFO" "  %~nx0 --project=PROJECT --module=DASH_SEP_MODULE_NAME [OPTIONS]"
call :log "INFO" ""
call :log "INFO" "REQUIRED:"
call :log "INFO" "  --project=NAME    Specify the project name (required)"
call :log "INFO" "  --module=NAME     Specify the module name (required)"
call :log "INFO" ""
call :log "INFO" "OPTIONAL:"
call :log "INFO" "  --postfix=NAME    Specify postfix for directories"
call :log "INFO" "  --model           Generate data models using Maven"
call :log "INFO" "  --interface       Generate API interfaces"
call :log "INFO" "  --core            Generate core module files"
call :log "INFO" "  --help            Show this help message"
call :log "INFO" ""
call :log "INFO" "DIRECTORY STRUCTURE:"
call :log "INFO" "  When using --model with --postfix=adapter, the script will:"
call :log "INFO" "  1. Navigate to: ../PROJECT/MODULE/MODULE-adapter-model"
call :log "INFO" "  2. Execute: mvn generate-sources -Pservice-swagger-models"
call :log "INFO" ""
call :log "INFO" "EXAMPLES:"
call :log "INFO" "  %~nx0 --project=lib --module=product --model"
call :log "INFO" "  %~nx0 --project=lib --module=user --postfix=adapter --model"
call :log "INFO" "  %~nx0 --project=service --module=user --model --core"
call :log "INFO" ""
call :log "INFO" "  Without postfix (assumes directory has no postfix):"
call :log "INFO" "  %~nx0 --project=lib --module=common --model"
call :log "INFO" ""
goto :eof