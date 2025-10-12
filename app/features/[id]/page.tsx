import { notFound } from "next/navigation"
import { connectToDatabase } from "@/lib/mongodb"
import GDTopic from "@/lib/models/GDTopic"

export const revalidate = 0

async function getTopic(id: string) {
  await connectToDatabase()
  const topic = await GDTopic.findById(id).lean().catch(() => null as any)
  if (!topic || topic.isActive === false) return null
  return topic
}

export default async function TopicDetailPage({ params }: { params: { id: string } }) {
  const topic = await getTopic(params.id)
  if (!topic) return notFound()

  const createdAt = topic.createdAt ? new Date(topic.createdAt).toLocaleDateString() : undefined
  const tags: string[] = Array.isArray(topic.tags) ? topic.tags : []

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-900 dark:to-slate-800 py-10 md:py-14">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6 flex items-center gap-3">
            <a href="/features" className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline">
              <span>←</span>
              <span>Back to GD Topics</span>
            </a>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">{topic.title}</h1>

          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-6">
            {topic.category && (
              <span className="inline-flex items-center rounded-full bg-blue-100 text-blue-800 border border-blue-200 px-2 py-0.5 text-xs">{topic.category}</span>
            )}
            {topic.difficulty && (
              <span className="inline-flex items-center rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200 px-2 py-0.5 text-xs">{topic.difficulty}</span>
            )}
            {createdAt && <span className="ml-2">• {createdAt}</span>}
          </div>

          {topic.imageUrl && (
            <div className="mb-8 rounded-lg overflow-hidden shadow">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={topic.imageUrl} alt={topic.title} className="w-full h-64 object-cover" />
            </div>
          )}

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {tags.map((t, i) => (
                <span key={i} className="text-xs bg-gray-100 text-gray-700 border border-gray-200 px-2 py-1 rounded-full">#{t}</span>
              ))}
            </div>
          )}

          {/* Description */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Overview</h2>
            <p className="text-gray-800 dark:text-gray-200 leading-7 whitespace-pre-wrap">{topic.description}</p>
          </section>

          {/* Discussion Points */}
          {Array.isArray(topic.discussionPoints) && topic.discussionPoints.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-2">Key Discussion Points</h2>
              <ul className="list-disc pl-5 space-y-1 text-gray-800 dark:text-gray-200">
                {topic.discussionPoints.map((p: string, idx: number) => (
                  <li key={idx}>{p}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Tips */}
          {Array.isArray(topic.tips) && topic.tips.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-2">Tips</h2>
              <ul className="list-disc pl-5 space-y-1 text-gray-800 dark:text-gray-200">
                {topic.tips.map((t: string, idx: number) => (
                  <li key={idx}>{t}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Related Topics */}
          {Array.isArray(topic.relatedTopics) && topic.relatedTopics.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-2">Related Topics</h2>
              <div className="flex flex-wrap gap-2">
                {topic.relatedTopics.map((rt: string, idx: number) => (
                  <span key={idx} className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-1 rounded-full">{rt}</span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const topic = await getTopic(params.id)
  if (!topic) return { title: "GD Topic | Placement Pulse" }
  const title = topic.title
  const description = (topic.description || "").slice(0, 150)
  return {
    title: `${title} | Placement Pulse`,
    description,
    openGraph: {
      title,
      description,
      images: topic.imageUrl ? [topic.imageUrl] : undefined,
      type: "article",
    },
  }
}

