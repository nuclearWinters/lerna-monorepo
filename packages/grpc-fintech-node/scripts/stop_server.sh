#!/bin/bash
cd /home/ec2-user/lerna-monorepo/packages/grpc-fintech-node-deploy
killall node || echo "No node process to kill"