import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (userId) {
    const business = await prisma.business.findUnique({ where: { userId }, include: { user: true } });
    return NextResponse.json(business);
  }

  const businesses = await prisma.business.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(businesses);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const business = await prisma.business.create({
      data: { ...body, status: 'pending' },
    });
    return NextResponse.json(business);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create business' }, { status: 500 });
  }
}