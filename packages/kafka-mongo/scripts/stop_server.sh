#!/bin/bash
cd /home/ec2-user/lerna-monorepo/packages/kafka-mongo
killall node || echo "No node process to kill"