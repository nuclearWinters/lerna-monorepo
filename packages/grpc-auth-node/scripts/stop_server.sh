#!/bin/bash
cd /home/ec2-user/lerna-monorepo/packages/grpc-auth-node
killall node || echo "No node process to kill"