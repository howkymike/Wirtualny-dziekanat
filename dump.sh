#!/bin/bash

container=(`docker ps | grep postgres | cut -f1 -d" "`)

docker exec $container pg_dump -c -U postgres -d dziekanat > dump.sql