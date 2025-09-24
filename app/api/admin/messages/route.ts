import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyAdmin } from '@/lib/admin-auth';
import { ContactMessageModel } from '@/lib/models/ContactMessage';

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

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Build filter object
    const filter: any = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const messages = await ContactMessageModel.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await ContactMessageModel.countDocuments(filter);

    return NextResponse.json({
      success: true,
      messages,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Fetch messages error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const admin = await verifyAdmin(request);
    
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { messageIds } = await request.json();

    if (!messageIds || !Array.isArray(messageIds)) {
      return NextResponse.json(
        { error: 'Message IDs are required' },
        { status: 400 }
      );
    }

    const result = await ContactMessageModel.deleteMany({
      _id: { $in: messageIds }
    });

    return NextResponse.json({
      success: true,
      message: `${result.deletedCount} messages deleted successfully`
    });
  } catch (error) {
    console.error('Delete messages error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
