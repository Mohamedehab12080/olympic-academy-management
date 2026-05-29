#!/bin/bash
set -e
cd "$(dirname "$0")"

cd ../../../../_scripts/swagger
./generate.bat --project=lib --module=sql.db.adapter --model

echo "Generation completed successfully"
