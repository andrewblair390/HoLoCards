import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Card from '@/models/card';

export async function GET() {
  try {
    await connectDB();
    
    // Fetch all cards from the 'Cards' collection
    const cards = await Card.find({});
    
    return NextResponse.json({ success: true, data: cards });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}