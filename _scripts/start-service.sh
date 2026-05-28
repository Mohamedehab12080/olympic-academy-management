#!/bin/sh
JAR_PORT=$1
PROFILE=$2
JAR_MIN_MEMORY=$3
JAR_MAX_MEMORY=$4
JAR_NAME=$5

export JENKINS_NODE_COOKIE=dontKillMe

#nohup java -Xms${JAR_MIN_MEMORY}m -Xmx${JAR_MAX_MEMORY}m -XX:+UseSerialGC -jar -Dspring.profiles.active=${PROFILE} \
# -Dserver.port=${JAR_PORT} ./${JAR_NAME} >> nohup.out 2>&1 &

nohup java -Xms${JAR_MIN_MEMORY}m -Xmx${JAR_MAX_MEMORY}m -jar -Dspring.profiles.active=${PROFILE} ./${JAR_NAME} >> nohup.out 2>&1 &

echo "Deployment started. Logs are being written to $PWD/nohup.out."
