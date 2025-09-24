import { NextRequest } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { VideoModel } from "@/lib/models/Video"

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured')
    const category = searchParams.get('category')
    
    let query = { isActive: true }
    if (featured === 'true') {
      query = { ...query, isFeatured: true }
    }
    if (category) {
      query = { ...query, category }
    }
    
    const videos = await VideoModel.find(query)
      .sort({ order: 1, createdAt: -1 })
      .select('videoId title description videoUrl thumbnailUrl duration category isFeatured order views createdAt')
      .limit(1) // Only return the first video
    
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