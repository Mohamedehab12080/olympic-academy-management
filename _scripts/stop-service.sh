#!/bin/sh
JAR_PORT=$1
#JAR_PIDS=$(ps -aux | grep "${JAR_PORT}" | awk '{print $2}')
#if [ -z "$JAR_PIDS" ]; then
#  echo "No process found for ${JAR_PORT}"
#fi



## Iterate through each PID and kill it
#echo "$JAR_PIDS" | while IFS= read -r PID; do
#  if [ -n "$PID" ]; then
#    #kill -9 "$PID";
#    if kill -9 "$PID"; then
#    	echo "PID $PID is killed successfully"
#    else
#    	echo "Failed to kill PID $PID"
#    fi
#  fi
#done

JAR_PIDS=$(lsof -t -i:$JAR_PORT)
echo "Processes running on port $JAR_PORT: $JAR_PIDS"

kill -9 $(lsof -t -i:$JAR_PORT)  
echo "Service is killed successfully"
