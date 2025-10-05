"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowRight, Target, Heart, Lightbulb, Award, Users2, Globe2, TrendingUp, Calendar, ChevronLeft, ChevronRight } from "lucide-react"

interface ProfileData {
  id: number;
  name: string;
  title: string;
  subtitle: string;
  image: string;
  linkedinUrl?: string;
}

export default function AboutPage() {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const parallaxRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(2)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
// ---------------------------------------------------------------------------------------------
  const team: ProfileData[] = [
    {
      id: 1,
      name: "Kamlesh Kumawat",
      title: "Founder",
      subtitle: "",
      image: "https://cdn.corenexis.com/files/b/5648343168.jpg",
      linkedinUrl: "https://linkedin.com/in/kamleshh-kumawat"
    },
    { 
      id: 2,
      name: "Adarsh Vijayvargiya",
      title: "Co-Founder",
      subtitle: "",
      image: "https://cdn.corenexis.com/files/b/1182911168.jpg",
      linkedinUrl: "https://linkedin.com/in/adarsh-vijayvargiya-27484a21a"
    },
    {
      id: 3,
      name: "Gaurav Shukla",
      title: "Co-Founder",
      subtitle: "",
      image: "https://cdn.corenexis.com/files/b/7883948168.jpg",
      linkedinUrl: "https://linkedin.com/in/gaurav-shukla-58b436178"
    },
    {
      id: 4,
      name: "Mukul Singh",
      title: "Co-Founder",
      subtitle: "",
      image: "https://cdn.corenexis.com/files/b/3299261168.jpg",
      linkedinUrl: "https://linkedin.com/in/mukul-singh-13655837a"
    }
  ]
// ----------------------------------------------------------------------------------------------------------------------
  useEffect(() => {
    // Check initial screen size
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640)
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)

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
      window.removeEventListener('resize', checkScreenSize)
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
    // On mobile screens, show only 3 images (1 front + 2 back)
    // On larger screens, show 5 images (2 back + 1 front + 2 back)
    const range = isMobile ? 1 : 2; // Show 1 image on each side for mobile, 2 for desktop
    
    for (let i = -range; i <= range; i++) {
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
      {/* Hero Section */}
      <section className="relative pt-28 xs:pt-32 pb-8 xs:pb-12 sm:pb-16 md:pb-18 lg:pb-20 overflow-hidden">
        <div
          ref={parallaxRef}
          className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20"
        />
        
        <div className="container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-3 xs:mb-4 sm:mb-6 animate-scale-in text-xs xs:text-sm" variant="secondary">
              🌟 Our Story
            </Badge>
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-3 xs:mb-4 sm:mb-6 text-balance animate-fade-in-up leading-tight">
              🎓 Building the Future of
              <span className="text-accent block">MBA Placements</span>
            </h1>
            <p className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-4 xs:mb-6 sm:mb-8 text-pretty animate-fade-in-up [animation-delay:0.2s] opacity-0 px-2 xs:px-4 sm:px-0 leading-relaxed">
              We're a team of MBA graduates who know exactly what it feels like to sit in the placement hot seat. Having successfully cracked our own B-School placements, we started Placement Pulse to guide the next generation of MBA students with the mentorship we wish we had.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-8 xs:py-12 sm:py-16 md:py-18 lg:py-20">
        <div className="container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-6 xs:gap-8 lg:gap-12 items-center">
            <div className="scroll-animate opacity-0 translate-y-8">
              <Badge className="mb-3 xs:mb-4 text-xs xs:text-sm" variant="outline">
                Our Mission
              </Badge>
              <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 xs:mb-4 sm:mb-6 leading-tight">Empowering MBA Students to Succeed in Internships & Placements</h2>
              <p className="text-sm xs:text-base sm:text-lg text-muted-foreground mb-3 xs:mb-4 sm:mb-6 leading-relaxed">
                At Placement Pulse, we believe that every MBA student deserves the right guidance to crack their dream internship and placement. Our mission is to simplify the placement journey by providing structured preparation, real-time practice, and mentorship from MBA alumni who have already been through the same journey.
              </p>
              <p className="text-sm xs:text-base sm:text-lg text-muted-foreground mb-4 xs:mb-6 sm:mb-8 leading-relaxed">
                Since our founding, we've been committed to helping students approach Group Discussions, Interviews, and placement strategies with confidence. Our goal is to ensure that no student feels lost or underprepared when recruiters arrive on campus.
              </p>
              <Link href="/auth?mode=signup">
                <Button size="lg" className="group hover:scale-105 transition-all duration-300 w-full xs:w-auto text-sm xs:text-base">
                  Join Our Mission
                  <ArrowRight className="ml-2 h-3 w-3 xs:h-4 xs:w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            <div className="scroll-animate opacity-0 translate-y-8">
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 xs:gap-4 sm:gap-6">
                {values.map((value, index) => (
                  <Card key={index} className="hover:scale-105 transition-all duration-300 hover:shadow-lg p-2 xs:p-3 sm:p-4">
                    <CardHeader className="pb-2 xs:pb-3">
                      <value.icon className={`h-5 w-5 xs:h-6 xs:w-6 sm:h-8 sm:w-8 ${value.color} mb-1 xs:mb-2`} />
                      <CardTitle className="text-sm xs:text-base sm:text-lg leading-tight">{value.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <CardDescription className="text-xs xs:text-sm leading-relaxed">{value.description}</CardDescription>
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
      <section className="py-8 xs:py-12 sm:py-16 md:py-18 lg:py-20 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
        <div className="container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 xs:mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 xs:mb-4 scroll-animate opacity-0 translate-y-8 leading-tight">
              Meet Our Team
            </h2>
            <p className="text-sm xs:text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto scroll-animate opacity-0 translate-y-8 px-2 xs:px-4 leading-relaxed">
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
            <div className="relative flex items-center justify-center mb-4 xs:mb-6 sm:mb-8">
              {/* Left Arrow */}
              <button
                onClick={prevSlide}
                className="absolute left-0 z-10 w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-accent hover:bg-accent/90 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 hover:scale-110"
              >
                <ChevronLeft size={12} className="xs:w-4 xs:h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
              </button>

              {/* Profile Images */}
              <div className="flex items-center justify-center space-x-1 xs:space-x-2 sm:space-x-4">
                {getVisibleProfiles().map((profile, index) => (
                  <div
                    key={`${profile.id}-${index}`}
                    className={`relative transition-all duration-500 ${
                      profile.position === 0
                        ? 'w-32 h-32 xs:w-40 xs:h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 xl:w-80 xl:h-80 z-20'
                        : profile.position === -1 || profile.position === 1
                        ? 'w-24 h-24 xs:w-28 xs:h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 xl:w-64 xl:h-64 z-10'
                        : 'w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 xl:w-48 xl:h-48 z-0'
                    }`}
                  >
                    <div
                      className={`w-full h-full block transition-all duration-500 hover:scale-105 ${
                        profile.position === 0
                          ? 'bg-gradient-to-br from-accent to-primary p-0.5 xs:p-1 sm:p-2 shadow-2xl rounded-xl xs:rounded-2xl sm:rounded-3xl'
                          : ''
                      } ${
                        profile.position !== 0 ? 'grayscale opacity-60' : ''
                      }`}
                    >
                      <div
                        className={`w-full h-full rounded-xl xs:rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-500 ${
                          profile.position === 0
                            ? 'bg-gradient-to-br from-accent to-primary p-0.5 xs:p-1 sm:p-2 shadow-2xl'
                            : ''
                        } ${
                          profile.position !== 0 ? 'grayscale opacity-60' : ''
                        }`}
                      >
                        <img
                          src={profile.image}
                          alt={profile.name}
                          className={`w-full h-full object-cover transition-all duration-500 ${
                            profile.position === 0 ? 'rounded-lg xs:rounded-xl sm:rounded-2xl' : 'rounded-xl xs:rounded-2xl sm:rounded-3xl'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Arrow */}
              <button
                onClick={nextSlide}
                className="absolute right-0 z-10 w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-accent hover:bg-accent/90 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 hover:scale-110"
              >
                <ChevronRight size={12} className="xs:w-4 xs:h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
              </button>
            </div>

            {/* Profile Information Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg xs:rounded-xl sm:rounded-2xl p-3 xs:p-4 sm:p-6 lg:p-8 shadow-xl border-2 border-accent/20 max-w-4xl mx-auto">
              <div className="text-center">
                <h3 className="text-lg xs:text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-accent mb-1 xs:mb-2 leading-tight">
                  {currentProfile.name}
                </h3>
                <p className="text-sm xs:text-base sm:text-lg lg:text-xl xl:text-2xl text-gray-700 dark:text-gray-300 mb-1 xs:mb-2">
                  {currentProfile.title}
                </p>
                <p className="text-xs xs:text-sm sm:text-base lg:text-lg xl:text-xl text-gray-500 dark:text-gray-400 mb-3 xs:mb-4 sm:mb-6">
                  {currentProfile.subtitle}
                </p>
                
                {/* LinkedIn Link */}
                {currentProfile.linkedinUrl && (
                  <div className="flex justify-center mb-4 xs:mb-6">
                    <a
                      href={currentProfile.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-4 xs:px-6 py-2 xs:py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm xs:text-base font-medium rounded-lg transition-all duration-300 hover:scale-105"
                    >
                      <svg className="w-5 h-5 xs:w-6 xs:h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      LinkedIn Profile
                    </a>
                  </div>
                )}

                {/* Company Logos
                <div className="flex items-center justify-center space-x-2 xs:space-x-4 sm:space-x-6 lg:space-x-8 opacity-70 flex-wrap gap-1 xs:gap-2 sm:gap-4">
                  <div className="text-sm xs:text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-gray-700 dark:text-gray-300">Deloitte</div>
                  <div className="text-sm xs:text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-gray-700 dark:text-gray-300">EY</div>
                  <div className="flex items-center space-x-1">
                    <div className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">A</span>
                    </div>
                    <span className="text-xs xs:text-sm sm:text-base lg:text-lg xl:text-xl font-semibold text-gray-700 dark:text-gray-300">ACUITY</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-blue-600 rounded-sm flex items-center justify-center">
                      <span className="text-white text-xs font-bold">FG</span>
                    </div>
                    <span className="text-xs xs:text-sm text-gray-600 dark:text-gray-400">future group</span>
                  </div>
                  <div className="text-sm xs:text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-orange-500">PwC</div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 xs:py-12 sm:py-16 md:py-18 lg:py-20 bg-muted/30">
        <div className="container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 xs:mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 xs:mb-4 scroll-animate opacity-0 translate-y-8 leading-tight">
              By the Numbers
            </h2>
          </div>
          <div className="grid grid-cols-2 xs:grid-cols-2 md:grid-cols-4 gap-3 xs:gap-4 sm:gap-6 lg:gap-8">
            {[
              { icon: Users2, number: "1k+", label: "Active Users", color: "text-blue-500" },
              { icon: Globe2, number: "5+", label: "Countries", color: "text-green-500" },
              { icon: TrendingUp, number: "99.9%", label: "Uptime", color: "text-purple-500" },
              { icon: Award, number: "24/7", label: "Support", color: "text-orange-500" },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center scroll-animate opacity-0 translate-y-8 hover:scale-105 transition-transform p-2 xs:p-3 sm:p-4"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <stat.icon className={`h-6 w-6 xs:h-8 xs:w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 ${stat.color} mx-auto mb-1 xs:mb-2 sm:mb-4`} />
                <div className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-1 xs:mb-1 sm:mb-2">{stat.number}</div>
                <div className="text-xs xs:text-sm text-muted-foreground leading-tight">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 xs:py-12 sm:py-16 md:py-18 lg:py-20">
        <div className="container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto scroll-animate opacity-0 translate-y-8">
            <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 xs:mb-4 sm:mb-6 leading-tight">Ready to Join Our Story?</h2>
            <p className="text-sm xs:text-base sm:text-lg lg:text-xl xl:text-2xl text-muted-foreground mb-4 xs:mb-6 sm:mb-8 px-2 xs:px-4 leading-relaxed">
              Be part of the next chapter as we continue to innovate and grow together.
            </p>
            <div className="flex flex-col xs:flex-row gap-2 xs:gap-3 sm:gap-4 justify-center">
              <Link href="/auth?mode=signup">
                <Button size="lg" className="group hover:scale-105 transition-all duration-300 w-full xs:w-auto text-sm xs:text-base">
                  Get Started Today
                  <ArrowRight className="ml-2 h-3 w-3 xs:h-4 xs:w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="hover:scale-105 transition-transform bg-transparent w-full xs:w-auto text-sm xs:text-base">
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
