import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { secret } = await request.json();
    
    if (secret !== 'create-test-2024') {
      return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
    }

    const hashedPassword = await bcrypt.hash('test123', 10);
    const hashedAdminPassword = await bcrypt.hash('admin123', 10);
    const hashedBusinessPassword = await bcrypt.hash('business123', 10);

    // Create test admin user
    const adminUser = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@lastminute.bg',
        password: hashedAdminPassword,
        phone: '+359885000000',
        role: 'admin',
      }
    });

    // Create test business user
    const businessUser = await prisma.user.create({
      data: {
        name: 'Business Owner',
        email: 'business@lastminute.bg',
        password: hashedBusinessPassword,
        phone: '+359885000002',
        role: 'business',
      }
    });

    // Create approved business for test business user
    const business = await prisma.business.create({
      data: {
        name: 'Glamour Studio Plovdiv',
        contactPerson: 'Maria Ivanova',
        email: 'business@lastminute.bg',
        phone: '+359885000002',
        address: 'ul. "Knyaz Alexander I" 12, Plovdiv',
        description: 'Premium hair and beauty salon in the heart of Plovdiv. Expert stylists, modern techniques, and luxury products.',
        category: 'hair',
        status: 'approved',
        rating: 4.8,
        reviewCount: 124,
        commission: 10,
        userId: businessUser.id,
      }
    });

    // Add some services
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

    // Create test client user
    const clientUser = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@lastminute.bg',
        password: hashedPassword,
        phone: '+359885000001',
        role: 'client',
      }
    });

    return NextResponse.json({ 
      message: 'All test users created with hashed passwords!',
      users: [
        { email: 'admin@lastminute.bg', password: 'admin123', role: 'admin' },
        { email: 'business@lastminute.bg', password: 'business123', role: 'business' },
        { email: 'test@lastminute.bg', password: 'test123', role: 'client' }
      ]
    });
  } catch (error) {
    console.error('Create test user error:', error);
    return NextResponse.json({ 
      error: 'Failed to create users', 
      details: String(error) 
    }, { status: 500 });
  }
}