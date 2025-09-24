import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyAdmin } from '@/lib/admin-auth';
import { CourseModel } from '@/lib/models/Course';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const courses = await CourseModel.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, courses });
  } catch (error) {
    console.error('Fetch courses error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('Course creation request received');
    
    await connectToDatabase();
    console.log('Database connected');
    
    const admin = await verifyAdmin(request);
    if (!admin) {
      console.log('Admin verification failed');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.log('Admin verified:', admin.name);

    const requestBody = await request.json();
    console.log('Request body received:', Object.keys(requestBody));

    const {
      title,
      description,
      shortDescription,
      price,
      originalPrice,
      discount,
      duration,
      level,
      category,
      instructor,
      image,
      features,
      modules,
      testimonials,
      isActive,
      isFeatured
    } = requestBody;

    // Validate required fields
    if (!title || !description || !shortDescription || !price || !originalPrice || !duration || !level || !category || !instructor) {
      console.log('Missing required fields:', {
        title: !!title,
        description: !!description,
        shortDescription: !!shortDescription,
        price: !!price,
        originalPrice: !!originalPrice,
        duration: !!duration,
        level: !!level,
        category: !!category,
        instructor: !!instructor
      });
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create slug from title
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    console.log('Generated slug:', slug);

    // Check if course with same slug exists
    const existingCourse = await CourseModel.findOne({ slug });
    if (existingCourse) {
      console.log('Course with slug already exists:', slug);
      return NextResponse.json({ error: 'Course with similar title already exists' }, { status: 400 });
    }

    console.log('Creating course with data:', {
      title,
      category,
      instructor,
      price,
      originalPrice,
      level
    });

    const course = await CourseModel.create({
      title,
      description,
      shortDescription,
      price,
      originalPrice,
      discount: discount || "50% OFF",
      duration,
      level,
      category,
      instructor,
      image: image || "/api/placeholder/400/300",
      features: features || [],
      modules: modules || [],
      testimonials: testimonials || [],
      isActive: isActive !== undefined ? isActive : true,
      isFeatured: isFeatured !== undefined ? isFeatured : false,
      slug
    });

    console.log('Course created successfully:', course._id);
    return NextResponse.json({ success: true, course });
  } catch (error) {
    console.error('Create course error:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
