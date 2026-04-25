import { create } from 'zustand';
import { User, Business, Service, TimeSlot, Booking, Review } from './types';
import { addDays, format } from 'date-fns';

interface AppState {
  currentUser: User | null;
  users: User[];
  businesses: Business[];
  services: Service[];
  timeSlots: TimeSlot[];
  bookings: Booking[];
  reviews: Review[];
  selectedCategory: string | null;
  selectedService: Service | null;
  selectedBusiness: Business | null;
  selectedSlot: TimeSlot | null;
  filters: {
    serviceType: string | null;
    subtype: string | null;
    date: string | null;
    time: string | null;
    priceRange: [number, number];
  };
  
  setCurrentUser: (user: User | null) => void;
  setSelectedCategory: (category: string | null) => void;
  setSelectedService: (service: Service | null) => void;
  setSelectedBusiness: (business: Business | null) => void;
  setSelectedSlot: (slot: TimeSlot | null) => void;
  setFilters: (filters: Partial<AppState['filters']>) => void;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string, phone: string) => User;
  logout: () => void;
  addBusiness: (business: Omit<Business, 'id' | 'createdAt' | 'status' | 'rating' | 'reviewCount'>) => Business;
  approveBusiness: (businessId: string) => void;
  rejectBusiness: (businessId: string) => void;
  addTimeSlot: (slot: Omit<TimeSlot, 'id'>) => void;
  createBooking: (userId: string, businessId: string, serviceId: string, slotId: string) => Booking;
  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => void;
  getAvailableSlots: (businessId: string, date: string) => TimeSlot[];
  getFilteredBusinesses: () => Business[];
}

const generateId = () => Math.random().toString(36).substring(2, 15);

// Verified working Unsplash URLs for barbershops and beauty salons
const BARBER_IMAGES = [
  'https://images.unsplash.com/photo-1585747860715-2ba37e788b09?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1503951911965-4d7a8f87bc6b?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1568605117036-5f7ff8747e29?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1603398938378-e54e5c91eeb3?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1519558021667-99fdd6f660f6?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1599351615870-7f2e63f57096?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1624880614138-f65b8d3cf84d?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1633681926046-69b0646f70a7?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1588195538326-c5b1acd1f7b0?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1608564697071-d4e1d47b4c5d?w=400&h=300&fit=crop',
];

const NAIL_IMAGES = [
  'https://images.unsplash.com/photo-1604654894610-df2494f9c7f8?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37a?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1516975080664-ed2fc2a6d278?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1632345031635-6e3d8f84c43d?w=400&h=300&fit=crop',
];

const mockBusinesses: Business[] = [
  // HAIR/BARBER SHOPS IN PLOVDIV
  {
    id: '1', userId: 'b1', name: 'Studio 22 Barbershop', contactPerson: 'Alex', phone: '+359 88 123 4567',
    email: 'studio22@plovdiv.bg', address: 'bulevard "Vasil Aprilov" 48, Plovdiv 4002',
    description: 'Premium barbershop in Plovdiv center. Expert haircuts & beard grooming.',
    status: 'approved', commission: 10, rating: 4.9, reviewCount: 218, category: 'hair',
    imageUrl: BARBER_IMAGES[0], createdAt: new Date('2023-01-01'),
  },
  {
    id: '2', userId: 'b2', name: 'Barber Studio 1', contactPerson: 'Martin', phone: '+359 88 234 5678',
    email: 'barberstudio1@plovdiv.bg', address: 'ulitsa "Lyuben Karavelov" 59, Plovdiv 4002',
    description: 'Professional barber services. Known for the best fades in Plovdiv.',
    status: 'approved', commission: 10, rating: 5.0, reviewCount: 156, category: 'hair',
    imageUrl: BARBER_IMAGES[1], createdAt: new Date('2023-02-01'),
  },
  {
    id: '3', userId: 'b3', name: 'Studio 38 Barber Shop', contactPerson: 'Georgi', phone: '+359 88 345 6789',
    email: 'studio38@plovdiv.bg', address: 'bulevard "Maritsa" 27, Plovdiv 4003',
    description: 'Modern barbershop with premium beard services.',
    status: 'approved', commission: 10, rating: 4.8, reviewCount: 89, category: 'hair',
    imageUrl: BARBER_IMAGES[2], createdAt: new Date('2023-03-01'),
  },
  {
    id: '4', userId: 'b4', name: 'Double M Barbershop', contactPerson: 'Maria & Michael', phone: '+359 88 456 7890',
    email: 'doublem@plovdiv.bg', address: 'ulitsa "Ilarion Makariopolski" 25, Plovdiv 4000',
    description: 'Family barbershop in Plovdiv center. Services for the whole family.',
    status: 'approved', commission: 10, rating: 5.0, reviewCount: 203, category: 'hair',
    imageUrl: BARBER_IMAGES[3], createdAt: new Date('2023-04-01'),
  },
  {
    id: '5', userId: 'b5', name: 'Karagyozov Studio', contactPerson: 'Karagyozov', phone: '+359 88 567 8901',
    email: 'karagyozov@plovdiv.bg', address: 'bulevard "Iztochen" 51, Plovdiv 4000',
    description: 'Traditional barbershop with modern techniques. Famous for classic cuts.',
    status: 'approved', commission: 10, rating: 4.7, reviewCount: 178, category: 'hair',
    imageUrl: BARBER_IMAGES[4], createdAt: new Date('2023-05-01'),
  },
  {
    id: '6', userId: 'b6', name: 'BarberShop Basri', contactPerson: 'Basri', phone: '+359 88 678 9012',
    email: 'basri@plovdiv.bg', address: 'ulitsa "Shipka" 27, Plovdiv 4003',
    description: 'Professional barber with coloring services.',
    status: 'approved', commission: 10, rating: 4.9, reviewCount: 124, category: 'hair',
    imageUrl: BARBER_IMAGES[5], createdAt: new Date('2023-06-01'),
  },
  {
    id: '7', userId: 'b7', name: 'Fit Barber Studio', contactPerson: 'Fitness Team', phone: '+359 88 789 0123',
    email: 'fitbarber@plovdiv.bg', address: 'ulitsa "Macedonia" 47-49, Plovdiv 4013',
    description: 'Barber & fitness combo. Modern services.',
    status: 'approved', commission: 10, rating: 4.6, reviewCount: 67, category: 'hair',
    imageUrl: BARBER_IMAGES[6], createdAt: new Date('2023-07-01'),
  },
  {
    id: '8', userId: 'b8', name: 'Meshari Barbers', contactPerson: 'Meshari', phone: '+359 88 890 1234',
    email: 'meshari@plovdiv.bg', address: 'bulevard "Hristo Botev" 138B, Plovdiv 4000',
    description: 'Traditional barber shop. Expert in fades and beard styling.',
    status: 'approved', commission: 10, rating: 4.8, reviewCount: 145, category: 'hair',
    imageUrl: BARBER_IMAGES[7], createdAt: new Date('2023-08-01'),
  },
  {
    id: '9', userId: 'b9', name: 'Oxygen Barbershop', contactPerson: 'Stanimir', phone: '+359 88 901 2345',
    email: 'oxygen@plovdiv.bg', address: 'Plovdiv Center',
    description: 'Fresh approach to classic barbering. Premium products.',
    status: 'approved', commission: 10, rating: 5.0, reviewCount: 92, category: 'hair',
    imageUrl: BARBER_IMAGES[8], createdAt: new Date('2023-09-01'),
  },
  {
    id: '10', userId: 'b10', name: 'Barber Shop MEMO', contactPerson: 'Memo', phone: '+359 88 012 3456',
    email: 'memo@plovdiv.bg', address: 'Plovdiv',
    description: 'Top-rated barbershop in Plovdiv. Excellent service.',
    status: 'approved', commission: 10, rating: 4.6, reviewCount: 234, category: 'hair',
    imageUrl: BARBER_IMAGES[9], createdAt: new Date('2023-10-01'),
  },
  {
    id: '11', userId: 'b11', name: 'Moustache BARBER SHOP', contactPerson: 'Mustache Team', phone: '+359 88 123 4568',
    email: 'moustache@plovdiv.bg', address: 'Plovdiv',
    description: 'Great moustache specialists! Full beard services.',
    status: 'approved', commission: 10, rating: 4.7, reviewCount: 88, category: 'hair',
    imageUrl: BARBER_IMAGES[10], createdAt: new Date('2023-11-01'),
  },
  {
    id: '12', userId: 'b12', name: 'Evolution Barber Shop', contactPerson: 'Evolution Team', phone: '+359 88 234 5679',
    email: 'evolution@plovdiv.bg', address: 'ulitsa "Rayko" 85, Plovdiv',
    description: 'Evolving the barber industry in Plovdiv.',
    status: 'approved', commission: 10, rating: 5.0, reviewCount: 156, category: 'hair',
    imageUrl: BARBER_IMAGES[11], createdAt: new Date('2023-12-01'),
  },
  // NAILS SALONS IN PLOVDIV
  {
    id: '13', userId: 'n1', name: 'Luxe Nails Plovdiv', contactPerson: 'Elena', phone: '+359 88 111 2233',
    email: 'luxenails@plovdiv.bg', address: 'bulevard "Russia" 6, Plovdiv 4002',
    description: 'Premium nail studio. Gel, acrylic & nail art services.',
    status: 'approved', commission: 10, rating: 4.9, reviewCount: 156, category: 'nails',
    imageUrl: NAIL_IMAGES[0], createdAt: new Date('2023-06-01'),
  },
  {
    id: '14', userId: 'n2', name: 'Nail Art Studio Plovdiv', contactPerson: 'Victoria', phone: '+359 88 222 3344',
    email: 'nailart@plovdiv.bg', address: 'ulitsa "Kamenitsa" 15, Plovdiv 4000',
    description: 'Creative nail art & luxury manicures.',
    status: 'approved', commission: 10, rating: 4.8, reviewCount: 89, category: 'nails',
    imageUrl: NAIL_IMAGES[1], createdAt: new Date('2023-07-15'),
  },
  {
    id: '15', userId: 'n3', name: 'Glamour Nails', contactPerson: 'Anna', phone: '+359 88 333 4455',
    email: 'glamournails@plovdiv.bg', address: 'ulitsa "Doctorendo" 12, Plovdiv 4003',
    description: 'Professional nail care & spa treatments.',
    status: 'approved', commission: 10, rating: 4.7, reviewCount: 67, category: 'nails',
    imageUrl: NAIL_IMAGES[2], createdAt: new Date('2023-08-01'),
  },
  {
    id: '16', userId: 'n4', name: 'Perfect Nails Plovdiv', contactPerson: 'Mirabella', phone: '+359 88 444 5566',
    email: 'perfectnails@plovdiv.bg', address: 'bulevard "Dunav" 35, Plovdiv 4003',
    description: 'Nail spa & pedicure luxury services.',
    status: 'approved', commission: 10, rating: 4.9, reviewCount: 203, category: 'nails',
    imageUrl: NAIL_IMAGES[3], createdAt: new Date('2023-09-01'),
  },
  // MORE HAIR SALONS IN PLOVDIV
  {
    id: '17', userId: 'h1', name: 'Hair Fashion Plovdiv', contactPerson: 'Stylist Team', phone: '+359 88 555 6677',
    email: 'hairfashion@plovdiv.bg', address: 'ulitsa "Gladston" 42, Plovdiv 4000',
    description: 'Modern hair styling & coloring.',
    status: 'approved', commission: 10, rating: 4.8, reviewCount: 145, category: 'hair',
    imageUrl: BARBER_IMAGES[0], createdAt: new Date('2023-10-01'),
  },
  {
    id: '18', userId: 'h2', name: 'Princess Hair Studio', contactPerson: 'Princess', phone: '+359 88 666 7788',
    email: 'princess@plovdiv.bg', address: 'ulitsa "Otets Paisiy" 28, Plovdiv 4002',
    description: 'Luxury hair & beauty services for women.',
    status: 'approved', commission: 10, rating: 4.9, reviewCount: 178, category: 'hair',
    imageUrl: BARBER_IMAGES[1], createdAt: new Date('2023-11-01'),
  },
  {
    id: '19', userId: 'h3', name: 'Gentlemen\'s Club Plovdiv', contactPerson: 'Club Team', phone: '+359 88 777 8899',
    email: 'gentlemen@plovdiv.bg', address: 'bulevard "Shesti April" 66, Plovdiv 4000',
    description: 'Premium grooming for gentlemen.',
    status: 'approved', commission: 10, rating: 4.8, reviewCount: 234, category: 'hair',
    imageUrl: BARBER_IMAGES[2], createdAt: new Date('2023-12-01'),
  },
  {
    id: '20', userId: 'h4', name: 'New Look Hairdressing', contactPerson: 'New Look Team', phone: '+359 88 888 9900',
    email: 'newlook@plovdiv.bg', address: 'ulitsa "Simeon Veliki" 18, Plovdiv 4001',
    description: 'Classic hairdressing & styling.',
    status: 'approved', commission: 10, rating: 4.6, reviewCount: 123, category: 'hair',
    imageUrl: BARBER_IMAGES[3], createdAt: new Date('2024-01-01'),
  },
];

const mockServices: Service[] = [
  // Services for Barbershops (business IDs 1-12)
  { id: 's1', businessId: '1', category: 'hair', name: 'Haircut', subtype: 'Standard', price: 25, duration: 30 },
  { id: 's2', businessId: '1', category: 'hair', name: 'Haircut & Beard', subtype: 'Full', price: 35, duration: 45 },
  { id: 's3', businessId: '1', category: 'hair', name: 'Beard Trim', subtype: 'Styling', price: 15, duration: 20 },
  { id: 's4', businessId: '2', category: 'hair', name: 'Haircut', subtype: 'Standard', price: 20, duration: 30 },
  { id: 's5', businessId: '2', category: 'hair', name: 'Fade Cut', subtype: 'Modern', price: 25, duration: 35 },
  { id: 's6', businessId: '3', category: 'hair', name: 'Haircut', subtype: 'Standard', price: 22, duration: 30 },
  { id: 's7', businessId: '3', category: 'hair', name: 'Full Service', subtype: 'Premium', price: 40, duration: 50 },
  { id: 's8', businessId: '4', category: 'hair', name: 'Haircut', subtype: 'Standard', price: 20, duration: 30 },
  { id: 's9', businessId: '4', category: 'hair', name: 'Beard Styling', subtype: 'Design', price: 18, duration: 25 },
  { id: 's10', businessId: '5', category: 'hair', name: 'Classic Haircut', subtype: 'Traditional', price: 25, duration: 35 },
  { id: 's11', businessId: '6', category: 'hair', name: 'Haircut', subtype: 'Standard', price: 22, duration: 30 },
  { id: 's12', businessId: '7', category: 'hair', name: 'Haircut', subtype: 'Standard', price: 20, duration: 30 },
  { id: 's13', businessId: '8', category: 'hair', name: 'Haircut', subtype: 'Standard', price: 24, duration: 30 },
  { id: 's14', businessId: '9', category: 'hair', name: 'Premium Cut', subtype: 'VIP', price: 30, duration: 40 },
  { id: 's15', businessId: '10', category: 'hair', name: 'Haircut', subtype: 'Standard', price: 20, duration: 30 },
  // Services for Nails (business IDs 13-16)
  { id: 's20', businessId: '13', category: 'nails', name: 'Gel Manicure', subtype: 'Gel', price: 45, duration: 45 },
  { id: 's21', businessId: '13', category: 'nails', name: 'Classic Manicure', subtype: 'Regular', price: 25, duration: 30 },
  { id: 's22', businessId: '13', category: 'nails', name: 'Nail Art', subtype: 'Design', price: 35, duration: 40 },
  { id: 's23', businessId: '14', category: 'nails', name: 'Gel Manicure', subtype: 'Gel', price: 40, duration: 40 },
  { id: 's24', businessId: '14', category: 'nails', name: 'Acrylic Nails', subtype: 'Acrylic', price: 55, duration: 60 },
  { id: 's25', businessId: '15', category: 'nails', name: 'Manicure', subtype: 'Standard', price: 22, duration: 25 },
  { id: 's26', businessId: '15', category: 'nails', name: 'Pedicure', subtype: 'Spa', price: 40, duration: 45 },
  { id: 's27', businessId: '16', category: 'nails', name: 'Luxury Manicure', subtype: 'Spa', price: 50, duration: 50 },
  { id: 's28', businessId: '16', category: 'nails', name: 'Gel Polish', subtype: 'Color', price: 35, duration: 35 },
  // Services for Hair salons (business IDs 17-20)
  { id: 's30', businessId: '17', category: 'hair', name: 'Haircut & Style', subtype: 'Styling', price: 35, duration: 45 },
  { id: 's31', businessId: '17', category: 'hair', name: 'Hair Coloring', subtype: 'Full Color', price: 60, duration: 90 },
  { id: 's32', businessId: '18', category: 'hair', name: 'Haircut', subtype: 'Standard', price: 30, duration: 35 },
  { id: 's33', businessId: '18', category: 'hair', name: 'Blow Dry', subtype: 'Style', price: 25, duration: 30 },
  { id: 's34', businessId: '19', category: 'hair', name: 'Haircut', subtype: 'Premium', price: 35, duration: 40 },
  { id: 's35', businessId: '19', category: 'hair', name: 'Hot Towel Shave', subtype: 'Classic', price: 20, duration: 30 },
  { id: 's36', businessId: '20', category: 'hair', name: 'Haircut', subtype: 'Standard', price: 22, duration: 30 },
  { id: 's37', businessId: '20', category: 'hair', name: 'Treatment', subtype: 'Care', price: 30, duration: 40 },
];

const generateTimeSlots = (businessId: string, daysAhead: number = 7): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const times = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
  
  for (let d = 0; d <= daysAhead; d++) {
    const date = addDays(new Date(), d);
    const dateStr = format(date, 'yyyy-MM-dd');
    times.forEach((time, i) => {
      slots.push({
        id: `${businessId}-${dateStr}-${i}`,
        businessId,
        date: dateStr,
        startTime: time,
        endTime: times[i + 1] || '18:00',
        available: Math.random() > 0.3,
      });
    });
  }
  return slots;
};

const allBusinessIds = mockBusinesses.map(b => b.id);
const mockTimeSlots: TimeSlot[] = allBusinessIds.flatMap(id => generateTimeSlots(id));

const mockReviews: Review[] = [
  { id: 'r1', userId: 'u1', businessId: '1', userName: 'Ivan D.', rating: 5, comment: 'Best barbershop in Plovdiv!', createdAt: new Date('2024-06-01') },
  { id: 'r2', userId: 'u2', businessId: '1', userName: 'Petar M.', rating: 5, comment: 'Great service!', createdAt: new Date('2024-05-28') },
  { id: 'r3', userId: 'u3', businessId: '2', userName: 'Georgi S.', rating: 5, comment: 'My go-to place!', createdAt: new Date('2024-06-05') },
  { id: 'r4', userId: 'u4', businessId: '3', userName: 'Nikolay R.', rating: 4, comment: 'Very professional.', createdAt: new Date('2024-06-03') },
  { id: 'r5', userId: 'u5', businessId: '4', userName: 'Stoyan K.', rating: 5, comment: 'Excellent fade!', createdAt: new Date('2024-06-01') },
  { id: 'r6', userId: 'u6', businessId: '13', userName: 'Maria P.', rating: 5, comment: 'Love my nails!', createdAt: new Date('2024-06-06') },
  { id: 'r7', userId: 'u7', businessId: '16', userName: 'Elena R.', rating: 5, comment: 'Best nail spa in Plovdiv!', createdAt: new Date('2024-05-20') },
  { id: 'r8', userId: 'u8', businessId: '18', userName: 'Daniela H.', rating: 4, comment: 'Beautiful styling!', createdAt: new Date('2024-06-02') },
];

export const useStore = create<AppState>((set, get) => ({
  currentUser: null,
  users: [],
  businesses: mockBusinesses,
  services: mockServices,
  timeSlots: mockTimeSlots,
  bookings: [],
  reviews: mockReviews,
  selectedCategory: null,
  selectedService: null,
  selectedBusiness: null,
  selectedSlot: null,
  filters: { serviceType: null, subtype: null, date: null, time: null, priceRange: [0, 300] },

  setCurrentUser: (user) => set({ currentUser: user }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSelectedService: (service) => set({ selectedService: service }),
  setSelectedBusiness: (business) => set({ selectedBusiness: business }),
  setSelectedSlot: (slot) => set({ selectedSlot: slot }),
  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
  
  login: (email, password) => {
    const user = get().users.find(u => u.email === email);
    if (user && user.password === password) {
      set({ currentUser: user });
      return true;
    }
    return false;
  },
  
  register: (name, email, password, phone) => {
    const newUser: User = { id: generateId(), email, password, name, phone, role: 'client', createdAt: new Date() };
    set((state) => ({ users: [...state.users, newUser], currentUser: newUser }));
    return newUser;
  },
  
  logout: () => set({ currentUser: null }),
  
  addBusiness: (business) => {
    const newBusiness: Business = { ...business, id: generateId(), status: 'pending', rating: 0, reviewCount: 0, createdAt: new Date() };
    set((state) => ({ businesses: [...state.businesses, newBusiness] }));
    return newBusiness;
  },
  
  approveBusiness: (businessId) => {
    set((state) => ({ businesses: state.businesses.map(b => b.id === businessId ? { ...b, status: 'approved' as const } : b) }));
  },
  
  rejectBusiness: (businessId) => {
    set((state) => ({ businesses: state.businesses.map(b => b.id === businessId ? { ...b, status: 'rejected' as const } : b) }));
  },
  
  addTimeSlot: (slot) => {
    const newSlot: TimeSlot = { ...slot, id: generateId() };
    set((state) => ({ timeSlots: [...state.timeSlots, newSlot] }));
  },
  
  createBooking: (userId, businessId, serviceId, slotId) => {
    const service = get().services.find(s => s.id === serviceId);
    const booking: Booking = { id: generateId(), userId, businessId, serviceId, slotId, status: 'confirmed', totalPrice: service?.price || 0, createdAt: new Date() };
    set((state) => ({
      bookings: [...state.bookings, booking],
      timeSlots: state.timeSlots.map(s => s.id === slotId ? { ...s, available: false } : s),
    }));
    return booking;
  },
  
  addReview: (review) => {
    const newReview: Review = { ...review, id: generateId(), createdAt: new Date() };
    set((state) => ({ reviews: [...state.reviews, newReview] }));
  },
  
  getAvailableSlots: (businessId, date) => {
    return get().timeSlots.filter(s => s.businessId === businessId && s.date === date && s.available);
  },
  
  getFilteredBusinesses: () => {
    const { filters, businesses } = get();
    return businesses.filter(b => {
      if (b.status !== 'approved') return false;
      if (filters.serviceType && b.category !== filters.serviceType) return false;
      return true;
    });
  },
}));