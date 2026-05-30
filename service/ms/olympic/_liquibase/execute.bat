@echo off

:: Change directory to the location of the .bat file
cd /d %~dp0

CALL mvn process-sources -Pliquibase "-Dcurrent.environment=local"

pause 