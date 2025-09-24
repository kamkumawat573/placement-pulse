import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { connectToDatabase } from "@/lib/mongodb"
import { UserModel } from "@/lib/models/User"

const JWT_SECRET = process.env.JWT_SECRET || ""

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value
    if (!token || !JWT_SECRET) return new Response(JSON.stringify({ user: null }), { status: 200 })

    const decoded = jwt.verify(token, JWT_SECRET) as any
    await connectToDatabase()
    const user = await UserModel.findById(decoded.sub)
    if (!user) return new Response(JSON.stringify({ user: null }), { status: 200 })

    return new Response(
      JSON.stringify({ user: { id: user._id.toString(), email: user.email, name: user.name, mobile: user.mobile, enrolledCourse: user.enrolledCourse, progress: user.progress } }),
      { status: 200 }
    )
  } catch {
    return new Response(JSON.stringify({ user: null }), { status: 200 })
  }
}


