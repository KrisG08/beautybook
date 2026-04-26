import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');

  const where: any = {};
  if (status && status !== 'all') where.status = status;

  const businesses = await prisma.business.findMany({ where, orderBy: { createdAt: 'desc' } });
  return NextResponse.json(businesses);
}

export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');
    
    if (!businessId) {
      return NextResponse.json({ error: 'Missing businessId' }, { status: 400 });
    }
    
    const { status } = await request.json();
    
    const business = await prisma.business.update({
      where: { id: businessId },
      data: { status },
    });
    return NextResponse.json(business);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update business' }, { status: 500 });
  }
}