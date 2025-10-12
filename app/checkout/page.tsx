"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { useAuth } from "@/contexts/auth-context"
import { ShoppingCart, Trash2 } from "lucide-react"

interface Course {
  id: string
  title?: string
  price?: number
  image?: string
  coverImage?: string
  imageUrl?: string
  isActive?: boolean
}

export default function CheckoutPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [courseIds, setCourseIds] = useState<string[]>([])
  const [allCourses, setAllCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)

  // Load cart + courses
  useEffect(() => {
    // Wait for auth loading to complete
    if (authLoading) {
      return
    }

    // Check for user with fallback to localStorage
    let currentUser = user
    if (!currentUser) {
      try {
        const userStr = localStorage.getItem('user')
        if (userStr) {
          currentUser = JSON.parse(userStr)
        }
      } catch (e) {
        console.warn('Failed to parse user from localStorage:', e)
      }
    }

    // Redirect to login if not authenticated
    if (!currentUser) {
      router.push('/auth')
      return
    }

    const raw = typeof window !== 'undefined' ? localStorage.getItem('cartCourseIds') : null
    setCourseIds(raw ? JSON.parse(raw) : [])

    const fetchCourses = async () => {
      try {
        const res = await fetch('/api/courses', { cache: 'no-store', headers: { 'Cache-Control': 'no-cache' } })
        const data = await res.json()
        setAllCourses(Array.isArray(data.courses) ? data.courses : [])
      } catch (e) {
        setAllCourses([])
      } finally {
        setLoading(false)
      }
    }
    fetchCourses()

    // Load CashFree script
    const script = document.createElement('script')
    script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js'
    script.async = true
    document.body.appendChild(script)
    return () => {
      script.remove()
    }
  }, [user, router, authLoading])

  const items = useMemo(() => {
    const set = new Set(courseIds.map(String))
    return allCourses.filter(c => set.has(String(c.id)))
  }, [courseIds, allCourses])

  const totalPaise = useMemo(() => items.reduce((sum, c) => sum + (Number(c.price) || 0), 0), [items])
  const totalDisplay = useMemo(() => (totalPaise / 100).toFixed(0), [totalPaise])

  const removeItem = (id: string) => {
    const next = courseIds.filter(x => String(x) !== String(id))
    setCourseIds(next)
    if (typeof window !== 'undefined') {
      localStorage.setItem('cartCourseIds', JSON.stringify(next))
      window.dispatchEvent(new Event('cartUpdated'))
    }
  }

  const clearCart = () => {
    setCourseIds([])
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cartCourseIds')
      window.dispatchEvent(new Event('cartUpdated'))
    }
  }

  const handlePayAndEnroll = async () => {
    // Get current user with fallback
    let currentUser = user
    if (!currentUser) {
      try {
        const userStr = localStorage.getItem('user')
        if (userStr) {
          currentUser = JSON.parse(userStr)
        }
      } catch (e) {
        console.warn('Failed to parse user from localStorage:', e)
      }
    }

    if (!currentUser) {
      router.push('/auth')
      return
    }
    if (items.length === 0) return

    try {
      setProcessing(true)

      // Create order with CashFree
      const orderRes = await fetch('/api/cashfree/order-bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseIds: items.map(c => c.id),
          currency: 'INR',
          customerDetails: {
            customer_id: currentUser.id || `user_${Date.now()}`,
            customer_name: currentUser.name || 'Customer',
            customer_email: currentUser.email,
            customer_phone: currentUser.mobile || '9999999999'
          }
        }),
      })
      if (!orderRes.ok) throw new Error('Failed to create order')
      const order = await orderRes.json()

      // Store courseIds and order info in localStorage for auto-enrollment after payment
      const enrollmentData = {
        courseIds: items.map(c => c.id),
        orderId: order.order_id,
        timestamp: Date.now(),
        user: { id: currentUser.id, email: currentUser.email, name: currentUser.name }
      }
      localStorage.setItem('lastCourseIds', JSON.stringify(items.map(c => c.id)))
      localStorage.setItem('pendingEnrollment', JSON.stringify(enrollmentData))

      // Initialize CashFree
      const cashfree = (window as any).Cashfree({
        mode: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox'
      })

      // Open CashFree checkout
      cashfree.checkout({
        paymentSessionId: order.payment_session_id,
        redirectTarget: "_self"
      }).then(async (result: any) => {
        console.log('Payment completed, result:', result)
        // Don't try to enroll immediately - let the success page handle it
        // This prevents race conditions with payment processing
        setProcessing(false)
        router.push('/payment/success?order_id=' + order.order_id)
      }).catch((error: any) => {
        console.error('Payment error:', error)
        setProcessing(false)
        // Clean up on payment failure
        localStorage.removeItem('pendingEnrollment')
      })
    } catch (e) {
      console.error('Order creation error:', e)
      setProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <div className="container mx-auto px-4 py-24">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" /> Cart ({courseIds.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div>Loading...</div>
            ) : items.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-600">Your cart is empty.</p>
                <div className="mt-4">
                  <Link href="/courses">
                    <Button>Browse Courses</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((c) => (
                  <div key={c.id} className="flex items-center justify-between border rounded p-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={c.image || c.coverImage || c.imageUrl || '/placeholder.png'}
                        alt={c.title || ''}
                        className="w-14 h-14 object-cover rounded"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                      />
                      <div>
                        <div className="font-medium">{c.title}</div>
                        <div className="text-sm text-gray-600">₹{((Number(c.price)||0)/100).toFixed(0)}</div>
                      </div>
                    </div>
                    <Button variant="ghost" onClick={() => removeItem(c.id)} aria-label="Remove from cart">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <div className="flex items-center justify-between border-t pt-4 mt-2">
                  <div className="text-lg font-semibold">Total</div>
                  <div className="text-xl font-bold">₹{totalDisplay}</div>
                </div>

                <div className="flex items-center justify-end gap-2">
                  <Button variant="outline" onClick={clearCart} disabled={processing}>Clear</Button>
                  {/* <Button onClick={handlePayAndEnroll} disabled={processing || items.length === 0}>
                    {processing ? 'Processing...' : `Pay & Enroll (${items.length})`}
                  </Button> */}
                  <Button onClick={handlePayAndEnroll} disabled={processing || items.length === 0}>
                    {processing ? 'Processing...' : `Pay & Enroll (${items.length})`}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
