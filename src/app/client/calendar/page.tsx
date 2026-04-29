'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, MapPin, CheckCircle, XCircle } from 'lucide-react';
import { ClientBottomNav, TabButton, Badge } from '@/components/UI';
import { useStore } from '@/lib/store';
import { format } from 'date-fns';

const colors = {
  primary: '#fdfcd2',
  secondary: '#140755',
  accent: '#ff6b9d',
  surface: '#12122a',
  surfaceLight: '#1a1a3a',
  background: '#0a0a1a',
  textPrimary: '#fdfcd2',
  textSecondary: '#b8b8d0',
  textMuted: '#6a6a8a',
  border: '#2a2a4a',
  success: '#00e676',
  error: '#ff5252',
  warning: '#ffab40',
};

export default function ClientCalendar() {
  const router = useRouter();
  const { bookings, businesses, services, timeSlots, currentUser, updateBookingStatus } = useStore();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [hydratedUser, setHydratedUser] = useState<any>(null);
  const [localBookings, setLocalBookings] = useState<any[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [businessesList, setBusinessesList] = useState<any[]>([]);
  const [servicesList, setServicesList] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        setHydratedUser(JSON.parse(stored));
      } catch {}
    }
    
    // Load bookings directly from localStorage
    const storedBookings = localStorage.getItem('bookings');
    if (storedBookings) {
      try {
        setLocalBookings(JSON.parse(storedBookings));
      } catch {}
    }

    // Load businesses from API
    fetch('/api/data/businesses')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setBusinessesList(data);
        }
      })
      .catch(() => {});

    // Load all services
    fetch('/api/data/services')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setServicesList(data);
        }
      })
      .catch(() => {});
  }, [refreshKey]);

  const activeUser = currentUser || hydratedUser;
  const userBookings = localBookings;
  const displayBookings = userBookings.filter(b => b.status !== 'cancelled');

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
              const business = businessesList.find(b => b.id === booking.businessId);
              const service = servicesList.find(s => s.id === booking.serviceId);
              
              console.log('Booking in calendar:', booking);
              
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
                      {business?.name || 'Business #' + booking.businessId}
                    </h3>
                    <Badge variant={booking.status === 'confirmed' ? 'success' : booking.status === 'completed' ? 'success' : 'warning'}>
                      {booking.status}
                    </Badge>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <Calendar size={14} stroke={colors.textMuted} />
                    <span style={{ fontSize: 14, color: colors.textSecondary }}>
                      {booking.date ? format(new Date(booking.date + 'T00:00:00'), 'EEE, MMM d, yyyy') : 'Date not set'}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <Clock size={14} stroke={colors.textMuted} />
                    <span style={{ fontSize: 14, color: colors.textSecondary }}>
                      {booking.time ? booking.time + ':00' : 'Time not set'}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <MapPin size={14} stroke={colors.textMuted} />
                    <span style={{ fontSize: 14, color: colors.textSecondary }}>
                      {business?.address || 'Address not available'}
                    </span>
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    paddingTop: 12,
                    borderTop: `1px solid ${colors.border}`,
                    alignItems: 'center'
                  }}>
                    <span style={{ fontSize: 14, color: colors.textSecondary }}>
                      {booking.serviceName || service?.name || 'Service #' + booking.serviceId}
                    </span>
                    <span style={{ fontSize: 16, fontWeight: 800, color: colors.primary }}>
                      ${booking.totalPrice || service?.price || 0}
                    </span>
                  </div>
                  
                  {booking.status === 'confirmed' && (
                    <button
                      onClick={() => {
                        updateBookingStatus(booking.id, 'cancelled');
                        setRefreshKey(k => k + 1);
                      }}
                      style={{
                        marginTop: 12,
                        width: '100%',
                        padding: '10px 16px',
                        borderRadius: 12,
                        border: '1px solid #ff5252',
                        background: 'transparent',
                        color: '#ff5252',
                        fontWeight: 600,
                        fontSize: 13,
                        cursor: 'pointer',
                      }}
                    >
                      Cancel Booking
                    </button>
                  )}
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