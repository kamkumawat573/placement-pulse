import { getCashfree } from '@/lib/cashfree'
import type { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { order_id } = await req.json()

    if (!order_id) {
      return new Response(JSON.stringify({ error: "Missing order ID" }), { status: 400 })
    }

    const appId = process.env.NEXT_PUBLIC_CASHFREE_APP_ID
    const secretKey = process.env.CASHFREE_SECRET_KEY
    const environment = process.env.CASHFREE_ENVIRONMENT || "sandbox"

    if (!appId || !secretKey) {
      return new Response(JSON.stringify({ error: "Missing CashFree credentials" }), { status: 500 })
    }

    // Get singleton CashFree client
    const cashfree = getCashfree()

    // Fetch order details
    const response = await cashfree.PGFetchOrder(order_id)

    if (response.data) {
      const orderData: any = response.data
      const isPaid = orderData.order_status === "PAID"

      return new Response(JSON.stringify({
        success: isPaid,
        order_status: orderData.order_status,
        payment_status: orderData.payment_status,
        order_amount: orderData.order_amount,
        order_currency: orderData.order_currency,
        order_id: orderData.order_id,
        payment_details: orderData.payment_details || null,
      }), { status: 200 })
    } else {
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Order not found" 
      }), { status: 404 })
    }
  } catch (err: any) {
    console.error('CashFree verification error:', err)
    return new Response(JSON.stringify({ 
      success: false,
      error: err?.message || "Failed to verify payment",
      details: err?.response?.data || null
    }), { status: 500 })
  }
}
