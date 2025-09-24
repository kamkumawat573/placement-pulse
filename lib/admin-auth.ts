import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import Admin from './models/Admin';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export async function verifyAdmin(request: NextRequest): Promise<AdminUser | null> {
  try {
    const token = request.cookies.get('admin_token')?.value;
    
    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { adminId: string };
    
    const admin = await Admin.findById(decoded.adminId).select('-passwordHash');
    
    if (!admin || !admin.isActive) {
      return null;
    }

    return {
      id: admin._id.toString(),
      name: admin.name,
      email: admin.email,
      role: admin.role
    };
  } catch (error) {
    console.error('Admin verification error:', error);
    return null;
  }
}

export function generateAdminToken(adminId: string): string {
  return jwt.sign({ adminId }, process.env.JWT_SECRET!, { expiresIn: '7d' });
}
