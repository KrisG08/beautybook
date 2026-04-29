import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const businessId = searchParams.get('businessId');
  const userId = searchParams.get('userId');

  if (businessId) {
    const bookings = await prisma.booking.findMany({
      where: { businessId },
      include: { user: true, service: true, slot: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(bookings);
  }

  if (userId) {
    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: { business: true, service: true, slot: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(bookings);
  }

  return NextResponse.json({ error: 'Missing params' }, { status: 400 });
}

export async function POST(request: NextRequest) {
  try {
    const { userId, businessId, serviceId, slotId } = await request.json();
    
    const slot = await prisma.timeSlot.findUnique({ where: { id: slotId } });
    if (!slot || !slot.available) {
      return NextResponse.json({ error: 'Slot not available' }, { status: 400 });
    }

    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    
    const booking = await prisma.booking.create({
      data: { userId, businessId, serviceId, slotId, totalPrice: service?.price || 0, status: 'confirmed' },
    });

    await prisma.timeSlot.update({ where: { id: slotId }, data: { available: false } });

    await prisma.notification.create({
      data: {
        businessId,
        type: 'booking',
        message: `New booking for ${service?.name || 'service'}`,
      },
    });

    return NextResponse.json(booking);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get('bookingId');
    
    if (!bookingId) {
      return NextResponse.json({ error: 'Missing bookingId' }, { status: 400 });
    }
    
    const { status } = await request.json();
    
    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status },
    });
    return NextResponse.json(booking);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}