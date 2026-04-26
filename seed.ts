import prisma from './src/lib/db';

async function main() {
  console.log('Seeding database...');

  const adminEmail = 'admin@lastminute.bg';
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  
  if (!existingAdmin) {
    const { registerUser } = await import('./src/lib/actions');
    
    await registerUser('Admin', adminEmail, 'admin123', '+359888000000', 'admin');
    console.log('Created admin user');
  }

  console.log('Database seeded!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());