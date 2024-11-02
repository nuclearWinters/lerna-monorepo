#!/bin/bash
cd /home/ec2-user/lerna-monorepo/packages/backend-auth-node-deploy
killall node || echo "No node process to kill"