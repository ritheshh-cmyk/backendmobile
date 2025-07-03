#!/bin/bash
# Mobile Repair Tracker Backend Startup Script
# Usage: bash startup.sh

set -e

# Go to the script's directory
cd "$(dirname "$0")"

# Install Node.js and npm if not present (for Ubuntu/Termux)
if ! command -v node >/dev/null 2>&1; then
  echo "Node.js not found. Please install Node.js and npm first."
  exit 1
fi

# Install dependencies
npm install

# Build the backend
npm run build

# Install PM2 globally if not present
if ! command -v pm2 >/dev/null 2>&1; then
  echo "PM2 not found. Installing PM2 globally..."
  npm install -g pm2
fi

# Start the backend with PM2
pm2 start dist/server/index.js --name mobile-repair-backend || pm2 restart mobile-repair-backend
pm2 save

# Set up PM2 to start on boot (Ubuntu/Termux)
pm2 startup

# Show status
pm2 status

echo "\n✅ Backend started and managed by PM2!"
echo "   Health check: http://localhost:10000/health"

# --- NGROK AUTO SETUP ---
# Set ngrok authtoken
ngrok config add-authtoken 2z66Kn4W25ApQ7mjI3Z8BqDfFbI_4GPA3KoVKk25MpvFcKL2a || true

# Write ngrok config file
echo "version: 3
agent:
  authtoken: 2z66Kn4W25ApQ7mjI3Z8BqDfFbI_4GPA3KoVKk25MpvFcKL2a
tunnels:
  backend:
    addr: 10000
    proto: http
    domain: positive-kodiak-friendly.ngrok-free.app
" > ~/.ngrok2/ngrok.yml

# Start ngrok with reserved domain in background
nohup ngrok start backend > ngrok.log 2>&1 &
echo "\n🌐 ngrok tunnel started: https://positive-kodiak-friendly.ngrok-free.app -> http://localhost:10000" 