import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyAdmin } from '@/lib/admin-auth';
import { PaymentModel } from '@/lib/models/Payment';

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

    // Get the request body to check for confirmation
    const body = await request.json();
    
    if (!body.confirm) {
      return NextResponse.json(
        { error: 'Confirmation required' },
        { status: 400 }
      );
    }

    // Delete all payment records
    const result = await PaymentModel.deleteMany({});
    
    console.log(`Revenue reset: Deleted ${result.deletedCount} payment records`);

    return NextResponse.json({
      success: true,
      message: `Revenue reset successfully. Deleted ${result.deletedCount} payment records.`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Reset revenue error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
