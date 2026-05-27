#!/bin/bash

# PM2 Setup Script for Misfit Ministries
# Run this on your production server to set up process management

set -e

echo "🚀 Setting up PM2 for Misfit Ministries..."

# Install PM2 globally if not already installed
if ! command -v pm2 &> /dev/null; then
    echo "📦 Installing PM2..."
    npm install -g pm2
fi

# Build the project
echo "🔨 Building project..."
cd /home/ubuntu/misfit-ministries
pnpm install
pnpm build

# Start the app with PM2
echo "▶️  Starting API server with PM2..."
pm2 start ecosystem.config.js

# Save PM2 process list
echo "💾 Saving PM2 process list..."
pm2 save

# Set up PM2 to start on system boot
echo "🔄 Setting up PM2 to start on boot..."
pm2 startup systemd -u ubuntu --hp /home/ubuntu

# Create logs directory
mkdir -p /home/ubuntu/misfit-ministries/logs

# Display status
echo ""
echo "✅ PM2 setup complete!"
echo ""
pm2 status
echo ""
echo "📋 Useful commands:"
echo "   pm2 status              - Show process status"
echo "   pm2 logs misfit-api     - View API logs"
echo "   pm2 restart misfit-api  - Restart API"
echo "   pm2 stop misfit-api     - Stop API"
echo "   pm2 monit               - Monitor processes"
