import { connectToDatabase } from "@/lib/mongodb"
import { BlogModel } from "@/lib/models/Blog"
import { NotificationModel } from "@/lib/models/Notification"
import { v4 as uuidv4 } from 'uuid'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()
    const blog = await BlogModel.findById(params.id)
    
    if (!blog) {
      return new Response(
        JSON.stringify({ error: 'Blog not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ blog }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error fetching blog:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to fetch blog' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()
    
    const body = await request.json()
    const { title, content, category, tags, coverImage, author, isVisible } = body

    // Validation
    if (!title || !title.trim()) {
      return new Response(
        JSON.stringify({ error: 'Title is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (!content || !content.trim()) {
      return new Response(
        JSON.stringify({ error: 'Content is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (content.trim().length < 50) {
      return new Response(
        JSON.stringify({ error: 'Content too short. Please provide at least 50 characters.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Check for duplicate title (excluding current blog)
    const existingBlog = await BlogModel.findOne({ 
      title: title.trim(), 
      _id: { $ne: params.id } 
    })
    if (existingBlog) {
      return new Response(
        JSON.stringify({ error: 'A blog with this title already exists' }),
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Process tags
    const processedTags = tags ? 
      (Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim()).filter(tag => tag)) 
      : []

    // Update blog
    const updatedBlog = await BlogModel.findByIdAndUpdate(
      params.id,
      {
        title: title.trim(),
        content: content.trim(),
        category: category?.trim() || undefined,
        tags: processedTags,
        coverImage: coverImage?.trim() || undefined,
        author: author?.trim() || 'Admin',
        isVisible: isVisible !== undefined ? isVisible : true
      },
      { new: true }
    )

    if (!updatedBlog) {
      return new Response(
        JSON.stringify({ error: 'Blog not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Blog updated successfully!',
        blog: {
          _id: updatedBlog._id,
          blogId: updatedBlog.blogId,
          title: updatedBlog.title,
          content: updatedBlog.content,
          category: updatedBlog.category,
          tags: updatedBlog.tags,
          coverImage: updatedBlog.coverImage,
          author: updatedBlog.author,
          isVisible: updatedBlog.isVisible,
          createdAt: updatedBlog.createdAt
        }
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error updating blog:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to update blog post' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()
    
    const blog = await BlogModel.findById(params.id)
    if (!blog) {
      return new Response(
        JSON.stringify({ error: 'Blog not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Delete associated notifications
    await NotificationModel.deleteMany({ blogId: blog.blogId })

    // Delete the blog
    await BlogModel.findByIdAndDelete(params.id)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Blog deleted successfully!'
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error deleting blog:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to delete blog post' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

