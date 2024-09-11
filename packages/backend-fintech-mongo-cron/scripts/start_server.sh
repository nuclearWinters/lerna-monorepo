#!/bin/bash
cd /home/ec2-user/lerna-monorepo/packages/backend-fintech-mongo-cron
MONGO_DB=$MONGO_DB KAFKA_ID=$KAFKA_ID NODE_ENV=$NODE_ENV KAFKA=$KAFKA KAFKA_USERNAME=$KAFKA_USERNAME KAFKA_PASSWORD=$KAFKA_PASSWORD npm run serve