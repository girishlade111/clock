#!/bin/bash
while true; do
  cd /home/z/my-project
  PORT=3000 HOSTNAME=0.0.0.0 node .next/standalone/server.js 2>/dev/null
  sleep 0.1
done
