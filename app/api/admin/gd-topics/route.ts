import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import GDTopic from '@/lib/models/GDTopic'

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    const trending = searchParams.get('trending')
    const search = searchParams.get('search')
    const difficulty = searchParams.get('difficulty')
    
    // Build query - only show active topics in admin panel
    const query: any = { isActive: true }
    
    if (category && category !== 'all') {
      query.category = category
    }
    
    if (trending === 'true') {
      query.isTrending = true
    }
    
    if (difficulty && difficulty !== 'all') {
      query.difficulty = difficulty
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ]
    }
    
    const skip = (page - 1) * limit
    
    const [topics, total] = await Promise.all([
      GDTopic.find(query)
        .sort({ isTrending: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      GDTopic.countDocuments(query)
    ])
    
    return NextResponse.json({
      success: true,
      topics,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching GD topics:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch GD topics' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
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
      isTrending
    } = body
    
    // Validate required fields
    if (!title?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Title is required' },
        { status: 400 }
      )
    }
    
    if (!description?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Description is required' },
        { status: 400 }
      )
    }
    
    if (!category?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Category is required' },
        { status: 400 }
      )
    }
    
    // Create new topic
    const newTopic = new GDTopic({
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
      difficulty: difficulty || 'Medium',
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map((t: string) => t.trim()).filter((t: string) => t) : []),
      discussionPoints: Array.isArray(discussionPoints) ? discussionPoints : (discussionPoints ? discussionPoints.split('\n').map((p: string) => p.trim()).filter((p: string) => p) : []),
      tips: Array.isArray(tips) ? tips : (tips ? tips.split('\n').map((t: string) => t.trim()).filter((t: string) => t) : []),
      relatedTopics: Array.isArray(relatedTopics) ? relatedTopics : (relatedTopics ? relatedTopics.split(',').map((t: string) => t.trim()).filter((t: string) => t) : []),
      imageUrl: imageUrl?.trim() || '',
      isTrending: Boolean(isTrending),
      isActive: true,
      createdBy: 'admin'
    })
    
    await newTopic.save()
    
    return NextResponse.json({
      success: true,
      topic: newTopic,
      message: 'GD topic created successfully'
    })
  } catch (error) {
    console.error('Error creating GD topic:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create GD topic' },
      { status: 500 }
    )
  }
}