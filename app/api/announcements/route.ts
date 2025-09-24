import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { AnnouncementModel } from '@/lib/models/Announcement';
import { verifyUser } from '@/lib/user-auth';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    // Get user from token
    const user = await verifyUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get current date for expiration check
    const now = new Date();
    
    // Build filter based on user's enrollment status and target audience
    const baseFilter = {
      isActive: true,
      $or: [
        { expiresAt: null },
        { expiresAt: { $gt: now } }
      ]
    };

    // Add target audience filtering
    const targetAudienceFilter = {
      $or: [
        { targetAudience: 'all' },
        { targetAudience: user.enrolledCourse ? 'enrolled' : 'unenrolled' },
        { 
          targetAudience: 'specific',
          specificStudents: { $in: [user.id] }
        }
      ]
    };

    // Combine filters
    const filter = {
      ...baseFilter,
      ...targetAudienceFilter
    };
    
    // Fetch filtered announcements
    const announcements = await AnnouncementModel.find(filter)
      .populate('createdBy', 'name email')
      .sort({ priority: -1, createdAt: -1 }); // Sort by priority (urgent first) then by date

    return NextResponse.json({
      success: true,
      announcements: announcements.map(announcement => ({
        id: announcement._id,
        title: announcement.title,
        content: announcement.content,
        type: announcement.type,
        priority: announcement.priority,
        targetAudience: announcement.targetAudience,
        createdAt: announcement.createdAt,
        createdBy: announcement.createdBy
      }))
    });
  } catch (error) {
    console.error('Fetch announcements error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
