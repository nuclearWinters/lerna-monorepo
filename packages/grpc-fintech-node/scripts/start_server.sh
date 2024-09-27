#!/bin/bash
cd /home/ec2-user/lerna-monorepo
aws s3 cp --recursive s3://lerna-monorepo-secrets/prod/certs /certs
cd /home/ec2-user/lerna-monorepo/packages/grpc-fintech-node
aws s3 cp s3://lerna-monorepo-secrets/prod/prod.json prod.json
KAFKA_ID=grpc-auth-node
NODE_ENV=production
MONGO_DB=`jq ".MONGO_DB" prod.json | sed -e 's/^"//' -e 's/"$//'`
KAFKA=`jq ".KAFKA" prod.json | sed -e 's/^"//' -e 's/"$//'`
KAFKA_USERNAME=`jq ".KAFKA_USERNAME" prod.json | sed -e 's/^"//' -e 's/"$//'`
KAFKA_PASSWORD=`jq ".KAFKA_PASSWORD" prod.json | sed -e 's/^"//' -e 's/"$//'`
rm prod.json
(MONGO_DB=$MONGO_DB KAFKA_ID=$KAFKA_ID NODE_ENV=$NODE_ENV KAFKA=$KAFKA KAFKA_USERNAME=$KAFKA_USERNAME KAFKA_PASSWORD=$KAFKA_PASSWORD npm run serve > /dev/null 2> /dev/null < /dev/null &)