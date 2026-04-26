import prisma from './src/lib/db';

async function main() {
  const businesses = await prisma.business.findMany();
  console.log('All businesses:', JSON.stringify(businesses, null, 2));
  
  const users = await prisma.user.findMany({ where: { role: 'business' } });
  console.log('\nBusiness users:', JSON.stringify(users, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());