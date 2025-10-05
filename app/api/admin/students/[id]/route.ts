import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyAdmin } from '@/lib/admin-auth';
import { UserModel } from '@/lib/models/User';
import { PaymentModel } from '@/lib/models/Payment';
import { CourseModel } from '@/lib/models/Course';

export async function GET(
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

    const student = await UserModel.findById(params.id).select('-passwordHash');
    
    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    // Collect full payment history for this student (multi-course payments)
    let paymentDetails = null;
    let paymentHistory = [] as any[];
    try {
      // Latest payment detail preserved for backward-compat UI
      paymentDetails = await PaymentModel.findOne({
        $or: [
          { userId: student._id },
          { email: student.email }
        ]
      }).sort({ createdAt: -1 });

      // Full history (descending)
      paymentHistory = await PaymentModel.find({
        $or: [
          { userId: student._id },
          { email: student.email }
        ]
      }).sort({ createdAt: -1 }).lean();

      // Enrich payments with course title when notes.courseId is present
      const courseIds = Array.from(new Set(
        (paymentHistory || [])
          .map((p: any) => p?.notes?.courseId)
          .filter((x: any) => !!x)
          .map((x: any) => String(x))
      ));
      if (courseIds.length > 0) {
        const courses = await CourseModel.find({ _id: { $in: courseIds } }).select('title').lean();
        const courseMap: Record<string, string> = {};
        courses.forEach((c: any) => { courseMap[String(c._id)] = c.title; });
        paymentHistory = paymentHistory.map((p: any) => ({
          ...p,
          courseTitle: p?.notes?.course ? p.notes.course : (p?.notes?.courseId ? courseMap[String(p.notes.courseId)] : undefined)
        }));
      }
    } catch (error) {
      console.error('Error fetching payment details:', error);
    }

    return NextResponse.json({
      success: true,
      student: {
        ...student.toObject(),
        paymentDetails,
        paymentHistory,
      }
    });
  } catch (error) {
    console.error('Get student error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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

    const { name, email, mobile, enrolledCourse, bypassPayment } = await request.json();

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (mobile !== undefined) updateData.mobile = mobile;
    if (enrolledCourse !== undefined) updateData.enrolledCourse = enrolledCourse;
    if (bypassPayment !== undefined) updateData.bypassPayment = bypassPayment;

    const student = await UserModel.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-passwordHash');
    
    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      student
    });
  } catch (error) {
    console.error('Update student error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    const student = await UserModel.findByIdAndDelete(params.id);
    
    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    console.error('Delete student error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
