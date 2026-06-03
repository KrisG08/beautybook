import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { businessId } = await request.json();

    const whereCondition: any = { status: 'waiting' };
    if (businessId) {
      whereCondition.businessId = businessId;
    }

    const waitlistEntries = await prisma.waitlistEntry.findMany({
      where: whereCondition,
      include: { user: true, business: true, service: true },
    });

    const notifications: any[] = [];

    for (const entry of waitlistEntries) {
      const availableSlots = await prisma.timeSlot.findMany({
        where: {
          businessId: entry.businessId,
          date: entry.preferredDate,
          available: true,
          startTime: { gte: entry.preferredTime },
        },
        orderBy: { startTime: 'asc' },
      });

      if (availableSlots.length > 0) {
        const matchingSlot = availableSlots[0];

        await prisma.waitlistEntry.update({
          where: { id: entry.id },
          data: { status: 'notified', notifiedAt: new Date() },
        });

        const notification = await prisma.clientNotification.create({
          data: {
            userId: entry.userId,
            type: 'slot_available',
            title: 'Appointment Available!',
            message: `A slot just opened at ${entry.business.name} on ${entry.preferredDate} at ${matchingSlot.startTime} for ${entry.service.name}. Book now before it's taken!`,
            businessId: entry.businessId,
            actionUrl: `/client/location/${entry.businessId}`,
          },
        });

        notifications.push(notification);
      }
    }

    const favoriteUserIds = await prisma.favorite.findMany({
      where: businessId ? { businessId } : {},
      select: { userId: true, businessId: true },
    });

    const groupedFavorites: Record<string, string[]> = {};
    for (const fav of favoriteUserIds) {
      if (!groupedFavorites[fav.userId]) groupedFavorites[fav.userId] = [];
      groupedFavorites[fav.userId].push(fav.businessId);
    }

    for (const [userId, bizIds] of Object.entries(groupedFavorites)) {
      for (const bizId of bizIds) {
        const newSlotCount = await prisma.timeSlot.count({
          where: {
            businessId: bizId,
            available: true,
            date: { gte: new Date().toISOString().split('T')[0] },
          },
        });

        if (newSlotCount > 0) {
          const business = await prisma.business.findUnique({ where: { id: bizId } });
          if (!business) continue;

          const recentNotif = await prisma.clientNotification.findFirst({
            where: {
              userId,
              type: 'favorite_update',
              businessId: bizId,
              createdAt: { gte: new Date(Date.now() - 60 * 60 * 1000) },
            },
          });

          if (!recentNotif) {
            const notif = await prisma.clientNotification.create({
              data: {
                userId,
                type: 'favorite_update',
                title: `${business.name} has openings`,
                message: `${newSlotCount} time slots available at ${business.name}. Tap to book!`,
                businessId: bizId,
                actionUrl: `/client/location/${bizId}`,
              },
            });
            notifications.push(notif);
          }
        }
      }
    }

    return NextResponse.json({ notificationsCreated: notifications.length, notifications });
  } catch (error) {
    console.error('Check slots error:', error);
    return NextResponse.json({ error: 'Failed to check slots' }, { status: 500 });
  }
}
