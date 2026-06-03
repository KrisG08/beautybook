import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  try {
    const { name, email, password, phone, role, businessName, contactPerson, address, category } = await request.json();
    
    console.log(`[REGISTER] New registration attempt: email=${email}, role=${role}, businessName=${businessName || 'N/A'}`);
    
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      console.log(`[REGISTER] Rejected: email already exists: ${email}`);
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
      data: { name: name || 'User', email, password: hashedPassword, phone, role },
    });
    console.log(`[REGISTER] User created: id=${user.id}, name=${user.name}, role=${user.role} (${Date.now() - startTime}ms)`);

    // If registering as business, create business record too
    if (role === 'business' && businessName) {
      const business = await prisma.business.create({
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
      console.log(`[REGISTER] Business created: id=${business.id}, name=${business.name}, status=${business.status} (${Date.now() - startTime}ms)`);
      
      // Verify the business was saved
      const verify = await prisma.business.findUnique({ where: { id: business.id } });
      console.log(`[REGISTER] Database verification: ${verify ? 'OK - business exists in DB' : 'FAILED - business NOT found in DB'}`);
    }

    return NextResponse.json({ 
      user: { id: user.id, name: user.name, email: user.email, role: user.role } 
    });
  } catch (error) {
    console.error(`[REGISTER] ERROR:`, error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}