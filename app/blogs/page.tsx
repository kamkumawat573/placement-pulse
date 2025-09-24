"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, User, Tag, Calendar, ArrowRight, Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Navigation } from "@/components/navigation"

interface Blog {
  id: string;
  blogId?: string;
  title?: string;
  content?: string;
  category?: string;
  tags?: string[];
  coverImage?: string;
  author?: string;
  caption?: string;
  imageUrl?: string;
  createdAt?: string;
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    try {
      const response = await fetch('/api/blogs')
      if (response.ok) {
        const data = await response.json()
        setBlogs(data || [])
      }
    } catch (error) {
      console.error('Error fetching blogs:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = !searchTerm || 
      (blog.title || blog.caption || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (blog.content || '').toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === 'all' || 
      (blog.category || '').toLowerCase() === selectedCategory.toLowerCase()
    
    return matchesSearch && matchesCategory
  })

  const categories = ['all', ...Array.from(new Set(blogs.map(blog => blog.category).filter(Boolean)))]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-900 dark:to-slate-800">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 sm:py-24 lg:py-32 relative overflow-hidden">
        {/* Light Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/20 rounded-full animate-float"></div>
          <div className="absolute top-32 right-20 w-24 h-24 bg-purple-200/20 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-cyan-200/20 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-pink-200/20 rounded-full animate-pulse" style={{animationDelay: '3s'}}></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block mb-6 animate-bounce">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200 px-4 py-2 text-sm font-medium">
                📝 Latest blogs
              </Badge>
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent animate-fade-in-up">
              Our Blog
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 animate-fade-in-up [animation-delay:0.2s]">
              Stay updated with the latest insights, tutorials, and industry trends
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up [animation-delay:0.4s]">
              <div className="relative flex-1 max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 animate-pulse" />
                <Input
                  placeholder="Search blogs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/80 backdrop-blur-sm border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div className="flex gap-2 flex-wrap justify-center">
                <Button
                  variant={selectedCategory === 'all' ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory('all')}
                  className="bg-blue-500 hover:bg-blue-600 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  All
                </Button>
                {categories.slice(1).map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory(category || 'all')}
                    className="bg-white hover:bg-blue-50 text-gray-700 border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blogs Grid */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <Card key={index} className="animate-pulse bg-white/50 backdrop-blur-sm border-0 shadow-lg">
                  <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 rounded-t-lg"></div>
                  <CardContent className="p-6">
                    <div className="h-4 bg-gradient-to-r from-blue-200 to-purple-200 rounded mb-2"></div>
                    <div className="h-4 bg-gradient-to-r from-blue-200 to-purple-200 rounded mb-4 w-3/4"></div>
                    <div className="h-3 bg-gradient-to-r from-blue-200 to-purple-200 rounded mb-2"></div>
                    <div className="h-3 bg-gradient-to-r from-blue-200 to-purple-200 rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredBlogs.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBlogs.map((blog, index) => (
                <Card
                  key={blog.id}
                  className="group hover:shadow-2xl transition-all duration-500 animate-fade-in-up hover:scale-105 bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-blue-200/50"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {(blog.coverImage || blog.imageUrl) && (
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={blog.coverImage || blog.imageUrl}
                        alt={blog.title || blog.caption}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <ArrowRight className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    </div>
                  )}
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      {blog.category && (
                        <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 border-blue-200 animate-pulse">
                          {blog.category}
                        </Badge>
                      )}
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3 animate-pulse" />
                        <span>{blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : 'Recent'}</span>
                      </div>
                    </div>
                    
                    <h3 className="font-bold text-lg mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                      {blog.title || blog.caption}
                    </h3>
                    
                    {blog.content && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3 group-hover:text-gray-700 transition-colors duration-300">
                        {blog.content.substring(0, 120)}...
                      </p>
                    )}
                    
                    <div className="flex items-center gap-2 mb-4">
                      <User className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
                      <span className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
                        {blog.author || 'Admin'}
                      </span>
                    </div>
                    
                    {blog.tags && blog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {blog.tags.slice(0, 3).map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="text-xs bg-gradient-to-r from-blue-50 to-purple-50 text-gray-600 px-2 py-1 rounded-full border border-blue-100 hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100 transition-all duration-300"
                          >
                            #{tag}
                          </span>
                        ))}
                        {blog.tags.length > 3 && (
                          <span className="text-xs text-gray-400">
                            +{blog.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 animate-fade-in-up">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                <Search className="h-16 w-16 text-blue-400" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-700">No blogs found</h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                {searchTerm || selectedCategory !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'No blogs have been published yet'
                }
              </p>
              {(searchTerm || selectedCategory !== 'all') && (
                <Button 
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedCategory('all')
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 lg:py-24 relative overflow-hidden">
        {/* Light Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200/30 rounded-full animate-float"></div>
          <div className="absolute bottom-10 right-10 w-16 h-16 bg-purple-200/30 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 w-12 h-12 bg-cyan-200/30 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent animate-fade-in-up">
              Stay Updated
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 animate-fade-in-up [animation-delay:0.2s]">
              Get the latest insights and tutorials delivered to your inbox
            </p>
            
          </div>
        </div>
      </section>
    </div>
  )
}
