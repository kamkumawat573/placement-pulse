import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyAdmin } from '@/lib/admin-auth';
import { PriceHistoryModel } from '@/lib/models/PriceHistory';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const priceHistory = await PriceHistoryModel.find({ courseId: params.id })
      .populate('changedBy', 'name email')
      .sort({ timestamp: -1 })
      .limit(50); // Limit to last 50 changes

    return NextResponse.json({
      success: true,
      priceHistory: priceHistory.map(change => ({
        id: change._id,
        oldPrice: change.oldPrice,
        newPrice: change.newPrice,
        oldOriginalPrice: change.oldOriginalPrice,
        newOriginalPrice: change.newOriginalPrice,
        oldDiscount: change.oldDiscount,
        newDiscount: change.newDiscount,
        changedBy: change.changedBy,
        changeReason: change.changeReason,
        timestamp: change.timestamp
      }))
    });
  } catch (error) {
    console.error('Get price history error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
