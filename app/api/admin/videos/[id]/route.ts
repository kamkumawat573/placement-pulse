import { NextRequest } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { VideoModel } from "@/lib/models/Video"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()
    const { id } = params
    
    const video = await VideoModel.findOne({ videoId: id })
      .select('videoId title description videoUrl thumbnailUrl duration category isActive isFeatured order views createdAt')
    
    if (!video) {
      return new Response(
        JSON.stringify({ error: 'Video not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      )
    }
    
    return new Response(
      JSON.stringify({ video }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error fetching video:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to fetch video' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()
    const { id } = params
    const body = await request.json()
    const { title, description, videoUrl, thumbnailUrl, duration, category, isActive, isFeatured, order } = body

    const updatedVideo = await VideoModel.findOneAndUpdate(
      { videoId: id },
      { 
        title: title?.trim(),
        description: description?.trim(),
        videoUrl: videoUrl?.trim(),
        thumbnailUrl: thumbnailUrl?.trim(),
        duration: duration?.trim(),
        category: category || 'preview',
        isActive: isActive ?? true,
        isFeatured: isFeatured ?? false,
        order: order || 0
      },
      { new: true }
    )

    if (!updatedVideo) {
      return new Response(
        JSON.stringify({ error: 'Video not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Video updated successfully!',
        video: updatedVideo 
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error updating video:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to update video' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()
    const { id } = params

    const deletedVideo = await VideoModel.findOneAndDelete({ videoId: id })

    if (!deletedVideo) {
      return new Response(
        JSON.stringify({ error: 'Video not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Video deleted successfully!' 
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error deleting video:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to delete video' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}