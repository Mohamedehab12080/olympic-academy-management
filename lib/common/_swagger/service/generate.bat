
@echo off

:: Change directory to the location of the .bat file
cd /d %~dp0

cd ../../../../_scripts/swagger
CALL generate.bat --project=lib --module=common --model

pause