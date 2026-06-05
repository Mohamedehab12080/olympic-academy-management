@echo off
setlocal enabledelayedexpansion

SET "LOG_FILE=%~1"
SET "PROJECT=%~2"
SET "MODULE=%~3"
SET "GENERATED_PACKAGE_PATH=%~4"

REM Validate required parameters
if "!LOG_FILE!"=="" (
    echo [%time%] [ERROR] Log file parameter is required
    exit /b 1
)

if "!MODULE!"=="" (
    echo [%time%] [ERROR] Module name parameter is required
    exit /b 1
) else (
    call :log "INFO" "Module name			: %MODULE%"
)

if "!PROJECT!"=="" (
    echo [%time%] [ERROR] Project name parameter is required
    exit /b 1
) else (
    call :log "INFO" "Project name			: %PROJECT%"
)

if "!GENERATED_PACKAGE_PATH!"=="" (
    echo [%time%] [ERROR] Generated package path parameter is required
    exit /b 1
) else (
    call :log "INFO" "Model Folder Path	: %GENERATED_PACKAGE_PATH%"
)

call :log_empty_line
call :log "N/A" "============================================="
call :log "N/A" "       Start Cleaning the Unused Models      "
call :log "N/A" "============================================="
call :log_empty_line

if exist "!GENERATED_PACKAGE_PATH!" (
    call :log "INFO" "Entering generated package directory..."
    cd /d "!GENERATED_PACKAGE_PATH!"
    
    call :log "INFO" "Checking module-specific files for deletion..."
    
    REM Check file existence before deleting
    if not "!MODULE!"=="common" (
        call :delete_file "ErrorVTO.java"
        call :delete_file "LookupDTO.java"
        call :delete_file "LookupResultSet.java"
        call :delete_file "LookupVTO.java"
        call :delete_file "NewRecordVTO.java"
        call :delete_file "RecordAttribute.java"
        call :delete_file "Gender.java"
        call :delete_file "ContactTypes.java"
        call :delete_file "PaymentStatus.java"
        call :delete_file "EnrollmentStatus.java"
        call :delete_file "CourseTypes.java"
        call :delete_file "SessionStatus.java"
        call :delete_file "RefundStatus.java"
        call :delete_file "SalaryTransactionType.java"
        call :delete_file "SalaryTypes.java"
        call :delete_file "DeductionTypes.java"
    )
	
    if "!MODULE!"=="common" (
        call :delete_file "ErrorVTO.java"
        call :delete_file "RecordAttribute.java"
        call :delete_file "Gender.java"
        call :delete_file "ContactTypes.java"
        call :delete_file "PaymentStatus.java"
    )

    if "!MODULE!"=="employee" (
            call :delete_file "SalaryTypes.java"
            call :delete_file "EmployeeAttendanceStatus.java"
            call :delete_file "EmployeeTypes.java"
    )

    if not "!MODULE!"=="user" (
        call :delete_file "LightUserVTO.java"
        call :delete_file "LightUserResultSet.java"
    )

    if not "!MODULE!"=="sql-db-adapter" (
        call :delete_file "OrderDirections.java"
    )


	REM if not "!PROJECT!"=="service"(
    REM )
    
    call :log "INFO" "Cleanup completed for module: !MODULE!"
) else (
    call :log "WARN" "Generated directory not found: !GENERATED_PACKAGE_PATH!"
)

endlocal
exit /b 0

REM ============================================
REM Delete File Function
REM ============================================

:delete_file
setlocal
set "FILENAME=%~1"

if exist "!FILENAME!" (
    del /q "!FILENAME!" 2>nul
    if exist "!FILENAME!" (
        call :log "WARN" "Failed to delete: !FILENAME!"
    ) else (
        call :log "INFO" "Deleted: !FILENAME!"
    )
) else (
    REM File doesn't exist, no action needed
)
endlocal
goto :eof

REM ============================================
REM Logging Functions
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

:log_empty_line
echo.
echo. >> "!LOG_FILE!"
goto :eof