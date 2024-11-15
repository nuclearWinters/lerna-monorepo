#!/bin/sh
cd /home/ec2-user/lerna-monorepo
killall node || echo "No node process to kill"