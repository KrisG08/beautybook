const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkSlotAvailability() {
  console.log('Checking slot availability for waitlist entries...');

  const waitlistEntries = await prisma.waitlistEntry.findMany({
    where: { status: 'waiting' },
    include: { user: true, business: true, service: true },
  });

  console.log(`Found ${waitlistEntries.length} active waitlist entries`);

  let notificationsCreated = 0;

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

      await prisma.clientNotification.create({
        data: {
          userId: entry.userId,
          type: 'slot_available',
          title: 'Appointment Available!',
          message: `A slot just opened at ${entry.business.name} on ${entry.preferredDate} at ${matchingSlot.startTime} for ${entry.service.name}. Book now before it's taken!`,
          businessId: entry.businessId,
          actionUrl: `/client/location/${entry.businessId}`,
        },
      });

      console.log(`Notified ${entry.user.name} about slot at ${entry.business.name}`);
      notificationsCreated++;
    }
  }

  console.log(`Created ${notificationsCreated} notifications`);
  return notificationsCreated;
}

async function checkFavoriteUpdates() {
  console.log('Checking favorite business updates...');

  const favorites = await prisma.favorite.findMany({
    select: { userId: true, businessId: true },
  });

  const grouped: Record<string, string[]> = {};
  for (const fav of favorites) {
    if (!grouped[fav.userId]) grouped[fav.userId] = [];
    grouped[fav.userId].push(fav.businessId);
  }

  let notificationsCreated = 0;

  for (const [userId, bizIds] of Object.entries(grouped)) {
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
          await prisma.clientNotification.create({
            data: {
              userId,
              type: 'favorite_update',
              title: `${business.name} has openings`,
              message: `${newSlotCount} time slots available at ${business.name}. Tap to book!`,
              businessId: bizId,
              actionUrl: `/client/location/${bizId}`,
            },
          });
          notificationsCreated++;
        }
      }
    }
  }

  console.log(`Created ${notificationsCreated} favorite update notifications`);
  return notificationsCreated;
}

async function main() {
  try {
    const waitlistNotifs = await checkSlotAvailability();
    const favoriteNotifs = await checkFavoriteUpdates();
    console.log(`\nSummary: ${waitlistNotifs} waitlist notifications, ${favoriteNotifs} favorite notifications`);
  } catch (error) {
    console.error('Error during slot check:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
