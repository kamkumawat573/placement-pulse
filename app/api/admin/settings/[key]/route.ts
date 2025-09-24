import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyAdmin } from '@/lib/admin-auth';
import { SettingModel } from '@/lib/models/Setting';

export async function GET(
  request: NextRequest,
  { params }: { params: { key: string } }
) {
  try {
    await connectToDatabase();
    
    const admin = await verifyAdmin(request);
    
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const setting = await SettingModel.findOne({ key: params.key });

    if (!setting) {
      return NextResponse.json(
        { error: 'Setting not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      setting
    });
  } catch (error) {
    console.error('Fetch setting error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { key: string } }
) {
  try {
    await connectToDatabase();
    
    const admin = await verifyAdmin(request);
    
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { value, type, description, category, isPublic } = await request.json();

    if (value === undefined) {
      return NextResponse.json(
        { error: 'Value is required' },
        { status: 400 }
      );
    }

    const setting = await SettingModel.findOneAndUpdate(
      { key: params.key },
      {
        value,
        type: type || 'string',
        description: description || '',
        category: category || 'general',
        isPublic: isPublic || false
      },
      { new: true }
    );

    if (!setting) {
      return NextResponse.json(
        { error: 'Setting not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      setting
    });
  } catch (error) {
    console.error('Update setting error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { key: string } }
) {
  try {
    await connectToDatabase();
    
    const admin = await verifyAdmin(request);
    
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const setting = await SettingModel.findOneAndDelete({ key: params.key });

    if (!setting) {
      return NextResponse.json(
        { error: 'Setting not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Setting deleted successfully'
    });
  } catch (error) {
    console.error('Delete setting error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}