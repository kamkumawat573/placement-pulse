import type { NextRequest } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import mongoose from 'mongoose'
import { UserModel } from "@/lib/models/User"
import { PaymentModel } from "@/lib/models/Payment"
import { getCashfree } from '@/lib/cashfree'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { user, verification, courseId } = body || {}

    if (!user?.email) {
      return new Response(JSON.stringify({ error: "Missing user email" }), { status: 400 })
    }

    if (!courseId) {
      return new Response(JSON.stringify({ error: "Missing course ID" }), { status: 400 })
    }

    if (!verification?.order_id) {
      return new Response(JSON.stringify({ error: "Missing payment verification" }), { status: 400 })
    }

    // Verify payment with CashFree
    const appId = process.env.NEXT_PUBLIC_CASHFREE_APP_ID
    const secretKey = process.env.CASHFREE_SECRET_KEY

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

    // Store payment details from CashFree
    let fetchedPayment: any = null
    try {
      if (verifyData) {
        fetchedPayment = verifyData
        await connectToDatabase()
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

    // Upsert in Mongo and mark enrolled for specific course
    await connectToDatabase()
    const query = user.id ? { _id: user.id } : { email: user.email }

    // Validate and convert courseId to ObjectId
    if (!mongoose.isValidObjectId(String(courseId))) {
      return new Response(JSON.stringify({ error: 'Invalid course ID' }), { status: 400 })
    }
    const courseObjectId = new mongoose.Types.ObjectId(String(courseId))

    // Check if user is already enrolled in this course
    const existingUser = await UserModel.findOne(query)
    if (existingUser) {
      const alreadyEnrolled = existingUser.enrolledCourses?.some(
        (enrollment: any) => String(enrollment.courseId) === String(courseObjectId)
      )
      if (alreadyEnrolled) {
        return new Response(JSON.stringify({
          success: true,
          message: 'User already enrolled in this course',
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
    }

    const enrollmentData = {
      courseId: courseObjectId,
      enrolledAt: new Date(),
      progress: 0,
      transactionId: fetchedPayment?.payment_details?.cf_payment_id || verification?.order_id || null,
      paymentId: verifyData.payment_details?.cf_payment_id || verification?.order_id,
      orderId: verification?.order_id,
      status: 'active'
    }

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
          enrolledCourses: enrollmentData
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
      }),
      { status: 200 }
    )
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || "Failed to enroll" }), { status: 500 })
  }
}


