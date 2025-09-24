"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import Link from "next/link"
import { ArrowRight, Target, Heart, Lightbulb, Award, Users2, Globe2, TrendingUp, Calendar, ChevronLeft, ChevronRight } from "lucide-react"

interface ProfileData {
  id: number;
  name: string;
  title: string;
  subtitle: string;
  image: string;
}

export default function AboutPage() {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const parallaxRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(2)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const team: ProfileData[] = [
    {
      id: 1,
      name: "Ms. Shivani Gera",
      title: "Investment Banker",
      subtitle: "Ex Senior Analyst at EY, IIM-K",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face"
    },
    {
      id: 2,
      name: "John Smith",
      title: "Financial Analyst",
      subtitle: "Ex Manager at Goldman Sachs",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
    },
    {
      id: 3,
      name: "Sarah Johnson",
      title: "Investment Advisor",
      subtitle: "Ex VP at Morgan Stanley",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face"
    },
    {
      id: 4,
      name: "Michael Brown",
      title: "Portfolio Manager",
      subtitle: "Ex Director at JP Morgan",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
    },
    {
      id: 5,
      name: "Emily Davis",
      title: "Risk Analyst",
      subtitle: "Ex Senior Associate at KPMG",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face"
    }
  ]

  useEffect(() => {
    // Intersection Observer for scroll animations
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in-up")
            entry.target.classList.remove("opacity-0", "translate-y-8")
          }
        })
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    )

    // Observe all elements with scroll-animate class
    const elements = document.querySelectorAll(".scroll-animate")
    elements.forEach((el) => observerRef.current?.observe(el))

    // Parallax effect for background elements
    const handleScroll = () => {
      if (parallaxRef.current) {
        const scrolled = window.pageYOffset
        const parallaxSpeed = 0.3
        parallaxRef.current.style.transform = `translateY(${scrolled * parallaxSpeed}px)`
      }
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      observerRef.current?.disconnect()
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Auto-running carousel effect
  useEffect(() => {
    if (isAutoPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % team.length)
      }, 2500) // Change every 2.5 seconds
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isAutoPlaying, team.length])

  const values = [
    {
      icon: Heart,
      title: "💡 Student-Centered",
      description: "Every course, session, and resource is designed keeping the MBA student's success at the heart of what we do.",
      color: "text-blue-500",
    },
    {
      icon: Target,
      title: "🎯 Practical & Result-Driven",
      description: "We focus on actionable insights, hands-on practice, and real feedback that directly improve your placement outcomes.",
      color: "text-green-500",
    },
    {
      icon: Users2,
      title: "🤝 Peer & Alumni Mentorship",
      description: "We believe in collaborative growth — connecting MBA students with alumni mentors and peers for shared learning.",
      color: "text-purple-500",
    },
    {
      icon: Award,
      title: "📈 Excellence in Preparation",
      description: "From resume reviews to mock interviews, we maintain the highest standards so that you're fully prepared to stand out to recruiters.",
      color: "text-orange-500",
    },
  ]

  const milestones = [
    { year: "2020", title: "Company Founded", description: "Started with a vision to revolutionize web development" },
    { year: "2021", title: "First 1000 Users", description: "Reached our first major milestone with rapid growth" },
    { year: "2022", title: "Series A Funding", description: "Secured $10M to accelerate product development" },
    { year: "2023", title: "Global Expansion", description: "Launched in 25+ countries with localized support" },
    { year: "2024", title: "1M+ Users", description: "Celebrating over 1 million active users worldwide" },
  ]

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % team.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + team.length) % team.length);
  };

  const getVisibleProfiles = () => {
    const visible = [];
    for (let i = -2; i <= 2; i++) {
      const index = (currentIndex + i + team.length) % team.length;
      visible.push({
        ...team[index],
        position: i
      });
    }
    return visible;
  };

  const currentProfile = team[currentIndex];

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        <div
          ref={parallaxRef}
          className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20"
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 animate-scale-in" variant="secondary">
              🌟 Our Story
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance animate-fade-in-up">
              🎓 Building the Future of
              <span className="text-accent block">MBA Placements</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 text-pretty animate-fade-in-up [animation-delay:0.2s] opacity-0">
              We're a team of MBA graduates who know exactly what it feels like to sit in the placement hot seat. Having successfully cracked our own B-School placements, we started Placement Pulse to guide the next generation of MBA students with the mentorship we wish we had.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="scroll-animate opacity-0 translate-y-8">
              <Badge className="mb-4" variant="outline">
                Our Mission
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Empowering MBA Students to Succeed in Internships & Placements</h2>
              <p className="text-lg text-muted-foreground mb-6">
                At Placement Pulse, we believe that every MBA student deserves the right guidance to crack their dream internship and placement. Our mission is to simplify the placement journey by providing structured preparation, real-time practice, and mentorship from MBA alumni who have already been through the same journey.
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                Since our founding, we've been committed to helping students approach Group Discussions, Interviews, and placement strategies with confidence. Our goal is to ensure that no student feels lost or underprepared when recruiters arrive on campus.
              </p>
              <Link href="/courses">
                <Button size="lg" className="group hover:scale-105 transition-all duration-300">
                  Join Our Mission
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            <div className="scroll-animate opacity-0 translate-y-8">
              <div className="grid grid-cols-2 gap-6">
                {values.map((value, index) => (
                  <Card key={index} className="hover:scale-105 transition-all duration-300 hover:shadow-lg">
                    <CardHeader className="pb-3">
                      <value.icon className={`h-8 w-8 ${value.color} mb-2`} />
                      <CardTitle className="text-lg">{value.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm leading-relaxed">{value.description}</CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      

      {/* Team Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 scroll-animate opacity-0 translate-y-8">
              Meet Our Team
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto scroll-animate opacity-0 translate-y-8">
              The passionate individuals behind our success.
            </p>
          </div>
          
          {/* Team Carousel */}
          <div 
            className="relative w-full max-w-6xl mx-auto"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            {/* Carousel Container */}
            <div className="relative flex items-center justify-center mb-8">
              {/* Left Arrow */}
              <button
                onClick={prevSlide}
                className="absolute left-0 z-10 w-16 h-16 bg-accent hover:bg-accent/90 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 hover:scale-110"
              >
                <ChevronLeft size={24} />
              </button>

              {/* Profile Images */}
              <div className="flex items-center justify-center space-x-4">
                {getVisibleProfiles().map((profile, index) => (
                  <div
                    key={`${profile.id}-${index}`}
                    className={`relative transition-all duration-500 ${
                      profile.position === 0
                        ? 'w-80 h-80 z-20'
                        : profile.position === -1 || profile.position === 1
                        ? 'w-64 h-64 z-10'
                        : 'w-48 h-48 z-0'
                    }`}
                  >
                    <div
                      className={`w-full h-full rounded-3xl overflow-hidden transition-all duration-500 ${
                        profile.position === 0
                          ? 'bg-gradient-to-br from-accent to-primary p-2 shadow-2xl'
                          : ''
                      } ${
                        profile.position !== 0 ? 'grayscale opacity-60' : ''
                      }`}
                    >
                      <img
                        src={profile.image}
                        alt={profile.name}
                        className={`w-full h-full object-cover transition-all duration-500 ${
                          profile.position === 0 ? 'rounded-2xl' : 'rounded-3xl'
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Arrow */}
              <button
                onClick={nextSlide}
                className="absolute right-0 z-10 w-16 h-16 bg-accent hover:bg-accent/90 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 hover:scale-110"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Profile Information Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border-2 border-accent/20 max-w-4xl mx-auto">
              <div className="text-center">
                <h3 className="text-3xl font-bold text-accent mb-2">
                  {currentProfile.name}
                </h3>
                <p className="text-xl text-gray-700 dark:text-gray-300 mb-2">
                  {currentProfile.title}
                </p>
                <p className="text-lg text-gray-500 dark:text-gray-400 mb-6">
                  {currentProfile.subtitle}
                </p>

                {/* Company Logos */}
                <div className="flex items-center justify-center space-x-8 opacity-70 flex-wrap gap-4">
                  <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">Deloitte</div>
                  <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">EY</div>
                  <div className="flex items-center space-x-1">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">A</span>
                    </div>
                    <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">ACUITY</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-8 h-8 bg-blue-600 rounded-sm flex items-center justify-center">
                      <span className="text-white text-xs font-bold">FG</span>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">future group</span>
                  </div>
                  <div className="text-xl font-bold text-orange-500">PwC</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 scroll-animate opacity-0 translate-y-8">
              By the Numbers
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Users2, number: "1k+", label: "Active Users", color: "text-blue-500" },
              { icon: Globe2, number: "5+", label: "Countries", color: "text-green-500" },
              { icon: TrendingUp, number: "99.9%", label: "Uptime", color: "text-purple-500" },
              { icon: Award, number: "24/7", label: "Support", color: "text-orange-500" },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center scroll-animate opacity-0 translate-y-8 hover:scale-105 transition-transform"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <stat.icon className={`h-12 w-12 ${stat.color} mx-auto mb-4`} />
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto scroll-animate opacity-0 translate-y-8">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Join Our Story?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Be part of the next chapter as we continue to innovate and grow together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/courses">
                <Button size="lg" className="group hover:scale-105 transition-all duration-300">
                  Get Started Today
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="hover:scale-105 transition-transform bg-transparent">
                  Contact Our Team
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
