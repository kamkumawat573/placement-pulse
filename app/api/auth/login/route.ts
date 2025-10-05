import type { NextRequest } from "next/server"
import { cookies } from "next/headers"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { connectToDatabase } from "@/lib/mongodb"
import { UserModel } from "@/lib/models/User"
import { verifyRecaptcha } from "@/lib/recaptcha"

const JWT_SECRET = process.env.JWT_SECRET || ""

export async function POST(req: NextRequest) {
  try {
    const { email, password, recaptchaToken } = await req.json()
    if (!email || !password) return new Response(JSON.stringify({ error: "Missing credentials" }), { status: 400 })
    if (!JWT_SECRET) return new Response(JSON.stringify({ error: "Server misconfigured" }), { status: 500 })

    // Verify reCAPTCHA
    const isValidRecaptcha = await verifyRecaptcha(recaptchaToken)
    if (!isValidRecaptcha) {
      return new Response(JSON.stringify({ error: "reCAPTCHA verification failed" }), { status: 400 })
    }

    await connectToDatabase()
    const user = await UserModel.findOne({ email })
    if (!user) return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 })

    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 })

    const token = jwt.sign({ sub: user._id.toString(), email: user.email }, JWT_SECRET, { expiresIn: "7d" })
    const cookieStore = await cookies()
    cookieStore.set("auth_token", token, { httpOnly: true, sameSite: "lax", path: "/" })

    return new Response(
      JSON.stringify({ 
        id: user._id.toString(), 
        email: user.email, 
        name: user.name, 
        mobile: user.mobile, 
        enrolledCourse: user.enrolledCourse, 
        enrolledCourses: user.enrolledCourses || [],
        progress: user.progress 
      }),
      { status: 200 }
    )
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || "Login failed" }), { status: 500 })
  }
}


