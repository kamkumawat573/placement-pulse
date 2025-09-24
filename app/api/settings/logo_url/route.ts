import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { SettingModel } from '@/lib/models/Setting';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const setting = await SettingModel.findOne({ 
      key: 'logo_url',
      isPublic: true 
    });

    if (!setting) {
      // Return default logo if setting doesn't exist
      return NextResponse.json({
        success: true,
        setting: {
          key: 'logo_url',
          value: '/placement-pulse-logo.png',
          type: 'string',
          description: 'Website logo URL',
          category: 'appearance',
          isPublic: true
        }
      });
    }

    return NextResponse.json({
      success: true,
      setting
    });
  } catch (error) {
    console.error('Fetch logo setting error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
