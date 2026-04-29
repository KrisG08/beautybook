import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function GET(request: NextRequest) {
  try {
    // Check if business user exists
    let businessUser = await prisma.user.findUnique({
      where: { email: 'business@lastminute.bg' }
    });

    const hashedPassword = await bcrypt.hash('business123', 10);

    if (!businessUser) {
      // Create business user
      businessUser = await prisma.user.create({
        data: {
          name: 'Business Owner',
          email: 'business@lastminute.bg',
          password: hashedPassword,
          phone: '+359885000002',
          role: 'business',
        }
      });
    } else {
      // Always set role to 'business' if user has business record
      businessUser = await prisma.user.update({
        where: { email: 'business@lastminute.bg' },
        data: { role: 'business', password: hashedPassword }
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
          description: 'Premium hair and beauty salon in Plovdiv',
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
      ];
      for (const svc of services) {
        await prisma.service.create({ data: { ...svc, businessId: business.id } });
      }
    }

    return NextResponse.json({ 
      success: true,
      user: { email: businessUser.email, role: businessUser.role },
      business: { name: business.name, status: business.status }
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}