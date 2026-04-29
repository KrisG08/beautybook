import prisma from './src/lib/db';

async function main() {
  // Get all businesses
  const businesses = await prisma.business.findMany({ orderBy: { category: 'asc' } });
  
  console.log(`Total businesses: ${businesses.length}\n`);
  
  for (const b of businesses) {
    const serviceCount = await prisma.service.count({ where: { businessId: b.id } });
    const slotCount = await prisma.timeSlot.count({ where: { businessId: b.id } });
    console.log(`${b.name} (${b.category}) - Services: ${serviceCount}, Slots: ${slotCount}`);
  }
}

main().then(() => prisma.$disconnect()).catch(console.error);