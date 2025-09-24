"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Play, Clock, Users, Award, Star, CheckCircle, Youtube, Instagram, Twitter, Linkedin } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Navigation } from "@/components/navigation"

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const videoSectionRef = useRef<HTMLElement>(null)
  const authContext = useAuth()
  const user = authContext?.user || null
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: string;
    message: string;
    createdAt: string;
  }>>([])
  const [videos, setVideos] = useState<Array<{
    _id: string;
    videoId: string;
    title: string;
    description?: string;
    videoUrl: string;
    thumbnailUrl?: string;
    duration?: string;
    category: string;
    isFeatured: boolean;
    views: number;
    createdAt: string;
  }>>([])
  const [heroImageUrl, setHeroImageUrl] = useState<string>('')
  const [course, setCourse] = useState<{
    id: string;
    title: string;
    price: number;
    originalPrice: number;
    discount: string;
  } | null>(null)

  // Helper functions for YouTube video support
  const isYouTubeUrl = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be')
  }

  const getYouTubeEmbedUrl = (url: string) => {
    let videoId = ''
    
    // Handle different YouTube URL formats
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1]?.split('&')[0] || ''
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0] || ''
    } else if (url.includes('youtube.com/embed/')) {
      videoId = url.split('embed/')[1]?.split('?')[0] || ''
    } else if (url.includes('youtube.com/v/')) {
      videoId = url.split('v/')[1]?.split('?')[0] || ''
    }
    
    if (!videoId) {
      console.error('Could not extract YouTube video ID from URL:', url)
      return url // Fallback to original URL
    }
    
    return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&showinfo=0`
  }

  const formatPrice = (price: number) => {
    // Convert paise to rupees (assuming price is stored in paise)
    const rupees = price / 100
    return `₹${Math.round(rupees)}`
  }

  const scrollToVideo = () => {
    if (videoSectionRef.current) {
      videoSectionRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrolled = window.pageYOffset
        const parallaxSpeed = 0.5
        heroRef.current.style.transform = `translateY(${scrolled * parallaxSpeed}px)`
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in-up")
          }
        })
      },
      { threshold: 0.1 },
    )

    const animateElements = document.querySelectorAll(".animate-on-scroll")
    animateElements.forEach((el) => observer.observe(el))

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
      observer.disconnect()
    }
  }, [])

        useEffect(() => {
          const loadNotifications = async () => {
            try {
              const res = await fetch("/api/notifications", { cache: "no-store" })
              if (res.ok) {
                const data = await res.json()
                setNotifications(data)
              }
            } catch {}
          }

          const loadVideos = async () => {
            try {
              const res = await fetch("/api/videos?featured=true", { cache: "no-store" })
              if (res.ok) {
                const data = await res.json()
                console.log('Videos loaded:', data.videos)
                // Only take the first featured video
                setVideos(data.videos ? [data.videos[0]].filter(Boolean) : [])
              }
            } catch (error) {
              console.log('Error loading videos:', error)
            }
          }

          const loadSettings = async () => {
            try {
              const res = await fetch("/api/settings", { cache: "no-store" })
              if (res.ok) {
                const data = await res.json()
                const heroImageSetting = data.settings.find((s: any) => s.key === 'hero_image_url')
                if (heroImageSetting) {
                  setHeroImageUrl(heroImageSetting.value)
                }
              }
            } catch (error) {
              console.log('Error loading settings:', error)
            }
          }

          const loadCourse = async () => {
            try {
              const res = await fetch("/api/courses", { cache: "no-store" })
              if (res.ok) {
                const data = await res.json()
                // Get the first active course or featured course
                const activeCourse = data.courses?.find((c: any) => c.isActive) || data.courses?.[0]
                if (activeCourse) {
                  setCourse({
                    id: activeCourse.id,
                    title: activeCourse.title,
                    price: activeCourse.price,
                    originalPrice: activeCourse.originalPrice,
                    discount: activeCourse.discount
                  })
                }
              }
            } catch (error) {
              console.log('Error loading course:', error)
            }
          }
          
          loadNotifications()
          loadVideos()
          loadSettings()
          loadCourse()
        }, [])

  return (
    <div className="min-h-screen">
      <Navigation />


      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-16 sm:pt-20">
        <div
          ref={heroRef}
          className="absolute inset-0 parallax"
          style={{
            background: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
            opacity: 0.1,
          }}
        />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Side - Content */}
            <div className="text-center lg:text-left">
              <Badge className="mb-6 animate-scale-in" variant="secondary">
              Master Your MBA Placement & Internship Journey
              </Badge>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-balance animate-fade-in-up leading-tight">
              Crack Your Dream
                <span className="text-accent block"> MBA Placements & Summer Internships with Confidence</span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-3xl mx-auto lg:mx-0 text-pretty animate-fade-in-up [animation-delay:0.2s] opacity-0 leading-relaxed">
              Join Placement Pulse – your ultimate companion for GDs, interviews, and placement strategy. Learn from experienced MBA alumni who have successfully secured top corporate offers.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start animate-fade-in-up [animation-delay:0.4s] opacity-0">
                {user?.enrolledCourse ? (
                  <Link href="/dashboard">
                    <Button size="lg" className="group hover:scale-105 transition-all duration-300">
                      Continue Learning
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  ) : (
                    <Link href={user ? "/enroll" : "/auth"}>
                      <Button size="lg" className="group font-bold text-xl px-10 py-6 bg-black hover:bg-gray-800 text-white shadow-2xl hover:shadow-black/50 hover:scale-110 hover:-translate-y-1 transition-all duration-500 border-2 border-gray-300 hover:border-white rounded-lg">
                        Enroll Now {course ? `- ${formatPrice(course.price)}` : '- ₹99'}
                        <ArrowRight className="ml-4 h-6 w-6 group-hover:translate-x-2 group-hover:rotate-12 transition-all duration-300" />
                      </Button>
                    </Link>
                  )}
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="hover:scale-105 transition-transform bg-transparent"
                  onClick={scrollToVideo}
                >
                Watch Free Preview
                  <Play className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Right Side - Image Space */}
            <div className="relative animate-fade-in-up [animation-delay:0.6s] opacity-0 mt-8 lg:mt-0">
              <div className="relative max-w-sm sm:max-w-md lg:max-w-lg mx-auto lg:mx-0 lg:ml-8 xl:ml-16">
                {/* Animated background elements */}
                <div className="absolute -top-8 -left-8 w-24 h-24 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-2xl animate-pulse [animation-delay:0.5s]"></div>
                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full blur-3xl animate-pulse [animation-delay:1.5s]"></div>
                
                {/* Main Image Container */}
                <div className="relative group">
                  <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                  <div className="relative bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-8 shadow-2xl group-hover:shadow-3xl transition-all duration-500 group-hover:scale-105">
                    {/* Hero Image */}
                    <div className="aspect-square rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center relative overflow-hidden">
                      {heroImageUrl ? (
                        <>
                          {/* Dynamic Hero Image */}
                          <img 
                            src={heroImageUrl} 
                            alt="Course Hero Image" 
                            className="absolute inset-0 w-full h-full object-cover rounded-xl"
                            onError={(e) => {
                              // Fallback to placeholder if image fails to load
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                          
                          {/* Fallback placeholder (hidden by default) */}
                          <div className="hidden absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                            {/* Animated background pattern */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 animate-pulse"></div>
                            
                            {/* Animated code lines */}
                            <div className="absolute top-4 left-4 w-16 h-1 bg-primary/30 rounded animate-pulse [animation-delay:0.2s]"></div>
                            <div className="absolute top-6 left-4 w-12 h-1 bg-accent/30 rounded animate-pulse [animation-delay:0.4s]"></div>
                            <div className="absolute top-8 left-4 w-14 h-1 bg-primary/30 rounded animate-pulse [animation-delay:0.6s]"></div>
                            
                            {/* Code preview or course image placeholder */}
                            <div className="relative z-10 text-center">
                              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center animate-bounce group-hover:animate-spin">
                                <Play className="h-8 w-8 text-white" />
                              </div>
                              <h3 className="text-lg font-semibold text-primary mb-2 animate-pulse">Course Preview</h3>
                              <p className="text-sm text-muted-foreground">Interactive Learning Experience</p>
                            </div>
                            
                            {/* Floating elements */}
                            <div className="absolute top-4 right-4 w-3 h-3 bg-accent rounded-full animate-ping"></div>
                            <div className="absolute bottom-4 left-4 w-2 h-2 bg-primary rounded-full animate-pulse [animation-delay:1s]"></div>
                            <div className="absolute top-1/2 right-2 w-1.5 h-1.5 bg-green-500 rounded-full animate-ping [animation-delay:2s]"></div>
                          </div>
                        </>
                      ) : (
                        <>
                          {/* Default placeholder when no image is set */}
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 animate-pulse"></div>
                          
                          {/* Animated code lines */}
                          <div className="absolute top-4 left-4 w-16 h-1 bg-primary/30 rounded animate-pulse [animation-delay:0.2s]"></div>
                          <div className="absolute top-6 left-4 w-12 h-1 bg-accent/30 rounded animate-pulse [animation-delay:0.4s]"></div>
                          <div className="absolute top-8 left-4 w-14 h-1 bg-primary/30 rounded animate-pulse [animation-delay:0.6s]"></div>
                          
                          {/* Code preview or course image placeholder */}
                          <div className="relative z-10 text-center">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center animate-bounce group-hover:animate-spin">
                              <Play className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-primary mb-2 animate-pulse">Course Preview</h3>
                            <p className="text-sm text-muted-foreground">Interactive Learning Experience</p>
                          </div>
                          
                          {/* Floating elements */}
                          <div className="absolute top-4 right-4 w-3 h-3 bg-accent rounded-full animate-ping"></div>
                          <div className="absolute bottom-4 left-4 w-2 h-2 bg-primary rounded-full animate-pulse [animation-delay:1s]"></div>
                          <div className="absolute top-1/2 right-2 w-1.5 h-1.5 bg-green-500 rounded-full animate-ping [animation-delay:2s]"></div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Floating badges with enhanced animations */}
                <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 bg-white dark:bg-slate-800 rounded-full p-2 sm:p-3 shadow-lg animate-float hover:animate-bounce">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center animate-pulse">
                    <CheckCircle className="h-3 w-3 sm:h-5 sm:w-5 text-white" />
                  </div>
                </div>
                
                <div className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 bg-white dark:bg-slate-800 rounded-full p-2 sm:p-3 shadow-lg animate-float [animation-delay:1s] hover:animate-bounce">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center animate-pulse">
                    <Users className="h-3 w-3 sm:h-5 sm:w-5 text-white" />
                  </div>
                </div>

                {/* Additional floating elements */}
                <div className="absolute top-4 -left-1 sm:top-8 sm:-left-2 bg-white dark:bg-slate-800 rounded-full p-1.5 sm:p-2 shadow-lg animate-float [animation-delay:2s]">
                  <div className="w-4 h-4 sm:w-6 sm:h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-spin">
                    <Star className="h-2 w-2 sm:h-3 sm:w-3 text-white" />
                  </div>
                </div>

                <div className="absolute bottom-4 -right-1 sm:bottom-8 sm:-right-2 bg-white dark:bg-slate-800 rounded-full p-1.5 sm:p-2 shadow-lg animate-float [animation-delay:0.8s]">
                  <div className="w-4 h-4 sm:w-6 sm:h-6 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
                    <Award className="h-2 w-2 sm:h-3 sm:w-3 text-white" />
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted by Top-Tier Institutions */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-purple-50 via-white to-purple-50 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-2">
              Trusted by Top-Tier Institutions
            </h2>
            <p className="text-sm text-gray-500">Leading educational institutions trust our platform</p>
          </div>
          
          {/* Auto-scrolling logos container */}
          <div className="relative">
            <div className="flex animate-scroll">
              {/* First set of logos */}
              <div className="flex items-center gap-8 sm:gap-12 lg:gap-16 flex-shrink-0">
                {/* IIM Indore */}
                <div className="flex items-center gap-3 bg-white rounded-xl px-6 py-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/a/a5/IIM_Indore_Logo.svg" 
                      alt="IIM Indore" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">IIM Indore</span>
                </div>
                
                {/* JBIMS */}
                <div className="flex items-center gap-3 bg-white rounded-xl px-6 py-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
                    <img 
                      src="https://www.jbims.edu/front/images/head-logo.png" 
                      alt="JBIMS" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">JBIMS</span>
                </div>
                
                {/* SRCC GBO */}
                <div className="flex items-center gap-3 bg-white rounded-xl px-6 py-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
                    <img 
                      src="https://www.pikpng.com/pngl/m/145-1453183_srcc-logo-png-shri-ram-college-of-commerce.png" 
                      alt="SRCC GBO" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">SRCC GBO</span>
                </div>
                
                {/* Symbiosis SIIB */}
                <div className="flex items-center gap-3 bg-white rounded-xl px-6 py-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/8/81/SIBM_Vector_Logo_2.png" 
                      alt="Symbiosis SIIB" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">Symbiosis SIIB</span>
                </div>
                
                {/* IIM Raipur */}
                <div className="flex items-center gap-3 bg-white rounded-xl px-6 py-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/en/2/20/Indian_Institute_of_Management_Raipur_logo.png?20190316024154" 
                      alt="IIM Raipur" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">IIM Raipur</span>
                </div>
                
                {/* DBE */}
                <div className="flex items-center gap-3 bg-white rounded-xl px-6 py-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
                    <img 
                      src="https://www.dbe-du.org/logo.png" 
                      alt="DBE" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">DBE</span>
                </div>
                
                {/* FORE */}
                <div className="flex items-center gap-3 bg-white rounded-xl px-6 py-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
                    <img 
                      src="https://www.mbarendezvous.com/images/bschool-logo/106x50-fore.jpg" 
                      alt="FORE" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">FORE</span>
                </div>
                
                {/* BIMTECH */}
                <div className="flex items-center gap-3 bg-white rounded-xl px-6 py-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
                    <img 
                      src="https://www.mbarendezvous.com/images/bschool-logo/bimtech.jpg" 
                      alt="BIMTECH" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">BIMTECH</span>
                </div>
              </div>
              
              {/* Second set of logos */}
              <div className="flex items-center gap-8 sm:gap-12 lg:gap-16 flex-shrink-0">
                {/* IIFT Delhi */}
                <div className="flex items-center gap-3 bg-white rounded-xl px-6 py-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
                    <img 
                      src="https://www.mbarendezvous.com/images/bschool-logo/bschool_1605004798.png" 
                      alt="IIFT Delhi" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">IIFT Delhi</span>
                </div>
                
                {/* IMI Delhi */}
                <div className="flex items-center gap-3 bg-white rounded-xl px-6 py-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
                    <img 
                      src="https://www.mbarendezvous.com/images/bschool-logo/imi-new-delhi.jpg" 
                      alt="IMI Delhi" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">IMI Delhi</span>
                </div>
                
                {/* NIA */}
                <div className="flex items-center gap-3 bg-white rounded-xl px-6 py-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/National_Investigation_Agency_Logo.png/786px-National_Investigation_Agency_Logo.png?20250104174950" 
                      alt="NIA" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">NIA</span>
                </div>
                
                {/* IIFM */}
                <div className="flex items-center gap-3 bg-white rounded-xl px-6 py-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
                    <span className="text-xs font-bold text-white">II</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-700">IIFM</span>
                </div>
                
                {/* DFS */}
                <div className="flex items-center gap-3 bg-white rounded-xl px-6 py-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="w-8 h-8 bg-gradient-to-br from-violet-400 to-violet-600 rounded-lg flex items-center justify-center">
                    <span className="text-xs font-bold text-white">D</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-700">DFS</span>
                </div>
                
                {/* Jaipuria */}
                <div className="flex items-center gap-3 bg-white rounded-xl px-6 py-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="w-8 h-8 bg-gradient-to-br from-lime-400 to-lime-600 rounded-lg flex items-center justify-center">
                    <span className="text-xs font-bold text-white">J</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-700">Jaipuria</span>
                </div>
                
                {/* Nirma */}
                <div className="flex items-center gap-3 bg-white rounded-xl px-6 py-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
                    <img 
                      src="https://www.mbarendezvous.com/images/bschool-logo/nirma-logo.jpg" 
                      alt="Nirma" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">Nirma</span>
                </div>
                
                {/* Welingkar */}
                <div className="flex items-center gap-3 bg-white rounded-xl px-6 py-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
                    <img 
                      src="https://www.mbarendezvous.com/images/bschool-logo/bschool_1644660427.png" 
                      alt="Welingkar" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">Welingkar</span>
                </div>
              </div>
              
              {/* Third set for ultra-smooth transition */}
              <div className="flex items-center gap-8 sm:gap-12 lg:gap-16 flex-shrink-0">
                {/* IIM Indore */}
                <div className="flex items-center gap-3 bg-white rounded-xl px-6 py-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-xs font-bold text-white">IIM</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-700">IIM Indore</span>
                </div>
                
                {/* JBIMS */}
                <div className="flex items-center gap-3 bg-white rounded-xl px-6 py-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
                    <img 
                      src="https://www.jbims.edu/front/images/head-logo.png" 
                      alt="JBIMS" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">JBIMS</span>
                </div>
                
                {/* SRCC GBO */}
                <div className="flex items-center gap-3 bg-white rounded-xl px-6 py-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
                    <img 
                      src="https://www.pikpng.com/pngl/m/145-1453183_srcc-logo-png-shri-ram-college-of-commerce.png" 
                      alt="SRCC GBO" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">SRCC GBO</span>
                </div>
                
                {/* Symbiosis SIIB */}
                <div className="flex items-center gap-3 bg-white rounded-xl px-6 py-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/8/81/SIBM_Vector_Logo_2.png" 
                      alt="Symbiosis SIIB" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">Symbiosis SIIB</span>
                </div>
                
                {/* IIM Raipur */}
                <div className="flex items-center gap-3 bg-white rounded-xl px-6 py-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/en/2/20/Indian_Institute_of_Management_Raipur_logo.png?20190316024154" 
                      alt="IIM Raipur" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">IIM Raipur</span>
                </div>
                
                {/* DBE */}
                <div className="flex items-center gap-3 bg-white rounded-xl px-6 py-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
                    <img 
                      src="https://www.dbe-du.org/logo.png" 
                      alt="DBE" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">DBE</span>
                </div>
                
                {/* FORE */}
                <div className="flex items-center gap-3 bg-white rounded-xl px-6 py-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
                    <img 
                      src="https://www.mbarendezvous.com/images/bschool-logo/106x50-fore.jpg" 
                      alt="FORE" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">FORE</span>
                </div>
                
                {/* BIMTECH */}
                <div className="flex items-center gap-3 bg-white rounded-xl px-6 py-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
                    <img 
                      src="https://www.mbarendezvous.com/images/bschool-logo/bimtech.jpg" 
                      alt="BIMTECH" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">BIMTECH</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

 
      <section className="py-12 sm:py-16 lg:py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 text-center">
            {[
              { icon: Users, value: "2,500+", label: "Students Enrolled" },
              { icon: Clock, value: "40+", label: "Hours of Content" },
              { icon: Award, value: "15", label: "Real Projects" },
              { icon: Star, value: "4.9/5", label: "Student Rating" },
            ].map((stat, index) => (
              <div key={index} className={`animate-on-scroll opacity-0 [animation-delay:${index * 0.1}s] p-4`}>
                <stat.icon className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-3 sm:mb-4 text-accent" />
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary mb-1 sm:mb-2">{stat.value}</div>
                <div className="text-xs sm:text-sm text-muted-foreground leading-tight">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Course Preview Video */}
      <section id="video-section" ref={videoSectionRef} className="py-12 sm:py-16 lg:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <Badge className="mb-4 sm:mb-6 animate-on-scroll opacity-0" variant="outline">
              Course Preview
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 animate-on-scroll opacity-0 [animation-delay:0.2s] leading-tight">
              See What You'll
              <span className="text-accent block">Learn</span>
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            {videos.length > 0 ? (
              <div className="relative group">
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 shadow-2xl">
                  {isYouTubeUrl(videos[0].videoUrl) ? (
                    <iframe
                      className="w-full h-full"
                      src={getYouTubeEmbedUrl(videos[0].videoUrl)}
                      title={videos[0].title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      className="w-full h-full object-cover"
                      poster={videos[0].thumbnailUrl}
                      controls
                      preload="metadata"
                      onLoadStart={() => console.log('Video loading started')}
                      onCanPlay={() => console.log('Video can play')}
                      onError={(e) => console.log('Video error:', e)}
                    >
                      <source src={videos[0].videoUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
                <div className="mt-3 sm:mt-4 text-center">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2">{videos[0].title}</h3>
                  {videos[0].description && (
                    <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">{videos[0].description}</p>
                  )}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                    {videos[0].duration && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>{videos[0].duration}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>{videos[0].views} views</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative group animate-on-scroll opacity-0 [animation-delay:0.4s]">
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Play className="h-8 w-8 text-white ml-1" />
                      </div>
                      <h3 className="text-white text-xl font-semibold mb-2">Course Introduction</h3>
                      <p className="text-white/80">Watch our 5-minute course overview</p>
                    </div>
                  </div>
                  <button className="absolute inset-0 w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover:bg-white transition-colors">
                      <Play className="h-6 w-6 text-slate-900 ml-0.5" />
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="py-12 sm:py-16 lg:py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 animate-on-scroll opacity-0">What You'll Learn</h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto animate-on-scroll opacity-0 [animation-delay:0.2s]">
            Master the strategies that top MBA recruiters expect from candidates.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
            {[
              "Group Discussion Mastery",
              "Mock Interview Training",
              "Resume & LinkedIn Optimization",
              "Placement & Internship Strategy Blueprint",
              "Aptitude & Case Study Preparation",
              "Personal Branding & Confidence Building",
              "Peer-to-Peer Learning",
              "Continuous Guidance & Blogs",
              "Financial & Technical Interview Preparation",
            ].map((skill, index) => (
              <Card
                key={index}
                className={`p-4 sm:p-6 hover:shadow-lg transition-all duration-300 animate-on-scroll opacity-0`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-0 flex items-start gap-2 sm:gap-3">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-accent mt-1 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-medium leading-relaxed">{skill}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 sm:py-16 lg:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 animate-on-scroll opacity-0">Student Success Stories</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Sarah Johnson",
                role: "Frontend Developer at Google",
                content:
                  "This course transformed my career. The projects were challenging and the instruction was top-notch.",
                rating: 5,
              },
              {
                name: "Mike Chen",
                role: "Full Stack Developer at Stripe",
                content:
                  "Best investment I've made in my career. Landed my dream job 3 months after completing the course.",
                rating: 5,
              },
              {
                name: "Emily Rodriguez",
                role: "React Developer at Airbnb",
                content: "The hands-on approach and real-world projects made all the difference. Highly recommended!",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <Card
                key={index}
                className={`p-4 sm:p-6 animate-on-scroll opacity-0`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <CardContent className="p-0">
                  <div className="flex mb-3 sm:mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 leading-relaxed">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold text-sm sm:text-base">{testimonial.name}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 animate-on-scroll opacity-0 leading-tight">
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg sm:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto animate-on-scroll opacity-0 [animation-delay:0.2s] leading-relaxed">
            Join thousands of students who have transformed their careers with our comprehensive MBA course.
          </p>
          <div className="animate-on-scroll opacity-0 [animation-delay:0.4s]">
            {user?.enrolledCourse ? (
              <Link href="/dashboard">
                <Button size="lg" variant="secondary" className="hover:scale-105 transition-transform w-full sm:w-auto">
                  Continue Learning
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              ) : (
                <Link href={user ? "/enroll" : "/auth"}>
                  <Button size="lg" className="group font-bold text-xl px-10 py-6 bg-black hover:bg-gray-800 text-white shadow-2xl hover:shadow-black/50 hover:scale-110 hover:-translate-y-1 transition-all duration-500 border-2 border-gray-300 hover:border-white rounded-lg w-full sm:w-auto">
                    Enroll Now {course ? `- ${formatPrice(course.price)}` : '- ₹299'}
                    <ArrowRight className="ml-4 h-6 w-6 group-hover:translate-x-2 group-hover:rotate-12 transition-all duration-300" />
                  </Button>
                </Link>
              )}
          </div>
        </div>
      </section>


      {/* Latest Notifications */}
      {notifications.length > 0 && (
        <section className="py-12 sm:py-16 lg:py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-10">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">Latest Notifications</h2>
              <p className="text-muted-foreground text-sm sm:text-base">Stay updated with our latest news</p>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="space-y-3 sm:space-y-4">
                {notifications.slice(0, 5).map((notification) => (
                  <div key={notification.id} className="p-3 sm:p-4 border rounded-lg bg-card hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm sm:text-base break-words">{notification.message}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-background border-t py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-primary">Placement Pulse</div>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">Empowering students to crack their dream MBA placements and internships.</p>
            
            {/* Social Media Links */}
            <div className="flex justify-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <a 
                href="https://youtube.com/@placementpulse" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a 
                href="https://instagram.com/placementpulse" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a 
                href="https://twitter.com/placementpulse" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a 
                href="https://linkedin.com/company/placementpulse" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
            </div>
            
            <div className="text-muted-foreground">
              <p className="text-xs sm:text-sm">&copy; 2025 Placement Pulse. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
