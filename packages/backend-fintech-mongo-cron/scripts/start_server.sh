#!/bin/bash
cd /home/ec2-user/lerna-monorepo/packages/backend-fintech-mongo-cron
aws s3 cp s3://lerna-monorepo-secrets/prod/prod.json prod.json
KAFKA_ID=cron-fintech
NODE_ENV=production
MONGO_DB=`sed -n 's/^\s*"MONGO_DB":\s*"\(.*\)",/\1/p' schema.json`
KAFKA=`sed -n 's/^\s*"KAFKA":\s*"\(.*\)",/\1/p' schema.json`
KAFKA_USERNAME=`sed -n 's/^\s*"KAFKA_USERNAME":\s*"\(.*\)",/\1/p' schema.json`
KAFKA_PASSWORD=`sed -n 's/^\s*"KAFKA_PASSWORD":\s*"\(.*\)",/\1/p' schema.json`
rm prod.json
MONGO_DB=$MONGO_DB KAFKA_ID=$KAFKA_ID NODE_ENV=$NODE_ENV KAFKA=$KAFKA KAFKA_USERNAME=$KAFKA_USERNAME KAFKA_PASSWORD=$KAFKA_PASSWORD npm run serve