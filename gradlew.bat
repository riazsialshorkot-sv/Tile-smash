@echo off
set SCRIPT_DIR=%~dp0
if exist "%SCRIPT_DIR%android" (
    cd /d "%SCRIPT_DIR%android"
    call gradlew.bat %*
) else (
    echo ERROR: android directory not found at %SCRIPT_DIR%android
    exit /b 1
)
