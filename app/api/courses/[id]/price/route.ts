import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { CourseModel } from '@/lib/models/Course';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const course = await CourseModel.findById(params.id);
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    if (!course.isActive) {
      return NextResponse.json({ error: 'Course is not available' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      price: {
        id: course._id,
        title: course.title,
        price: course.price,
        originalPrice: course.originalPrice,
        discount: course.discount,
        currency: 'INR'
      }
    });
  } catch (error) {
    console.error('Get course price error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
