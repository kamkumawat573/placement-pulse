# Placement Pulse - MBA Placement Preparation Website

*Master your MBA placements and internships with expert guidance, mock interviews, and placement strategy from MBA alumni*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/vishal-mishras-projects-3b9179fb/v0-scrolling-animation-website)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/c4Xeuk8qEE3)

## Overview

This repository will stay in sync with your deployed chats on [v0.app](https://v0.app).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.app](https://v0.app).

## Backend additions (Razorpay Test Mode + Admin Panel)

This project now includes API routes to handle course enrollment with Razorpay in test mode, user authentication with MongoDB, and a comprehensive admin panel.

### Environment variables

Create a `.env.local` file in the project root with:

```
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_test_key_secret
MONGODB_URI=mongodb+srv://user:pass@cluster0.example.mongodb.net/learnpro
JWT_SECRET=your_long_random_secret

# reCAPTCHA Configuration (get from https://www.google.com/recaptcha/admin)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-recaptcha-site-key
RECAPTCHA_SECRET_KEY=your-recaptcha-secret-key

# Admin credentials (required for admin panel)
ADMIN_NAME=Admin User
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_secure_admin_password
ADMIN_ROLE=admin
```

Notes:
- `NEXT_PUBLIC_RAZORPAY_KEY_ID` is exposed to the browser to initialize Checkout.
- Keep `RAZORPAY_KEY_SECRET` server-only.
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` is exposed to the browser for reCAPTCHA widget.
- Keep `RECAPTCHA_SECRET_KEY` server-only for verification.
- Admin credentials are used to create the first admin user in the database.

### Install dependencies

```
npm i
```

Razorpay SDK, MongoDB, and authentication dependencies are already added.

### Setup Admin User

After setting up your environment variables, create the admin user:

```
npm run setup-admin
```

This will create an admin user in your MongoDB database using the credentials from your `.env.local` file.

### API routes

**Payment & Enrollment:**
- `POST /api/razorpay/order`: Creates a Razorpay order (default amount 29900 paise).
- `POST /api/razorpay/verify`: Verifies payment signature.
- `POST /api/enroll`: Verifies the payment and marks user as enrolled in MongoDB.

**User Authentication:**
- `POST /api/auth/signup`: User registration with email, password, and mobile number.
- `POST /api/auth/login`: User login with email and password.
- `POST /api/auth/logout`: User logout.
- `GET /api/auth/me`: Get current user data.

**Admin Authentication:**
- `POST /api/admin/login`: Admin login with email and password.
- `POST /api/admin/logout`: Admin logout.
- `GET /api/admin/me`: Get current admin data.

**Admin Management:**
- `GET /api/admin/students`: Get all students (admin only).
- `DELETE /api/admin/students/[id]`: Delete a student (admin only).
- `GET /api/admin/stats`: Get platform statistics (admin only).

### Database Models

**User Model:**
- Basic info: name, email, mobile, password
- Course data: enrolledCourse, progress, transactionId
- Additional: avatarUrl, address, city, state, country, zip
- Role: user (default)

**Admin Model:**
- Basic info: name, email, password
- Role: admin, super-admin
- Status: isActive, lastLogin

**Payment Model:**
- Razorpay transaction details
- Amount, currency, status
- User association

### Admin Panel Features

- **Dashboard**: Overview of platform statistics
- **Student Management**: View, edit, delete students
- **Analytics**: Platform performance metrics
- **Settings**: Platform configuration

### Authentication Flow

1. **Student Login**: Uses the same login form, redirects to `/dashboard` if enrolled, `/enroll` if not enrolled
2. **Admin Login**: Uses the same login form, automatically detects admin credentials and redirects to `/admin`
3. **Role-based Navigation**: Different navigation options based on user role

### Run the app

```
npm run dev
```

**Access Points:**
- Home: `http://localhost:3000`
- Student Auth: `http://localhost:3000/auth`
- Admin Panel: `http://localhost:3000/admin` (requires admin login)
- Course Enrollment: `http://localhost:3000/enroll`
- Student Dashboard: `http://localhost:3000/dashboard`

### Admin Login

Use the same login form at `/auth` with your admin credentials:
- Email: `admin@example.com` (or your ADMIN_EMAIL)
- Password: Your ADMIN_PASSWORD

The system will automatically detect admin credentials and redirect to the admin panel.