import Razorpay from "razorpay"
import type { NextRequest } from "next/server"
import { connectToDatabase } from '@/lib/mongodb'
import { CourseModel } from '@/lib/models/Course'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { courseIds, currency = "INR" } = body || {}

    if (!courseIds || !Array.isArray(courseIds) || courseIds.length === 0) {
      return new Response(JSON.stringify({ error: "Missing or invalid course IDs" }), { status: 400 })
    }

    const keyId = process.env.RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET
    if (!keyId || !keySecret) {
      return new Response(JSON.stringify({ error: "Missing Razorpay credentials" }), { status: 500 })
    }

    await connectToDatabase()
    const courses = await CourseModel.find({ _id: { $in: courseIds }, isActive: true })

    if (!courses || courses.length === 0) {
      return new Response(JSON.stringify({ error: "No active courses found for provided IDs" }), { status: 404 })
    }

    const totalAmount = courses.reduce((sum: number, c: any) => sum + (Number(c.price) || 0), 0)

    const instance = new Razorpay({ key_id: keyId, key_secret: keySecret })
    const order = await instance.orders.create({
      amount: totalAmount,
      currency,
      receipt: `rcpt_${Date.now()}`,
      notes: {
        courseIds: courses.map((c: any) => String(c._id)),
        count: courses.length,
      },
    })

    return new Response(JSON.stringify(order), { status: 200 })
  } catch (err: any) {
    console.error('Bulk order creation failed:', err)
    return new Response(JSON.stringify({ error: err?.message || "Failed to create bulk order" }), { status: 500 })
  }
}

