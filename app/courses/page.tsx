"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, User, Tag, Calendar, ArrowRight, Search, Filter, Star, Users, Play, Award, RefreshCw, CheckCircle2 } from "lucide-react"
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { useAuth } from "@/contexts/auth-context"

interface Course {
  id: string;
  courseId?: string;
  title?: string;
  description?: string;
  category?: string;
  tags?: string[];
  coverImage?: string;
  image?: string;
  instructor?: string;
  caption?: string;
  imageUrl?: string;
  createdAt?: string;
  price?: string;
  originalPrice?: string;
  discount?: string;
  duration?: string;
  level?: string;
  students?: string;
  rating?: string;
  reviews?: string;
  features?: string[];
  enrollFormUrl?: string;
}

export default function CoursesPage() {
  const authContext = useAuth()
  const user = authContext?.user || null
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  // Cart state (localStorage)
  const [cart, setCart] = useState<string[]>([])
  useEffect(() => {
    try {
      const raw = localStorage.getItem('cartCourseIds')
      setCart(raw ? JSON.parse(raw) : [])
    } catch {
      setCart([])
    }
  }, [])
  const addToCart = (id: string) => {
    const next = Array.from(new Set([...(cart||[]).map(String), String(id)]))
    setCart(next)
    try {
      localStorage.setItem('cartCourseIds', JSON.stringify(next))
      window.dispatchEvent(new Event('cartUpdated'))
    } catch {}
  }
  const removeFromCart = (id: string) => {
    const next = (cart||[]).filter(x => String(x) !== String(id))
    setCart(next)
    try {
      if (next.length > 0) localStorage.setItem('cartCourseIds', JSON.stringify(next))
      else localStorage.removeItem('cartCourseIds')
      window.dispatchEvent(new Event('cartUpdated'))
    } catch {}
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setRefreshing(true)
    }

    try {
      const response = await fetch('/api/courses', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      })
      if (response.ok) {
        const data = await response.json()
        setCourses(data.courses || [])
      }
    } catch (error) {
      console.error('Error fetching courses:', error)
      setCourses([])
    } finally {
      setLoading(false)
      if (isManualRefresh) {
        setRefreshing(false)
      }
    }
  }

  const handleManualRefresh = () => {
    fetchCourses(true)
  }

  const filteredCourses = courses.filter(course => {
    const matchesSearch = !searchTerm ||
      (course.title || course.caption || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.description || '').toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = selectedCategory === 'all' ||
      (course.category || '').toLowerCase() === selectedCategory.toLowerCase()

    return matchesSearch && matchesCategory
  })

  const categories = ['all', ...Array.from(new Set(courses.map(course => course.category).filter(Boolean)))]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-900 dark:to-slate-800">
      <Navigation />
      {/* Hero Section */}
      <section className="py-12 sm:py-16 pt-20 lg:pt-24 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-block mb-4">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200 px-3 py-1 text-sm font-medium">
                🎓 Our Courses
              </Badge>
            </div>
            <div className="flex items-center justify-center gap-4 mb-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                Master New Skills
              </h1>
              <Button
                variant="outline"
                size="sm"
                onClick={handleManualRefresh}
                disabled={refreshing}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </Button>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Learn from industry experts with our comprehensive course collection
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <div className="relative flex-1 max-w-sm mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/80 backdrop-blur-sm border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div className="flex gap-2 flex-wrap justify-center">
                <Button
                  variant={selectedCategory === 'all' ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory('all')}
                  className="bg-blue-500 hover:bg-blue-600 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300"
                >
                  All
                </Button>
                {categories.slice(1).map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory(category || 'all')}
                    className="bg-white hover:bg-blue-50 text-gray-700 border-gray-200 shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Courses Grid */}
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {filteredCourses.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredCourses.map((course, index) => {
                console.log('Rendering course:', course.id, course.title)
                console.log('User enrolledCourses:', user?.enrolledCourses)
                const isEnrolled = user?.enrolledCourses?.some((enrollment: any) => String(enrollment.courseId) === String(course.id))
                console.log('Is enrolled in this course:', isEnrolled)
                return (
                <Card
                  key={course.id}
                  className="group hover:shadow-xl transition-all duration-300 hover:scale-102 bg-white border border-gray-200 shadow-md hover:shadow-lg"
                >
                  {(course.image || course.coverImage || course.imageUrl) && (
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={course.image || course.coverImage || course.imageUrl}
                        alt={course.title || course.caption}
                        className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                      {course.discount && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                          {course.discount}
                        </div>
                      )}
                    </div>
                  )}
                  <CardContent className="p-4">
                    <div className="flex items-center gap-1 mb-2">
                      {course.category && (
                        <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 border-blue-200">
                          {course.category}
                        </Badge>
                      )}
                      {course.level && (
                        <Badge variant="outline" className="text-xs">
                          {course.level}
                        </Badge>
                      )}
                    </div>

                    <h3 className="font-bold text-sm mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                      {course.title || course.caption}
                    </h3>

                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="text-xs font-medium">{course.rating || '4.8'}</span>
                        <span className="text-xs text-gray-500">({course.reviews || '35'})</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{course.students || '300+'}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1">
                        <span className="text-lg font-bold text-blue-600">₹{course.price ? (Number(course.price) / 100).toFixed(0) : 'Loading...'}</span>
                        {course.originalPrice && Number(course.originalPrice) > Number(course.price) && (
                          <span className="text-sm text-gray-500 line-through">₹{(Number(course.originalPrice) / 100).toFixed(0)}</span>
                        )}
                        {course.discount && (
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                            {course.discount}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-3">
                      {course.enrollFormUrl ? (
                        <a href={course.enrollFormUrl} target="_blank" rel="noopener noreferrer">
                          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded-md shadow-md hover:shadow-lg transition-all duration-300 text-sm">
                            <span>Enroll Now</span>
                            <ArrowRight className="ml-1 h-3 w-3" />
                          </Button>
                        </a>
                      ) : user?.enrolledCourses?.some((enrollment: any) => String(enrollment.courseId) === String(course.id)) ? (
                        <Link href="/dashboard">
                          <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-3 rounded-md shadow-md hover:shadow-lg transition-all duration-300 text-sm">
                            <span>Continue Study</span>
                            <ArrowRight className="ml-1 h-3 w-3" />
                          </Button>
                        </Link>
                      ) : (
                        <div className="flex gap-2">
                          <Link href={user ? `/enroll?courseId=${course.id}` : "/auth?mode=signup"} className="flex-1">
                            <Button
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded-md shadow-md hover:shadow-lg transition-all duration-300 text-sm"
                            >
                              <span>Enroll Now</span>
                              <ArrowRight className="ml-1 h-3 w-3" />
                            </Button>
                          </Link>
                          {(cart || []).includes(String(course.id)) ? (
                            <Button
                              variant="outline"
                              className="w-28"
                              onClick={(e) => { e.preventDefault(); removeFromCart(String(course.id)); }}
                            >
                              Remove
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              className="w-28"
                              onClick={(e) => { e.preventDefault(); addToCart(String(course.id)); }}
                            >
                              Add to Cart
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                )
              })}
            </div>
          ) : loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, index) => (
                <Card key={index} className="animate-pulse bg-white/50 backdrop-blur-sm border-0 shadow-md">
                  <div className="h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-t-lg"></div>
                  <CardContent className="p-4">
                    <div className="h-3 bg-gradient-to-r from-blue-200 to-purple-200 rounded mb-2"></div>
                    <div className="h-3 bg-gradient-to-r from-blue-200 to-purple-200 rounded mb-3 w-3/4"></div>
                    <div className="h-2 bg-gradient-to-r from-blue-200 to-purple-200 rounded mb-2"></div>
                    <div className="h-2 bg-gradient-to-r from-blue-200 to-purple-200 rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-700">No courses found</h3>
              <p className="text-gray-500 mb-4 text-sm">
                {searchTerm || selectedCategory !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'No courses have been published yet'
                }
              </p>
              {(searchTerm || selectedCategory !== 'all') && (
                <Button
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedCategory('all')
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </div>
      </section>


      {/* Main Features Grid */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
              Core Features
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Comprehensive tools and resources designed to help you excel in MBA placements and internships.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: Award,
                title: "Expert Mentorship",
                description: "Learn from industry professionals and placement experts who have successfully guided hundreds of MBA students.",
                color: "text-blue-600"
              },
              {
                icon: Users,
                title: "Mock GD & PI Sessions",
                description: "Practice with real-time group discussions and personal interviews to build confidence and improve performance.",
                color: "text-green-600"
              },
              {
                icon: Play,
                title: "Video Learning",
                description: "Access comprehensive video content covering all aspects of placement preparation and interview techniques.",
                color: "text-purple-600"
              },
              {
                icon: Star,
                title: "Resume & Profile Review",
                description: "Get your resume and LinkedIn profile reviewed by experts to make them recruiter-ready.",
                color: "text-orange-600"
              },
              {
                icon: Clock,
                title: "Flexible Learning",
                description: "Study at your own pace with 24/7 access to all course materials and resources.",
                color: "text-cyan-600"
              },
              {
                icon: User,
                title: "Personalized Guidance",
                description: "Receive one-on-one mentorship and personalized feedback to address your specific needs.",
                color: "text-pink-600"
              }
            ].map((feature, index) => (
              <Card
                key={index}
                className="hover:scale-105 transition-all duration-300 hover:shadow-xl group p-6 bg-white border border-gray-200 shadow-md hover:shadow-lg"
              >
                <CardHeader className="pb-4">
                  <feature.icon
                    className={`h-10 w-10 sm:h-12 sm:w-12 ${feature.color} mb-4 group-hover:scale-110 transition-transform`}
                  />
                  <CardTitle className="text-xl leading-tight">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-base leading-relaxed text-gray-600 dark:text-gray-300">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Showcase */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 sm:gap-12 items-center">
            <div>
              <Badge className="mb-4 text-sm" variant="outline">
                📊 Placement Success Metrics
              </Badge>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">Built for Your Internship & Placement Success</h2>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                Our structured courses and mentorship ensure you are fully prepared for every stage of the MBA placement journey. From mock GDs to resume polishing, we provide the right tools and guidance to help you land your dream offer.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                  <div className="text-3xl font-bold text-blue-600 mb-2">95%+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Students Improved GD & PI Performance</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Proven results from our practice-based approach.</div>
                </div>
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                  <div className="text-3xl font-bold text-blue-600 mb-2">100+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Mock GDs & Interviews Conducted</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Gain real-world exposure before stepping into the actual placement rounds.</div>
                </div>
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                  <div className="text-3xl font-bold text-blue-600 mb-2">₹99</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Starting Course Fee</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Affordable, high-impact mentorship accessible to every MBA student.</div>
                </div>
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                  <div className="text-3xl font-bold text-blue-600 mb-2">20+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Cities</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Trusted by students across top B-Schools in 20+ cities.</div>
                </div>
              </div>
            </div>
            <div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-100/50 to-purple-100/50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl transform rotate-3" />
                <div className="relative bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg">
                  <h3 className="text-2xl font-bold mb-6">Additional Capabilities</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <span className="text-lg">🎤</span>
                      <div>
                        <div className="font-semibold text-sm">Live GD Practice</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Participate in real-time GDs with alumni moderators.</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <span className="text-lg">💼</span>
                      <div>
                        <div className="font-semibold text-sm">Mock Interviews</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Face one-on-one mock HR & technical interviews with detailed feedback.</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <span className="text-lg">📄</span>
                      <div>
                        <div className="font-semibold text-sm">Resume & LinkedIn Review</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Get your profile recruiter-ready with expert reviews.</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <span className="text-lg">📚</span>
                      <div>
                        <div className="font-semibold text-sm">Internship & Placement Strategy Sessions</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Step-by-step guidance to crack aptitude tests, shortlist companies, and prep smart.</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <span className="text-lg">🤝</span>
                      <div>
                        <div className="font-semibold text-sm">Peer-to-Peer Learning</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Collaborate with fellow MBA students, exchange insights, and practice together.</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <span className="text-lg">📝</span>
                      <div>
                        <div className="font-semibold text-sm">Weekly Blogs & Hacks</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Stay updated with placement trends, interview hacks, and success stories.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-10 sm:mt-12">
            <Link href="/courses">
              <Button size="lg" className="group font-bold text-base sm:text-lg px-6 sm:px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border-0 rounded-lg">
                Start Your Placement Journey Today
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-2 group-hover:rotate-12 transition-all duration-300" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">🚀 Ready to Ace Your MBA Internships & Placements?</h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Join hundreds of MBA students who are transforming their placement journey with Placement Pulse. Get the right guidance, practice, and confidence to land your dream role.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/courses">
                <Button size="lg" className="group font-bold text-base sm:text-lg px-6 sm:px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border-0 rounded-lg">
                  Start Preparing Today
                  <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-2 group-hover:rotate-12 transition-all duration-300" />
                </Button>
              </Link>
              <Link href="/#video-section">
                <Button size="lg" variant="outline" className="group hover:scale-105 transition-all duration-300 bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white text-base sm:text-lg px-6 sm:px-8 py-4">
                  Watch Free Preview
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* Comparison Section (Plans) moved to bottom */}
      <section className="py-10 sm:py-14">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm bg-white">
            {/* Header Row */}
            <div className="grid grid-cols-3 bg-slate-800 text-white text-xs sm:text-sm">
              <div className="px-3 sm:px-4 py-3 font-semibold uppercase tracking-wide text-center">Features</div>
              <div className="px-3 sm:px-4 py-3 font-semibold text-center">1:1 Mock Interview
                <div className="text-[10px] sm:text-xs opacity-90">₹ 99/-</div>
              </div>
              <div className="px-3 sm:px-4 py-3 font-semibold text-center">GD-PI Prep Course
                <div className="text-[10px] sm:text-xs opacity-90">₹ 999/-</div>
              </div>
            </div>

            {[
              { label: 'No. of Interview', left: '1', right: '3', type: 'text' },
              { label: 'No. of Group Discussion', left: false, right: '1', type: 'bool' },
              { label: 'CV Curation', left: false, right: true, type: 'bool' },
              { label: 'Feedback on Interview', left: true, right: true, type: 'bool' },
              { label: 'Recording of Interview', left: false, right: true, type: 'bool' }
            ].map((row, idx) => (
              <div key={idx} className={`grid grid-cols-3 text-xs sm:text-sm ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                <div className="px-3 sm:px-4 py-3 border-t border-gray-200 font-medium text-gray-700">{row.label}</div>
                <div className="px-3 sm:px-4 py-3 border-t border-gray-200 text-center">
                  {row.type === 'bool' ? (
                    row.left ? (
                      <span aria-label="Yes" className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-white">✓</span>
                    ) : (
                      <span aria-label="No" className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white">✕</span>
                    )
                  ) : (
                    <span className="font-semibold text-slate-800">{row.left}</span>
                  )}
                </div>
                <div className="px-3 sm:px-4 py-3 border-t border-gray-200 text-center">
                  {row.type === 'bool' ? (
                    row.right ? (
                      <span aria-label="Yes" className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-white">✓</span>
                    ) : (
                      <span aria-label="No" className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white">✕</span>
                    )
                  ) : (
                    <span className="font-semibold text-slate-800">{row.right}</span>
                  )}
                </div>
              </div>
            ))}

            {/* Core feature lists */}
            <div className="grid grid-cols-3 text-xs sm:text-sm">
              <div className="px-3 sm:px-4 py-3 border-t border-gray-200 font-semibold text-gray-700">Core Feature</div>
              <div className="px-3 sm:px-4 py-3 border-t border-gray-200 text-gray-700">
                <div className="flex justify-center">
                  <ul className="list-disc list-inside space-y-1 text-left">
                  <li>1:1 Personal Interview</li>
                  <li>Feedback for improvement</li>
                  </ul>
                </div>
              </div>
              <div className="px-3 sm:px-4 py-3 border-t border-gray-200 text-gray-700">
                <div className="flex justify-center">
                  <ul className="list-disc list-inside space-y-1 text-left">
                  <li>1:1 Personal Interview (3)</li>
                  <li>Feedback for improvement</li>
                  <li>1 Group Discussion</li>
                  <li>1:1 CV Curation</li>
                  <li>Detailed Analysis of PI</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Footer buttons */}
            <div className="grid grid-cols-3">
              <div className="px-3 sm:px-4 py-3 bg-white" />
                <div className="px-3 sm:px-4 py-3">
                  <a href="https://forms.gle/7ABmEt4gVtL34nxq6" target="_blank" rel="noopener noreferrer">
                    <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white">ENROLL NOW</Button>
                  </a>
                </div>
              <div className="px-3 sm:px-4 py-3">
                <Link href="/enroll">
                  <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white">ENROLL NOW</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
