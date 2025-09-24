import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { AnnouncementModel } from '@/lib/models/Announcement';
import { verifyAdmin } from '@/lib/admin-auth';

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

    const { id } = params;
    const { title, content, type, priority, targetAudience, expiresAt, specificStudents, isActive } = await request.json();

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const announcement = await AnnouncementModel.findByIdAndUpdate(
      id,
      {
        title,
        content,
        type: type || 'general',
        priority: priority || 'medium',
        targetAudience: targetAudience || 'all',
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        specificStudents: specificStudents || [],
        isActive: isActive !== undefined ? isActive : true
      },
      { new: true }
    ).populate('createdBy', 'name email');

    if (!announcement) {
      return NextResponse.json({ error: 'Announcement not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      announcement: {
        _id: announcement._id,
        title: announcement.title,
        content: announcement.content,
        type: announcement.type,
        priority: announcement.priority,
        targetAudience: announcement.targetAudience,
        isActive: announcement.isActive,
        createdAt: announcement.createdAt,
        createdBy: announcement.createdBy
      }
    });
  } catch (error) {
    console.error('Update announcement error:', error);
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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    const announcement = await AnnouncementModel.findByIdAndDelete(id);

    if (!announcement) {
      return NextResponse.json({ error: 'Announcement not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Announcement deleted successfully'
    });
  } catch (error) {
    console.error('Delete announcement error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
