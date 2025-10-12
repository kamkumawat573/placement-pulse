import type { NextRequest } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { UserModel } from "@/lib/models/User"
import { PaymentModel } from "@/lib/models/Payment"
import { CourseModel } from "@/lib/models/Course"
import mongoose from 'mongoose'
import { getCashfree } from '@/lib/cashfree'

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

    if (!verification?.order_id) {
      return new Response(JSON.stringify({ error: "Missing payment verification" }), { status: 400 })
    }

    // Verify payment with CashFree
    const appId = process.env.NEXT_PUBLIC_CASHFREE_APP_ID
    const secretKey = process.env.CASHFREE_SECRET_KEY
    const environment = process.env.CASHFREE_ENVIRONMENT || "sandbox"

    if (!appId || !secretKey) {
      return new Response(JSON.stringify({ error: "Missing CashFree config" }), { status: 500 })
    }

    const cashfree = getCashfree()

    // Verify payment status
    let verifyData: any = null
    try {
      const verifyResponse = await cashfree.PGFetchOrder(verification.order_id)
      verifyData = verifyResponse.data

      if (!verifyData) {
        return new Response(JSON.stringify({ error: "Payment order not found" }), { status: 400 })
      }

      // Allow both PAID and SUCCESS status for compatibility
      if (verifyData.order_status !== "PAID" && verifyData.order_status !== "SUCCESS") {
        return new Response(JSON.stringify({
          error: `Payment not completed. Status: ${verifyData.order_status}`,
          order_status: verifyData.order_status,
          payment_status: verifyData.payment_status
        }), { status: 400 })
      }
    } catch (verifyError: any) {
      console.error('Payment verification error:', verifyError)
      return new Response(JSON.stringify({
        error: "Failed to verify payment with payment gateway",
        details: verifyError.message
      }), { status: 500 })
    }

    // Verify all courses exist and are active
    await connectToDatabase()

    // Validate and convert courseIds to ObjectId
    if (!Array.isArray(courseIds) || courseIds.length === 0) {
      return new Response(JSON.stringify({ error: 'Missing course IDs' }), { status: 400 })
    }

    const invalidId = (courseIds || []).find((id: any) => !mongoose.isValidObjectId(String(id)))
    if (invalidId) {
      return new Response(JSON.stringify({ error: `Invalid course ID: ${invalidId}` }), { status: 400 })
    }

    const courseObjectIds = courseIds.map((id: any) => new mongoose.Types.ObjectId(String(id)))

    const courses = await CourseModel.find({
      _id: { $in: courseObjectIds },
      isActive: true,
    })

    if (!courses || courses.length !== courseIds.length) {
      return new Response(JSON.stringify({ error: 'One or more courses not found or inactive' }), { status: 400 })
    }

    // Check if user is already enrolled in any of these courses
    const existingUser = await UserModel.findOne(
      user.id ? { _id: user.id } : { email: user.email }
    )
    
    if (existingUser) {
      // Filter out courses user is already enrolled in
      const enrolledCourseIds = existingUser.enrolledCourses?.map(
        (enrollment: any) => enrollment.courseId.toString()
      ) || []
      
      const newCourseIds = courseIds.filter(
        (courseId: string) => !enrolledCourseIds.includes(courseId)
      )
      
      if (newCourseIds.length === 0) {
        return new Response(JSON.stringify({ 
          success: true, 
          message: "User already enrolled in all courses",
          user: {
            id: existingUser._id.toString(),
            email: existingUser.email,
            name: existingUser.name,
            enrolledCourse: existingUser.enrolledCourse,
            enrolledCourses: existingUser.enrolledCourses || [],
            progress: existingUser.progress,
            transactionId: existingUser.transactionId ?? null,
          }
        }), { status: 200 })
      }
      
      // Update courseIds to only include new courses
      courseIds.splice(0, courseIds.length, ...newCourseIds)
    }

    // Store payment details from CashFree
    let fetchedPayment: any = null
    try {
      if (verifyData) {
        fetchedPayment = verifyData
        await PaymentModel.create({
          email: user.email,
          orderId: verification.order_id,
          paymentId: verifyData.payment_details?.cf_payment_id || verification.order_id,
          signature: "cashfree_verified",
          amount: Math.round(parseFloat(verifyData.order_amount) * 100), // Convert to paise
          currency: verifyData.order_currency,
          status: "PAID", // Use consistent successful status
          method: verifyData.payment_details?.payment_method || "cashfree",
          notes: {
            order_note: verifyData.order_note,
            customer_details: verifyData.customer_details,
            original_status: verifyData.payment_status
          },
          raw: verifyData,
        })
      }
    } catch (error) {
      console.error('Payment storage error:', error)
      // Continue enrollment even if payment storage fails
    }

    // Create enrollment data for all courses
    const enrollmentData = courseObjectIds.map(courseObjectId => ({
      courseId: courseObjectId,
      enrolledAt: new Date(),
      progress: 0,
      transactionId: fetchedPayment?.payment_details?.cf_payment_id || verification?.order_id || null,
      paymentId: verifyData.payment_details?.cf_payment_id || verification?.order_id,
      orderId: verification?.order_id,
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
          transactionId: fetchedPayment?.payment_details?.cf_payment_id || verification?.order_id || null,
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