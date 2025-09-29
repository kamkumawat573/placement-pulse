@echo off
REM Production Deployment Script for PlacementPulse

echo 🚀 Starting production deployment...

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: package.json not found. Please run this script from the project root.
    exit /b 1
)

REM Install dependencies
echo 📦 Installing dependencies...
npm ci --only=production

REM Run type checking
echo 🔍 Running type check...
npm run type-check

REM Run linting
echo 🧹 Running linting...
npm run lint

REM Build for production
echo 🏗️ Building for production...
npm run build:production

REM Check if build was successful
if %errorlevel% equ 0 (
    echo ✅ Production build completed successfully!
    echo 🎉 Your application is ready for deployment!
) else (
    echo ❌ Build failed. Please check the errors above.
    exit /b 1
)

echo 📋 Next steps:
echo 1. Deploy to your hosting platform (Vercel, Netlify, etc.)
echo 2. Set up environment variables in your hosting platform
echo 3. Configure your domain and SSL certificate
echo 4. Monitor your application logs
