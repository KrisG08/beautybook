import prisma from './src/lib/db';

async function main() {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true }
  });
  
  console.table(users);
  
  const businesses = await prisma.business.findMany({
    select: { id: true, name: true, status: true, category: true }
  });
  
  console.log('\nBusinesses:');
  console.table(businesses);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());