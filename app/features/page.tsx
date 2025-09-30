"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, TrendingUp, Lightbulb, Target, BookOpen, MessageSquare, Search, Filter, Clock, Tag, Users, Calendar, RefreshCw } from "lucide-react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Input } from "@/components/ui/input"

interface GDTopic {
  _id: string
  title: string
  description: string
  category: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  tags: string[]
  discussionPoints: string[]
  tips: string[]
  relatedTopics: string[]
  imageUrl?: string
  isTrending: boolean
  likes: number
  createdAt: string
}

export default function FeaturesPage() {
  const [topics, setTopics] = useState<GDTopic[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")
  const [showTrending, setShowTrending] = useState(false)
  const [refreshing, setRefreshing] = useState(false)


  useEffect(() => {
    fetchTopics()
  }, [])

  useEffect(() => {
    if (!loading) {
      fetchTopics()
    }
  }, [searchTerm, selectedCategory, selectedDifficulty, showTrending])

  const fetchTopics = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }
      
      const params = new URLSearchParams({
        page: '1',
        limit: '12',
        ...(selectedCategory !== 'all' && { category: selectedCategory }),
        ...(selectedDifficulty !== 'all' && { difficulty: selectedDifficulty }),
        ...(showTrending && { trending: 'true' }),
        ...(searchTerm && { search: searchTerm })
      })
      
      const response = await fetch(`/api/gd-topics?${params}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setTopics(data.topics || [])
      } else {
        const errorText = await response.text()
        console.error('Failed to fetch GD topics:', response.status, errorText)
        setTopics([])
      }
    } catch (error) {
      console.error('Error fetching GD topics:', error)
      setTopics([])
    } finally {
      setLoading(false)
      if (isManualRefresh) {
        setRefreshing(false)
      }
    }
  }

  const handleManualRefresh = () => {
    fetchTopics(true)
  }

  const categories = [
    'all', 'Business', 'Technology', 'Social Issues', 'Economics', 
    'Politics', 'Environment', 'Education', 'Healthcare', 'Sports', 
    'Entertainment', 'General Knowledge'
  ]

  const difficulties = ['all', 'Easy', 'Medium', 'Hard']

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 border-green-200'
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Hard': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      'Business': 'bg-blue-100 text-blue-800 border-blue-200',
      'Technology': 'bg-purple-100 text-purple-800 border-purple-200',
      'Social Issues': 'bg-pink-100 text-pink-800 border-pink-200',
      'Economics': 'bg-green-100 text-green-800 border-green-200',
      'Politics': 'bg-red-100 text-red-800 border-red-200',
      'Environment': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'Education': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'Healthcare': 'bg-cyan-100 text-cyan-800 border-cyan-200',
      'Sports': 'bg-orange-100 text-orange-800 border-orange-200',
      'Entertainment': 'bg-violet-100 text-violet-800 border-violet-200',
      'General Knowledge': 'bg-gray-100 text-gray-800 border-gray-200'
    }
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-900 dark:to-slate-800">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-12 sm:py-16 pt-20 lg:pt-24 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-block mb-4">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200 px-3 py-1 text-sm font-medium">
                🔥 Daily Trending GD Topics
            </Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
              Master Group Discussions
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Practice with trending GD topics, get expert tips, and ace your placement interviews with confidence.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/courses">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                  Explore Courses
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="bg-white hover:bg-blue-50 text-gray-700 border-gray-200 shadow-md hover:shadow-lg transition-all duration-300">
                  Get in Touch
              </Button>
            </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search GD topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/80 backdrop-blur-sm border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={showTrending ? 'default' : 'outline'}
                  onClick={() => setShowTrending(!showTrending)}
                  className="bg-blue-500 hover:bg-blue-600 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Trending
                </Button>
                <Button
                  variant="outline"
                  onClick={handleManualRefresh}
                  disabled={refreshing}
                  className="bg-white hover:bg-gray-50 text-gray-700 border-gray-200 shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                  {refreshing ? 'Refreshing...' : 'Refresh'}
                </Button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              <div className="flex gap-2 flex-wrap">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">Category:</span>
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory(category)}
                    className="bg-white hover:bg-blue-50 text-gray-700 border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 text-sm"
                  >
                    {category}
                  </Button>
                ))}
              </div>
          </div>
            
            <div className="flex flex-wrap gap-2">
              <div className="flex gap-2 flex-wrap">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">Difficulty:</span>
                {difficulties.map(difficulty => (
                  <Button
                    key={difficulty}
                    variant={selectedDifficulty === difficulty ? 'default' : 'outline'}
                    onClick={() => setSelectedDifficulty(difficulty)}
                    className="bg-white hover:bg-blue-50 text-gray-700 border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 text-sm"
                  >
                    {difficulty}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GD Topics Grid */}
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-700">Loading GD Topics...</h3>
              <p className="text-gray-500 text-sm">Fetching the latest topics from the database</p>
            </div>
          ) : topics.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {topics.map((topic, index) => (
                <Card
                  key={topic._id}
                  className="group hover:shadow-xl transition-all duration-300 hover:scale-102 bg-white border border-gray-200 shadow-md hover:shadow-lg"
                >
                  <div className="relative overflow-hidden rounded-t-lg">
                    {topic.imageUrl ? (
                      <img
                        src={topic.imageUrl}
                        alt={topic.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                        <div className="text-center">
                          <BookOpen className="h-12 w-12 text-blue-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600 font-medium">GD Topic</p>
                    </div>
                      </div>
                    )}
                    {topic.isTrending && (
                      <div className="absolute top-2 left-2">
                        <Badge className="text-xs bg-orange-100 text-orange-800 border-orange-200">
                          <TrendingUp className="mr-1 h-3 w-3" />
                          Trending
                        </Badge>
                      </div>
                    )}
                    </div>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex flex-wrap gap-2">
                        <Badge className={`text-xs ${getCategoryColor(topic.category)}`}>
                          {topic.category}
                        </Badge>
                        <Badge className={`text-xs ${getDifficultyColor(topic.difficulty)}`}>
                          {topic.difficulty}
                        </Badge>
                        {topic.isTrending && !topic.imageUrl && (
                          <Badge className="text-xs bg-orange-100 text-orange-800 border-orange-200">
                            <TrendingUp className="mr-1 h-3 w-3" />
                            Trending
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardTitle className="text-lg leading-tight group-hover:text-blue-600 transition-colors duration-300">
                      {topic.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-sm leading-relaxed mb-4 line-clamp-3">
                      {topic.description}
                    </CardDescription>
                    
                    {topic.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {topic.tags.slice(0, 3).map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                        {topic.tags.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{topic.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-end text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(topic.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                  </CardContent>
                </Card>
              ))}
                  </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-blue-400" />
                </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-700">No GD topics found</h3>
              <p className="text-gray-500 mb-4 text-sm">
                {searchTerm || selectedCategory !== 'all' || selectedDifficulty !== 'all' || showTrending
                  ? 'Try adjusting your search or filter criteria'
                  : 'No GD topics have been published yet. Admins can add topics through the admin panel.'
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {(searchTerm || selectedCategory !== 'all' || selectedDifficulty !== 'all' || showTrending) && (
                  <Button 
                    onClick={() => {
                      setSearchTerm('')
                      setSelectedCategory('all')
                      setSelectedDifficulty('all')
                      setShowTrending(false)
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2"
                  >
                    Clear Filters
                  </Button>
                )}
                <Button 
                  onClick={handleManualRefresh}
                  disabled={refreshing}
                  variant="outline"
                  className="text-sm px-4 py-2"
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                  {refreshing ? 'Refreshing...' : 'Refresh'}
                </Button>
              </div>
              {!searchTerm && selectedCategory === 'all' && selectedDifficulty === 'all' && !showTrending && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>For Admins:</strong> To add GD topics, go to the admin panel and use the GD Topics management section.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">🚀 Ready to Master Group Discussions?</h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Join thousands of MBA students who are practicing with our trending GD topics and acing their placement interviews.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/courses">
                <Button size="lg" className="group font-bold text-base sm:text-lg px-6 sm:px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border-0 rounded-lg">
                  Start Your GD Journey
                  <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-2 group-hover:rotate-12 transition-all duration-300" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="group hover:scale-105 transition-all duration-300 bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white text-base sm:text-lg px-6 sm:px-8 py-4">
                  Get Expert Guidance
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}