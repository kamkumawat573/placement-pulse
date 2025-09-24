import { connectToDatabase } from "@/lib/mongodb"
import { BlogModel } from "@/lib/models/Blog"

export async function GET() {
  await connectToDatabase()
  const blogs = await BlogModel.find({ 
    $or: [
      { isVisible: { $ne: false } }, // Show visible blogs or legacy blogs (no isVisible field)
      { isVisible: { $exists: false } } // Include legacy blogs without isVisible field
    ]
  }).sort({ createdAt: -1 }).limit(12)
  return new Response(
    JSON.stringify(
      blogs.map((b) => {
        // Return new format if available, fallback to legacy format
        if (b.title && b.content) {
          return {
            id: b._id.toString(),
            blogId: b.blogId,
            title: b.title,
            content: b.content,
            category: b.category,
            tags: b.tags,
            coverImage: b.coverImage,
            author: b.author,
            createdAt: b.createdAt
          }
        } else {
          // Legacy format for backward compatibility
          return {
            id: b._id.toString(),
            caption: b.caption,
            imageUrl: b.imageUrl,
            highlightedText: b.highlightedText,
            highlightType: b.highlightType,
            createdAt: b.createdAt
          }
        }
      })
    ),
    { status: 200 }
  )
}


