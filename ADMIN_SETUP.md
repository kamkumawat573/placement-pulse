# Admin Panel Setup Guide

## Quick Setup

1. **Create Environment File**
   Create a `.env.local` file in your project root with:

   ```env
   # Razorpay Configuration
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
   RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
   RAZORPAY_KEY_SECRET=your_test_key_secret

   # Database Configuration
   MONGODB_URI=mongodb+srv://user:pass@cluster0.example.mongodb.net/placementpulse

   # JWT Secret (generate a long random string)
   JWT_SECRET=your_long_random_secret

   # Admin Credentials (for admin panel)
   ADMIN_NAME=Admin User
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=your_secure_admin_password
   ADMIN_ROLE=admin
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Setup Admin User**
   ```bash
   npm run setup-admin
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## Admin Login

1. Go to `http://localhost:3000/auth`
2. Use your admin credentials:
   - Email: `admin@example.com` (or your ADMIN_EMAIL)
   - Password: Your ADMIN_PASSWORD
3. The system will automatically redirect you to the admin panel

## Admin Panel Features

- **Dashboard**: View platform statistics
- **Student Management**: View, edit, delete students
- **Analytics**: Platform performance metrics
- **Settings**: Platform configuration

## Security Notes

- Admin credentials are stored securely in MongoDB
- Passwords are hashed using bcrypt
- Admin sessions use JWT tokens
- Admin routes are protected with middleware

## Troubleshooting

- Make sure MongoDB is running and accessible
- Verify all environment variables are set correctly
- Check that the admin user was created successfully
- Ensure JWT_SECRET is a long, random string
