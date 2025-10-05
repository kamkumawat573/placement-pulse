"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { BookOpen, ArrowLeft, FileText, LinkIcon, Megaphone } from "lucide-react"

interface Material {
  _id: string
  title: string
  description?: string
  fileUrl?: string
  content?: string
  createdAt: string
}

interface Announcement {
  _id: string
  title: string
  content: string
  createdAt: string
}

export default function CourseStudyPage({ params }: { params: { id: string } }) {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [materials, setMaterials] = useState<Material[]>([])
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [courseTitle, setCourseTitle] = useState<string>("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // If not logged in, go to auth
    if (user === null) return // wait until auth initializes
    if (!user) {
      router.push("/auth")
      return
    }
    const load = async () => {
      try {
        setLoading(true)
        // Fetch course meta
        const courseRes = await fetch(`/api/courses/${params.id}`)
        if (courseRes.ok) {
          const c = await courseRes.json()
          setCourseTitle(c?.course?.title || "Course")
        }
        // Fetch materials (requires enrollment)
        const res = await fetch(`/api/courses/${params.id}/materials`, { credentials: "include" })
        if (res.status === 401) {
          setError("Please login to view this course.")
          return
        }
        if (res.status === 403) {
          setError("You are not enrolled in this course.")
          return
        }
        if (!res.ok) {
          setError("Failed to load study materials.")
          return
        }
        const data = await res.json()
        setMaterials(data.materials || [])
        // Fetch announcements for this course
        const annRes = await fetch(`/api/courses/${params.id}/announcements`, { credentials: "include" })
        if (annRes.ok) {
          const ann = await annRes.json()
          setAnnouncements(ann.announcements || [])
        }
      } catch (e) {
        setError("Something went wrong. Please try again.")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user, params.id, router])

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8 pt-16 sm:pt-20 lg:pt-24">
        <div className="flex items-center justify-between mb-4 sm:mb-6 lg:mb-8">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-green-600" />
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">{courseTitle || "Course"}</h1>
          </div>
          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Loading your study materials...</p>
          </div>
        ) : error ? (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <p className="text-sm text-red-700">{error}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">Study Materials</CardTitle>
                  <CardDescription>Provided by your instructor for this course</CardDescription>
                </CardHeader>
                <CardContent>
                  {materials.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No materials yet. Please check back later.</p>
                  ) : (
                    <ul className="space-y-3">
                      {materials.map((m) => (
                        <li key={m._id} className="p-3 border rounded-lg">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="font-medium">{m.title}</div>
                              {m.description && (
                                <div className="text-sm text-muted-foreground">{m.description}</div>
                              )}
                              {m.content && (
                                <div className="text-sm mt-1 whitespace-pre-wrap">{m.content}</div>
                              )}
                            </div>
                            {m.fileUrl && (
                              <a className="text-blue-600 text-sm flex items-center gap-1" href={m.fileUrl} target="_blank" rel="noreferrer">
                                <FileText className="h-4 w-4" /> Open
                              </a>
                            )}
                          </div>
                          <div className="mt-2">
                            <Badge variant="secondary" className="text-xs">{new Date(m.createdAt).toLocaleString()}</Badge>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                    <Megaphone className="h-4 w-4" /> Course Updates
                  </CardTitle>
                  <CardDescription>Announcements from admin/instructor</CardDescription>
                </CardHeader>
                <CardContent>
                  {announcements.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No announcements yet.</p>
                  ) : (
                    <ul className="space-y-3">
                      {announcements.map((a) => (
                        <li key={a._id} className="p-3 border rounded-lg">
                          <div className="font-medium">{a.title}</div>
                          <div className="text-sm whitespace-pre-wrap text-muted-foreground">{a.content}</div>
                          <div className="mt-2">
                            <Badge variant="secondary" className="text-xs">{new Date(a.createdAt).toLocaleString()}</Badge>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">Quick Links</CardTitle>
                  <CardDescription>Helpful navigation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    <Link href="/dashboard"><Button variant="outline" size="sm" className="justify-start gap-2"><ArrowLeft className="h-4 w-4" /> Back to Dashboard</Button></Link>
                    <Link href="/courses"><Button variant="outline" size="sm" className="justify-start gap-2"><LinkIcon className="h-4 w-4" /> Browse Courses</Button></Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

