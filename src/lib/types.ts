export type UserRole = 'client' | 'business' | 'admin';

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  phone: string;
  role: UserRole;
  createdAt: Date;
}

export interface Business {
  id: string;
  userId: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  commission: number;
  bankAccount?: BankAccount;
  rating: number;
  reviewCount: number;
  category: string;
  imageUrl?: string;
  createdAt: Date;
}

export interface BankAccount {
  bankName: string;
  accountNumber: string;
  routingNumber: string;
  accountHolderName: string;
}

export interface Service {
  id: string;
  businessId: string;
  category: string;
  name: string;
  subtype: string;
  price: number;
  duration: number;
}

export interface TimeSlot {
  id: string;
  businessId: string;
  date: string;
  startTime: string;
  endTime: string;
  available: boolean;
}

export interface Booking {
  id: string;
  userId: string;
  businessId: string;
  serviceId: string;
  slotId: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  totalPrice: number;
  createdAt: Date;
}

export interface Review {
  id: string;
  userId: string;
  businessId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export const CATEGORIES: Category[] = [
  { id: 'hair', name: 'Hair', icon: 'Scissors', color: '#E8B4B8' },
  { id: 'nails', name: 'Nails', icon: 'Hand', color: '#C9A87C' },
  { id: 'skin', name: 'Skin', icon: 'Sparkles', color: '#F5E6E8' },
  { id: 'massage', name: 'Massage', icon: 'Heart', color: '#7CB98B' },
  { id: 'makeup', name: 'Makeup', icon: 'Palette', color: '#E57373' },
  { id: 'brows', name: 'Brows', icon: 'Eye', color: '#FFB74D' },
];