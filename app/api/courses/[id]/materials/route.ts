import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { MaterialModel } from '@/lib/models/Material'
import { UserModel } from '@/lib/models/User'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || ''

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase()

    const cookie = req.cookies.get('auth_token')?.value
    if (!cookie || !JWT_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded: any = jwt.verify(cookie, JWT_SECRET)
    const user = await UserModel.findById(decoded.sub)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id: courseId } = params

    // Check enrollment
    const isEnrolled = (user.enrolledCourses || []).some((e: any) => String(e.courseId) === String(courseId))
    if (!isEnrolled) {
      return NextResponse.json({ error: 'Forbidden: not enrolled in this course' }, { status: 403 })
    }

    const materials = await MaterialModel.find({ courseId, isActive: true }).sort({ createdAt: -1 })

    return NextResponse.json({ success: true, materials })
  } catch (error: any) {
    console.error('Fetch course materials error:', error)
    return NextResponse.json({ error: error?.message || 'Failed to fetch materials' }, { status: 500 })
  }
}

