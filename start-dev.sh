#!/bin/bash
cd /home/z/my-project
while true; do
  npx next dev -p 3000 -H 0.0.0.0 --webpack 2>&1 | tee dev.log
  echo "Restarting in 0.5s..." >> dev.log
  sleep 0.5
done
