#!/bin/sh

# Input Arguments >>
# $1 = container name
# $2 = service port
# $3 = spring profile
# $4 = min memory (MB)
# $5 = max memory (MB)
# $6 = docker image name

CONTAINER_NAME=$1
JAR_PORT=$2
PROFILE=$3
JAR_MIN_MEMORY=$4
JAR_MAX_MEMORY=$5
IMAGE_NAME=$6

if [ -z "$CONTAINER_NAME" ] || [ -z "$JAR_PORT" ] || [ -z "$PROFILE" ] || [ -z "$IMAGE_NAME" ]; then
    echo "Usage: $0 <container_name> <port> <profile> <min_memory> <max_memory> <docker_image>"
    exit 1
fi

# Run container
docker run -d \
  --name $CONTAINER_NAME \
  -p $JAR_PORT:$JAR_PORT \
  -e SPRING_PROFILES_ACTIVE=$PROFILE \
  -e JAVA_OPTS="-Xms${JAR_MIN_MEMORY}m -Xmx${JAR_MAX_MEMORY}m -XX:+UseSerialGC" \
  $IMAGE_NAME

echo "Deployment started. Container '$CONTAINER_NAME' is running on port $JAR_PORT."
docker logs -f $CONTAINER_NAME
