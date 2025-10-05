import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { verifyAdmin } from '@/lib/admin-auth'
import { AnnouncementModel } from '@/lib/models/Announcement'
import { CourseModel } from '@/lib/models/Course'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase()
    const admin = await verifyAdmin(req)
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id: courseId } = params
    const body = await req.json()
    const { title, content, priority = 'medium' } = body || {}

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 })
    }

    // Validate course exists
    const course = await CourseModel.findById(courseId)
    if (!course || !course.isActive) {
      return NextResponse.json({ error: 'Invalid or inactive course' }, { status: 400 })
    }

    const announcement = await AnnouncementModel.create({
      title,
      content,
      type: 'course',
      priority,
      targetAudience: 'enrolled',
      courseId,
      createdBy: admin.id,
      isActive: true,
    })

    return NextResponse.json({ success: true, announcement }, { status: 201 })
  } catch (error: any) {
    console.error('Create course notification error:', error)
    return NextResponse.json({ error: error?.message || 'Failed to create notification' }, { status: 500 })
  }
}

