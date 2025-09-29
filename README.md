# 🎯 Placement Pulse - MBA Placement Preparation Platform

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://placement-pulse.vercel.app)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

> **Master your MBA placements and internships with expert guidance, mock interviews, and placement strategy from MBA alumni**

## 🌟 Features

### 🎓 For Students
- **Live GD Practice** - Real-time Group Discussions with alumni moderators
- **Mock Interviews** - HR & technical interviews with detailed feedback
- **Resume & LinkedIn Review** - Expert reviews to make profiles recruiter-ready
- **Placement Strategy Sessions** - Step-by-step guidance for aptitude tests and company shortlisting
- **Peer-to-Peer Learning** - Collaborate with fellow MBA students
- **Weekly Blogs & Hacks** - Stay updated with placement trends and success stories

### 👨‍💼 For Admins
- **Comprehensive Dashboard** - Platform statistics and analytics
- **Student Management** - View, edit, and manage student profiles
- **Course Management** - Dynamic course content and pricing
- **Content Management** - Blogs, testimonials, and announcements
- **Analytics** - Performance metrics and insights

## 🚀 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Backend**: Next.js API Routes, MongoDB, Mongoose
- **Authentication**: JWT, bcryptjs
- **Payments**: Razorpay Integration
- **Security**: reCAPTCHA, Input validation
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB Atlas account
- Razorpay account (for payments)
- Google reCAPTCHA account (for security)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vishal-mishra/placement-pulse.git
   cd placement-pulse
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env.local` file in the project root:
   ```env
   # Database
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/placement-pulse
   
   # JWT Secret
   JWT_SECRET=your_long_random_secret_key_here
   
   # Razorpay Configuration
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
   RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   
   # reCAPTCHA Configuration
   NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-recaptcha-site-key
   RECAPTCHA_SECRET_KEY=your-recaptcha-secret-key
   
   # Admin Configuration
   ADMIN_NAME=Admin User
   ADMIN_EMAIL=admin@placementpulse.com
   ADMIN_PASSWORD=your_secure_admin_password
   ADMIN_ROLE=admin
   
   # App Configuration
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

4. **Setup Admin User**
   ```bash
   npm run setup-admin
   ```

5. **Seed Sample Data (Optional)**
   ```bash
   npm run seed-data
   ```

6. **Start Development Server**
   ```bash
   npm run dev
   ```

## 🌐 Access Points

- **Home**: `http://localhost:3000`
- **Student Auth**: `http://localhost:3000/auth`
- **Admin Panel**: `http://localhost:3000/admin`
- **Course Enrollment**: `http://localhost:3000/enroll`
- **Student Dashboard**: `http://localhost:3000/dashboard`

## 📱 Responsive Design

The platform is fully responsive and optimized for:
- 📱 Mobile devices (320px+)
- 📱 Small tablets (475px+)
- 💻 Tablets (640px+)
- 🖥️ Desktop (1024px+)
- 🖥️ Large screens (1280px+)

## 🔐 Authentication Flow

### Student Authentication
1. **Signup**: Email, password, mobile number
2. **Login**: Email and password
3. **Auto-redirect**: 
   - Enrolled users → Dashboard
   - Non-enrolled users → Enrollment page

### Admin Authentication
1. **Login**: Admin credentials
2. **Auto-detection**: System detects admin role
3. **Redirect**: Admin panel access

## 💳 Payment Integration

- **Razorpay Integration**: Secure payment processing
- **Test Mode**: Safe testing environment
- **Payment Verification**: Server-side verification
- **Transaction Tracking**: Complete payment history

## 🗄️ Database Models

### User Model
```typescript
{
  name: string
  email: string
  mobile: string
  password: string (hashed)
  enrolledCourse: boolean
  progress: number
  transactionId: string
  role: 'user'
}
```

### Admin Model
```typescript
{
  name: string
  email: string
  password: string (hashed)
  role: 'admin' | 'super-admin'
  isActive: boolean
  lastLogin: Date
}
```

### Payment Model
```typescript
{
  userId: ObjectId
  razorpayOrderId: string
  razorpayPaymentId: string
  amount: number
  currency: string
  status: string
  createdAt: Date
}
```

## 🚀 Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
npm run build
npm run start
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Admin
- `POST /api/admin/login` - Admin login
- `GET /api/admin/students` - Get all students
- `GET /api/admin/stats` - Platform statistics

### Payments
- `POST /api/razorpay/order` - Create payment order
- `POST /api/razorpay/verify` - Verify payment
- `POST /api/enroll` - Complete enrollment

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcryptjs for password security
- **reCAPTCHA**: Bot protection
- **Input Validation**: Zod schema validation
- **CORS Protection**: Cross-origin request security

## 📈 Performance

- **Next.js 14**: Latest React framework
- **Server Components**: Optimized rendering
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic bundle optimization
- **Caching**: Efficient data caching

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Vishal Mishra**
- LinkedIn: [vishal-mishra-454b67204](https://www.linkedin.com/in/vishal-mishra-454b67204/)
- GitHub: [@vishal-mishra](https://github.com/vishal-mishra)

## 🙏 Acknowledgments

- MBA alumni for expert guidance
- Students for valuable feedback
- Open source community for amazing tools

## 📞 Support

For support, email support@placementpulse.com or create an issue in this repository.

---

**Made with ❤️ for MBA students by MBA alumni**