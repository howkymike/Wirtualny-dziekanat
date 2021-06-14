#!/bin/bash
docker-compose -f docker-compose.test.yml up 
./run.sh &
sleep 60
cd tests/e2e && npm install codeceptjs playwright --save && npx codeceptjs run --steps
