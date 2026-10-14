@echo off
cd /d %~dp0
CALL mvn process-sources -Pliquibase "-Dcurrent.environment=docker"
pause