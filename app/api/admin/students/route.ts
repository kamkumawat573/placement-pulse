import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyAdmin } from '@/lib/admin-auth';
import { UserModel } from '@/lib/models/User';
import bcrypt from 'bcryptjs';

// Ensure models are loaded
if (!UserModel) {
  console.error('UserModel is not defined');
}

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const admin = await verifyAdmin(request);
    
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const students = await UserModel.find({})
      .select('-passwordHash')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      students
    });
  } catch (error) {
    console.error('Fetch students error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const admin = await verifyAdmin(request);
    
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { name, email, mobile, password, enrolledCourse, progress, transactionId, bypassPayment } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new UserModel({
      name,
      email,
      mobile: mobile || '',
      passwordHash,
      enrolledCourse: enrolledCourse || false,
      progress: progress || 0,
      transactionId: transactionId || null,
      bypassPayment: bypassPayment || false,
      createdAt: new Date()
    });

    await newUser.save();

    // Return user without password hash
    const { passwordHash: _, ...userWithoutPassword } = newUser.toObject();

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      message: 'Student created successfully'
    });
  } catch (error) {
    console.error('Create student error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
