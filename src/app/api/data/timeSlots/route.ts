import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const businessId = searchParams.get('businessId');
  const date = searchParams.get('date');

  if (userId) {
    const business = await prisma.business.findUnique({ where: { userId }, include: { user: true } });
    return NextResponse.json(business);
  }

  if (businessId) {
    const where: any = { businessId };
    if (date) where.date = date;
    const slots = await prisma.timeSlot.findMany({ where, orderBy: [{ date: 'asc' }, { startTime: 'asc' }] });
    return NextResponse.json(slots);
  }

  return NextResponse.json({ error: 'Missing params' }, { status: 400 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const slot = await prisma.timeSlot.create({ data: body });
    return NextResponse.json(slot);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create slot' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slotId = searchParams.get('slotId');
    
    if (!slotId) {
      return NextResponse.json({ error: 'Missing slotId' }, { status: 400 });
    }
    
    await prisma.timeSlot.delete({ where: { id: slotId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete slot' }, { status: 500 });
  }
}