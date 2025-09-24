"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, User, Tag, Calendar, ArrowRight, Search, Filter, Star, Users, Play, Award } from "lucide-react"
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
}

export default function CoursesPage() {
  const authContext = useAuth()
  const user = authContext?.user || null
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses')
      if (response.ok) {
        const data = await response.json()
        setCourses(data.courses || [])
      }
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setLoading(false)
    }
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
      <section className="py-12 sm:py-16 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-block mb-4">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200 px-3 py-1 text-sm font-medium">
                🎓 Our Courses
              </Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
              Master New Skills
            </h1>
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
          {loading ? (
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
          ) : filteredCourses.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredCourses.map((course, index) => (
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
                        <span className="text-xs text-gray-500">({course.reviews || '0'})</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{course.students || '0+'}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1">
                        <span className="text-lg font-bold text-blue-600">₹{course.price ? (Number(course.price) / 100).toFixed(0) : '299'}</span>
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
                      {user?.enrolledCourse ? (
                        <Link href="/dashboard">
                          <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-3 rounded-md shadow-md hover:shadow-lg transition-all duration-300 text-sm">
                            <span>Continue Study</span>
                            <ArrowRight className="ml-1 h-3 w-3" />
                          </Button>
                        </Link>
                      ) : (
                        <Link href={user ? "/enroll" : "/auth"}>
                          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded-md shadow-md hover:shadow-lg transition-all duration-300 text-sm">
                            <span>Enroll Now</span>
                            <ArrowRight className="ml-1 h-3 w-3" />
                          </Button>
                        </Link>
                      )}
                    </div>
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

      {/* CTA Section */}
      <section className="py-8 sm:py-12 relative overflow-hidden">
        {/* Light Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200/30 rounded-full animate-float"></div>
          <div className="absolute bottom-10 right-10 w-16 h-16 bg-purple-200/30 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 w-12 h-12 bg-cyan-200/30 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
              Start Learning Today
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Join thousands of students who have transformed their careers
            </p>
           
          </div>
        </div>
      </section>
    </div>
  )
}
