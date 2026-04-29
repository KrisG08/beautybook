import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const userId = searchParams.get('userId');

  const where: any = {};
  if (status && status !== 'all') where.status = status;
  if (userId) where.userId = userId;

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
  
  // Transform to include summary data
  const businessesWithSummary = businesses.map(business => ({
    ...business,
    serviceCount: business.services.length,
    priceRange: business.services.length > 0 ? {
      min: Math.min(...business.services.map(s => s.price)),
      max: Math.max(...business.services.map(s => s.price))
    } : null,
    todaySlots: business.timeSlots.filter(slot => {
      // Simple check for today - in a real app you'd compare dates properly
      return true; // For now, show all available slots as today's slots
    }).length
  }));
  
  return NextResponse.json(businessesWithSummary);
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