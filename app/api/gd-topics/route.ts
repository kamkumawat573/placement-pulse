import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import GDTopic from '@/lib/models/GDTopic'

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const category = searchParams.get('category')
    const trending = searchParams.get('trending')
    const search = searchParams.get('search')
    const difficulty = searchParams.get('difficulty')
    
    // Build query - only show active topics
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