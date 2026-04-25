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

const mockBusinesses: Business[] = [
  {
    id: '1', userId: 'b1', name: 'Studio 22 Barbershop', contactPerson: 'Alex', phone: '+359 88 123 4567',
    email: 'studio22@plovdiv.bg', address: 'bulevard "Vasil Aprilov" 48, Plovdiv 4002',
    description: 'Premium barbershop in the heart of Plovdiv. Expert haircuts, beard grooming, and styling.',
    status: 'approved', commission: 10, rating: 4.9, reviewCount: 218, category: 'hair',
    imageUrl: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b09?w=400', createdAt: new Date('2023-01-01'),
  },
  {
    id: '2', userId: 'b2', name: 'Barber Studio 1', contactPerson: 'Martin', phone: '+359 88 234 5678',
    email: 'barberstudio1@plovdiv.bg', address: 'ulitsa "Lyuben Karavelov" 59, Plovdiv 4002',
    description: 'Professional barber services in Plovdiv. Known for the best fades.',
    status: 'approved', commission: 10, rating: 5.0, reviewCount: 156, category: 'hair',
    imageUrl: 'https://images.unsplash.com/photo-1503951911965-4d7a8f87bc6b?w=400', createdAt: new Date('2023-02-01'),
  },
  {
    id: '3', userId: 'b3', name: 'Studio 38 Barber Shop', contactPerson: 'Georgi', phone: '+359 88 345 6789',
    email: 'studio38@plovdiv.bg', address: 'bulevard "Maritsa" 27, Plovdiv 4003',
    description: 'Modern barbershop offering premium haircuts and beard services.',
    status: 'approved', commission: 10, rating: 4.8, reviewCount: 89, category: 'hair',
    imageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400', createdAt: new Date('2023-03-01'),
  },
  {
    id: '4', userId: 'b4', name: 'Double M Barbershop', contactPerson: 'Maria & Michael', phone: '+359 88 456 7890',
    email: 'doublem@plovdiv.bg', address: 'ulitsa "Ilarion Makariopolski" 25, Plovdiv 4000',
    description: 'Family barbershop in Plovdiv center. Professional services for the whole family.',
    status: 'approved', commission: 10, rating: 5.0, reviewCount: 203, category: 'hair',
    imageUrl: 'https://images.unsplash.com/photo-1568605117036-5f7ff8747e29?w=400', createdAt: new Date('2023-04-01'),
  },
  {
    id: '5', userId: 'b5', name: 'Karagyozov Studio Plovdiv', contactPerson: 'Karagyozov', phone: '+359 88 567 8901',
    email: 'karagyozov@plovdiv.bg', address: 'bulevard "Iztochen" 51, Plovdiv 4000',
    description: 'Traditional barbershop with modern techniques. Famous for classic cuts.',
    status: 'approved', commission: 10, rating: 4.7, reviewCount: 178, category: 'hair',
    imageUrl: 'https://images.unsplash.com/photo-1603398938378-e54e5c91eeb3?w=400', createdAt: new Date('2023-05-01'),
  },
  {
    id: '6', userId: 'b6', name: 'BarberShop Basri', contactPerson: 'Basri', phone: '+359 88 678 9012',
    email: 'basri@plovdiv.bg', address: 'ulitsa "Shipka" 27, Plovdiv 4003',
    description: 'Professional barber services with coloring available.',
    status: 'approved', commission: 10, rating: 4.9, reviewCount: 124, category: 'hair',
    imageUrl: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400', createdAt: new Date('2023-06-01'),
  },
  {
    id: '7', userId: 'b7', name: 'Fit Barber Studio', contactPerson: 'Fitness Team', phone: '+359 88 789 0123',
    email: 'fitbarber@plovdiv.bg', address: 'ulitsa "Macedonia" 47-49, Plovdiv 4013',
    description: 'Barber and fitness studio combo. Modern services.',
    status: 'approved', commission: 10, rating: 4.6, reviewCount: 67, category: 'hair',
    imageUrl: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b09?w=400', createdAt: new Date('2023-07-01'),
  },
  {
    id: '8', userId: 'b8', name: 'Meshari Barbers', contactPerson: 'Meshari', phone: '+359 88 890 1234',
    email: 'meshari@plovdiv.bg', address: 'bulevard "Hristo Botev" 138B, Plovdiv 4000',
    description: 'Traditional barber shop with modern flair. Expert in fades.',
    status: 'approved', commission: 10, rating: 4.8, reviewCount: 145, category: 'hair',
    imageUrl: 'https://images.unsplash.com/photo-1519558021667-99fdd6f660f6?w=400', createdAt: new Date('2023-08-01'),
  },
  {
    id: '9', userId: 'b9', name: 'Oxygen Barbershop', contactPerson: 'Stanimir', phone: '+359 88 901 2345',
    email: 'oxygen@plovdiv.bg', address: 'Plovdiv Center',
    description: 'Fresh approach to classic barbering. Premium products.',
    status: 'approved', commission: 10, rating: 5.0, reviewCount: 92, category: 'hair',
    imageUrl: 'https://images.unsplash.com/photo-1599351615870-7f2e63f57096?w=400', createdAt: new Date('2023-09-01'),
  },
  {
    id: '10', userId: 'b10', name: 'Barber Shop MEMO', contactPerson: 'Memo', phone: '+359 88 012 3456',
    email: 'memo@plovdiv.bg', address: 'Plovdiv',
    description: 'Top-rated barbershop in Plovdiv. Excellent service.',
    status: 'approved', commission: 10, rating: 4.6, reviewCount: 234, category: 'hair',
    imageUrl: 'https://images.unsplash.com/photo-1624880614138-f65b8d3cf84d?w=400', createdAt: new Date('2023-10-01'),
  },
  {
    id: '11', userId: 'b11', name: 'Moustache BARBER SHOP', contactPerson: 'Mustache Team', phone: '+359 88 123 4568',
    email: 'moustache@plovdiv.bg', address: 'Plovdiv',
    description: 'Great moustache specialists! Full beard and hair services.',
    status: 'approved', commission: 10, rating: 4.7, reviewCount: 88, category: 'hair',
    imageUrl: 'https://images.unsplash.com/photo-1633681926046-69b0646f70a7?w=400', createdAt: new Date('2023-11-01'),
  },
  {
    id: '12', userId: 'b12', name: 'Evolution Barber Shop', contactPerson: 'Evolution Team', phone: '+359 88 234 5679',
    email: 'evolution@plovdiv.bg', address: 'ulitsa "Rayko" 85, Plovdiv',
    description: 'Evolving the barber industry in Plovdiv.',
    status: 'approved', commission: 10, rating: 5.0, reviewCount: 156, category: 'hair',
    imageUrl: 'https://images.unsplash.com/photo-1588195538326-c5b1acd1f7b0?w=400', createdAt: new Date('2023-12-01'),
  },
];

const mockServices: Service[] = [
  { id: 's1', businessId: '1', category: 'hair', name: 'Haircut', subtype: 'Standard', price: 25, duration: 30 },
  { id: 's2', businessId: '1', category: 'hair', name: 'Haircut & Beard', subtype: 'Full Service', price: 35, duration: 45 },
  { id: 's3', businessId: '1', category: 'hair', name: 'Beard Trim', subtype: 'Styling', price: 15, duration: 20 },
  { id: 's4', businessId: '2', category: 'hair', name: 'Haircut', subtype: 'Standard', price: 20, duration: 30 },
  { id: 's5', businessId: '2', category: 'hair', name: 'Haircut & Beard', subtype: 'Full Service', price: 30, duration: 45 },
  { id: 's6', businessId: '2', category: 'hair', name: 'Beard Trim', subtype: 'Styling', price: 12, duration: 15 },
  { id: 's7', businessId: '3', category: 'hair', name: 'Haircut', subtype: 'Standard', price: 22, duration: 30 },
  { id: 's8', businessId: '3', category: 'hair', name: 'Haircut + Beard + Eyebrows', subtype: 'Premium', price: 35, duration: 50 },
  { id: 's9', businessId: '4', category: 'hair', name: 'Haircut', subtype: 'Standard', price: 20, duration: 30 },
  { id: 's10', businessId: '4', category: 'hair', name: 'Haircut & Beard', subtype: 'Full Service', price: 30, duration: 45 },
  { id: 's11', businessId: '5', category: 'hair', name: 'Classic Haircut', subtype: 'Traditional', price: 25, duration: 35 },
  { id: 's12', businessId: '5', category: 'hair', name: 'Hot Towel Shave', subtype: 'Razor', price: 20, duration: 30 },
  { id: 's13', businessId: '6', category: 'hair', name: 'Haircut', subtype: 'Standard', price: 22, duration: 30 },
  { id: 's14', businessId: '6', category: 'hair', name: 'Beard Coloring', subtype: 'Color', price: 25, duration: 30 },
  { id: 's15', businessId: '7', category: 'hair', name: 'Haircut', subtype: 'Standard', price: 20, duration: 30 },
  { id: 's16', businessId: '7', category: 'hair', name: 'Fade Cut', subtype: 'Modern', price: 25, duration: 35 },
  { id: 's17', businessId: '8', category: 'hair', name: 'Haircut', subtype: 'Standard', price: 24, duration: 30 },
  { id: 's18', businessId: '8', category: 'hair', name: 'Beard Styling', subtype: 'Design', price: 18, duration: 25 },
  { id: 's19', businessId: '9', category: 'hair', name: 'Haircut', subtype: 'Premium', price: 25, duration: 30 },
  { id: 's20', businessId: '10', category: 'hair', name: 'Haircut', subtype: 'Standard', price: 20, duration: 30 },
  { id: 's21', businessId: '11', category: 'hair', name: 'Haircut', subtype: 'Standard', price: 22, duration: 30 },
  { id: 's22', businessId: '12', category: 'hair', name: 'Haircut', subtype: 'Standard', price: 25, duration: 30 },
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
  { id: 'r6', userId: 'u6', businessId: '5', userName: 'Dimitar H.', rating: 4, comment: 'Classic cuts!', createdAt: new Date('2024-06-06') },
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