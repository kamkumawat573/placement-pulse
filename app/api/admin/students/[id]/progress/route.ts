import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyAdmin } from '@/lib/admin-auth';
import { UserModel } from '@/lib/models/User';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    
    const admin = await verifyAdmin(request);
    
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { progress, enrolledCourse } = await request.json();
    
    const updateData: any = {};
    if (progress !== undefined) updateData.progress = progress;
    if (enrolledCourse !== undefined) updateData.enrolledCourse = enrolledCourse;
    
    const student = await UserModel.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        mobile: student.mobile,
        enrolledCourse: student.enrolledCourse,
        progress: student.progress,
        transactionId: student.transactionId
      }
    });
  } catch (error) {
    console.error('Update student progress error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
