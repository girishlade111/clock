#!/bin/bash
# Keep-alive script for the Next.js production server
# Restarts the server automatically when it crashes
while true; do
  cd /home/z/my-project
  PORT=3001 HOSTNAME=0.0.0.0 node .next/standalone/server.js 2>&1
  echo "[$(date)] Server died, restarting in 3 seconds..." >> /home/z/my-project/server-restart.log
  sleep 3
done
