import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyAdmin } from '@/lib/admin-auth';
import { UserModel } from '@/lib/models/User';
import { PaymentModel } from '@/lib/models/Payment';

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

    // Get payment details if transactionId exists
    let paymentDetails = null;
    if (student.transactionId && student.transactionId !== 'ADMIN_ENROLLED') {
      try {
        paymentDetails = await PaymentModel.findOne({ 
          $or: [
            { paymentId: student.transactionId },
            { userId: student._id }
          ]
        }).sort({ createdAt: -1 });
      } catch (error) {
        console.error('Error fetching payment details:', error);
      }
    }

    return NextResponse.json({
      success: true,
      student: {
        ...student.toObject(),
        paymentDetails
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
