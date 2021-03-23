#!/bin/bash

container=(`docker ps | grep postgres | cut -f1 -d" "`)

cat dump.sql | docker exec -i $container psql -U postgres -d dziekanat