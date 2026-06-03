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
    const { userId, businessId, serviceId, slotId, paymentType } = await request.json();
    
    const slot = await prisma.timeSlot.findUnique({ where: { id: slotId } });
    if (!slot || !slot.available) {
      return NextResponse.json({ error: 'Slot not available' }, { status: 400 });
    }

    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    
    const booking = await prisma.booking.create({
      data: { 
        userId, 
        businessId, 
        serviceId, 
        slotId, 
        totalPrice: service?.price || 0, 
        status: 'confirmed',
        paymentType: paymentType || 'cash',
        paymentStatus: paymentType === 'card' ? 'paid' : 'pending',
      },
    });

    await prisma.timeSlot.update({ where: { id: slotId }, data: { available: false } });

    await prisma.notification.create({
      data: {
        businessId,
        type: 'booking',
        message: `New booking for ${service?.name || 'service'} - ${paymentType === 'card' ? 'Paid online' : 'Pay with cash'}`,
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

    if (status === 'cancelled') {
      const originalBooking = await prisma.booking.findUnique({ where: { id: bookingId } });
      if (originalBooking) {
        await prisma.timeSlot.update({
          where: { id: originalBooking.slotId },
          data: { available: true },
        });

        const waitlistEntries = await prisma.waitlistEntry.findMany({
          where: {
            businessId: originalBooking.businessId,
            serviceId: originalBooking.serviceId,
            status: 'waiting',
          },
          include: { user: true, business: true, service: true },
        });

        const slot = await prisma.timeSlot.findUnique({ where: { id: originalBooking.slotId } });

        for (const entry of waitlistEntries) {
          if (slot && slot.date === entry.preferredDate) {
            await prisma.waitlistEntry.update({
              where: { id: entry.id },
              data: { status: 'notified', notifiedAt: new Date() },
            });

            await prisma.clientNotification.create({
              data: {
                userId: entry.userId,
                type: 'slot_available',
                title: 'Appointment Available!',
                message: `A slot just opened at ${entry.business.name} on ${slot.date} at ${slot.startTime} for ${entry.service.name}. Book now!`,
                businessId: originalBooking.businessId,
                actionUrl: `/client/location/${originalBooking.businessId}`,
              },
            });
          }
        }
      }
    }
    
    return NextResponse.json(booking);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}