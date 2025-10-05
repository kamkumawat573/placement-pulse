import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { verifyAdmin } from '@/lib/admin-auth'
import { MaterialModel } from '@/lib/models/Material'

// Update or toggle visibility for a single material
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase()
    const admin = await verifyAdmin(req)
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = params
    const body = await req.json()

    const update: any = {}
    if (body.title !== undefined) update.title = String(body.title)
    if (body.description !== undefined) update.description = String(body.description)
    if (body.fileUrl !== undefined) update.fileUrl = String(body.fileUrl)
    if (body.content !== undefined) update.content = String(body.content)
    if (body.isActive !== undefined) update.isActive = !!body.isActive

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    const material = await MaterialModel.findByIdAndUpdate(id, update, { new: true })
    if (!material) return NextResponse.json({ error: 'Material not found' }, { status: 404 })

    return NextResponse.json({ success: true, material })
  } catch (error: any) {
    console.error('Update material error:', error)
    return NextResponse.json({ error: error?.message || 'Failed to update material' }, { status: 500 })
  }
}

// Delete a single material
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase()
    const admin = await verifyAdmin(req)
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = params
    const removed = await MaterialModel.findByIdAndDelete(id)
    if (!removed) return NextResponse.json({ error: 'Material not found' }, { status: 404 })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Delete material error:', error)
    return NextResponse.json({ error: error?.message || 'Failed to delete material' }, { status: 500 })
  }
}

