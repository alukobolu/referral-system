#!/bin/bash

echo "🚀 Deploying to Vercel..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "🔗 Your API should now be available at: https://referral-system-alpha.vercel.app/api" 