"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
      {/* Hero Section */}
      <section className="relative pt-20 sm:pt-24 pb-16 sm:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20" />
        
        <div className="container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-4 sm:mb-6 animate-scale-in text-xs sm:text-sm" variant="secondary">
              🚀 Powerful Features
            </Badge>
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 text-balance animate-fade-in-up leading-tight">
              Everything You Need to
              <span className="text-accent block">Ace Your MBA Internships & Placements</span>
            </h1>
            <p className="text-base xs:text-lg sm:text-xl md:text-2xl text-muted-foreground mb-6 sm:mb-8 text-pretty animate-fade-in-up [animation-delay:0.2s] opacity-0 leading-relaxed">
            Placement Pulse gives you a clear path from summer internship to final placement. With real insights, practical training, and personal mentorship, we make sure you're ready when recruiters arrive.
            </p>
            <Link href="/courses">
              <Button
                size="lg"
                className="group hover:scale-105 transition-all duration-300 animate-fade-in-up [animation-delay:0.4s] opacity-0 text-sm xs:text-base sm:text-lg px-4 xs:px-6 sm:px-8 py-3 xs:py-4"
              >
                Start Your Preparation Today
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Features Grid */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 scroll-animate opacity-0 translate-y-8 leading-tight">
              Core Features
            </h2>
            <p className="text-base xs:text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto scroll-animate opacity-0 translate-y-8 leading-relaxed">
              Comprehensive tools and resources designed to help you excel in MBA placements and internships.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-6 sm:gap-8">
            {mainFeatures.map((feature, index) => (
              <Card
                key={index}
                className="scroll-animate opacity-0 translate-y-8 hover:scale-105 transition-all duration-300 hover:shadow-xl group p-4 xs:p-6"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="pb-3 xs:pb-4">
                  <feature.icon
                    className={`h-8 w-8 xs:h-10 xs:w-10 sm:h-12 sm:w-12 ${feature.color} mb-3 xs:mb-4 group-hover:scale-110 transition-transform`}
                  />
                  <CardTitle className="text-lg xs:text-xl leading-tight">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-sm xs:text-base leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Showcase */}
      <section className="py-12 sm:py-16 lg:py-20 bg-muted/30">
        <div className="container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 xs:gap-10 sm:gap-12 items-center">
            <div className="scroll-animate opacity-0 translate-y-8">
              <Badge className="mb-3 xs:mb-4 text-xs xs:text-sm" variant="outline">
                📊 Placement Success Metrics
              </Badge>
              <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold mb-4 xs:mb-6 leading-tight">Built for Your Internship & Placement Success</h2>
              <p className="text-sm xs:text-base sm:text-lg text-muted-foreground mb-6 xs:mb-8 leading-relaxed">
                Our structured courses and mentorship ensure you are fully prepared for every stage of the MBA placement journey. From mock GDs to resume polishing, we provide the right tools and guidance to help you land your dream offer.
              </p>
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 xs:gap-4 sm:gap-6">
                <div className="text-center p-3 xs:p-4 bg-card rounded-lg border">
                  <div className="text-2xl xs:text-3xl font-bold text-accent mb-1 xs:mb-2">95%+</div>
                  <div className="text-xs xs:text-sm text-muted-foreground">Students Improved GD & PI Performance</div>
                  <div className="text-xs text-muted-foreground mt-1">Proven results from our practice-based approach.</div>
                </div>
                <div className="text-center p-3 xs:p-4 bg-card rounded-lg border">
                  <div className="text-2xl xs:text-3xl font-bold text-accent mb-1 xs:mb-2">500+</div>
                  <div className="text-xs xs:text-sm text-muted-foreground">Mock GDs & Interviews Conducted</div>
                  <div className="text-xs text-muted-foreground mt-1">Gain real-world exposure before stepping into the actual placement rounds.</div>
                </div>
                <div className="text-center p-3 xs:p-4 bg-card rounded-lg border">
                  <div className="text-2xl xs:text-3xl font-bold text-accent mb-1 xs:mb-2">₹99</div>
                  <div className="text-xs xs:text-sm text-muted-foreground">Starting Course Fee</div>
                  <div className="text-xs text-muted-foreground mt-1">Affordable, high-impact mentorship accessible to every MBA student.</div>
                </div>
                <div className="text-center p-3 xs:p-4 bg-card rounded-lg border">
                  <div className="text-2xl xs:text-3xl font-bold text-accent mb-1 xs:mb-2">20+</div>
                  <div className="text-xs xs:text-sm text-muted-foreground">Cities</div>
                  <div className="text-xs text-muted-foreground mt-1">Trusted by students across top B-Schools in 20+ cities.</div>
                </div>
              </div>
            </div>
            <div className="scroll-animate opacity-0 translate-y-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-primary/20 rounded-xl xs:rounded-2xl transform rotate-3" />
                <div className="relative bg-card p-4 xs:p-6 sm:p-8 rounded-xl xs:rounded-2xl border shadow-lg">
                  <h3 className="text-xl xs:text-2xl font-bold mb-4 xs:mb-6">Additional Capabilities</h3>
                  <div className="space-y-3 xs:space-y-4">
                    <div className="flex items-start space-x-2 xs:space-x-3 p-2 xs:p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <span className="text-base xs:text-lg">🎤</span>
                      <div>
                        <div className="font-semibold text-xs xs:text-sm">Live GD Practice</div>
                        <div className="text-xs text-muted-foreground">Participate in real-time GDs with alumni moderators.</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2 xs:space-x-3 p-2 xs:p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <span className="text-base xs:text-lg">💼</span>
                      <div>
                        <div className="font-semibold text-xs xs:text-sm">Mock Interviews</div>
                        <div className="text-xs text-muted-foreground">Face one-on-one mock HR & technical interviews with detailed feedback.</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2 xs:space-x-3 p-2 xs:p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <span className="text-base xs:text-lg">📄</span>
                      <div>
                        <div className="font-semibold text-xs xs:text-sm">Resume & LinkedIn Review</div>
                        <div className="text-xs text-muted-foreground">Get your profile recruiter-ready with expert reviews.</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2 xs:space-x-3 p-2 xs:p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <span className="text-base xs:text-lg">📚</span>
                      <div>
                        <div className="font-semibold text-xs xs:text-sm">Internship & Placement Strategy Sessions</div>
                        <div className="text-xs text-muted-foreground">Step-by-step guidance to crack aptitude tests, shortlist companies, and prep smart.</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2 xs:space-x-3 p-2 xs:p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <span className="text-base xs:text-lg">🤝</span>
                      <div>
                        <div className="font-semibold text-xs xs:text-sm">Peer-to-Peer Learning</div>
                        <div className="text-xs text-muted-foreground">Collaborate with fellow MBA students, exchange insights, and practice together.</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2 xs:space-x-3 p-2 xs:p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <span className="text-base xs:text-lg">📝</span>
                      <div>
                        <div className="font-semibold text-xs xs:text-sm">Weekly Blogs & Hacks</div>
                        <div className="text-xs text-muted-foreground">Stay updated with placement trends, interview hacks, and success stories.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-8 xs:mt-10 sm:mt-12">
            <Link href="/courses">
              <Button size="lg" className="group font-bold text-sm xs:text-base sm:text-lg px-4 xs:px-6 sm:px-8 py-3 xs:py-4 bg-gradient-to-r from-accent to-purple-600 hover:from-purple-600 hover:to-accent text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 border-0 rounded-lg">
                Start Your Placement Journey Today
                <ArrowRight className="ml-2 xs:ml-3 h-4 xs:h-5 w-4 xs:w-5 group-hover:translate-x-2 group-hover:rotate-12 transition-all duration-300" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto scroll-animate opacity-0 translate-y-8">
            <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold mb-4 xs:mb-6 leading-tight">🚀 Ready to Ace Your MBA Internships & Placements?</h2>
            <p className="text-base xs:text-lg sm:text-xl text-muted-foreground mb-6 xs:mb-8 leading-relaxed">
              Join hundreds of MBA students who are transforming their placement journey with Placement Pulse. Get the right guidance, practice, and confidence to land your dream role.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 xs:gap-4 justify-center">
              <Link href="/courses">
                <Button size="lg" className="group font-bold text-sm xs:text-base sm:text-lg px-4 xs:px-6 sm:px-8 py-3 xs:py-4 bg-gradient-to-r from-accent to-purple-600 hover:from-purple-600 hover:to-accent text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 border-0 rounded-lg">
                  Start Preparing Today
                  <ArrowRight className="ml-2 xs:ml-3 h-4 xs:h-5 w-4 xs:w-5 group-hover:translate-x-2 group-hover:rotate-12 transition-all duration-300" />
                </Button>
              </Link>
              <Link href="/#video-section">
                <Button size="lg" variant="outline" className="group hover:scale-105 transition-all duration-300 bg-transparent border-2 border-accent text-accent hover:bg-accent hover:text-white text-sm xs:text-base sm:text-lg px-4 xs:px-6 sm:px-8 py-3 xs:py-4">
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
