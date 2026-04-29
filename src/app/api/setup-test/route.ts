import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    // Find or create business user
    let businessUser = await prisma.user.findUnique({
      where: { email: 'business@lastminute.bg' }
    });

    if (!businessUser) {
      const hashedPassword = await bcrypt.hash('business123', 10);
      businessUser = await prisma.user.create({
        data: {
          name: 'Business Owner',
          email: 'business@lastminute.bg',
          password: hashedPassword,
          phone: '+359885000002',
          role: 'business',
        }
      });
    }

    // Check if business exists
    let business = await prisma.business.findUnique({
      where: { userId: businessUser.id }
    });

    if (!business) {
      business = await prisma.business.create({
        data: {
          name: 'Glamour Studio Plovdiv',
          contactPerson: 'Maria Ivanova',
          email: 'business@lastminute.bg',
          phone: '+359885000002',
          address: 'ul. "Knyaz Alexander I" 12, Plovdiv',
          description: 'Premium hair and beauty salon in the heart of Plovdiv.',
          category: 'hair',
          status: 'approved',
          rating: 4.8,
          reviewCount: 124,
          commission: 10,
          userId: businessUser.id,
        }
      });

      // Add services
      const services = [
        { name: 'Haircut & Styling', category: 'hair', subtype: 'cut', price: 45, duration: 60 },
        { name: 'Hair Coloring', category: 'hair', subtype: 'color', price: 80, duration: 120 },
        { name: 'Balayage', category: 'hair', subtype: 'color', price: 120, duration: 180 },
        { name: 'Blow Dry', category: 'hair', subtype: 'styling', price: 25, duration: 30 },
        { name: 'Keratin Treatment', category: 'hair', subtype: 'treatment', price: 150, duration: 150 },
      ];
      for (const svc of services) {
        await prisma.service.create({ data: { ...svc, businessId: business.id } });
      }
    }

    return NextResponse.json({ 
      success: true,
      business: { name: business.name, status: business.status }
    });
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}