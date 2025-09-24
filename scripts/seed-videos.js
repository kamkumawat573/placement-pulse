require('dotenv').config();
const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI environment variable is required');
  process.exit(1);
}

async function seedVideos() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    
    // Clear existing videos
    await db.collection('videos').deleteMany({});
    console.log('Cleared existing videos');
    
    // Sample videos
    const sampleVideos = [
      {
        videoId: uuidv4(),
        title: 'Course Introduction - What You\'ll Learn',
        description: 'Get an overview of our comprehensive web development course and see what skills you\'ll master.',
        videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        thumbnailUrl: 'https://via.placeholder.com/1280x720/8b5cf6/ffffff?text=Course+Introduction',
        duration: '3:45',
        category: 'preview',
        isActive: true,
        isFeatured: true,
        order: 1,
        views: 1250,
        createdBy: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        videoId: uuidv4(),
        title: 'HTML & CSS Fundamentals',
        description: 'Learn the building blocks of web development with HTML and CSS.',
        videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
        thumbnailUrl: 'https://via.placeholder.com/1280x720/6366f1/ffffff?text=HTML+%26+CSS',
        duration: '8:30',
        category: 'preview',
        isActive: true,
        isFeatured: false,
        order: 2,
        views: 980,
        createdBy: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    // Insert sample videos
    const result = await db.collection('videos').insertMany(sampleVideos);
    console.log(`Inserted ${result.insertedCount} sample videos`);
    
    console.log('Video seeding completed successfully!');
    
  } catch (error) {
    console.error('Error seeding videos:', error);
  } finally {
    await client.close();
  }
}

seedVideos();
