import type { NextRequest } from "next/server"
import bcrypt from "bcryptjs"
import { connectToDatabase } from "@/lib/mongodb"
import { UserModel } from "@/lib/models/User"
import { verifyRecaptcha } from "@/lib/recaptcha"

export async function POST(req: NextRequest) {
  try {
    const { email, password, name, mobile, recaptchaToken } = await req.json()
    if (!email || !password) return new Response(JSON.stringify({ error: "Missing credentials" }), { status: 400 })
    if (!mobile) return new Response(JSON.stringify({ error: "Mobile is required" }), { status: 400 })

    // Verify reCAPTCHA
    const isValidRecaptcha = await verifyRecaptcha(recaptchaToken)
    if (!isValidRecaptcha) {
      return new Response(JSON.stringify({ error: "reCAPTCHA verification failed" }), { status: 400 })
    }

    await connectToDatabase()
    const existingEmail = await UserModel.findOne({ email })
    if (existingEmail) return new Response(JSON.stringify({ error: "Email already in use" }), { status: 409 })
    const existingMobile = await UserModel.findOne({ mobile })
    if (existingMobile) return new Response(JSON.stringify({ error: "Mobile already in use" }), { status: 409 })

    const passwordHash = await bcrypt.hash(password, 10)
    const user = await UserModel.create({ email, name, passwordHash, mobile })

    return new Response(
      JSON.stringify({ id: user._id.toString(), email: user.email, name: user.name, mobile: user.mobile, enrolledCourse: user.enrolledCourse, progress: user.progress }),
      { status: 201 }
    )
  } catch (err: any) {
    console.error("Signup error:", err)
    if (err.code === 11000) {
      if (err.keyPattern?.mobile) {
        return new Response(JSON.stringify({ error: "Mobile already in use" }), { status: 409 })
      }
      if (err.keyPattern?.email) {
        return new Response(JSON.stringify({ error: "Email already in use" }), { status: 409 })
      }
    }
    return new Response(JSON.stringify({ error: err?.message || "Signup failed" }), { status: 500 })
  }
}


