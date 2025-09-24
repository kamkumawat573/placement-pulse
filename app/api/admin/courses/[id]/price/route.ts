import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyAdmin } from '@/lib/admin-auth';
import { CourseModel } from '@/lib/models/Course';
import { PriceHistoryModel } from '@/lib/models/PriceHistory';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { price, originalPrice, discount, changeReason } = await request.json();
    
    if (!price || price <= 0) {
      return NextResponse.json({ error: 'Valid price is required' }, { status: 400 });
    }

    const course = await CourseModel.findById(params.id);
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Store old price for history
    const oldPrice = course.price;
    const oldOriginalPrice = course.originalPrice;
    const oldDiscount = course.discount;

    // Update course price
    const updatedCourse = await CourseModel.findByIdAndUpdate(
      params.id,
      {
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : course.originalPrice,
        discount: discount || course.discount,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!updatedCourse) {
      return NextResponse.json({ error: 'Failed to update course' }, { status: 500 });
    }

    // Record price change in history
    try {
      await PriceHistoryModel.create({
        courseId: course._id,
        oldPrice,
        newPrice: Number(price),
        oldOriginalPrice,
        newOriginalPrice: originalPrice ? Number(originalPrice) : course.originalPrice,
        oldDiscount,
        newDiscount: discount || course.discount,
        changedBy: admin.id,
        changeReason: changeReason || 'Price update',
        timestamp: new Date()
      });
    } catch (historyError) {
      console.error('Error recording price history:', historyError);
      // Don't fail the request if history recording fails
    }

    return NextResponse.json({
      success: true,
      course: updatedCourse,
      priceChange: {
        oldPrice,
        newPrice: price,
        oldOriginalPrice,
        newOriginalPrice: originalPrice || course.originalPrice
      }
    });
  } catch (error) {
    console.error('Update course price error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const course = await CourseModel.findById(params.id);
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      course: {
        id: course._id,
        title: course.title,
        price: course.price,
        originalPrice: course.originalPrice,
        discount: course.discount
      }
    });
  } catch (error) {
    console.error('Get course price error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
