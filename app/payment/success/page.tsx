"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Navigation from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order_id')
  const { user, loading: authLoading } = useAuth()

  const [paymentStatus, setPaymentStatus] = useState<'loading' | 'success' | 'failed'>('loading')
  const [paymentDetails, setPaymentDetails] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [enrollmentStatus, setEnrollmentStatus] = useState<'pending' | 'success' | 'failed' | 'retrying'>('pending')
  const [enrollmentError, setEnrollmentError] = useState<string | null>(null)

  const handleAutoEnrollment = async (orderId: string, retryCount = 0) => {
    const maxRetries = 3
    const retryDelay = 2000 // 2 seconds

    try {
      // Check if user is authenticated, with fallback to localStorage
      let currentUser = user

      if (!currentUser) {
        // Fallback: try to get user from localStorage
        try {
          const userStr = localStorage.getItem('user')
          if (userStr) {
            currentUser = JSON.parse(userStr)
            console.log('Using fallback user from localStorage:', { id: currentUser?.id, email: currentUser?.email })
          }
        } catch (e) {
          console.warn('Failed to parse user from localStorage:', e)
        }
      }

      if (!currentUser) {
        console.error('No authenticated user found')
        return { success: false, error: 'No authenticated user found. Please log in and try again.' }
      }

      console.log('Starting enrollment for user:', { id: currentUser.id, email: currentUser.email, name: currentUser.name })

      // First try to get enrollment data from pendingEnrollment
      const pendingEnrollmentStr = localStorage.getItem('pendingEnrollment')
      let courseIds: string[] = []
      let courseId: string | null = null

      if (pendingEnrollmentStr) {
        try {
          const pendingData = JSON.parse(pendingEnrollmentStr)
          if (pendingData.orderId === orderId && pendingData.courseIds) {
            courseIds = pendingData.courseIds
          }
        } catch (e) {
          console.warn('Failed to parse pending enrollment data:', e)
        }
      }

      // Fallback to other sources
      if (courseIds.length === 0) {
        const courseIdsStr = localStorage.getItem('lastCourseIds')
        courseId = searchParams.get('courseId') || localStorage.getItem('lastCourseId')

        if (courseIdsStr) {
          try {
            courseIds = JSON.parse(courseIdsStr)
          } catch (e) {
            console.warn('Failed to parse lastCourseIds:', e)
          }
        }
      }

      let enrollRes

      if (courseIds.length > 0) {
        // Multi-course enrollment
        console.log('Attempting multi-course enrollment for:', courseIds)
        enrollRes = await fetch('/api/enroll/multi-course', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user: { id: currentUser.id, email: currentUser.email, name: currentUser.name },
            courseIds: courseIds,
            verification: {
              order_id: orderId,
            },
          }),
        })
      } else if (courseId) {
        // Single course enrollment
        console.log('Attempting single course enrollment for:', courseId)
        enrollRes = await fetch('/api/enroll', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user: { id: currentUser.id, email: currentUser.email, name: currentUser.name },
            courseId: courseId,
            verification: {
              order_id: orderId,
            },
          }),
        })
      } else {
        console.error('No courseId or courseIds found for enrollment')
        return { success: false, error: 'No courses found for enrollment' }
      }

      const data = await enrollRes.json()

      if (enrollRes.ok && data.success) {
        // Update user in localStorage
        localStorage.setItem('user', JSON.stringify(data.user))
        // Clean up stored course IDs
        localStorage.removeItem('lastCourseId')
        localStorage.removeItem('lastCourseIds')
        localStorage.removeItem('pendingEnrollment')
        // Clear cart for multi-course purchases
        if (courseIds.length > 0) {
          localStorage.removeItem('cartCourseIds')
          window.dispatchEvent(new Event('cartUpdated'))
        }
        console.log('User enrolled successfully')
        return { success: true, data }
      } else {
        console.error('Enrollment failed:', data.error)

        // Retry logic for certain errors
        if (retryCount < maxRetries && (
          data.error?.includes('verification') ||
          data.error?.includes('Payment') ||
          enrollRes.status >= 500
        )) {
          console.log(`Retrying enrollment in ${retryDelay}ms (attempt ${retryCount + 1}/${maxRetries})`)
          await new Promise(resolve => setTimeout(resolve, retryDelay))
          return await handleAutoEnrollment(orderId, retryCount + 1)
        }

        return { success: false, error: data.error }
      }
    } catch (err: any) {
      console.error('Auto-enrollment error:', err)

      // Retry on network errors
      if (retryCount < maxRetries && (
        err.name === 'TypeError' ||
        err.message?.includes('fetch') ||
        err.message?.includes('network')
      )) {
        console.log(`Retrying enrollment in ${retryDelay}ms (attempt ${retryCount + 1}/${maxRetries})`)
        await new Promise(resolve => setTimeout(resolve, retryDelay))
        return await handleAutoEnrollment(orderId, retryCount + 1)
      }

      return { success: false, error: err.message || 'Unknown error' }
    }
  }

  useEffect(() => {
    if (!orderId) {
      setError("No order ID provided")
      setPaymentStatus('failed')
      return
    }

    // Wait for authentication to complete
    if (authLoading) {
      return
    }

    // Check if user is authenticated, with fallback to localStorage
    let hasUser = !!user
    if (!hasUser) {
      try {
        const userStr = localStorage.getItem('user')
        hasUser = !!userStr && !!JSON.parse(userStr)
      } catch (e) {
        hasUser = false
      }
    }

    if (!hasUser) {
      setError("Please log in to view payment status")
      setPaymentStatus('failed')
      setEnrollmentStatus('failed')
      setEnrollmentError('User not authenticated')
      return
    }

    // Verify payment status and handle enrollment
    const verifyPaymentAndEnroll = async () => {
      try {
        console.log('Starting payment verification for order:', orderId)
        setEnrollmentStatus('pending')

        // First verify payment status
        const response = await fetch('/api/cashfree/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order_id: orderId })
        })

        const data = await response.json()
        console.log('Payment verification response:', data)

        if (data.success) {
          setPaymentStatus('success')
          setPaymentDetails(data)

          // Auto-enroll user in course after successful payment
          console.log('Payment verified successfully, starting enrollment...')
          setEnrollmentStatus('retrying')
          const enrollmentResult = await handleAutoEnrollment(orderId)

          if (enrollmentResult.success) {
            console.log('Enrollment successful!')
            setEnrollmentStatus('success')
            setEnrollmentError(null)
          } else {
            console.error('Enrollment failed:', enrollmentResult.error)
            setEnrollmentStatus('failed')
            setEnrollmentError(enrollmentResult.error || 'Enrollment failed')
          }
        } else {
          console.error('Payment verification failed:', data.error)
          setPaymentStatus('failed')
          setError(data.error || 'Payment verification failed')
          setEnrollmentStatus('failed')
          setEnrollmentError('Payment verification failed')
        }
      } catch (err: any) {
        console.error('Payment verification error:', err)
        setPaymentStatus('failed')
        setError('Failed to verify payment')
        setEnrollmentStatus('failed')
        setEnrollmentError(err.message || 'Failed to verify payment')
      }
    }

    verifyPaymentAndEnroll()
  }, [orderId, authLoading, user])

  const handleContinue = () => {
    router.push('/dashboard?enrolled=true')
  }

  const handleRefreshAuth = async () => {
    try {
      const res = await fetch("/api/auth/me", {
        cache: "no-store",
        headers: { 'Cache-Control': 'no-cache' }
      })
      const data = await res.json()
      if (data?.user) {
        localStorage.setItem("user", JSON.stringify(data.user))
        // Trigger a page reload to refresh the auth context
        window.location.reload()
      } else {
        // If still no user, redirect to login
        router.push('/auth')
      }
    } catch (e) {
      console.error('Failed to refresh auth:', e)
      router.push('/auth')
    }
  }

  const handleRetryEnrollment = async () => {
    if (!orderId) return

    setEnrollmentStatus('retrying')
    setEnrollmentError(null)

    // Try to refresh auth state first
    try {
      const res = await fetch("/api/auth/me", {
        cache: "no-store",
        headers: { 'Cache-Control': 'no-cache' }
      })
      const data = await res.json()
      if (data?.user) {
        localStorage.setItem("user", JSON.stringify(data.user))
      }
    } catch (e) {
      console.warn('Failed to refresh auth state:', e)
    }

    const enrollmentResult = await handleAutoEnrollment(orderId)

    if (enrollmentResult.success) {
      setEnrollmentStatus('success')
      setEnrollmentError(null)
    } else {
      setEnrollmentStatus('failed')
      setEnrollmentError(enrollmentResult.error || 'Enrollment failed')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              {(paymentStatus === 'loading' || authLoading) && (
                <>
                  <Loader2 className="h-16 w-16 text-blue-500 animate-spin mx-auto mb-4" />
                  <CardTitle className="text-2xl">
                    {authLoading ? 'Loading...' : 'Verifying Payment'}
                  </CardTitle>
                  <CardDescription>
                    {authLoading
                      ? 'Please wait while we load your account...'
                      : 'Please wait while we verify your payment...'
                    }
                  </CardDescription>
                </>
              )}
              
              {paymentStatus === 'success' && (
                <>
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <CardTitle className="text-2xl text-green-600">Payment Successful!</CardTitle>
                  <CardDescription>
                    {enrollmentStatus === 'success' && "Your payment has been processed and you have been enrolled in your course(s) successfully!"}
                    {enrollmentStatus === 'retrying' && "Your payment was successful. We're enrolling you in your course(s)..."}
                    {enrollmentStatus === 'failed' && "Your payment was successful, but there was an issue with enrollment. Please try again or contact support."}
                    {enrollmentStatus === 'pending' && "Your payment has been processed successfully. Processing enrollment..."}
                  </CardDescription>
                  {enrollmentStatus === 'retrying' && (
                    <div className="flex items-center justify-center mt-2">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <span className="text-sm">Enrolling...</span>
                    </div>
                  )}
                  {enrollmentStatus === 'failed' && enrollmentError && (
                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
                      Error: {enrollmentError}
                    </div>
                  )}
                </>
              )}
              
              {paymentStatus === 'failed' && (
                <>
                  <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                  <CardTitle className="text-2xl text-red-600">Payment Failed</CardTitle>
                  <CardDescription>
                    {error || "There was an issue processing your payment."}
                  </CardDescription>
                </>
              )}
            </CardHeader>
            
            {paymentDetails && (
              <CardContent className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Payment Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Order ID:</span>
                      <span className="font-mono">{paymentDetails.order_id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Amount:</span>
                      <span>₹{paymentDetails.order_amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className="capitalize">{paymentDetails.order_status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment Status:</span>
                      <span className="capitalize">{paymentDetails.payment_status}</span>
                    </div>
                  </div>
                </div>
                
                 <div className="text-center space-y-2">
                   {enrollmentStatus === 'success' && (
                     <Button onClick={handleContinue} className="w-full">
                       Continue to Dashboard
                     </Button>
                   )}
                   {enrollmentStatus === 'failed' && (
                     <>
                       <Button onClick={handleRetryEnrollment} className="w-full">
                         Retry Enrollment
                       </Button>
                       <Button onClick={handleContinue} variant="outline" className="w-full">
                         Continue to Dashboard
                       </Button>
                     </>
                   )}
                   {(enrollmentStatus === 'pending' || enrollmentStatus === 'retrying') && (
                     <Button onClick={handleContinue} variant="outline" className="w-full">
                       Continue to Dashboard
                     </Button>
                   )}
                   <Button
                     onClick={() => window.location.reload()}
                     variant="outline"
                     className="w-full"
                   >
                     Refresh Page
                   </Button>
                 </div>
              </CardContent>
            )}
            
            {paymentStatus === 'failed' && (
              <CardContent className="text-center space-y-2">
                {!user && (
                  <>
                    <Button
                      onClick={handleRefreshAuth}
                      className="w-full"
                    >
                      Refresh Authentication
                    </Button>
                    <Button
                      onClick={() => router.push('/auth')}
                      variant="outline"
                      className="w-full"
                    >
                      Login to Continue
                    </Button>
                  </>
                )}
                <Button
                  onClick={() => router.push('/courses')}
                  variant="outline"
                  className="w-full"
                >
                  {!user ? 'Browse Courses' : 'Try Again'}
                </Button>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
