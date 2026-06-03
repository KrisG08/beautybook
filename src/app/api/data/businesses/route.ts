import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const userId = searchParams.get('userId');
  const businessId = searchParams.get('businessId');

  console.log(`[BUSINESSES GET] status=${status}, userId=${userId}, businessId=${businessId}`);

  const where: any = {};
  if (status && status !== 'all') where.status = status;
  if (userId) where.userId = userId;
  if (businessId) where.id = businessId;

  const businesses = await prisma.business.findMany({
    where, 
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      address: true,
      description: true,
      category: true,
      rating: true,
      reviewCount: true,
      status: true,
      imageUrl: true,
      createdAt: true,
      contactPerson: true,
      email: true,
      phone: true,
      services: {
        select: {
          price: true
        }
      },
      timeSlots: {
        where: {
          available: true
        },
        select: {
          startTime: true,
          endTime: true
        }
      }
    }
  });
  
  console.log(`[BUSINESSES GET] Found ${businesses.length} businesses (pending: ${businesses.filter(b => b.status === 'pending').length})`);

  // Transform to include summary data
  const businessesWithSummary = businesses.map(business => ({
    ...business,
    serviceCount: business.services.length,
    priceRange: business.services.length > 0 ? {
      min: Math.min(...business.services.map(s => s.price)),
      max: Math.max(...business.services.map(s => s.price))
    } : null,
    todaySlots: business.timeSlots.filter(slot => {
      return true;
    }).length
  }));
  
  return NextResponse.json(businessesWithSummary);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log(`[BUSINESSES POST] Creating business: name=${body.name}, userId=${body.userId}`);
    
    const business = await prisma.business.create({
      data: { ...body, status: body.status || 'pending' },
    });
    
    console.log(`[BUSINESSES POST] Created: id=${business.id}, name=${business.name}, status=${business.status}`);
    
    // Verify
    const verify = await prisma.business.findUnique({ where: { id: business.id } });
    console.log(`[BUSINESSES POST] DB verification: ${verify ? 'OK' : 'FAILED'}`);
    
    return NextResponse.json(business);
  } catch (error) {
    console.error('[BUSINESSES POST] ERROR:', error);
    return NextResponse.json({ error: 'Failed to create business' }, { status: 500 });
  }
}