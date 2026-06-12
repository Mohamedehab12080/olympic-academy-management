#!/bin/bash
set -e
cd "$(dirname "$0")"

cd ../../../../_scripts/swagger
./generate.bat --project=service --module=file --model --core

echo "Generation completed successfully"
