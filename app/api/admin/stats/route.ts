import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyAdmin } from '@/lib/admin-auth';
import { UserModel } from '@/lib/models/User';
import { PaymentModel } from '@/lib/models/Payment';

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

    console.log('UserModel in stats:', UserModel);
    console.log('PaymentModel in stats:', PaymentModel);

    // Get total students
    const totalStudents = await UserModel.countDocuments();
    
    // Get enrolled students
    const enrolledStudents = await UserModel.countDocuments({ enrolledCourse: true });
    
    // Get total revenue from payments
    const payments = await PaymentModel.find({ status: 'captured' });
    const totalRevenue = payments.reduce((sum, payment) => sum + (payment.amount / 100), 0);
    
    // Get recent enrollments (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentEnrollments = await UserModel.countDocuments({
      enrolledCourse: true,
      updatedAt: { $gte: sevenDaysAgo }
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalStudents,
        enrolledStudents,
        totalRevenue,
        recentEnrollments
      }
    });
  } catch (error) {
    console.error('Fetch stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
