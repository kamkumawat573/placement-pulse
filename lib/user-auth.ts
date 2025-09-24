import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { connectToDatabase } from './mongodb';
import { UserModel } from './models/User';

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  enrolledCourse: boolean;
  progress: number;
}

export async function verifyUser(request: NextRequest): Promise<User | null> {
  try {
    const token = request.cookies.get('auth_token')?.value;
    
    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { sub: string; email: string };
    
    await connectToDatabase();
    const user = await UserModel.findById(decoded.sub);
    
    if (!user) {
      return null;
    }

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      enrolledCourse: user.enrolledCourse,
      progress: user.progress
    };
  } catch (error) {
    console.error('User verification error:', error);
    return null;
  }
}
