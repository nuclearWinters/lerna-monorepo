#!/bin/bash
cd /home/ec2-user/lerna-monorepo/packages/grpc-auth-node
aws s3 cp s3://lerna-monorepo-secrets/prod/prod.json prod.json
NODE_ENV=production
MONGO_DB=`jq ".MONGO_DB" prod.json | sed -e 's/^"//' -e 's/"$//'`
REDIS=`jq ".REDIS" prod.json | sed -e 's/^"//' -e 's/"$//'`
rm prod.json
(MONGO_DB=$MONGO_DB NODE_ENV=$NODE_ENV REDIS=$REDIS npm run serve > /dev/null 2> /dev/null < /dev/null &)