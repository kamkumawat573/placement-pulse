import { Cashfree, CFEnvironment } from "cashfree-pg"
import type { NextRequest } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { PaymentModel } from "@/lib/models/Payment"
import crypto from "crypto"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { type, data } = body || {}

    // Verify webhook signature
    const signature = req.headers.get('x-webhook-signature')
    const secretKey = process.env.CASHFREE_SECRET_KEY
    
    if (!signature || !secretKey) {
      return new Response(JSON.stringify({ error: "Missing signature or secret key" }), { status: 400 })
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', secretKey)
      .update(JSON.stringify(body))
      .digest('hex')

    if (signature !== expectedSignature) {
      return new Response(JSON.stringify({ error: "Invalid signature" }), { status: 401 })
    }

    // Handle different webhook events
    if (type === 'PAYMENT_SUCCESS_WEBHOOK') {
      const { order, payment } = data
      
      if (order && payment) {
        await connectToDatabase()
        
        // Store payment details
        await PaymentModel.create({
          email: order.customer_details?.customer_email || "unknown@example.com",
          orderId: order.order_id,
          paymentId: payment.cf_payment_id,
          signature: signature,
          amount: Math.round(parseFloat(order.order_amount) * 100), // Convert to paise
          currency: order.order_currency,
          status: "PAID", // Use consistent successful status
          method: payment.payment_method,
          notes: {
            course: order.order_note,
            customer_name: order.customer_details?.customer_name,
            customer_phone: order.customer_details?.customer_phone,
            original_status: payment.payment_status
          },
          raw: { order, payment },
          createdAt: new Date(payment.payment_time || Date.now())
        })
      }
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (err: any) {
    console.error('CashFree webhook error:', err)
    return new Response(JSON.stringify({ 
      error: err?.message || "Webhook processing failed" 
    }), { status: 500 })
  }
}
