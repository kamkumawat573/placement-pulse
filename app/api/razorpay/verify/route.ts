import crypto from "crypto"
import type { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json()

    const keySecret = process.env.RAZORPAY_KEY_SECRET
    if (!keySecret) {
      return new Response(JSON.stringify({ error: "Missing Razorpay key secret" }), { status: 500 })
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return new Response(JSON.stringify({ error: "Invalid payload" }), { status: 400 })
    }

    const hmac = crypto.createHmac("sha256", keySecret)
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`)
    const digest = hmac.digest("hex")

    const isValid = digest === razorpay_signature
    if (!isValid) {
      return new Response(JSON.stringify({ success: false }), { status: 200 })
    }
    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || "Failed to verify payment" }), { status: 500 })
  }
}


