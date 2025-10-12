import { connectToDatabase } from "@/lib/mongodb"
import { BlogModel } from "@/lib/models/Blog"
import { NotificationModel } from "@/lib/models/Notification"
import { v4 as uuidv4 } from 'uuid'

export async function GET() {
  try {
    await connectToDatabase()
    const blogs = await BlogModel.find({})
      .sort({ createdAt: -1 })
      .select('blogId title content category tags coverImage author isVisible createdAt')
    
    return new Response(
      JSON.stringify({ blogs }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error fetching blogs:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to fetch blogs' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase()
    
    const body = await request.json()
    const { title, content, category, tags, coverImage, author = 'Admin' } = body

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

    // Check for duplicate title
    const existingBlog = await BlogModel.findOne({ title: title.trim() })
    if (existingBlog) {
      return new Response(
        JSON.stringify({ error: 'A blog with this title already exists' }),
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Generate unique blogId
    const blogId = uuidv4()

    // Process tags
    const processedTags = tags ? 
      (Array.isArray(tags) ? tags : tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag)) 
      : []

    // Create blog
    const blog = new BlogModel({
      blogId,
      title: title.trim(),
      content: content.trim(),
      category: category?.trim() || undefined,
      tags: processedTags,
      coverImage: coverImage?.trim() || undefined,
      author: author.trim(),
      isVisible: true
    })

    await blog.save()

    // Create notification
    const notificationId = uuidv4()
    const notification = new NotificationModel({
      id: notificationId,
      type: 'blog',
      message: `New Blog Published: ${title.trim()}`,
      blogId: blogId
    })

    await notification.save()

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Blog created successfully!',
        blogId: blogId,
        blog: {
          blogId: blog.blogId,
          title: blog.title,
          content: blog.content,
          category: blog.category,
          tags: blog.tags,
          coverImage: blog.coverImage,
          author: blog.author,
          createdAt: blog.createdAt
        }
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error creating blog:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to create blog post' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
