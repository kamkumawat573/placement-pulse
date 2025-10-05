"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/contexts/auth-context"
import { CheckCircle, CreditCard, Clock, Users, Award, Loader2, RefreshCw } from "lucide-react"

// Course features will be fetched dynamically from the course data

// Removed manual payment inputs. Razorpay modal will collect payment details.

export default function EnrollPage() {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [mounted, setMounted] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [coursePrice, setCoursePrice] = useState(0) // Will be updated from API
  const [courseId, setCourseId] = useState("") // Store actual course ID
  const [courseDataLoaded, setCourseDataLoaded] = useState(false)
  const [courseInfo, setCourseInfo] = useState({
    title: "MBA Placement Mastery Program",
    description: "Master Group Discussions, Interviews, and Placement Strategies with expert guidance from MBA alumni",
    shortDescription: "Comprehensive MBA placement preparation course",
    price: 0, // Will be updated from API
    originalPrice: 0, // Will be updated from API
    discount: "", // Will be updated from API
    duration: "40+ Hours",
    level: "Beginner to Advanced",
    category: "MBA Placements",
    instructor: "MBA Alumni Experts",
    image: "/api/placeholder/400/300",
    features: [
      "40+ hours of premium placement content",
      "15+ mock interviews and GD sessions",
      "Lifetime access to placement materials",
      "Certificate of completion",
      "Direct mentorship from MBA alumni",
      "Access to exclusive placement community",
      "Regular content updates",
      "30-day money-back guarantee",
    ],
    modules: [] as Array<{week: string, title: string, lessons: string, duration: string}>,
    testimonials: [] as Array<{name: string, role: string, content: string, rating: number, avatar: string}>,
    students: "2,500+",
    rating: 4.5,
    reviews: "150+"
  })

  const fetchCourseData = async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setRefreshing(true)
    }
    
    console.log('Fetching course data for courseId:', courseId)
    
    try {
      let response
      if (courseId) {
        // Fetch specific course data
        console.log('Fetching specific course:', `/api/courses/${courseId}`)
        response = await fetch(`/api/courses/${courseId}?t=${Date.now()}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        })
        
        // If specific course API fails, fallback to general courses API
        if (!response.ok) {
          console.log('Specific course API failed, falling back to general courses API')
          response = await fetch(`/api/courses?t=${Date.now()}`, {
            cache: 'no-store',
            headers: {
              'Cache-Control': 'no-cache',
              'Pragma': 'no-cache'
            }
          })
        }
      } else {
        // Fallback to general courses API
        console.log('Fetching general courses')
        response = await fetch(`/api/courses?t=${Date.now()}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        })
      }
      
      if (response.ok) {
        const data = await response.json()
        console.log('Course data received:', data)
        let course
        
        if (courseId && data.course) {
          // Single course response
          course = data.course
          console.log('Using specific course:', course)
        } else if (courseId && data.courses && data.courses.length > 0) {
          // Fallback: find the specific course in the courses list
          course = data.courses.find((c: any) => c.id === courseId)
          console.log('Found specific course in list:', course)
        } else {
          // Multiple courses response
          if (data.courses && data.courses.length > 0) {
            course = data.courses[0] // Get the first active course
            console.log('Using first course from list:', course)
          }
        }
        
        if (course) {
          setCourseId(course.id) // Store the actual course ID
          setCoursePrice(course.price)
          setCourseInfo({
            title: course.title,
            description: course.description,
            shortDescription: course.shortDescription,
            price: course.price / 100, // Convert from paise to rupees
            originalPrice: course.originalPrice / 100,
            discount: course.discount,
            duration: course.duration,
            level: course.level,
            category: course.category,
            instructor: course.instructor,
            image: course.image,
            features: course.features || [],
            modules: course.modules || [],
            testimonials: course.testimonials || [],
            students: course.students || "0+",
            rating: course.rating || 4.5,
            reviews: course.reviews || "0"
          })
          console.log('Course data updated:', {
            courseId: course.id,
            title: course.title,
            price: course.price,
            displayPrice: course.price / 100,
            features: course.features?.length || 0
          })
          setCourseDataLoaded(true)
        }
      }
    } catch (error) {
      console.error('Error fetching course data:', error)
      // Keep default values if fetch fails
    } finally {
      if (isManualRefresh) {
        setRefreshing(false)
      }
    }
  }

  const handleManualRefresh = () => {
    fetchCourseData(true)
  }

  useEffect(() => {
    setMounted(true)
    
    // Get courseId from URL parameters
    const urlCourseId = searchParams.get('courseId')
    if (urlCourseId) {
      setCourseId(urlCourseId)
      console.log('CourseId from URL:', urlCourseId)
    }
    
    // Load Razorpay Checkout script
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    document.body.appendChild(script)
    
    if (!user) {
      router.push("/auth")
    }

    return () => {
      // Cleanup Razorpay script
      const existingScript = document.getElementById('razorpay-checkout-script')
      if (existingScript) {
        existingScript.remove()
      }
    }
  }, [user, router, searchParams])

  // Separate useEffect to check if user is already enrolled in this specific course
  useEffect(() => {
    if (user && courseId) {
      console.log('Checking enrollment for courseId:', courseId)
      console.log('User enrolledCourses:', user.enrolledCourses)
      const isEnrolled = user.enrolledCourses?.some((enrollment: any) => String(enrollment.courseId) === String(courseId))
      console.log('Is enrolled in this course:', isEnrolled)

      if (isEnrolled) {
        console.log('User already enrolled in this course, redirecting to dashboard')
        router.push("/dashboard")
      }
    }
  }, [user, courseId, router])

  // Separate useEffect for fetching course data when courseId changes
  useEffect(() => {
    if (courseId) {
      fetchCourseData()
      
      // Set up periodic refresh for course data (every 30 seconds)
      const interval = setInterval(() => {
        fetchCourseData()
      }, 30000)
      
      return () => {
        clearInterval(interval)
      }
    }
  }, [courseId])

  if (!mounted || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 lg:pt-24 bg-gradient-to-br from-background to-muted">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Loading Course Details</h2>
          <p className="text-muted-foreground">Preparing your enrollment...</p>
        </div>
      </div>
    )
  }

  // No input handling needed; Razorpay collects card details securely.

  const handleEnrollment = async () => {
    if (!user) return
    try {
      setProcessing(true)

      // Refresh course data before payment to ensure we have the latest information
      await fetchCourseData()

      console.log('Creating payment order with:', {
        courseId,
        coursePrice,
        displayPrice: coursePrice / 100
      })

      // Create order on the server (amount in paise)
      const orderRes = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          amount: coursePrice, 
          currency: "INR", 
          receipt: `rcpt_${Date.now()}`,
          courseId: courseId || "default" // Use actual course ID
        }),
      })
      if (!orderRes.ok) throw new Error("Failed to create order")
      const order = await orderRes.json()

      const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
      if (!key) {
        throw new Error("Missing Razorpay public key")
      }

      const options: any = {
        key,
        amount: order.amount,
        currency: order.currency,
        name: "Placement Pulse",
        description: "Course Enrollment",
        order_id: order.id,
        prefill: {
          name: user.name || "",
          email: user.email,
        },
        theme: { color: "#4f46e5" },
        handler: async function (response: any) {
          try {
            // Server-side verify and enroll
            const enrollRes = await fetch("/api/enroll", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                user: { id: user.id, email: user.email, name: user.name },
                courseId: courseId,
                verification: {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                },
              }),
            })
            const data = await enrollRes.json()
            if (!enrollRes.ok || !data.success) throw new Error(data.error || "Verification failed")

            const updatedUser = data.user
            localStorage.setItem("user", JSON.stringify(updatedUser))
            setProcessing(false)
            router.push("/dashboard?enrolled=true")
          } catch (err) {
            setProcessing(false)
            // no enrollment on failure
            console.error(err)
          }
        },
        modal: {
          ondismiss: function () {
            setProcessing(false)
          },
        },
      }

      // @ts-ignore - Razorpay injected by script
      const rzp = new (window as any).Razorpay(options)
      rzp.open()
    } catch (e) {
      console.error(e)
      setProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Complete Your MBA Placement Enrollment</h1>
            <p className="text-xl text-muted-foreground">{courseInfo.shortDescription}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Course Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                    <img 
                      src={courseInfo.image} 
                      alt={courseInfo.title}
                      className="w-full sm:w-48 h-48 sm:h-48 object-cover rounded-xl flex-shrink-0 shadow-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-2xl sm:text-3xl leading-tight">{courseInfo.title}</CardTitle>
                      <CardDescription className="text-base sm:text-lg mt-2 leading-relaxed">{courseInfo.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-lg">
                      <span>Course Price</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">
                          {courseDataLoaded ? `₹${courseInfo.price}` : 'Loading...'}
                        </span>
                        {courseInfo.originalPrice && courseInfo.originalPrice > courseInfo.price && (
                          <span className="text-sm text-gray-500 line-through">₹{courseInfo.originalPrice}</span>
                        )}
                        {courseInfo.discount && (
                          <span className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded">
                            {courseInfo.discount}
                          </span>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleManualRefresh}
                          disabled={refreshing}
                          className="ml-2"
                        >
                          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                        </Button>
                      </div>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
                      <div>
                        <Clock className="h-6 w-6 mx-auto mb-2 text-accent" />
                        <div className="text-sm font-medium">{courseInfo.duration}</div>
                        <div className="text-xs text-muted-foreground">Content</div>
                      </div>
                      <div>
                        <Users className="h-6 w-6 mx-auto mb-2 text-accent" />
                        {/* <div className="text-sm font-medium">{courseInfo.students}</div> */}
                        <div className="text-sm font-medium">2,500+</div>
                        <div className="text-xs text-muted-foreground">Students</div>
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <Award className="h-6 w-6 mx-auto mb-2 text-accent" />
                        <div className="text-sm font-medium">{courseInfo.level}</div>
                        <div className="text-xs text-muted-foreground">Level</div>
                      </div>
                    </div>
                    <div className="pt-4 border-t">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Instructor:</span>
                          <span className="font-medium">{courseInfo.instructor}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Category:</span>
                          <span className="font-medium">{courseInfo.category}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>What's Included in Your MBA Placement Journey</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {courseInfo.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {courseInfo.modules && courseInfo.modules.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Placement Preparation Modules</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {courseInfo.modules.map((module, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <div>
                            <div className="font-medium text-sm">{module.title}</div>
                            <div className="text-xs text-muted-foreground">{module.lessons} • {module.duration}</div>
                          </div>
                          <div className="text-xs text-muted-foreground">{module.week}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

            </div>

            {/* Payment Summary and proceed */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>MBA Placement Course Summary</CardTitle>
                  <CardDescription>Secure checkout via Razorpay</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Course Price</span>
                      <span>{courseDataLoaded ? `₹${courseInfo.price}.00` : 'Loading...'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Tax</span>
                      <span>₹0.00</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>{courseDataLoaded ? `₹${courseInfo.price}.00` : 'Loading...'}</span>
                    </div>
                  </div>

                  <Button onClick={handleEnrollment} disabled={processing || !courseDataLoaded} className="w-full mt-2" size="lg">
                    {processing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Redirecting to Razorpay...
                      </>
                    ) : !courseDataLoaded ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading Course Details...
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Enroll Now - ₹{courseInfo.price}
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center mt-2">
                    You will be redirected to Razorpay to securely complete your payment.
                  </p>
                  <p className="text-xs text-muted-foreground text-center mt-1">
                    After payment, you'll be redirected to the dashboard. If you don't see your enrollment immediately, please refresh the page and log in again.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
