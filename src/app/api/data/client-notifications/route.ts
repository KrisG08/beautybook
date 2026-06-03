import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  const notifications = await prisma.clientNotification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  return NextResponse.json(notifications);
}

export async function POST(request: NextRequest) {
  try {
    const { userId, type, title, message, businessId, actionUrl } = await request.json();

    const notification = await prisma.clientNotification.create({
      data: { userId, type, title, message, businessId, actionUrl },
    });

    return NextResponse.json(notification);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { notificationId, userId } = await request.json();

    if (notificationId) {
      const notification = await prisma.clientNotification.update({
        where: { id: notificationId },
        data: { read: true },
      });
      return NextResponse.json(notification);
    }

    if (userId) {
      await prisma.clientNotification.updateMany({
        where: { userId, read: false },
        data: { read: true },
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Missing params' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const notificationId = searchParams.get('notificationId');

  if (!notificationId) {
    return NextResponse.json({ error: 'Missing notificationId' }, { status: 400 });
  }

  await prisma.clientNotification.delete({ where: { id: notificationId } });
  return NextResponse.json({ success: true });
}
