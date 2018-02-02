#!/bin/sh
cd ~/yieldio
git pull
npm run build
sudo PORT=80 NODE_ENV=production forever restart server.js -o output.log
