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
  const { user } = useAuth()
  const router = useRouter()
  const [courseIds, setCourseIds] = useState<string[]>([])
  const [allCourses, setAllCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)

  // Load cart + courses
  useEffect(() => {
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

    // Load Razorpay script
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)
    return () => {
      script.remove()
    }
  }, [])

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
    if (!user) {
      router.push('/auth')
      return
    }
    if (items.length === 0) return

    try {
      setProcessing(true)

      const orderRes = await fetch('/api/razorpay/order-bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseIds: items.map(c => c.id), currency: 'INR' }),
      })
      if (!orderRes.ok) throw new Error('Failed to create order')
      const order = await orderRes.json()

      const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
      if (!key) throw new Error('Missing Razorpay public key')

      const options: any = {
        key,
        amount: order.amount,
        currency: order.currency,
        name: 'Placement Pulse',
        description: `Enroll in ${items.length} course(s)`,
        order_id: order.id,
        prefill: { name: user.name || '', email: user.email },
        theme: { color: '#4f46e5' },
        handler: async function (response: any) {
          try {
            const enrollRes = await fetch('/api/enroll/multi-course', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                user: { id: user.id, email: user.email, name: user.name },
                courseIds: items.map(c => c.id),
                verification: {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                },
              }),
            })
            const data = await enrollRes.json()
            if (!enrollRes.ok || !data.success) throw new Error(data.error || 'Verification failed')

            // Update local user cache if returned
            if (data.user) {
              localStorage.setItem('user', JSON.stringify(data.user))
            }
            clearCart()
            setProcessing(false)
            router.push('/dashboard?enrolled=true')
          } catch (err) {
            console.error(err)
            setProcessing(false)
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
