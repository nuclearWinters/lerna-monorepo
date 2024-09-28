#!/bin/bash
cd /home/ec2-user/lerna-monorepo
aws s3 cp --recursive s3://lerna-monorepo-secrets/prod/certs ./certs
cd /home/ec2-user/lerna-monorepo/packages/backend-auth-node
aws s3 cp s3://lerna-monorepo-secrets/prod/prod.json prod.json
NODE_ENV=production
MONGO_DB=`jq ".MONGO_DB" prod.json | sed -e 's/^"//' -e 's/"$//'`
REDIS=`jq ".REDIS" prod.json | sed -e 's/^"//' -e 's/"$//'`
GRPC_FINTECH=`jq ".GRPC_FINTECH" prod.json | sed -e 's/^"//' -e 's/"$//'`
REFRESHSECRET=`jq ".REFRESHSECRET" prod.json | sed -e 's/^"//' -e 's/"$//'`
ACCESSSECRET=`jq ".ACCESSSECRET" prod.json | sed -e 's/^"//' -e 's/"$//'`
rm prod.json
(REFRESHSECRET=$REFRESHSECRET ACCESSSECRET=$ACCESSSECRET GRPC_FINTECH=$GRPC_FINTECH REDIS=$REDIS MONGO_DB=$MONGO_DB NODE_ENV=$NODE_ENV npm run serve > /dev/null 2> /dev/null < /dev/null &)