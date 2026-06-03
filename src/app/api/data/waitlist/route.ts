import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const businessId = searchParams.get('businessId');

  if (userId) {
    const entries = await prisma.waitlistEntry.findMany({
      where: { userId },
      include: { business: true, service: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(entries);
  }

  if (businessId) {
    const entries = await prisma.waitlistEntry.findMany({
      where: { businessId, status: 'waiting' },
      include: { user: true, service: true },
      orderBy: { createdAt: 'asc' },
    });
    return NextResponse.json(entries);
  }

  return NextResponse.json({ error: 'Missing params' }, { status: 400 });
}

export async function POST(request: NextRequest) {
  try {
    const { userId, businessId, serviceId, preferredDate, preferredTime } = await request.json();

    if (!userId || !businessId || !serviceId || !preferredDate || !preferredTime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existing = await prisma.waitlistEntry.findUnique({
      where: {
        userId_businessId_serviceId_preferredDate: {
          userId,
          businessId,
          serviceId,
          preferredDate,
        },
      },
    });

    if (existing) {
      return NextResponse.json({ error: 'Already on waitlist for this date' }, { status: 400 });
    }

    const entry = await prisma.waitlistEntry.create({
      data: { userId, businessId, serviceId, preferredDate, preferredTime },
      include: { business: true, service: true },
    });

    return NextResponse.json(entry);
  } catch (error) {
    console.error('Waitlist error:', error);
    return NextResponse.json({ error: 'Failed to join waitlist' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const entryId = searchParams.get('entryId');

  if (!entryId) {
    return NextResponse.json({ error: 'Missing entryId' }, { status: 400 });
  }

  await prisma.waitlistEntry.delete({ where: { id: entryId } });
  return NextResponse.json({ success: true });
}
