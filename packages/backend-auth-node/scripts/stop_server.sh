#!/bin/bash
cd /home/ec2-user/lerna-monorepo/packages/backend-auth-node
killall node || echo "No node process to kill"