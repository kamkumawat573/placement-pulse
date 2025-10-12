import { connectToDatabase } from "@/lib/mongodb"
import { NotificationModel } from "@/lib/models/Notification"

export async function GET() {
  try {
    await connectToDatabase()
    const notifications = await NotificationModel.find({})
      .sort({ createdAt: -1 })
      .limit(10)
    
    return new Response(
      JSON.stringify(notifications),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to fetch notifications' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
