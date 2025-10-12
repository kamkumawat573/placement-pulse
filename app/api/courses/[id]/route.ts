import type { NextRequest } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { CourseModel } from "@/lib/models/Course"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    console.log('Fetching course with ID:', id)

    if (!id) {
      return new Response(JSON.stringify({ error: "Course ID is required" }), { status: 400 })
    }

    await connectToDatabase()
    const course = await CourseModel.findById(id)
    console.log('Found course:', course ? course.title : 'Not found')

    if (!course) {
      return new Response(JSON.stringify({ error: "Course not found" }), { status: 404 })
    }

    if (!course.isActive) {
      return new Response(JSON.stringify({ error: "Course is not active" }), { status: 400 })
    }

    return new Response(
      JSON.stringify({
        course: {
          id: course._id,
          title: course.title,
          description: course.description,
          shortDescription: course.shortDescription,
          price: course.price,
          originalPrice: course.originalPrice,
          discount: course.discount,
          duration: course.duration,
          level: course.level,
          category: course.category,
          instructor: course.instructor,
          image: course.image,
          features: course.features || [],
          modules: course.modules || [],
          testimonials: course.testimonials || [],
          students: course.students,
          rating: course.rating,
          reviews: course.reviews,
          isActive: course.isActive,
          isFeatured: course.isFeatured,
          slug: course.slug,
          createdAt: course.createdAt,
          updatedAt: course.updatedAt
        }
      }),
      { status: 200 }
    )
  } catch (err: any) {
    console.error("Error fetching course:", err)
    return new Response(JSON.stringify({ error: err?.message || "Failed to fetch course" }), { status: 500 })
  }
}
