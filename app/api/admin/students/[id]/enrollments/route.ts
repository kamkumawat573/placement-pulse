import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { verifyAdmin } from '@/lib/admin-auth'
import { UserModel } from '@/lib/models/User'
import { CourseModel } from '@/lib/models/Course'

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()

    const admin = await verifyAdmin(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: userId } = params
    const { courseId } = await request.json()

    if (!courseId) {
      return NextResponse.json({ error: 'courseId is required' }, { status: 400 })
    }

    const user = await UserModel.findById(userId)
    if (!user) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    const course = await CourseModel.findById(courseId)
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    const alreadyEnrolled = (user.enrolledCourses || []).some((e: any) => String(e.courseId) === String(courseId))
    if (alreadyEnrolled) {
      return NextResponse.json({ error: 'Student is already enrolled in this course' }, { status: 409 })
    }

    const enrollmentData = {
      courseId,
      enrolledAt: new Date(),
      progress: 0,
      transactionId: 'ADMIN_ENROLLED',
      status: 'active' as const,
    }

    const updated = await UserModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          enrolledCourse: true,
          bypassPayment: true,
          progress: 0,
          transactionId: 'ADMIN_ENROLLED',
        },
        $push: {
          enrolledCourses: enrollmentData,
        },
      },
      { new: true }
    ).select('-passwordHash')

    return NextResponse.json({ success: true, student: updated })
  } catch (error: any) {
    console.error('Admin enroll student error:', error)
    return NextResponse.json({ error: error?.message || 'Failed to enroll student' }, { status: 500 })
  }
}

