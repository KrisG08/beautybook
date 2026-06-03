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
    
    const body = await request.json();
    const { status, name, contactPerson, phone, email, address, description, category } = body;
    
    console.log(`[BUSINESS PATCH] id=${businessId}, updates:`, JSON.stringify(body));
    
    const data: any = {};
    if (status) data.status = status;
    if (name) data.name = name;
    if (contactPerson) data.contactPerson = contactPerson;
    if (phone) data.phone = phone;
    if (email) data.email = email;
    if (address) data.address = address;
    if (description !== undefined) data.description = description;
    if (category) data.category = category;
    
    const business = await prisma.business.update({
      where: { id: businessId },
      data,
    });
    
    console.log(`[BUSINESS PATCH] Updated: id=${business.id}, name=${business.name}, status=${business.status}`);
    
    return NextResponse.json(business);
  } catch (error) {
    console.error('[BUSINESS PATCH] ERROR:', error);
    return NextResponse.json({ error: 'Failed to update business' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');
    
    if (!businessId) {
      return NextResponse.json({ error: 'Missing businessId' }, { status: 400 });
    }
    
    // First delete related records to avoid foreign key constraint issues
    // Delete in order of dependency
    await prisma.notification.deleteMany({
      where: { businessId }
    });
    
    await prisma.review.deleteMany({
      where: { businessId }
    });
    
    await prisma.booking.deleteMany({
      where: { businessId }
    });
    
    await prisma.timeSlot.deleteMany({
      where: { businessId }
    });
    
    await prisma.service.deleteMany({
      where: { businessId }
    });
    
    // Finally delete the business
    const business = await prisma.business.delete({
      where: { id: businessId }
    });
    
    return NextResponse.json({ success: true, business });
  } catch (error) {
    console.error('Delete business error:', error);
    return NextResponse.json({ error: 'Failed to delete business' }, { status: 500 });
  }
}