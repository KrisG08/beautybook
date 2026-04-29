const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding users and businesses...');
  
  // Create users first
  const userIds = [];
  for (let i = 1; i <= 20; i++) {
    const user = await prisma.user.create({
      data: {
        id: 'b' + i,
        name: 'Business User ' + i,
        email: 'user' + i + '@plovdiv.bg',
        password: 'password123',
        role: 'business',
      }
    });
    userIds.push(user.id);
  }
  console.log('Created ' + userIds.length + ' users');
  
  const businesses = [
    { userId: userIds[0], name: 'Studio 22 Barbershop', contactPerson: 'Atanas', phone: '+359 88 123 4567', email: 'studio22@plovdiv.bg', address: 'bulevard "Vasil Aprilov" 48, Plovdiv 4002', description: 'Creative barbershop at Medical University. Modern cuts & beard styling.', category: 'hair', imageUrl: 'https://images.unsplash.com/photo-1607780082253-e40c2e7c2c00?w=400', status: 'approved', rating: 5.0, reviewCount: 218 },
    { userId: userIds[1], name: 'Barber Studio', contactPerson: 'Petar', phone: '+359 88 234 5678', email: 'barberstudio@plovdiv.bg', address: 'ulitsa "Lyuben Karavelov" 59, Plovdiv 4002', description: 'Professional barbers near Ancient Theatre. Best fades in city.', category: 'hair', imageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400', status: 'approved', rating: 4.9, reviewCount: 156 },
    { userId: userIds[2], name: 'Studio 38 Barber Shop', contactPerson: 'Georgi', phone: '+359 88 345 6789', email: 'studio38@plovdiv.bg', address: 'bulevard "Maritsa" 27, Plovdiv 4003', description: 'Premium beard services & hot towel shaves in Karshiaka.', category: 'hair', imageUrl: 'https://images.unsplash.com/photo-1503951911965-4d7a8f87bc6b?w=400', status: 'approved', rating: 4.8, reviewCount: 89 },
    { userId: userIds[3], name: 'Barber Studio 2', contactPerson: 'Maria', phone: '+359 88 456 7890', email: 'barberstudio2@plovdiv.bg', address: 'ulitsa "Filip Makedonski" 49B, Plovdiv 4000', description: 'Second location near Plovdiv Central. Quality service.', category: 'hair', imageUrl: 'https://images.unsplash.com/photo-1568605117036-5f7f87bc29b?w=400', status: 'approved', rating: 5.0, reviewCount: 203 },
    { userId: userIds[4], name: 'Karagyozov Barbershop', contactPerson: 'Karagyozov', phone: '+359 88 567 8901', email: 'karagyozov@plovdiv.bg', address: 'bulevard "Iztochen" 51, Plovdiv 4000', description: 'Traditional techniques with modern flair. Classic cuts.', category: 'hair', imageUrl: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b09?w=400', status: 'approved', rating: 4.7, reviewCount: 178 },
    { userId: userIds[5], name: 'BarberShop Basri', contactPerson: 'Basri', phone: '+359 88 678 9012', email: 'basri@plovdiv.bg', address: 'ulitsa "Shipka" 27, Plovdiv 4003', description: 'Professional barber with coloring & styling services.', category: 'hair', imageUrl: 'https://images.unsplash.com/photo-1603398938378-e54e5c91eeb3?w=400', status: 'approved', rating: 4.9, reviewCount: 124 },
    { userId: userIds[6], name: 'Fit Barber Studio', contactPerson: 'Fit Team', phone: '+359 88 789 0123', email: 'fitbarber@plovdiv.bg', address: 'ulitsa "Macedonia" 47-49, Plovdiv 4013', description: 'Modern barbershop in Hristo Botev area.', category: 'hair', imageUrl: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400', status: 'approved', rating: 4.6, reviewCount: 67 },
    { userId: userIds[7], name: 'Meshari Barbers', contactPerson: 'Meshari', phone: '+359 88 890 1234', email: 'meshari@plovdiv.bg', address: 'bulevard "Hristo Botev" 138B, Plovdiv 4000', description: 'Expert in fades, beard sculpting & modern styling.', category: 'hair', imageUrl: 'https://images.unsplash.com/photo-1599351615870-7f2e63f57096?w=400', status: 'approved', rating: 4.8, reviewCount: 145 },
    { userId: userIds[8], name: 'Oxygen Barbershop', contactPerson: 'Stanimir', phone: '+359 88 901 2345', email: 'oxygen@plovdiv.bg', address: 'Plovdiv Center', description: 'Fresh approach to classic barbering. Premium products.', category: 'hair', imageUrl: 'https://images.unsplash.com/photo-1519558021667-99fdd6f660f6?w=400', status: 'approved', rating: 5.0, reviewCount: 92 },
    { userId: userIds[9], name: 'Barber Shop MEMO', contactPerson: 'Memo', phone: '+359 88 012 3456', email: 'memo@plovdiv.bg', address: 'Plovdiv', description: 'Top-rated barbershop. Excellent service & friendly staff.', category: 'hair', imageUrl: 'https://images.unsplash.com/photo-1633681926046-69b0646f70a7?w=400', status: 'approved', rating: 4.6, reviewCount: 234 },
    { userId: userIds[10], name: 'Luxe Nails Plovdiv', contactPerson: 'Elena', phone: '+359 88 111 2233', email: 'luxenails@plovdiv.bg', address: 'bulevard "Russia" 6, Plovdiv 4002', description: 'Premium nail studio. Gel, acrylic & nail art. Near Tsar Simeon Garden.', category: 'nails', imageUrl: 'https://images.unsplash.com/photo-1604654894610-df2494f9c7f8?w=400', status: 'approved', rating: 4.9, reviewCount: 156 },
    { userId: userIds[11], name: 'Nail Art Studio', contactPerson: 'Victoria', phone: '+359 88 222 3344', email: 'nailart@plovdiv.bg', address: 'ulitsa "Kamenitsa" 15, Plovdiv 4000', description: 'Creative nail art & luxury manicures in city center.', category: 'nails', imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37a?w=400', status: 'approved', rating: 4.8, reviewCount: 89 },
    { userId: userIds[12], name: 'Glamour Nails', contactPerson: 'Anna', phone: '+359 88 333 4455', email: 'glamournails@plovdiv.bg', address: 'ulitsa "Dragan Minkov" 12, Plovdiv 4003', description: 'Professional nail care & spa treatments.', category: 'nails', imageUrl: 'https://images.unsplash.com/photo-1516975080664-ed2fc2a6d278?w=400', status: 'approved', rating: 4.7, reviewCount: 67 },
    { userId: userIds[13], name: 'Perfect Nails Spa', contactPerson: 'Mirabella', phone: '+359 88 444 5566', email: 'perfectnails@plovdiv.bg', address: 'bulevard "Dunav" 35, Plovdiv 4003', description: 'Luxury nail spa & pedicure in Severen area.', category: 'nails', imageUrl: 'https://images.unsplash.com/photo-1632345031635-6e3d8f84c43d?w=400', status: 'approved', rating: 4.9, reviewCount: 203 },
    { userId: userIds[14], name: 'Hair Fashion Plovdiv', contactPerson: 'Style Team', phone: '+359 88 555 6677', email: 'hairfashion@plovdiv.bg', address: 'ulitsa "Gladston" 42, Plovdiv 4000', description: 'Modern hair styling & professional coloring.', category: 'hair', imageUrl: 'https://images.unsplash.com/photo-1607780082253-e40c2e7c2c00?w=400', status: 'approved', rating: 4.8, reviewCount: 145 },
    { userId: userIds[15], name: 'Princess Hair Studio', contactPerson: 'Princess', phone: '+359 88 666 7788', email: 'princess@plovdiv.bg', address: 'ulitsa "Otets Paisiy" 28, Plovdiv 4002', description: 'Luxury hair & beauty services for women.', category: 'hair', imageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400', status: 'approved', rating: 4.9, reviewCount: 178 },
    { userId: userIds[16], name: 'Gentlemens Club Plovdiv', contactPerson: 'Club Team', phone: '+359 88 777 8899', email: 'gentlemen@plovdiv.bg', address: 'bulevard "Shesti April" 66, Plovdiv 4000', description: 'Premium grooming for gentlemen only.', category: 'hair', imageUrl: 'https://images.unsplash.com/photo-1568605117036-5f7f87bc29b?w=400', status: 'approved', rating: 4.8, reviewCount: 234 },
    { userId: userIds[17], name: 'New Look Hairdressing', contactPerson: 'New Look', phone: '+359 88 888 9900', email: 'newlook@plovdiv.bg', address: 'ulitsa "Simeon Veliki" 18, Plovdiv 4001', description: 'Classic hairdressing & styling for all ages.', category: 'hair', imageUrl: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b09?w=400', status: 'approved', rating: 4.6, reviewCount: 123 },
  ];

  const createdBusinesses = [];
  for (const b of businesses) {
    const business = await prisma.business.create({ data: b });
    createdBusinesses.push(business);
  }
  console.log('Seeded ' + createdBusinesses.length + ' businesses');

  // Add services for each business
  const hairServices = [
    { name: 'Men\'s Haircut', price: 20, duration: 30 },
    { name: ' Beard Trim', price: 15, duration: 20 },
    { name: 'Hot Towel Shave', price: 18, duration: 25 },
    { name: 'Hair Wash & Style', price: 25, duration: 35 },
    { name: 'Hair Coloring', price: 45, duration: 90 },
    { name: 'Kids Haircut', price: 15, duration: 25 },
    { name: 'Senior Cut', price: 18, duration: 30 },
    { name: 'Hair Treatment', price: 30, duration: 45 },
  ];

  const nailServices = [
    { name: 'Classic Manicure', price: 20, duration: 30 },
    { name: 'Gel Manicure', price: 35, duration: 45 },
    { name: 'Acrylic Nails', price: 45, duration: 60 },
    { name: 'Nail Art', price: 25, duration: 30 },
    { name: 'Classic Pedicure', price: 25, duration: 40 },
    { name: 'Spa Pedicure', price: 40, duration: 60 },
    { name: 'Nail Repair', price: 10, duration: 15 },
    { name: 'Nail Polish Change', price: 12, duration: 15 },
  ];

  console.log('Adding services...');
  for (const business of createdBusinesses) {
    const services = business.category === 'hair' ? hairServices : nailServices;
    for (const service of services) {
      await prisma.service.create({
        data: {
          businessId: business.id,
          name: service.name,
          price: service.price,
          duration: service.duration,
          active: true,
        }
      });
    }
  }
  console.log('Services added');

  // Add time slots for each business (business hours: 9 AM to 8 PM)
  console.log('Adding time slots...');
  const today = new Date();
  for (let dayOffset = 0; dayOffset < 14; dayOffset++) {
    const date = new Date(today);
    date.setDate(date.getDate() + dayOffset);
    const dateStr = date.toISOString().split('T')[0];
    const dayOfWeek = date.getDay();
    
    // Closed on Sunday
    if (dayOfWeek === 0) continue;

    for (const business of createdBusinesses) {
      // Business hours: 9:00 - 20:00, 1-hour slots
      const timeSlots = [
        { start: '09:00', end: '10:00' },
        { start: '10:00', end: '11:00' },
        { start: '11:00', end: '12:00' },
        { start: '13:00', end: '14:00' },
        { start: '14:00', end: '15:00' },
        { start: '15:00', end: '16:00' },
        { start: '16:00', end: '17:00' },
        { start: '17:00', end: '18:00' },
        { start: '18:00', end: '19:00' },
        { start: '19:00', end: '20:00' },
      ];

      for (const slot of timeSlots) {
        // Randomly make some slots unavailable
        const available = Math.random() > 0.3;
        await prisma.timeSlot.create({
          data: {
            businessId: business.id,
            date: dateStr,
            startTime: slot.start,
            endTime: slot.end,
            available,
          }
        });
      }
    }
  }
  console.log('Time slots added');

  console.log('Seeding complete!');
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });