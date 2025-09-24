"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { Bell, Calendar, User, AlertCircle, Info, CheckCircle, AlertTriangle } from "lucide-react"
import { Navigation } from "@/components/navigation"

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: string;
  priority: string;
  targetAudience: string;
  createdAt: string;
  createdBy: {
    name: string;
    email: string;
  };
}

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
    if (!user) {
      router.push("/auth")
    } else {
      fetchAnnouncements()
    }
  }, [user, router])

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('/api/announcements', {
        credentials: 'include', // Include cookies in the request
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (response.ok) {
        const data = await response.json()
        setAnnouncements(data.announcements || [])
      } else if (response.status === 401) {
        // User not authenticated, redirect to login
        router.push('/auth')
      }
    } catch (error) {
      console.error('Error fetching announcements:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!mounted || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      case 'medium':
        return <Info className="h-4 w-4 text-blue-500" />
      case 'low':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'course':
        return 'bg-purple-100 text-purple-800'
      case 'payment':
        return 'bg-green-100 text-green-800'
      case 'system':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Component */}
      <Navigation />

      <div className="container mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8 pt-16 sm:pt-20 lg:pt-24">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 lg:mb-8 gap-3 sm:gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 truncate">
              Welcome back, {user.name}!
            </h1>
            <p className="text-xs sm:text-sm lg:text-base text-muted-foreground">
              Stay updated with the latest announcements
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={logout} 
            className="w-full sm:w-auto text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-2.5"
          >
            Logout
          </Button>
        </div>

        {/* Updates/Announcements Section */}
        <div className="space-y-3 sm:space-y-4 lg:space-y-6">
          <div className="flex items-center gap-2 mb-3 sm:mb-4 lg:mb-6">
            <Bell className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-blue-600 flex-shrink-0" />
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">Updates for You</h2>
          </div>

          {loading ? (
            <div className="text-center py-6 sm:py-8 lg:py-12">
              <div className="w-6 h-6 sm:w-8 sm:h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3 sm:mb-4" />
              <p className="text-xs sm:text-sm text-muted-foreground">Loading updates...</p>
            </div>
          ) : announcements.length > 0 ? (
            <div className="space-y-2 sm:space-y-3 lg:space-y-4">
              {announcements.map((announcement) => (
                <Card key={announcement.id} className="hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
                  <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-4 lg:p-6">
                    <div className="flex flex-col gap-3">
                      {/* Title and Priority */}
                      <div className="flex items-start gap-2">
                        <div className="flex-shrink-0 mt-0.5">
                          {getPriorityIcon(announcement.priority)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-sm sm:text-base lg:text-lg font-semibold leading-tight break-words">
                            {announcement.title}
                          </CardTitle>
                        </div>
                      </div>
                      
                      {/* Badges */}
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <Badge className={`${getPriorityColor(announcement.priority)} text-xs px-2 py-1`}>
                          {announcement.priority.toUpperCase()}
                        </Badge>
                        <Badge className={`${getTypeColor(announcement.type)} text-xs px-2 py-1`}>
                          {announcement.type.toUpperCase()}
                        </Badge>
                      </div>
                      
                      {/* Meta Information */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                          <span>{new Date(announcement.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <User className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                          <span className="truncate">{announcement.createdBy.name}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 p-3 sm:p-4 lg:p-6">
                    <CardDescription className="text-xs sm:text-sm lg:text-base leading-relaxed break-words">
                      {announcement.content}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-dashed border-2 border-gray-200">
              <CardContent className="text-center py-6 sm:py-8 lg:py-12 px-4 sm:px-6">
                <Bell className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
                <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-1 sm:mb-2">No updates available</h3>
                <p className="text-xs sm:text-sm lg:text-base text-muted-foreground max-w-md mx-auto">
                  Check back later for announcements and updates from the admin.
                </p>
              </CardContent>
            </Card>
          )}
                </div>
      </div>
    </div>
  )
}