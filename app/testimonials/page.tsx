"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, ArrowRight, Quote, Building, Users, TrendingUp, Award, CheckCircle } from "lucide-react"

export default function TestimonialsPage() {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, scrollPosition: 0 })
  const [scrollPosition, setScrollPosition] = useState(0)
  const animationRef = useRef<number>()

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

    return () => observerRef.current?.disconnect()
  }, [])

  // Smooth infinite scroll using JavaScript
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const scrollSpeed = 0.5 // pixels per frame
    const containerWidth = container.scrollWidth / 3 // One-third the total width (since we have 3 sets)

    const animate = () => {
      if (!isPaused && !isDragging) {
        setScrollPosition(prev => {
          const newPosition = prev + scrollSpeed
          // Create seamless loop by resetting to 0 when reaching the end
          if (newPosition >= containerWidth) {
            return 0 // Instant reset for seamless loop
          }
          return newPosition
        })
      }
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPaused, isDragging])

  // Update transform when scroll position changes
  useEffect(() => {
    const container = scrollContainerRef.current
    if (container) {
      container.style.transform = `translateX(-${scrollPosition}px)`
    }
  }, [scrollPosition])

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setIsPaused(true)
    setDragStart({
      x: e.clientX,
      scrollPosition: scrollPosition
    })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    
    const deltaX = e.clientX - dragStart.x
    const newPosition = dragStart.scrollPosition - deltaX
    const containerWidth = scrollContainerRef.current?.scrollWidth ? scrollContainerRef.current.scrollWidth / 3 : 0
    
    // Handle infinite scroll bounds seamlessly
    if (newPosition < 0) {
      setScrollPosition(containerWidth + newPosition)
    } else if (newPosition >= containerWidth) {
      setScrollPosition(newPosition - containerWidth)
    } else {
      setScrollPosition(newPosition)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setIsPaused(false)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
    setIsPaused(false)
  }

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    setIsDragging(true)
    setIsPaused(true)
    setDragStart({
      x: touch.clientX,
      scrollPosition: scrollPosition
    })
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    
    const touch = e.touches[0]
    const deltaX = touch.clientX - dragStart.x
    const newPosition = dragStart.scrollPosition - deltaX
    const containerWidth = scrollContainerRef.current?.scrollWidth ? scrollContainerRef.current.scrollWidth / 3 : 0
    
    // Handle infinite scroll bounds seamlessly
    if (newPosition < 0) {
      setScrollPosition(containerWidth + newPosition)
    } else if (newPosition >= containerWidth) {
      setScrollPosition(newPosition - containerWidth)
    } else {
      setScrollPosition(newPosition)
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
    setIsPaused(false)
  }

  const featuredTestimonials = [
    {
      name: "Amit Singh",
      role: "MBA Student",
      company: "IIM Amritsar",
      content:
        "Placement Pulse really simplified things for me. The GD practice made me realize my common mistakes, and the resume audit was so detailed. Honestly, I didn’t expect this level of feedback at such an affordable price.",
      rating: 5,
      image: "AS",
      results: "Multiple Top Offers",
    },
    {
      name: "Sidharth Bishnoi",
      role: "MBA Student",
      company: "IIM Vizag",
      content:
        "What I liked most was how practical everything was. The alumni actually told me what I was doing wrong in my answers, and their tips were super easy to apply. I felt more confident immediately.",
      rating: 5,
      image: "SB",
      results: "Multiple Top Offers",
    },
    {
      name: "Saumya Gupta",
      role: "MBA Student",
      company: "IIFT Delhi",
      content:
        "Before this, I kept fumbling in mock interviews. After two sessions here, I learned how to structure my thoughts and avoid over-explaining. That small change made a big difference in my final placements.",
      rating: 5,
      image: "SG",
      results: "Multiple Top Offers",
    },
  ]

  const testimonials = [
    {
      name: "Pragati Jha",
      role: "MBA Student",
      company: "IIM Raipur",
      content:
        "During my SIP prep, I was completely lost. Placement Pulse helped me with simple frameworks for GDs and really useful interview feedback. I honestly wish I had found this earlier.",
      rating: 5,
    },
    {
      name: "Aditi Chaudhary",
      role: "MBA Student",
      company: "FORE",
      content:
        "The alumni sessions stood out for me. Instead of generic advice, they shared exactly what worked for them during placements. It felt genuine and gave me confidence that I was preparing in the right way.",
      rating: 5,
    },
    {
      name: "Vikas Yadav",
      role: "MBA Student",
      company: "BIMTECH",
      content:
        "I wasn’t sure about joining at first, but the mock GD sessions changed my mind. They actually pointed out habits I never realized I had, like cutting people off too soon. Small things, but they matter.",
      rating: 5,
    },
    {
      name: "Kavya Nair",
      role: "MBA Student",
      company: "IIM Shillong",
      content:
        "As someone from a non-business background, I was worried about placement preparation. Placement Pulse's structured curriculum and peer learning helped me build confidence and land my dream role at P&G.",
      rating: 5,
    },
    {
      name: "Raghav Khandelwal",
      role: "MBA Student",
      company: "IIFT Delhi",
      content:
        "The resume review was eye-opening. Just a few edits made my profile look so much sharper. I even got compliments on it during interviews, which never happened before.",
      rating: 5,
    },
    {
      name: "Shreeyanka Das",
      role: "MBA Student",
      company: "IIM Indore",
      content:"Placement Pulse is different because it’s not just theory. The feedback was practical, to the point, and from people who actually went through placements recently. That made me trust the process.",
      rating: 5,
    },
  ]

  const stats = [
    { icon: Users, number: "300+", label: "MBA Students", color: "text-blue-500" },
    { icon: Star, number: "4.9/5", label: "Student Rating", color: "text-yellow-500" },
    { icon: TrendingUp, number: "95%", label: "Placement Success", color: "text-green-500" },
    { icon: Award, number: "500+", label: "Dream Offers", color: "text-purple-500" },
  ]

  const companies = [
    "McKinsey & Company",
    "Boston Consulting Group",
    "Bain & Company",
    "Goldman Sachs",
    "JP Morgan",
    "Amazon",
    "Microsoft",
    "Google",
    "Deloitte",
    "PwC",
    "P&G",
    "Unilever",
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 animate-scale-in" variant="secondary">
              ⭐ Success Stories
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance animate-fade-in-up">
              Trusted by MBA Students,
              <span className="text-accent block">Recommended by Alumni</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 text-pretty animate-fade-in-up [animation-delay:0.2s] opacity-0 max-w-4xl mx-auto">
              See how MBA students across top B-Schools have transformed their placement preparation and landed dream roles with Placement Pulse.
            </p>
            <div className="flex items-center justify-center space-x-2 animate-fade-in-up [animation-delay:0.4s] opacity-0">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="ml-2 text-lg font-semibold">4.9/5 from 1,000+ MBA students</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Testimonials */}     
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 scroll-animate opacity-0 translate-y-8">
              Success Stories
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto scroll-animate opacity-0 translate-y-8">
              Real results from real MBA students who transformed their placement preparation and landed dream roles.
            </p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {featuredTestimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="scroll-animate opacity-0 translate-y-8 hover:scale-105 transition-all duration-300 hover:shadow-xl relative overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="absolute top-4 right-4">
                  <Quote className="h-8 w-8 text-accent/20" />
                </div>
                <CardHeader>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full flex items-center justify-center font-bold text-accent">
                      {testimonial.image}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{testimonial.name}</CardTitle> from {testimonial.company}
                      <CardDescription>
                        {testimonial.role}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 leading-relaxed">"{testimonial.content}"</p>
                  <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {testimonial.results}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 scroll-animate opacity-0 translate-y-8">
              The Numbers Speak
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center scroll-animate opacity-0 translate-y-8 hover:scale-105 transition-transform"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-card rounded-full flex items-center justify-center mx-auto border shadow-lg">
                    <stat.icon className={`h-10 w-10 ${stat.color}`} />
                  </div>
                </div>
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* More Testimonials - Horizontal Scrolling */}
      <section className="py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 scroll-animate opacity-0 translate-y-8">
              What Our MBA Students Say
            </h2>
          </div>
          
          {/* Horizontal Scrolling Container */}
          <div className="relative overflow-hidden">
            {/* Left fade gradient */}
            <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-12 md:w-16 lg:w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
            
            {/* Right fade gradient */}
            <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-12 md:w-16 lg:w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>
            
            <div 
              ref={scrollContainerRef}
              className="flex gap-3 sm:gap-4 md:gap-6 smooth-scroll-container cursor-grab active:cursor-grabbing select-none touch-pan-x"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={handleMouseLeave}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{ userSelect: 'none', touchAction: 'pan-x' }}
            >
              {/* First set of testimonials */}
              {testimonials.map((testimonial, index) => (
                <Card
                  key={`first-${index}`}
                  className="flex-shrink-0 w-72 sm:w-80 hover:scale-105 transition-all duration-300 hover:shadow-lg"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex space-x-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <Quote className="h-5 w-5 text-accent/30" />
                    </div>
                    <CardTitle className="text-base">{testimonial.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {testimonial.role} at {testimonial.company}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">"{testimonial.content}"</p>
                  </CardContent>
                </Card>
              ))}
              
              {/* Second set of testimonials for seamless loop */}
              {testimonials.map((testimonial, index) => (
                <Card
                  key={`second-${index}`}
                  className="flex-shrink-0 w-72 sm:w-80 hover:scale-105 transition-all duration-300 hover:shadow-lg"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex space-x-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <Quote className="h-5 w-5 text-accent/30" />
                    </div>
                    <CardTitle className="text-base">{testimonial.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {testimonial.role} at {testimonial.company}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">"{testimonial.content}"</p>
                  </CardContent>
                </Card>
              ))}
              
              {/* Third set for ultra-smooth transition */}
              {testimonials.map((testimonial, index) => (
                <Card
                  key={`third-${index}`}
                  className="flex-shrink-0 w-72 sm:w-80 hover:scale-105 transition-all duration-300 hover:shadow-lg"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex space-x-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <Quote className="h-5 w-5 text-accent/30" />
                    </div>
                    <CardTitle className="text-base">{testimonial.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {testimonial.role} at {testimonial.company}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">"{testimonial.content}"</p>
                  </CardContent>
                </Card>
              ))}
              
            </div>
          </div>
        </div>
      </section>

     
    
      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto scroll-animate opacity-0 translate-y-8">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Join These MBA Success Stories?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Start your MBA placement journey today and see why thousands of students choose our comprehensive preparation program.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/courses">
                <Button size="lg" className="group hover:scale-105 transition-all duration-300">
                  Start Your MBA Placement Journey
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
             
            </div>
            <div className="flex items-center justify-center space-x-4 mt-8 text-sm text-muted-foreground">
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
