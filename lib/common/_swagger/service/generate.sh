#!/bin/bash
set -e
cd "$(dirname "$0")"

cd ../../../../_scripts/swagger
./generate.bat --project=lib --module=common --model

echo "Generation completed successfully"
