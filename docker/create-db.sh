#!/bin/bash

sudo docker rm -f test_container
sudo docker volume prune -f
sudo docker-compose -f ./docker/docker-compose.yml up -d