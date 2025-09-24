"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { Star, ArrowRight, Quote, Building, Users, TrendingUp, Award, CheckCircle } from "lucide-react"

export default function TestimonialsPage() {
  const observerRef = useRef<IntersectionObserver | null>(null)

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

  const featuredTestimonials = [
    {
      name: "Sarah Johnson",
      role: "CEO",
      company: "TechStart Inc.",
      content:
        "This platform transformed our entire development workflow. We've seen a 300% increase in deployment speed and our team productivity has never been higher. The support team is exceptional.",
      rating: 5,
      image: "SJ",
      results: "300% faster deployments",
    },
    {
      name: "Michael Chen",
      role: "CTO",
      company: "DataFlow Systems",
      content:
        "The scalability and reliability are outstanding. We handle millions of requests daily without any issues. The analytics and monitoring tools give us complete visibility into our applications.",
      rating: 5,
      image: "MC",
      results: "99.99% uptime achieved",
    },
    {
      name: "Emily Rodriguez",
      role: "Lead Developer",
      company: "Creative Solutions",
      content:
        "As a developer, I love how intuitive and powerful the platform is. The documentation is comprehensive, and the developer experience is simply the best I've encountered.",
      rating: 5,
      image: "ER",
      results: "50% reduction in dev time",
    },
  ]

  const testimonials = [
    {
      name: "David Kim",
      role: "Product Manager",
      company: "InnovateCorp",
      content:
        "The collaboration features have revolutionized how our team works together. Real-time updates and seamless integration with our existing tools.",
      rating: 5,
    },
    {
      name: "Lisa Wang",
      role: "DevOps Engineer",
      company: "CloudTech",
      content:
        "Deployment has never been easier. The automated scaling and monitoring save us countless hours every week.",
      rating: 5,
    },
    {
      name: "James Wilson",
      role: "Startup Founder",
      company: "NextGen Apps",
      content:
        "As a startup, we needed something reliable and cost-effective. This platform delivered on both fronts and helped us scale rapidly.",
      rating: 5,
    },
    {
      name: "Maria Garcia",
      role: "Senior Developer",
      company: "WebSolutions",
      content:
        "The performance improvements we've seen are incredible. Our applications load faster and handle more traffic than ever before.",
      rating: 5,
    },
    {
      name: "Alex Thompson",
      role: "Technical Director",
      company: "DigitalFirst",
      content:
        "Security was our top concern, and this platform exceeded our expectations. Enterprise-grade security with ease of use.",
      rating: 5,
    },
    {
      name: "Rachel Brown",
      role: "Full Stack Developer",
      company: "ModernWeb Co.",
      content:
        "The developer tools and APIs are fantastic. Everything just works as expected, and the learning curve is minimal.",
      rating: 5,
    },
  ]

  const stats = [
    { icon: Users, number: "10,000+", label: "Happy Customers", color: "text-blue-500" },
    { icon: Star, number: "4.9/5", label: "Average Rating", color: "text-yellow-500" },
    { icon: TrendingUp, number: "98%", label: "Customer Retention", color: "text-green-500" },
    { icon: Award, number: "50+", label: "Industry Awards", color: "text-purple-500" },
  ]

  const companies = [
    "TechStart Inc.",
    "DataFlow Systems",
    "Creative Solutions",
    "InnovateCorp",
    "CloudTech",
    "NextGen Apps",
    "WebSolutions",
    "DigitalFirst",
  ]

  return (
    <div className="min-h-screen">
      <Navigation />

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

      {/* More Testimonials Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 scroll-animate opacity-0 translate-y-8">
              What Our MBA Students Say
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="scroll-animate opacity-0 translate-y-8 hover:scale-105 transition-all duration-300 hover:shadow-lg"
                style={{ animationDelay: `${index * 0.05}s` }}
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
      </section>

      {/* Trusted By Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 scroll-animate opacity-0 translate-y-8">
              Trusted by MBA Alumni
            </h2>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {companies.map((company, index) => (
              <div
                key={index}
                className="scroll-animate opacity-0 translate-y-8 hover:opacity-100 transition-opacity"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center space-x-2 px-4 py-2 bg-card rounded-lg border">
                  <Building className="h-5 w-5 text-accent" />
                  <span className="font-medium">{company}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto scroll-animate opacity-0 translate-y-8">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Join These Success Stories?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Start your journey today and see why thousands of MBA students choose our platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="group hover:scale-105 transition-all duration-300">
                Start Your Preparation Today
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="hover:scale-105 transition-transform bg-transparent">
                Read More Success Stories
              </Button>
            </div>
            <div className="flex items-center justify-center space-x-4 mt-8 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Free 14-day trial</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
