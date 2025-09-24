require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
// Import models directly since we're in a script
const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  thumbnail: { type: String, default: "" },
  price: { type: Number, required: true, default: 29900 },
  duration: { type: String, default: "4 weeks" },
  level: { type: String, enum: ["beginner", "intermediate", "advanced"], default: "beginner" },
  isActive: { type: Boolean, default: true },
  modules: [{
    title: { type: String, required: true },
    description: { type: String, required: true },
    content: { type: String, required: true },
    videoUrl: { type: String, default: "" },
    duration: { type: Number, default: 0 },
    order: { type: Number, required: true },
    isPublished: { type: Boolean, default: false }
  }],
  instructor: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    bio: { type: String, default: "" },
    avatar: { type: String, default: "" }
  },
  tags: [{ type: String }],
  prerequisites: [{ type: String }],
  learningOutcomes: [{ type: String }]
}, { timestamps: true });

const AnnouncementSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  type: { type: String, enum: ["general", "course", "payment", "system"], default: "general" },
  priority: { type: String, enum: ["low", "medium", "high", "urgent"], default: "medium" },
  targetAudience: { type: String, enum: ["all", "enrolled", "unenrolled", "specific"], default: "all" },
  isActive: { type: Boolean, default: true },
  expiresAt: { type: Date, default: null },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true }
}, { timestamps: true });

const CourseModel = mongoose.models.Course || mongoose.model('Course', CourseSchema);
const AnnouncementModel = mongoose.models.Announcement || mongoose.model('Announcement', AnnouncementSchema);

async function seedData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Create sample course
    const sampleCourse = {
      title: "Complete Web Development Course",
      description: "Learn full-stack web development with modern technologies including React, Node.js, and MongoDB.",
      thumbnail: "",
      price: 29900, // ₹299
      duration: "8 weeks",
      level: "beginner",
      isActive: true,
      modules: [
        {
          title: "Introduction to Web Development",
          description: "Get started with the basics of web development",
          content: "Learn HTML, CSS, and JavaScript fundamentals",
          videoUrl: "",
          duration: 120,
          order: 1,
          isPublished: true
        },
        {
          title: "React Fundamentals",
          description: "Master React components and state management",
          content: "Build interactive user interfaces with React",
          videoUrl: "",
          duration: 180,
          order: 2,
          isPublished: true
        },
        {
          title: "Backend Development",
          description: "Create robust APIs with Node.js and Express",
          content: "Learn server-side development and database integration",
          videoUrl: "",
          duration: 240,
          order: 3,
          isPublished: false
        }
      ],
      instructor: {
        name: "John Doe",
        email: "john@example.com",
        bio: "Senior Full-Stack Developer with 10+ years experience",
        avatar: ""
      },
      tags: ["web development", "react", "node.js", "mongodb"],
      prerequisites: ["Basic programming knowledge"],
      learningOutcomes: [
        "Build complete web applications",
        "Understand modern development practices",
        "Deploy applications to production"
      ]
    };

    // Check if course already exists
    const existingCourse = await CourseModel.findOne({ title: sampleCourse.title });
    if (!existingCourse) {
      const course = await CourseModel.create(sampleCourse);
      console.log('✅ Sample course created:', course.title);
    } else {
      console.log('⚠️  Sample course already exists');
    }

    // Create sample announcements
    const sampleAnnouncements = [
      {
        title: "Welcome to LearnPro!",
        content: "Welcome to our learning platform. We're excited to have you here and help you achieve your learning goals.",
        type: "general",
        priority: "medium",
        targetAudience: "all",
        isActive: true,
        createdBy: new mongoose.Types.ObjectId() // This will be replaced with actual admin ID
      },
      {
        title: "New Course Module Added",
        content: "We've added a new module on Advanced React Patterns to our Web Development course. Check it out!",
        type: "course",
        priority: "low",
        targetAudience: "enrolled",
        isActive: true,
        createdBy: new mongoose.Types.ObjectId()
      },
      {
        title: "Payment System Update",
        content: "We've updated our payment system for better security. All transactions are now more secure.",
        type: "payment",
        priority: "high",
        targetAudience: "all",
        isActive: true,
        createdBy: new mongoose.Types.ObjectId()
      }
    ];

    for (const announcement of sampleAnnouncements) {
      const existingAnnouncement = await AnnouncementModel.findOne({ title: announcement.title });
      if (!existingAnnouncement) {
        await AnnouncementModel.create(announcement);
        console.log('✅ Sample announcement created:', announcement.title);
      }
    }

    console.log('✅ Data seeding completed successfully!');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
}

// Run the seeding
seedData();
