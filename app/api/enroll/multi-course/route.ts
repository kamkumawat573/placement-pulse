import type { NextRequest } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { UserModel } from "@/lib/models/User"
import { PaymentModel } from "@/lib/models/Payment"
import { CourseModel } from "@/lib/models/Course"
import Razorpay from "razorpay"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { user, verification, courseIds } = body || {}

    if (!user?.email) {
      return new Response(JSON.stringify({ error: "Missing user email" }), { status: 400 })
    }

    if (!courseIds || !Array.isArray(courseIds) || courseIds.length === 0) {
      return new Response(JSON.stringify({ error: "Missing or invalid course IDs" }), { status: 400 })
    }

    if (!verification?.razorpay_order_id || !verification?.razorpay_payment_id || !verification?.razorpay_signature) {
      return new Response(JSON.stringify({ error: "Missing payment verification" }), { status: 400 })
    }

    // Verify payment signature
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

    // Verify all courses exist and are active
    await connectToDatabase()
    const courses = await CourseModel.find({ 
      _id: { $in: courseIds }, 
      isActive: true 
    })
    
    if (courses.length !== courseIds.length) {
      return new Response(JSON.stringify({ error: "One or more courses not found or inactive" }), { status: 400 })
    }

    // Check if user is already enrolled in any of these courses
    const existingUser = await UserModel.findOne(
      user.id ? { _id: user.id } : { email: user.email }
    )
    
    if (existingUser) {
      const alreadyEnrolled = existingUser.enrolledCourses?.some(
        (enrollment: any) => courseIds.includes(enrollment.courseId.toString())
      )
      if (alreadyEnrolled) {
        return new Response(JSON.stringify({ error: "User already enrolled in one or more of these courses" }), { status: 409 })
      }
    }

    // Fetch payment details from Razorpay
    let fetchedPayment: any = null
    try {
      const keyId = process.env.RAZORPAY_KEY_ID
      const keySecret = process.env.RAZORPAY_KEY_SECRET
      if (keyId && keySecret && verification?.razorpay_payment_id) {
        const rzp = new Razorpay({ key_id: keyId, key_secret: keySecret })
        const payment = await rzp.payments.fetch(verification.razorpay_payment_id)
        fetchedPayment = payment
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

    // Create enrollment data for all courses
    const enrollmentData = courseIds.map(courseId => ({
      courseId: courseId,
      enrolledAt: new Date(),
      progress: 0,
      transactionId: fetchedPayment?.id || verification?.razorpay_payment_id || null,
      paymentId: verification?.razorpay_payment_id,
      orderId: verification?.razorpay_order_id,
      status: 'active'
    }))

    // Update user with all course enrollments
    const query = user.id ? { _id: user.id } : { email: user.email }
    const updated = await UserModel.findOneAndUpdate(
      query,
      {
        $set: {
          name: user.name,
          // Keep backward compatibility
          enrolledCourse: true,
          progress: 0,
          transactionId: fetchedPayment?.id || verification?.razorpay_payment_id || null,
        },
        $push: {
          enrolledCourses: { $each: enrollmentData }
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
          enrolledCourses: updated.enrolledCourses || [],
          progress: updated.progress,
          transactionId: updated.transactionId ?? null,
        },
        enrolledCourses: courses.map(course => ({
          id: course._id.toString(),
          title: course.title,
          enrolledAt: new Date()
        }))
      }),
      { status: 200 }
    )
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || "Failed to enroll in courses" }), { status: 500 })
  }
}