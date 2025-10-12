import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyAdmin } from '@/lib/admin-auth';
import { PaymentModel } from '@/lib/models/Payment';

export const dynamic = 'force-dynamic'

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

    const { amount, email } = await request.json();
    
    // Create a test payment
    const testPayment = await PaymentModel.create({
      email: email || 'test@example.com',
      orderId: `test_order_${Date.now()}`,
      paymentId: `test_payment_${Date.now()}`,
      signature: 'test_signature',
      amount: amount || 29900, // ₹299 in paise
      currency: 'INR',
      status: 'PAID',
      method: 'test',
      notes: {
        test: true,
        created_by: 'admin'
      },
      raw: { test: true }
    });
    
    return NextResponse.json({
      success: true,
      payment: {
        id: testPayment._id,
        email: testPayment.email,
        amount: testPayment.amount,
        status: testPayment.status,
        createdAt: testPayment.createdAt
      }
    });
  } catch (error) {
    console.error('Create test payment error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
