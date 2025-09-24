"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Navigation } from "@/components/navigation"
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Headphones,
  Users,
  ArrowRight,
  CheckCircle,
  X,
} from "lucide-react"

export default function ContactPage() {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [submitMessage, setSubmitMessage] = useState("")

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setSubmitMessage("")

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitStatus('success')
        setSubmitMessage(data.message)
        setFormData({
          name: "",
          email: "",
          company: "",
          message: "",
        })
      } else {
        setSubmitStatus('error')
        setSubmitMessage(data.error || 'Failed to send message. Please try again.')
      }
    } catch (error) {
      console.error('Contact form error:', error)
      setSubmitStatus('error')
      setSubmitMessage('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleContactMethodClick = (method: string, contact: string) => {
    switch (method) {
      case 'Call Now':
        window.open(`tel:${contact}`, '_self')
        break
      case 'Send Email':
        window.open(`mailto:${contact}`, '_self')
        break
      case 'Start Chat':
        // WhatsApp link - you can customize the message
        const message = encodeURIComponent('Hello! I would like to get in touch about your services.')
        window.open(`https://wa.me/917073406229?text=${message}`, '_blank')
        break
      default:
        break
    }
  }

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Us",
      description: "Send us an email and we'll respond within 24 hours",
      contact: "kamlesh@placementpulse.com",
      action: "Send Email",
      color: "text-blue-500",
    },
    {
      icon: Phone,
      title: "Call Us",
      description: "Speak directly with our support team",
      contact: "+91 7073406229",
      action: "Call Now",
      color: "text-green-500",
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Get instant help through our live chat",
      contact: "Whatsapp",
      action: "Start Chat",
      color: "text-purple-500",
    },
  ]

  const supportOptions = [
    {
      icon: Headphones,
      title: "Technical Support",
      description: "Get help with implementation, troubleshooting, and best practices",
      availability: "24/7 Support",
    },
    {
      icon: Users,
      title: "Sales Consultation",
      description: "Discuss pricing, features, and find the right plan for your needs",
      availability: "Business Hours",
    },
    {
      icon: MessageCircle,
      title: "General Inquiries",
      description: "Questions about our platform, partnerships, or anything else",
      availability: "24/7 Support",
    },
  ]

  const officeInfo = [
    {
      icon: MapPin,
      title: "Headquarters",
      details: ["Vijay Nagar,New Delhi"],
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: ["9:00 AM to 8:00 PM"],
    },
  ]

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 animate-scale-in" variant="secondary">
              💬 Get in Touch
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance animate-fade-in-up">
            We’re Here to Guide You 
              <span className="text-accent block">Through your Summer Internships & Placements</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 text-pretty animate-fade-in-up [animation-delay:0.2s] opacity-0">
            Have questions about our courses? Need support with your placement preparation? Want to explore how Placement Pulse can help you crack your dream job? Let’s connect.
            </p>
            <div className="flex items-center justify-center space-x-6 animate-fade-in-up [animation-delay:0.4s] opacity-0">
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Average response time: 30 Min</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>24/7 support available</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 scroll-animate opacity-0 translate-y-8">
              Choose Your Preferred Way
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto scroll-animate opacity-0 translate-y-8">
              Multiple ways to reach us, all designed to get you the help you need quickly.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => (
              <Card
                key={index}
                className="scroll-animate opacity-0 translate-y-8 hover:scale-105 transition-all duration-300 hover:shadow-xl text-center group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <method.icon
                    className={`h-12 w-12 ${method.color} mx-auto mb-4 group-hover:scale-110 transition-transform`}
                  />
                  <CardTitle className="text-xl">{method.title}</CardTitle>
                  <CardDescription className="text-base">{method.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold text-lg mb-4">{method.contact}</p>
                  <Button 
                    className="w-full group-hover:scale-105 transition-transform"
                    onClick={() => handleContactMethodClick(method.action, method.contact)}
                  >
                    {method.action}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="scroll-animate opacity-0 translate-y-8">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-2xl">Send Us a Message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you as soon as possible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {submitStatus === 'success' && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <p className="text-green-800">{submitMessage}</p>
                    </div>
                  )}
                  
                  {submitStatus === 'error' && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                      <X className="h-5 w-5 text-red-600" />
                      <p className="text-red-800">{submitMessage}</p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-2">
                          Full Name *
                        </label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="John Doe"
                          required
                          className="transition-all duration-200 focus:scale-105"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2">
                          Email Address *
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="john@company.com"
                          required
                          className="transition-all duration-200 focus:scale-105"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium mb-2">
                        Company Name
                      </label>
                      <Input
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder="Your Company"
                        className="transition-all duration-200 focus:scale-105"
                      />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-2">
                        Message *
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Tell us how we can help you..."
                        rows={5}
                        required
                        className="transition-all duration-200 focus:scale-105"
                      />
                    </div>
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting}
                      className="w-full group hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                      <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Support Options & Office Info */}
            <div className="space-y-8">
              {/* Support Options */}
              <div className="scroll-animate opacity-0 translate-y-8">
                <h3 className="text-2xl font-bold mb-6">How Can We Help?</h3>
                <div className="space-y-4">
                  {supportOptions.map((option, index) => (
                    <Card key={index} className="hover:scale-105 transition-all duration-300 hover:shadow-lg">
                      <CardHeader className="pb-3">
                        <div className="flex items-start space-x-4">
                          <option.icon className="h-6 w-6 text-accent mt-1" />
                          <div className="flex-grow">
                            <CardTitle className="text-lg">{option.title}</CardTitle>
                            <CardDescription className="text-sm mt-1">{option.description}</CardDescription>
                            <Badge variant="outline" className="mt-2 text-xs">
                              {option.availability}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Office Information */}
              <div className="scroll-animate opacity-0 translate-y-8">
                <h3 className="text-2xl font-bold mb-6">Visit Our Office</h3>
                <div className="space-y-6">
                  {officeInfo.map((info, index) => (
                    <Card key={index} className="hover:scale-105 transition-all duration-300">
                      <CardHeader>
                        <div className="flex items-start space-x-4">
                          <info.icon className="h-6 w-6 text-accent mt-1" />
                          <div>
                            <CardTitle className="text-lg mb-2">{info.title}</CardTitle>
                            {info.details.map((detail, i) => (
                              <p key={i} className="text-muted-foreground text-sm">
                                {detail}
                              </p>
                            ))}
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 scroll-animate opacity-0 translate-y-8">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground scroll-animate opacity-0 translate-y-8">
              Quick answers to common questions about our platform and services.
            </p>
          </div>
          <div className="max-w-3xl mx-auto grid gap-6">
            {[
              {
                question: "How quickly can I get started?",
                answer:
                  "You can sign up and start building in under 5 minutes. Our onboarding process is designed to get you productive immediately.",
              },
              {
                question: "Do you offer technical support?",
                answer:
                  "Yes! We provide 24/7 technical support through multiple channels including live chat, email, and phone support.",
              },
              {
                question: "Can I migrate from my current platform?",
                answer:
                  "Absolutely. We offer free migration assistance and have tools to help you seamlessly transition from most major platforms.",
              },
              {
                question: "What's your uptime guarantee?",
                answer:
                  "We guarantee 99.9% uptime with our enterprise-grade infrastructure. We also provide real-time status updates and incident reports.",
              },
            ].map((faq, index) => (
              <Card
                key={index}
                className="scroll-animate opacity-0 translate-y-8 hover:scale-105 transition-all duration-300 hover:shadow-lg"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto scroll-animate opacity-0 translate-y-8">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Don't wait - join thousands of satisfied customers who have transformed their businesses with our
              platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="group hover:scale-105 transition-all duration-300">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="hover:scale-105 transition-transform bg-transparent">
                Schedule a Demo
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
