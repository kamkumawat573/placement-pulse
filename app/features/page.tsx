"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import Link from "next/link"
import {
  Zap,
  Shield,
  Globe,
  Code,
  Rocket,
  Users,
  Star,
  ArrowRight,
  Palette,
  BarChart3,
  Lock,
  Smartphone,
  MessageCircle,
  FileText,
  Target,
  UserCheck,
  BookOpen,
} from "lucide-react"

export default function FeaturesPage() {
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

  const mainFeatures = [
    {
      icon: MessageCircle,
      title: "Live GD Practice",
      description: "Get hands-on experience with real Group Discussions moderated by experts. Learn how to initiate, contribute, and conclude effectively.",
      color: "text-blue-500",
    },
    {
      icon: UserCheck,
      title: "Mock Interviews",
      description: "Face HR and technical mock interviews with MBA alumni who provide detailed feedback to improve your answers, body language, and confidence.",
      color: "text-green-500",
    },
    {
      icon: FileText,
      title: "Resume & LinkedIn Review",
      description: "Get your resume and LinkedIn profile reviewed by industry professionals to make sure they stand out to recruiters.",
      color: "text-purple-500",
    },
    {
      icon: Target,
      title: "Placement & Internship Strategy Sessions",
      description: "Understand how to shortlist companies, prepare for aptitude tests, and plan your preparation month-by-month.",
      color: "text-orange-500",
    },
    {
      icon: Users,
      title: "Peer-to-Peer Learning",
      description: "Collaborate with fellow MBA students to practice GDs, share interview questions, and grow together.",
      color: "text-pink-500",
    },
    {
      icon: BookOpen,
      title: "Continuous Guidance & Blogs",
      description: "Access weekly blogs and updates on interview hacks, company insights, and success stories to stay ahead.",
      color: "text-indigo-500",
    },
  ]

  const additionalFeatures = [
    { icon: Rocket, title: "Auto-scaling", description: "Handles traffic spikes automatically" },
    { icon: Lock, title: "Data Privacy", description: "GDPR compliant with data residency options" },
    { icon: Smartphone, title: "Mobile First", description: "Optimized for all devices and screen sizes" },
    { icon: Palette, title: "Custom Branding", description: "White-label solutions with full customization" },
    { icon: Star, title: "24/7 Support", description: "Expert support team available around the clock" },
    { icon: ArrowRight, title: "Easy Migration", description: "Seamless migration from existing platforms" },
  ]

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 animate-scale-in" variant="secondary">
              🚀 Powerful Features
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance animate-fade-in-up">
              Everything You Need to
              <span className="text-accent block">Ace Your MBA Internships & Placements</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 text-pretty animate-fade-in-up [animation-delay:0.2s] opacity-0">
            Placement Pulse gives you a clear path from summer internship to final placement. With real insights, practical training, and personal mentorship, we make sure you’re ready when recruiters arrive.

            </p>
            <Link href="/courses">
              <Button
                size="lg"
                className="group hover:scale-105 transition-all duration-300 animate-fade-in-up [animation-delay:0.4s] opacity-0"
              >
                Start Your Preparation Today
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 scroll-animate opacity-0 translate-y-8">
              Core Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto scroll-animate opacity-0 translate-y-8">
              Comprehensive tools and resources designed to help you excel in MBA placements and internships.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mainFeatures.map((feature, index) => (
              <Card
                key={index}
                className="scroll-animate opacity-0 translate-y-8 hover:scale-105 transition-all duration-300 hover:shadow-xl group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <feature.icon
                    className={`h-12 w-12 ${feature.color} mb-4 group-hover:scale-110 transition-transform`}
                  />
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Showcase */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="scroll-animate opacity-0 translate-y-8">
              <Badge className="mb-4" variant="outline">
                📊 Placement Success Metrics
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Built for Your Internship & Placement Success</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Our structured courses and mentorship ensure you are fully prepared for every stage of the MBA placement journey. From mock GDs to resume polishing, we provide the right tools and guidance to help you land your dream offer.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-card rounded-lg border">
                  <div className="text-3xl font-bold text-accent mb-2">95%+</div>
                  <div className="text-sm text-muted-foreground">Students Improved GD & PI Performance</div>
                  <div className="text-xs text-muted-foreground mt-1">Proven results from our practice-based approach.</div>
                </div>
                <div className="text-center p-4 bg-card rounded-lg border">
                  <div className="text-3xl font-bold text-accent mb-2">500+</div>
                  <div className="text-sm text-muted-foreground">Mock GDs & Interviews Conducted</div>
                  <div className="text-xs text-muted-foreground mt-1">Gain real-world exposure before stepping into the actual placement rounds.</div>
                </div>
                <div className="text-center p-4 bg-card rounded-lg border">
                  <div className="text-3xl font-bold text-accent mb-2">₹99</div>
                  <div className="text-sm text-muted-foreground">Starting Course Fee</div>
                  <div className="text-xs text-muted-foreground mt-1">Affordable, high-impact mentorship accessible to every MBA student.</div>
                </div>
                <div className="text-center p-4 bg-card rounded-lg border">
                  <div className="text-3xl font-bold text-accent mb-2">20+</div>
                  <div className="text-sm text-muted-foreground">Cities</div>
                  <div className="text-xs text-muted-foreground mt-1">Trusted by students across top B-Schools in 20+ cities.</div>
                </div>
              </div>
            </div>
            <div className="scroll-animate opacity-0 translate-y-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-primary/20 rounded-2xl transform rotate-3" />
                <div className="relative bg-card p-8 rounded-2xl border shadow-lg">
                  <h3 className="text-2xl font-bold mb-6">Additional Capabilities</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <span className="text-lg">🎤</span>
                      <div>
                        <div className="font-semibold text-sm">Live GD Practice</div>
                        <div className="text-xs text-muted-foreground">Participate in real-time GDs with alumni moderators.</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <span className="text-lg">💼</span>
                      <div>
                        <div className="font-semibold text-sm">Mock Interviews</div>
                        <div className="text-xs text-muted-foreground">Face one-on-one mock HR & technical interviews with detailed feedback.</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <span className="text-lg">📄</span>
                      <div>
                        <div className="font-semibold text-sm">Resume & LinkedIn Review</div>
                        <div className="text-xs text-muted-foreground">Get your profile recruiter-ready with expert reviews.</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <span className="text-lg">📚</span>
                      <div>
                        <div className="font-semibold text-sm">Internship & Placement Strategy Sessions</div>
                        <div className="text-xs text-muted-foreground">Step-by-step guidance to crack aptitude tests, shortlist companies, and prep smart.</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <span className="text-lg">🤝</span>
                      <div>
                        <div className="font-semibold text-sm">Peer-to-Peer Learning</div>
                        <div className="text-xs text-muted-foreground">Collaborate with fellow MBA students, exchange insights, and practice together.</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <span className="text-lg">📝</span>
                      <div>
                        <div className="font-semibold text-sm">Weekly Blogs & Hacks</div>
                        <div className="text-xs text-muted-foreground">Stay updated with placement trends, interview hacks, and success stories.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-12">
            <Link href="/courses">
              <Button size="lg" className="group font-bold text-lg px-8 py-4 bg-gradient-to-r from-accent to-purple-600 hover:from-purple-600 hover:to-accent text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 border-0 rounded-lg">
                Start Your Placement Journey Today
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-2 group-hover:rotate-12 transition-all duration-300" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto scroll-animate opacity-0 translate-y-8">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">🚀 Ready to Ace Your MBA Internships & Placements?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join hundreds of MBA students who are transforming their placement journey with Placement Pulse. Get the right guidance, practice, and confidence to land your dream role.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/courses">
                <Button size="lg" className="group font-bold text-lg px-8 py-4 bg-gradient-to-r from-accent to-purple-600 hover:from-purple-600 hover:to-accent text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 border-0 rounded-lg">
                  Start Preparing Today
                  <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-2 group-hover:rotate-12 transition-all duration-300" />
                </Button>
              </Link>
              <Link href="/#video-section">
                <Button size="lg" variant="outline" className="group hover:scale-105 transition-all duration-300 bg-transparent border-2 border-accent text-accent hover:bg-accent hover:text-white">
                  Watch Free Preview
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
