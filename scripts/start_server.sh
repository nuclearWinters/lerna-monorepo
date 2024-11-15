#!/bin/sh
cd /home/ec2-user/lerna-monorepo
aws s3 cp --recursive s3://lerna-monorepo-secrets/prod/certs ./certs
cd /home/ec2-user/lerna-monorepo
aws s3 cp s3://lerna-monorepo-secrets/prod/prod.json prod.json
MONGO_DB=`jq ".MONGO_DB" prod.json | sed -e 's/^"//' -e 's/"$//'`
REFRESHSECRET=`jq ".REFRESHSECRET" prod.json | sed -e 's/^"//' -e 's/"$//'`
ACCESSSECRET=`jq ".ACCESSSECRET" prod.json | sed -e 's/^"//' -e 's/"$//'`
REDIS=`jq ".REDIS" prod.json | sed -e 's/^"//' -e 's/"$//'`
NODE_ENV=production
KAFKA=`jq ".KAFKA" prod.json | sed -e 's/^"//' -e 's/"$//'`
KAFKA_USERNAME=`jq ".KAFKA_USERNAME" prod.json | sed -e 's/^"//' -e 's/"$//'`
KAFKA_PASSWORD=`jq ".KAFKA_PASSWORD" prod.json | sed -e 's/^"//' -e 's/"$//'`
GRPC_AUTH=`jq ".GRPC_AUTH" prod.json | sed -e 's/^"//' -e 's/"$//'`
GRPC_FINTECH=`jq ".GRPC_FINTECH" prod.json | sed -e 's/^"//' -e 's/"$//'`
AWS_MAIN_KEY=`jq ".AWS_MAIN_KEY" prod.json | sed -e 's/^"//' -e 's/"$//'`
AWS_MAIN_SECRET=`jq ".AWS_MAIN_SECRET" prod.json | sed -e 's/^"//' -e 's/"$//'`
AWS_REGION=`jq ".AWS_REGION" prod.json | sed -e 's/^"//' -e 's/"$//'`
rm prod.json
MONGO_DB=$MONGO_DB REFRESHSECRET=$REFRESHSECRET ACCESSSECRET=$ACCESSSECRET REDIS=$REDIS NODE_ENV=$NODE_ENV KAFKA=$KAFKA KAFKA_USERNAME=$KAFKA_USERNAME KAFKA_PASSWORD=$KAFKA_PASSWORD GRPC_AUTH=$GRPC_AUTH GRPC_FINTECH=$GRPC_FINTECH AWS_MAIN_KEY=$AWS_MAIN_KEY AWS_MAIN_SECRET=$AWS_MAIN_SECRET AWS_REGION=$AWS_REGION pnpm --recursive --if-present run serve 