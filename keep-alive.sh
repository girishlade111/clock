#!/bin/bash
while true; do
  cd /home/z/my-project
  node node_modules/next/dist/bin/next dev -p 3000 -H 0.0.0.0 --webpack 2>&1 | tee -a dev.log
  echo "$(date): Restarting..." >> dev.log
  sleep 2
done
