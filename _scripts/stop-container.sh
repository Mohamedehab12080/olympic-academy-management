#!/bin/sh

# Input Arguments >>
# $1 = container name
CONTAINER_NAME=$1

if [ -z "$CONTAINER_NAME" ]; then
    echo "Usage: $0 <container_name>"
    exit 1
fi

if docker ps -a --format '{{.Names}}' | grep -q "^$CONTAINER_NAME$"; then
    docker stop $CONTAINER_NAME
    docker rm $CONTAINER_NAME
    echo "Container '$CONTAINER_NAME' stopped and removed successfully."
else
    echo "No container named '$CONTAINER_NAME' found."
fi