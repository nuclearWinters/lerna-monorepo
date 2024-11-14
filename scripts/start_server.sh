#!/bin/bash
cd /home/ec2-user/lerna-monorepo
aws s3 cp --recursive s3://lerna-monorepo-secrets/prod/certs ./certs
cd /home/ec2-user/lerna-monorepo/packages/backend-fintech-mongo-deploy
aws s3 cp s3://lerna-monorepo-secrets/prod/prod.json prod.json
KAFKA_ID=backend-fintech-mongo
NODE_ENV=production
MONGO_DB=`jq ".MONGO_DB" prod.json | sed -e 's/^"//' -e 's/"$//'`
KAFKA=`jq ".KAFKA" prod.json | sed -e 's/^"//' -e 's/"$//'`
KAFKA_USERNAME=`jq ".KAFKA_USERNAME" prod.json | sed -e 's/^"//' -e 's/"$//'`
KAFKA_PASSWORD=`jq ".KAFKA_PASSWORD" prod.json | sed -e 's/^"//' -e 's/"$//'`
REDIS=`jq ".REDIS" prod.json | sed -e 's/^"//' -e 's/"$//'`
GRPC_AUTH=`jq ".GRPC_AUTH" prod.json | sed -e 's/^"//' -e 's/"$//'`
AWS_MAIN_KEY=`jq ".AWS_MAIN_KEY" prod.json | sed -e 's/^"//' -e 's/"$//'`
AWS_REGION=`jq ".AWS_REGION" prod.json | sed -e 's/^"//' -e 's/"$//'`
AWS_MAIN_SECRET=`jq ".AWS_MAIN_SECRET" prod.json | sed -e 's/^"//' -e 's/"$//'`
rm prod.json
(AWS_MAIN_KEY=$AWS_MAIN_KEY AWS_REGION=$AWS_REGION AWS_MAIN_SECRET=$AWS_MAIN_SECRET GRPC_AUTH=$GRPC_AUTH REDIS=$REDIS MONGO_DB=$MONGO_DB KAFKA_ID=$KAFKA_ID NODE_ENV=$NODE_ENV KAFKA=$KAFKA KAFKA_USERNAME=$KAFKA_USERNAME KAFKA_PASSWORD=$KAFKA_PASSWORD pnpm serve > /dev/null 2> /dev/null < /dev/null &)