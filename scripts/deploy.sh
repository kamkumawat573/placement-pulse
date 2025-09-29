#!/bin/bash

# Production Deployment Script for PlacementPulse

echo "🚀 Starting production deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Run type checking
echo "🔍 Running type check..."
npm run type-check

# Run linting
echo "🧹 Running linting..."
npm run lint

# Build for production
echo "🏗️ Building for production..."
npm run build:production

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Production build completed successfully!"
    echo "🎉 Your application is ready for deployment!"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi

echo "📋 Next steps:"
echo "1. Deploy to your hosting platform (Vercel, Netlify, etc.)"
echo "2. Set up environment variables in your hosting platform"
echo "3. Configure your domain and SSL certificate"
echo "4. Monitor your application logs"
