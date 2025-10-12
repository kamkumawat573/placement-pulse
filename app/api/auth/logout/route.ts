import { cookies } from "next/headers"

export async function POST() {
  const cookieStore = await cookies()
  cookieStore.set("auth_token", "", { httpOnly: true, expires: new Date(0), path: "/" })
  return new Response(JSON.stringify({ success: true }), { status: 200 })
}


