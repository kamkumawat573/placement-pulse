# 🚀 Deployment Guide - Placement Pulse

This guide will help you deploy Placement Pulse to various platforms.

## 📋 Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account
- Razorpay account
- Google reCAPTCHA account
- Git installed

## 🌐 Deployment Options

### 1. Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications.

#### Steps:
1. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with GitHub
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Environment Variables**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/placement-pulse
   JWT_SECRET=your_long_random_secret_key
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
   RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-recaptcha-site-key
   RECAPTCHA_SECRET_KEY=your-recaptcha-secret-key
   ADMIN_NAME=Admin User
   ADMIN_EMAIL=admin@yourdomain.com
   ADMIN_PASSWORD=your_secure_admin_password
   ADMIN_ROLE=admin
   NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app
   ```

3. **Deploy**
   - Vercel will automatically deploy on push to main branch
   - Or click "Deploy" button for manual deployment

#### Vercel Configuration
Create `vercel.json` in project root:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

### 2. Netlify

#### Steps:
1. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Sign up/Login with GitHub
   - Click "New site from Git"
   - Choose your repository

2. **Build Settings**
   ```
   Build command: npm run build
   Publish directory: .next
   ```

3. **Environment Variables**
   - Add all environment variables in Netlify dashboard
   - Same as Vercel configuration

### 3. Railway

#### Steps:
1. **Connect to Railway**
   - Go to [railway.app](https://railway.app)
   - Sign up/Login with GitHub
   - Click "New Project"
   - Choose "Deploy from GitHub repo"

2. **Configure**
   - Add environment variables
   - Railway will auto-detect Next.js

### 4. DigitalOcean App Platform

#### Steps:
1. **Create App**
   - Go to DigitalOcean App Platform
   - Click "Create App"
   - Connect GitHub repository

2. **Configure**
   ```
   Build Command: npm run build
   Run Command: npm start
   ```

### 5. AWS Amplify

#### Steps:
1. **Connect to Amplify**
   - Go to AWS Amplify Console
   - Click "New app" > "Host web app"
   - Connect GitHub repository

2. **Build Settings**
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm install
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

## 🗄️ Database Setup

### MongoDB Atlas (Recommended)

1. **Create Cluster**
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Create free cluster
   - Get connection string

2. **Configure Database**
   ```bash
   # After deployment, run setup commands
   npm run setup-admin
   npm run seed-data
   ```

### Alternative: MongoDB Self-hosted

1. **Install MongoDB**
   ```bash
   # Ubuntu/Debian
   sudo apt-get install mongodb
   
   # macOS
   brew install mongodb-community
   
   # Windows
   # Download from mongodb.com
   ```

2. **Start MongoDB**
   ```bash
   sudo systemctl start mongod
   # or
   mongod
   ```

## 🔧 Environment Configuration

### Required Variables
```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/placement-pulse

# Authentication
JWT_SECRET=your_long_random_secret_key_here

# Razorpay (Payment)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# reCAPTCHA (Security)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-recaptcha-site-key
RECAPTCHA_SECRET_KEY=your-recaptcha-secret-key

# Admin Configuration
ADMIN_NAME=Admin User
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=your_secure_admin_password
ADMIN_ROLE=admin

# App Configuration
NEXT_PUBLIC_BASE_URL=https://your-app-domain.com
```

### Optional Variables
```env
# Email Configuration (if using email features)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

## 🚀 Post-Deployment Setup

### 1. Setup Admin User
```bash
# Run this after deployment
npm run setup-admin
```

### 2. Seed Sample Data (Optional)
```bash
npm run seed-data
```

### 3. Verify Deployment
- Check if the site loads correctly
- Test user registration
- Test admin login
- Test payment flow (in test mode)

## 🔒 Security Considerations

### Production Checklist
- [ ] Use strong JWT secret (32+ characters)
- [ ] Use production Razorpay keys
- [ ] Use production reCAPTCHA keys
- [ ] Enable HTTPS
- [ ] Set up proper CORS
- [ ] Use environment variables for secrets
- [ ] Regular security updates

### SSL/HTTPS
- Vercel, Netlify, Railway provide free SSL
- For custom domains, configure SSL certificates

## 📊 Monitoring & Analytics

### Vercel Analytics
```bash
npm install @vercel/analytics
```

### Error Monitoring
Consider adding:
- Sentry for error tracking
- LogRocket for session replay
- Google Analytics for user behavior

## 🔄 CI/CD Pipeline

### GitHub Actions
The project includes GitHub Actions for:
- Automated testing
- Linting
- Type checking
- Auto-deployment

### Manual Deployment
```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🐛 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version (18+)
   - Verify all dependencies installed
   - Check environment variables

2. **Database Connection**
   - Verify MongoDB URI
   - Check network access
   - Ensure database exists

3. **Payment Issues**
   - Verify Razorpay keys
   - Check webhook URLs
   - Test in sandbox mode first

4. **Authentication Issues**
   - Verify JWT secret
   - Check token expiration
   - Verify admin credentials

### Debug Mode
```bash
# Enable debug logging
DEBUG=* npm run dev
```

## 📞 Support

If you encounter issues:
1. Check the logs
2. Verify environment variables
3. Test locally first
4. Create an issue on GitHub

## 🎉 Success!

Once deployed, your Placement Pulse platform will be live and ready for MBA students to use!

---

**Happy Deploying! 🚀**
