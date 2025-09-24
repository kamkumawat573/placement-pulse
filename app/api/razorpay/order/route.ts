import Razorpay from "razorpay"
import type { NextRequest } from "next/server"
import { connectToDatabase } from '@/lib/mongodb'
import { CourseModel } from '@/lib/models/Course'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { amount, currency = "INR", receipt, courseId } = body || {}

    const keyId = process.env.RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET
    if (!keyId || !keySecret) {
      return new Response(JSON.stringify({ error: "Missing Razorpay credentials" }), { status: 500 })
    }

    let finalAmount = 29900; // Default amount in paise
    let courseTitle = "Modern Web Development";

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

    const instance = new Razorpay({ key_id: keyId, key_secret: keySecret })
    const order = await instance.orders.create({
      amount: finalAmount,
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
      notes: { course: courseTitle, courseId: courseId || null },
    })

    return new Response(JSON.stringify(order), { status: 200 })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || "Failed to create order" }), { status: 500 })
  }
}


