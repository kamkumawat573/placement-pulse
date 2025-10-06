import { notFound } from "next/navigation"
import { connectToDatabase } from "@/lib/mongodb"
import { BlogModel } from "@/lib/models/Blog"

export const revalidate = 0

async function getBlog(id: string) {
  await connectToDatabase()
  // Try by ObjectId first; fall back to blogId string
  const byId = await BlogModel.findById(id).lean().catch(() => null as any)
  if (byId && (byId.isVisible !== false)) return byId
  const byBlogId = await BlogModel.findOne({ blogId: id }).lean()
  if (byBlogId && (byBlogId.isVisible !== false)) return byBlogId
  return null
}

export default async function BlogDetailPage({ params }: { params: { id: string } }) {
  const blog = await getBlog(params.id)
  if (!blog) return notFound()

  const title: string = blog.title || blog.caption || "Blog"
  const cover = blog.coverImage || blog.imageUrl
  const createdAt = blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : undefined
  const tags: string[] = Array.isArray(blog.tags) ? blog.tags : []

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-900 dark:to-slate-800 py-10 md:py-14">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <a href="/blogs" className="text-sm text-blue-600 hover:underline">← Back to Blogs</a>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">{title}</h1>

          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300 mb-6">
            {createdAt && <span>{createdAt}</span>}
            {blog.author && <span>• By {blog.author}</span>}
          </div>

          {cover && (
            <div className="mb-8 rounded-lg overflow-hidden shadow">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={cover} alt={title} className="w-full h-64 object-cover" />
            </div>
          )}

          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {tags.map((t, i) => (
                <span key={i} className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-1 rounded-full">#{t}</span>
              ))}
            </div>
          )}

          {blog.content ? (
            <article className="prose dark:prose-invert max-w-none">
              <p className="whitespace-pre-wrap leading-7 text-gray-800 dark:text-gray-200">
                {blog.content}
              </p>
            </article>
          ) : (
            <p className="text-gray-600 dark:text-gray-300">No content available.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const blog = await getBlog(params.id)
  if (!blog) return { title: "Blog | Placement Pulse" }
  const title = blog.title || blog.caption || "Blog"
  const description = (blog.content || "").slice(0, 150)
  return {
    title: `${title} | Placement Pulse`,
    description,
    openGraph: {
      title,
      description,
      images: blog.coverImage ? [blog.coverImage] : undefined,
      type: "article",
    },
  }
}

