import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { AnnouncementModel } from '@/lib/models/Announcement'
import { UserModel } from '@/lib/models/User'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || ''

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase()

    const token = req.cookies.get('auth_token')?.value
    if (!token || !JWT_SECRET) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const decoded: any = jwt.verify(token, JWT_SECRET)
    const user = await UserModel.findById(decoded.sub)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id: courseId } = params
    const isEnrolled = (user.enrolledCourses || []).some((e: any) => String(e.courseId) === String(courseId))
    if (!isEnrolled) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const announcements = await AnnouncementModel.find({ courseId, isActive: true }).sort({ createdAt: -1 })

    return NextResponse.json({ success: true, announcements })
  } catch (error: any) {
    console.error('Fetch course announcements error:', error)
    return NextResponse.json({ error: error?.message || 'Failed to fetch announcements' }, { status: 500 })
  }
}

