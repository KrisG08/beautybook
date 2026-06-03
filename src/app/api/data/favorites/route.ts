import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId },
    include: { business: true },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(favorites);
}

export async function POST(request: NextRequest) {
  try {
    const { userId, businessId } = await request.json();

    if (!userId || !businessId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existing = await prisma.favorite.findUnique({
      where: { userId_businessId: { userId, businessId } },
    });

    if (existing) {
      return NextResponse.json({ error: 'Already in favorites' }, { status: 400 });
    }

    const favorite = await prisma.favorite.create({
      data: { userId, businessId },
      include: { business: true },
    });

    return NextResponse.json(favorite);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add favorite' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const businessId = searchParams.get('businessId');

  if (!userId || !businessId) {
    return NextResponse.json({ error: 'Missing params' }, { status: 400 });
  }

  await prisma.favorite.delete({
    where: { userId_businessId: { userId, businessId } },
  });

  return NextResponse.json({ success: true });
}
