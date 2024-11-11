#!/bin/bash
cd /home/ec2-user/lerna-monorepo/packages/backend-fintech-mongo
killall node || echo "No node process to kill"