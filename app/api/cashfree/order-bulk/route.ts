import { getCashfree } from '@/lib/cashfree'
import type { NextRequest } from "next/server"
import { connectToDatabase } from '@/lib/mongodb'
import { CourseModel } from '@/lib/models/Course'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { courseIds, currency = "INR", customerDetails } = body || {}

    if (!courseIds || !Array.isArray(courseIds) || courseIds.length === 0) {
      return new Response(JSON.stringify({ error: "Missing or invalid course IDs" }), { status: 400 })
    }

    const appId = process.env.NEXT_PUBLIC_CASHFREE_APP_ID
    const secretKey = process.env.CASHFREE_SECRET_KEY
    const environment = process.env.CASHFREE_ENVIRONMENT || "sandbox"

    if (!appId || !secretKey) {
      return new Response(JSON.stringify({ error: "Missing CashFree credentials" }), { status: 500 })
    }

    const cashfree = getCashfree()

    await connectToDatabase()
    const courses = await CourseModel.find({ _id: { $in: courseIds }, isActive: true })

    if (!courses || courses.length === 0) {
      return new Response(JSON.stringify({ error: "No active courses found for provided IDs" }), { status: 404 })
    }

    const totalAmount = courses.reduce((sum: number, c: any) => sum + (Number(c.price) || 0), 0)
    const courseTitles = courses.map((c: any) => c.title).join(", ")

    // Generate unique order ID
    const orderId = `bulk_order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Create order request
    const orderRequest = {
      // Cashfree SDK expects order_amount as number (rupees)
      order_amount: totalAmount / 100,
      order_currency: currency,
      order_id: orderId,
      customer_details: {
        customer_id: customerDetails?.customer_id || `customer_${Date.now()}`,
        customer_name: customerDetails?.customer_name || "Customer",
        customer_email: customerDetails?.customer_email || "customer@example.com",
        customer_phone: customerDetails?.customer_phone || "9999999999",
      },
      order_meta: {
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment/success?order_id=${orderId}`,
        notify_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/cashfree/webhook`,
      },
      order_note: `Payment for ${courses.length} course(s): ${courseTitles}`,
    }

    // Create order
    const response = await cashfree.PGCreateOrder(orderRequest)

    if (response.data && (response.data as any).payment_session_id) {
      return new Response(JSON.stringify({
        order_id: orderId,
        payment_session_id: (response.data as any).payment_session_id,
        order_amount: totalAmount,
        order_currency: currency,
        course_count: courses.length,
        course_titles: courseTitles
      }), { status: 200 })
    } else {
      throw new Error("Failed to create bulk order")
    }
  } catch (err: any) {
    console.error('CashFree bulk order creation error:', err)
    return new Response(JSON.stringify({ 
      error: err?.message || "Failed to create bulk order",
      details: err?.response?.data || null
    }), { status: 500 })
  }
}
