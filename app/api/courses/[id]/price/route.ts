import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { CourseModel } from '@/lib/models/Course';

export const dynamic = 'force-dynamic'

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

    const response = NextResponse.json({
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

    // Add cache control headers to prevent caching
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('Surrogate-Control', 'no-store');

    return response;
  } catch (error) {
    console.error('Get course price error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
