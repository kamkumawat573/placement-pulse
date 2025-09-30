import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { CourseModel } from '@/lib/models/Course';

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const courses = await CourseModel.find({ isActive: true }).sort({ createdAt: -1 });
    
    const response = NextResponse.json({
      success: true,
      courses: courses.map(course => ({
        id: course._id,
        title: course.title,
        description: course.description,
        shortDescription: course.shortDescription,
        price: course.price,
        originalPrice: course.originalPrice,
        discount: course.discount,
        duration: course.duration,
        level: course.level,
        category: course.category,
        instructor: course.instructor,
        image: course.image,
        features: course.features,
        modules: course.modules,
        testimonials: course.testimonials,
        isActive: course.isActive,
        isFeatured: course.isFeatured,
        slug: course.slug,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt
      }))
    });

    // Add cache control headers to prevent caching
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('Surrogate-Control', 'no-store');

    return response;
  } catch (error) {
    console.error('Fetch courses error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}