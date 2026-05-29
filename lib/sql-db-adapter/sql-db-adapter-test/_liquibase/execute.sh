#!/bin/bash

cd "$(dirname "$0")"

mvn process-sources -Pliquibase "-Dcurrent.environment=local"

