"use client"


import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Clock,
  CheckCircle,
  Play,
  FileText,
  Download,
  MessageSquare,
} from "lucide-react"
import Link from "next/link"

const moduleContent = {
  "1": {
    title: "Getting Started with React",
    description: "Learn the fundamentals of React including components, JSX, and state management.",
    lessons: [
      {
        id: 1,
        title: "Introduction to React",
        duration: "15 min",
        type: "video",
        completed: true,
        content: "Welcome to React! In this lesson, we'll explore what React is and why it's so popular.",
      },
      {
        id: 2,
        title: "Setting up Your Development Environment",
        duration: "20 min",
        type: "video",
        completed: true,
        content: "Let's set up your development environment with Node.js, npm, and create-react-app.",
      },
      {
        id: 3,
        title: "Your First React Component",
        duration: "25 min",
        type: "video",
        completed: true,
        content: "Create your first React component and understand JSX syntax.",
      },
      {
        id: 4,
        title: "Props and State",
        duration: "30 min",
        type: "video",
        completed: false,
        content: "Learn how to pass data between components using props and manage component state.",
      },
    ],
  },
  "3": {
    title: "Next.js Fundamentals",
    description: "Master Next.js features including routing, server-side rendering, and API routes.",
    lessons: [
      {
        id: 1,
        title: "Introduction to Next.js",
        duration: "18 min",
        type: "video",
        completed: true,
        content: "Discover the power of Next.js and its key features for modern web development.",
      },
      {
        id: 2,
        title: "App Router vs Pages Router",
        duration: "22 min",
        type: "video",
        completed: true,
        content: "Understanding the differences between App Router and Pages Router in Next.js 13+.",
      },
      {
        id: 3,
        title: "Server Components",
        duration: "28 min",
        type: "video",
        completed: true,
        content: "Learn about React Server Components and how they work in Next.js.",
      },
      {
        id: 4,
        title: "Dynamic Routing",
        duration: "25 min",
        type: "video",
        completed: false,
        content: "Create dynamic routes and handle parameters in your Next.js applications.",
      },
    ],
  },
}

export default function ModulePage() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const moduleId = params.moduleId as string
  const [currentLesson, setCurrentLesson] = useState(1)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (!user) {
      router.push("/auth")
    }
  }, [user, router])

  if (!mounted || !user) {
    return <div className="min-h-screen flex items-center justify-center pt-20 lg:pt-24">Loading...</div>
  }

  const module = moduleContent[moduleId as keyof typeof moduleContent]

  if (!module) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 lg:pt-24">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Module Not Found</h1>
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  const currentLessonData = module.lessons[currentLesson - 1]
  const completedLessons = module.lessons.filter((lesson) => lesson.completed).length
  const progress = Math.round((completedLessons / module.lessons.length) * 100)

  const markLessonComplete = () => {
    // In a real app, this would update the database
    console.log(`Marking lesson ${currentLesson} as complete`)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold">{module.title}</h1>
              <p className="text-sm text-muted-foreground">{module.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-medium">{progress}% Complete</div>
              <Progress value={progress} className="w-32 h-2" />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 pt-20 lg:pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Lesson Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Lessons</CardTitle>
                <CardDescription>
                  {completedLessons} of {module.lessons.length} completed
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {module.lessons.map((lesson, index) => (
                    <button
                      key={lesson.id}
                      onClick={() => setCurrentLesson(lesson.id)}
                      className={`w-full text-left p-4 hover:bg-muted/50 transition-colors border-l-4 ${
                        currentLesson === lesson.id ? "border-accent bg-accent/10" : "border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-1 rounded-full ${
                            lesson.completed
                              ? "bg-green-100 text-green-600"
                              : currentLesson === lesson.id
                                ? "bg-accent/20 text-accent"
                                : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {lesson.completed ? <CheckCircle className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">
                            {index + 1}. {lesson.title}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {lesson.duration}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">
                      {currentLesson}. {currentLessonData.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-2">
                      <Badge variant="outline">
                        <Play className="h-3 w-3 mr-1" />
                        Video
                      </Badge>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {currentLessonData.duration}
                      </span>
                    </CardDescription>
                  </div>
                  {currentLessonData.completed && (
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Completed
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {/* Video Player Placeholder */}
                <div className="aspect-video bg-slate-900 rounded-lg mb-6 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                      <Play className="h-6 w-6 ml-1" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{currentLessonData.title}</h3>
                    <p className="text-white/80">Click to play lesson video</p>
                  </div>
                </div>

                <Tabs defaultValue="overview" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="resources">Resources</TabsTrigger>
                    <TabsTrigger value="discussion">Discussion</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <div className="prose max-w-none">
                      <p className="text-muted-foreground">{currentLessonData.content}</p>

                      <div className="bg-muted/50 p-4 rounded-lg mt-6">
                        <h4 className="font-semibold mb-2">What you'll learn:</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• Core concepts and terminology</li>
                          <li>• Practical implementation examples</li>
                          <li>• Best practices and common patterns</li>
                          <li>• Hands-on coding exercises</li>
                        </ul>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="resources" className="space-y-4">
                    <div className="grid gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-accent" />
                            <div className="flex-1">
                              <h4 className="font-medium">Lesson Notes</h4>
                              <p className="text-sm text-muted-foreground">
                                Comprehensive notes covering all key concepts
                              </p>
                            </div>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <BookOpen className="h-5 w-5 text-accent" />
                            <div className="flex-1">
                              <h4 className="font-medium">Code Examples</h4>
                              <p className="text-sm text-muted-foreground">Source code and examples from the lesson</p>
                            </div>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="discussion" className="space-y-4">
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Discussion feature coming soon!</p>
                      <p className="text-sm">Connect with other students and ask questions.</p>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentLesson(Math.max(1, currentLesson - 1))}
                    disabled={currentLesson === 1}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous Lesson
                  </Button>

                  <div className="flex items-center gap-2">
                    {!currentLessonData.completed && (
                      <Button onClick={markLessonComplete}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark Complete
                      </Button>
                    )}
                    <Button
                      onClick={() => setCurrentLesson(Math.min(module.lessons.length, currentLesson + 1))}
                      disabled={currentLesson === module.lessons.length}
                    >
                      Next Lesson
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
