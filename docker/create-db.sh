#!/bin/bash

docker rm -f test_container
docker volume prune -f
docker-compose -f ./docker/docker-compose.yml up -d