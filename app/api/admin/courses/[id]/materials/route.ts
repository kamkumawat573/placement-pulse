import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { verifyAdmin } from '@/lib/admin-auth'
import { MaterialModel } from '@/lib/models/Material'
import { CourseModel } from '@/lib/models/Course'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase()
    const admin = await verifyAdmin(req)
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id: courseId } = params
    const materials = await MaterialModel.find({ courseId }).sort({ createdAt: -1 })

    return NextResponse.json({ success: true, materials })
  } catch (error: any) {
    console.error('Fetch materials error:', error)
    return NextResponse.json({ error: error?.message || 'Failed to fetch materials' }, { status: 500 })
  }
}

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
    const { title, description, fileUrl, content, isActive } = body || {}

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    // Validate course exists
    const course = await CourseModel.findById(courseId)
    if (!course || !course.isActive) {
      return NextResponse.json({ error: 'Invalid or inactive course' }, { status: 400 })
    }

    const material = await MaterialModel.create({
      courseId,
      title,
      description,
      fileUrl,
      content,
      isActive: isActive !== undefined ? !!isActive : true,
      createdBy: admin.id,
    })

    return NextResponse.json({ success: true, material }, { status: 201 })
  } catch (error: any) {
    console.error('Create material error:', error)
    return NextResponse.json({ error: error?.message || 'Failed to create material' }, { status: 500 })
  }
}

