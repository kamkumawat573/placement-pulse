import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { SettingModel } from '@/lib/models/Setting';

export async function GET() {
  try {
    await connectToDatabase();
    
    const settings = await SettingModel.find({ isPublic: true })
      .select('key value type description category');

    return NextResponse.json({
      success: true,
      settings
    });
  } catch (error) {
    console.error('Fetch public settings error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
