import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ContactMessageModel } from '@/lib/models/ContactMessage';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const { name, email, company, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Get client IP and user agent
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    const contactMessage = new ContactMessageModel({
      name,
      email,
      company: company || '',
      message,
      ipAddress,
      userAgent
    });

    await contactMessage.save();

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully! We will get back to you soon.',
      id: contactMessage._id
    });
  } catch (error) {
    console.error('Contact form submission error:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    );
  }
}
