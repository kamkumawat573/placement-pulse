require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Admin schema (same as in lib/models/Admin.ts)
const AdminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'super-admin'],
    default: 'admin'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Admin = mongoose.model('Admin', AdminSchema);

async function setupAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
    if (existingAdmin) {
      console.log('⚠️  Admin already exists with email:', process.env.ADMIN_EMAIL);
      console.log('Admin ID:', existingAdmin._id);
      console.log('Admin Name:', existingAdmin.name);
      console.log('Admin Role:', existingAdmin.role);
      return;
    }

    // Create admin user
    const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
    
    const admin = new Admin({
      name: process.env.ADMIN_NAME || 'Admin User',
      email: process.env.ADMIN_EMAIL,
      passwordHash: passwordHash,
      role: process.env.ADMIN_ROLE || 'admin',
      isActive: true
    });

    await admin.save();
    console.log('✅ Admin user created successfully!');
    console.log('Admin ID:', admin._id);
    console.log('Admin Name:', admin.name);
    console.log('Admin Email:', admin.email);
    console.log('Admin Role:', admin.role);

  } catch (error) {
    console.error('❌ Error setting up admin:', error);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
}

// Run the setup
setupAdmin();
