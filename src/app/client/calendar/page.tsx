'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, MapPin, CheckCircle, XCircle } from 'lucide-react';
import { ClientBottomNav, TabButton, Badge } from '@/components/UI';
import { useStore } from '@/lib/store';
import { format } from 'date-fns';

const colors = {
  primary: '#E8B4B8',
  secondary: '#F5E6E8',
  accent: '#C9A87C',
  background: '#FFFBFA',
  surface: '#FFFFFF',
  textPrimary: '#2D2A2A',
  textSecondary: '#6B6565',
  textMuted: '#9A9595',
  success: '#7CB98B',
  error: '#E57373',
  warning: '#FFB74D',
};

export default function ClientCalendar() {
  const router = useRouter();
  const { bookings, businesses, services, timeSlots, currentUser } = useStore();
  const [activeTab, setActiveTab] = useState('upcoming');

  const userBookings = bookings.filter(b => b.userId === currentUser?.id);
  
  const now = new Date();
  const pastBookings = userBookings.filter(b => {
    const slot = timeSlots.find(s => s.id === b.slotId);
    return slot && new Date(slot.date) < now;
  });
  const upcomingBookings = userBookings.filter(b => {
    const slot = timeSlots.find(s => s.id === b.slotId);
    return slot && new Date(slot.date) >= now;
  });
  const currentBookings = upcomingBookings.filter(b => b.status === 'confirmed');

  const displayBookings = activeTab === 'upcoming' ? upcomingBookings 
    : activeTab === 'past' ? pastBookings 
    : currentBookings;

  return (
    <div className="container" style={{ paddingBottom: 80 }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h1 style={{ fontSize: 28, marginBottom: 24, color: colors.textPrimary }}>
          My Bookings
        </h1>

        <div style={{ 
          display: 'flex', 
          borderBottom: '2px solid ' + colors.secondary,
          marginBottom: 24 
        }}>
          <TabButton 
            label="Upcoming" 
            active={activeTab === 'upcoming'} 
            onClick={() => setActiveTab('upcoming')} 
          />
          <TabButton 
            label="Current" 
            active={activeTab === 'current'} 
            onClick={() => setActiveTab('current')} 
          />
          <TabButton 
            label="Past" 
            active={activeTab === 'past'} 
            onClick={() => setActiveTab('past')} 
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {displayBookings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40 }}>
              <Calendar size={48} stroke={colors.textMuted} style={{ marginBottom: 16 }} />
              <p style={{ color: colors.textMuted, marginBottom: 8 }}>No bookings yet</p>
              <p style={{ color: colors.textMuted, fontSize: 14 }}>
                {activeTab === 'upcoming' ? 'Book your first service!' : 'No past bookings'}
              </p>
            </div>
          ) : (
            displayBookings.map((booking, index) => {
              const business = businesses.find(b => b.id === booking.businessId);
              const service = services.find(s => s.id === booking.serviceId);
              const slot = timeSlots.find(s => s.id === booking.slotId);
              
              return (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  style={{
                    background: colors.surface,
                    borderRadius: 16,
                    padding: 16,
                    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: colors.textPrimary }}>
                      {business?.name}
                    </h3>
                    <Badge variant={booking.status === 'confirmed' ? 'success' : booking.status === 'completed' ? 'success' : 'warning'}>
                      {booking.status}
                    </Badge>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <Calendar size={14} stroke={colors.textMuted} />
                    <span style={{ fontSize: 14, color: colors.textSecondary }}>
                      {slot ? format(new Date(slot.date), 'EEE, MMM d, yyyy') : 'N/A'}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <Clock size={14} stroke={colors.textMuted} />
                    <span style={{ fontSize: 14, color: colors.textSecondary }}>
                      {slot ? `${slot.startTime} - ${slot.endTime}` : 'N/A'}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <MapPin size={14} stroke={colors.textMuted} />
                    <span style={{ fontSize: 14, color: colors.textSecondary }}>
                      {business?.address}
                    </span>
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    paddingTop: 12,
                    borderTop: '1px solid ' + colors.secondary 
                  }}>
                    <span style={{ fontSize: 14, color: colors.textSecondary }}>
                      {service?.name}
                    </span>
                    <span style={{ fontSize: 16, fontWeight: 600, color: colors.primary }}>
                      ${booking.totalPrice}
                    </span>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </motion.div>

      <ClientBottomNav active="calendar" />
    </div>
  );
}