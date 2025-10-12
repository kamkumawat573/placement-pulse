import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyAdmin } from '@/lib/admin-auth';
import { PaymentModel } from '@/lib/models/Payment';

export const dynamic = 'force-dynamic'

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

    // Get all payments for debugging
    const allPayments = await PaymentModel.find({}).sort({ createdAt: -1 }).limit(10);
    
    // Get payments by status
    const paidPayments = await PaymentModel.find({ status: 'PAID' });
    const otherStatusPayments = await PaymentModel.find({ status: { $ne: 'PAID' } });
    
    // Calculate revenue
    const totalRevenue = paidPayments.reduce((sum, payment) => sum + (payment.amount / 100), 0);
    
    return NextResponse.json({
      success: true,
      debug: {
        totalPayments: allPayments.length,
        paidPayments: paidPayments.length,
        otherStatusPayments: otherStatusPayments.length,
        totalRevenue,
        allPayments: allPayments.map(p => ({
          id: p._id,
          email: p.email,
          amount: p.amount,
          status: p.status,
          method: p.method,
          orderId: p.orderId,
          createdAt: p.createdAt
        })),
        statusBreakdown: {
          PAID: paidPayments.length,
          other: otherStatusPayments.map(p => p.status)
        }
      }
    });
  } catch (error) {
    console.error('Debug payments error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
