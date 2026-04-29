import prisma from './src/lib/db';

async function main() {
  const businesses = await prisma.business.findMany({
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      email: true,
      category: true,
      status: true,
      rating: true,
      address: true
    }
  });
  
  console.log('All Businesses in the app:\n');
  businesses.forEach((b, i) => {
    console.log(`${i + 1}. ${b.name}`);
    console.log(`   Email: ${b.email}`);
    console.log(`   Category: ${b.category}`);
    console.log(`   Status: ${b.status}`);
    console.log(`   Rating: ${b.rating}`);
    console.log(`   Address: ${b.address}`);
    console.log('');
  });
  
  console.log(`Total: ${businesses.length} businesses`);
}

main().then(() => prisma.$disconnect()).catch(console.error);