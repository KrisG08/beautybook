import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, phone, role, businessName, contactPerson, address, category } = await request.json();
    
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
      data: { name: name || 'User', email, password: hashedPassword, phone, role },
    });

    // If registering as business, create business record too
    if (role === 'business' && businessName) {
      await prisma.business.create({
        data: {
          userId: user.id,
          name: businessName,
          contactPerson: contactPerson || name,
          phone: phone || '',
          email,
          address: address || 'Plovdiv, Bulgaria',
          category: category || 'hair',
          status: 'pending',
        },
      });
    }

    return NextResponse.json({ 
      user: { id: user.id, name: user.name, email: user.email, role: user.role } 
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}