import prisma from './src/lib/db';

async function main() {
  // Find business users
  const businessUsers = await prisma.user.findMany({ where: { role: 'business' } });
  
  console.log('Creating businesses for', businessUsers.length, 'users...');
  
  for (const user of businessUsers) {
    const existing = await prisma.business.findUnique({ where: { userId: user.id } });
    if (!existing) {
      await prisma.business.create({
        data: {
          userId: user.id,
          name: user.name || 'My Business',
          contactPerson: user.name || 'Owner',
          phone: user.phone || '',
          email: user.email,
          address: 'Plovdiv, Bulgaria',
          category: 'hair',
          status: 'approved', // Auto-approve for testing
        }
      });
      console.log('Created business for', user.email);
    } else {
      console.log('Business already exists for', user.email);
    }
  }
  
  const allBusinesses = await prisma.business.findMany();
  console.log('\nAll businesses:', allBusinesses.map(b => ({ name: b.name, status: b.status, email: b.email })));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());