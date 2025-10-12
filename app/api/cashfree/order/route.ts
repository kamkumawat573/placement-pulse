import { Cashfree, CFEnvironment } from "cashfree-pg"
import type { NextRequest } from "next/server"
import { connectToDatabase } from '@/lib/mongodb'
import { CourseModel } from '@/lib/models/Course'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { amount, currency = "INR", courseId, customerDetails } = body || {}

    const appId = process.env.NEXT_PUBLIC_CASHFREE_APP_ID
    const secretKey = process.env.CASHFREE_SECRET_KEY
    const environment = process.env.CASHFREE_ENVIRONMENT || "sandbox"

    if (!appId || !secretKey) {
      return new Response(JSON.stringify({ error: "Missing CashFree credentials" }), { status: 500 })
    }

    // Initialize CashFree
    const cashfree = new Cashfree(
      environment === "production" ? CFEnvironment.PRODUCTION : CFEnvironment.SANDBOX,
      appId,
      secretKey
    )

    let finalAmount = 29900; // Default amount in paise (₹299)
    let courseTitle = "MBA Placement Mastery Program";

    // If courseId is provided, fetch the current price from database
    if (courseId) {
      try {
        await connectToDatabase();
        const course = await CourseModel.findById(courseId);
        if (course && course.isActive) {
          finalAmount = course.price; // Course price is already in paise
          courseTitle = course.title;
        }
      } catch (error) {
        console.error('Error fetching course price:', error);
        // Fall back to default amount if course fetch fails
      }
    } else if (typeof amount === "number") {
      finalAmount = amount;
    }

    // Generate unique order ID
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Create order request
    const orderRequest = {
      order_amount: finalAmount / 100, // Convert paise to rupees
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
      order_note: `Payment for ${courseTitle}`,
    }

    // Create order
    const response = await cashfree.PGCreateOrder(orderRequest)
    
    if (response.data && response.data.payment_session_id) {
      return new Response(JSON.stringify({
        order_id: orderId,
        payment_session_id: response.data.payment_session_id,
        order_amount: finalAmount,
        order_currency: currency,
        course_title: courseTitle
      }), { status: 200 })
    } else {
      throw new Error("Failed to create order")
    }
  } catch (err: any) {
    console.error('CashFree order creation error:', err)
    return new Response(JSON.stringify({ 
      error: err?.message || "Failed to create order",
      details: err?.response?.data || null
    }), { status: 500 })
  }
}
