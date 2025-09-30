import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import GDTopic from '@/lib/models/GDTopic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase()
    
    const topic = await GDTopic.findById(params.id)
    if (!topic) {
      return NextResponse.json(
        { success: false, error: 'GD topic not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      topic
    })
  } catch (error) {
    console.error('Error fetching GD topic:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch GD topic' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase()
    
    const body = await request.json()
    const {
      title,
      description,
      category,
      difficulty,
      tags,
      discussionPoints,
      tips,
      relatedTopics,
      imageUrl,
      isActive,
      isTrending
    } = body
    
    const topic = await GDTopic.findById(params.id)
    if (!topic) {
      return NextResponse.json(
        { success: false, error: 'GD topic not found' },
        { status: 404 }
      )
    }
    
    // Update fields
    if (title !== undefined) topic.title = title.trim()
    if (description !== undefined) topic.description = description.trim()
    if (category !== undefined) topic.category = category.trim()
    if (difficulty !== undefined) topic.difficulty = difficulty
    if (tags !== undefined) {
      topic.tags = Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()).filter(t => t) : [])
    }
    if (discussionPoints !== undefined) {
      topic.discussionPoints = Array.isArray(discussionPoints) ? discussionPoints : (discussionPoints ? discussionPoints.split('\n').map(p => p.trim()).filter(p => p) : [])
    }
    if (tips !== undefined) {
      topic.tips = Array.isArray(tips) ? tips : (tips ? tips.split('\n').map(t => t.trim()).filter(t => t) : [])
    }
    if (relatedTopics !== undefined) {
      topic.relatedTopics = Array.isArray(relatedTopics) ? relatedTopics : (relatedTopics ? relatedTopics.split(',').map(t => t.trim()).filter(t => t) : [])
    }
    if (imageUrl !== undefined) topic.imageUrl = imageUrl.trim()
    if (typeof isActive === 'boolean') topic.isActive = isActive
    if (typeof isTrending === 'boolean') topic.isTrending = isTrending
    
    await topic.save()
    
    return NextResponse.json({
      success: true,
      topic,
      message: 'GD topic updated successfully'
    })
  } catch (error) {
    console.error('Error updating GD topic:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update GD topic' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase()
    
    const topic = await GDTopic.findById(params.id)
    if (!topic) {
      return NextResponse.json(
        { success: false, error: 'GD topic not found' },
        { status: 404 }
      )
    }
    
    // Soft delete by setting isActive to false
    topic.isActive = false
    await topic.save()
    
    return NextResponse.json({
      success: true,
      message: 'GD topic deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting GD topic:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete GD topic' },
      { status: 500 }
    )
  }
}