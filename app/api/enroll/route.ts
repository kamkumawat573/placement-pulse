import type { NextRequest } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { UserModel } from "@/lib/models/User"
import { PaymentModel } from "@/lib/models/Payment"
import Razorpay from "razorpay"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { user, verification } = body || {}

    if (!user?.email) {
      return new Response(JSON.stringify({ error: "Missing user email" }), { status: 400 })
    }

    if (!verification?.razorpay_order_id || !verification?.razorpay_payment_id || !verification?.razorpay_signature) {
      return new Response(JSON.stringify({ error: "Missing payment verification" }), { status: 400 })
    }

    // Reuse the verify endpoint logic inline to enforce server-side verification before enrollment
    const keySecret = process.env.RAZORPAY_KEY_SECRET
    if (!keySecret) {
      return new Response(JSON.stringify({ error: "Missing Razorpay config" }), { status: 500 })
    }

    const crypto = await import("crypto")
    const hmac = crypto.createHmac("sha256", keySecret)
    hmac.update(`${verification.razorpay_order_id}|${verification.razorpay_payment_id}`)
    const digest = hmac.digest("hex")
    const isValid = digest === verification.razorpay_signature
    if (!isValid) {
      return new Response(JSON.stringify({ error: "Payment verification failed" }), { status: 400 })
    }

    // Optionally fetch payment details from Razorpay to store more info
    let fetchedPayment: any = null
    try {
      const keyId = process.env.RAZORPAY_KEY_ID
      const keySecret = process.env.RAZORPAY_KEY_SECRET
      if (keyId && keySecret && verification?.razorpay_payment_id) {
        const rzp = new Razorpay({ key_id: keyId, key_secret: keySecret })
        const payment = await rzp.payments.fetch(verification.razorpay_payment_id)
        fetchedPayment = payment
        await connectToDatabase()
        await PaymentModel.create({
          email: user.email,
          orderId: verification.razorpay_order_id,
          paymentId: verification.razorpay_payment_id,
          signature: verification.razorpay_signature,
          amount: payment.amount,
          currency: payment.currency,
          status: payment.status,
          method: payment.method,
          notes: payment.notes,
          raw: payment,
        })
      }
    } catch {
      // ignore payment fetch failure, continue enrollment if signature valid
    }

    // Upsert in Mongo and mark enrolled
    await connectToDatabase()
    const query = user.id ? { _id: user.id } : { email: user.email }
    const updated = await UserModel.findOneAndUpdate(
      query,
      {
        $set: {
          name: user.name,
          enrolledCourse: true,
          progress: 0,
          transactionId: fetchedPayment?.id || verification?.razorpay_payment_id || null,
        },
        $setOnInsert: {
          passwordHash: "", // placeholder if user somehow didn't sign up; ideally enrollment requires login
        },
      },
      { new: true, upsert: true }
    )

    // Backfill userId on payment (if created)
    try {
      await PaymentModel.updateMany(
        { email: user.email, userId: { $exists: false } },
        { $set: { userId: updated._id } }
      )
    } catch {}

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: updated._id.toString(),
          email: updated.email,
          name: updated.name,
          enrolledCourse: updated.enrolledCourse,
          progress: updated.progress,
          transactionId: updated.transactionId ?? null,
        },
      }),
      { status: 200 }
    )
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || "Failed to enroll" }), { status: 500 })
  }
}


