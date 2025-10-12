import { NextRequest } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { VideoModel } from "@/lib/models/Video"
import { v4 as uuidv4 } from 'uuid'

export async function GET() {
  try {
    await connectToDatabase()
    const videos = await VideoModel.find({})
      .sort({ order: 1, createdAt: -1 })
      .select('videoId title description videoUrl thumbnailUrl duration category isActive isFeatured order views createdAt')
    
    return new Response(
      JSON.stringify({ videos }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error fetching videos:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to fetch videos' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()
    const body = await request.json()
    const { title, description, videoUrl, thumbnailUrl, duration, category, isActive, isFeatured, order } = body

    if (!title || !videoUrl) {
      return new Response(
        JSON.stringify({ error: 'Title and video URL are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const videoId = uuidv4()
    const video = new VideoModel({
      videoId,
      title: title.trim(),
      description: description?.trim() || undefined,
      videoUrl: videoUrl.trim(),
      thumbnailUrl: thumbnailUrl?.trim() || undefined,
      duration: duration?.trim() || undefined,
      category: category || 'preview',
      isActive: isActive ?? true,
      isFeatured: isFeatured ?? false,
      order: order || 0,
      // createdBy: TODO: Get from auth context
    })

    await video.save()

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Video created successfully!', 
        videoId,
        video: {
          videoId,
          title: video.title,
          description: video.description,
          videoUrl: video.videoUrl,
          thumbnailUrl: video.thumbnailUrl,
          duration: video.duration,
          category: video.category,
          isActive: video.isActive,
          isFeatured: video.isFeatured,
          order: video.order,
          views: video.views,
          createdAt: video.createdAt
        }
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error creating video:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to create video' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}