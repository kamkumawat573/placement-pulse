import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyAdmin } from '@/lib/admin-auth';
import { SettingModel } from '@/lib/models/Setting';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const admin = await verifyAdmin(request);
    
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const settings = await SettingModel.find({})
      .sort({ category: 1, key: 1 });

    return NextResponse.json({
      success: true,
      settings
    });
  } catch (error) {
    console.error('Fetch settings error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const admin = await verifyAdmin(request);
    
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { key, value, type, description, category, isPublic } = await request.json();

    if (!key || value === undefined) {
      return NextResponse.json(
        { error: 'Key and value are required' },
        { status: 400 }
      );
    }

    const setting = await SettingModel.findOneAndUpdate(
      { key },
      {
        key,
        value,
        type: type || 'string',
        description: description || '',
        category: category || 'general',
        isPublic: isPublic || false
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      success: true,
      setting
    });
  } catch (error) {
    console.error('Create/update setting error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
