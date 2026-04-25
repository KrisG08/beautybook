'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Star, MapPin, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { ClientBottomNav, Button, TimeSlotButton, ReviewCard } from '@/components/UI';
import { useStore } from '@/lib/store';
import { Business, TimeSlot, Review } from '@/lib/types';
import { format, addDays } from 'date-fns';

const colors = {
  primary: '#E8B4B8',
  secondary: '#F5E6E8',
  accent: '#C9A87C',
  background: '#FFFBFA',
  surface: '#FFFFFF',
  textPrimary: '#2D2A2A',
  textSecondary: '#6B6565',
  textMuted: '#9A9595',
};

export default function LocationPage() {
  const router = useRouter();
  const params = useParams();
  const { businesses, services, timeSlots, reviews, currentUser, createBooking } = useStore();
  
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const business = businesses.find(b => b.id === params.id) as Business | undefined;
  const businessServices = services.filter(s => s.businessId === params.id);
  const availableSlots = timeSlots.filter(
    s => s.businessId === params.id && s.date === selectedDate && s.available
  );
  const businessReviews = reviews.filter(r => r.businessId === params.id);

  const dates = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

  const handleBook = () => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }

    if (!selectedTimeSlot || !selectedService) {
      return;
    }

    createBooking(currentUser.id, business!.id, selectedService, selectedTimeSlot.id);
    router.push('/client/calendar');
  };

  if (!business) {
    return (
      <div className="container">
        <p>Business not found</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingBottom: 100 }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div style={{ position: 'relative', marginBottom: 16 }}>
          <motion.div
            onClick={() => router.back()}
            whileTap={{ scale: 0.95 }}
            style={{
              position: 'absolute',
              top: 16,
              left: 16,
              width: 40,
              height: 40,
              borderRadius: 12,
              background: colors.surface,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            <ArrowLeft size={20} stroke={colors.textPrimary} />
          </motion.div>
          
          <div style={{
            height: 200,
            background: business.imageUrl 
              ? `url(${business.imageUrl}) center/cover`
              : colors.primary,
            borderRadius: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {!business.imageUrl && <span style={{ fontSize: 64, color: colors.surface }}>💅</span>}
          </div>
        </div>

        <div style={{ padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div>
              <h1 style={{ fontSize: 24, marginBottom: 8, color: colors.textPrimary }}>
                {business.name}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
                <Star size={16} fill={colors.accent} stroke={colors.accent} />
                <span style={{ fontWeight: 600 }}>{business.rating}</span>
                <span style={{ fontSize: 14, color: colors.textMuted }}>({business.reviewCount} reviews)</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <MapPin size={16} stroke={colors.textMuted} />
            <span style={{ fontSize: 14, color: colors.textSecondary }}>{business.address}</span>
          </div>

          <p style={{ fontSize: 14, color: colors.textSecondary, lineHeight: 1.6, marginBottom: 24 }}>
            {business.description}
          </p>

          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, marginBottom: 12, color: colors.textPrimary }}>
              Select Service
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {businessServices.slice(0, 5).map((service) => (
                <motion.div
                  key={service.id}
                  onClick={() => setSelectedService(service.id)}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    padding: 12,
                    borderRadius: 12,
                    border: `2px solid ${selectedService === service.id ? colors.primary : colors.secondary}`,
                    background: selectedService === service.id ? colors.secondary : colors.surface,
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <span style={{ fontWeight: 600, color: colors.textPrimary }}>{service.name}</span>
                    <span style={{ fontSize: 12, color: colors.textMuted, marginLeft: 8 }}>{service.subtype}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontWeight: 600, color: colors.primary }}>${service.price}</span>
                    <span style={{ fontSize: 12, color: colors.textMuted, display: 'block' }}>{service.duration} min</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, marginBottom: 12, color: colors.textPrimary }}>
              Select Date
            </h3>
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8 }}>
              {dates.map((date) => {
                const dateStr = format(date, 'yyyy-MM-dd');
                return (
                  <div
                    key={dateStr}
                    onClick={() => setSelectedDate(dateStr)}
                    style={{
                      minWidth: 60,
                      padding: 12,
                      borderRadius: 12,
                      background: selectedDate === dateStr ? colors.primary : colors.surface,
                      color: selectedDate === dateStr ? colors.surface : colors.textPrimary,
                      textAlign: 'center',
                      cursor: 'pointer',
                      border: `2px solid ${selectedDate === dateStr ? colors.primary : colors.secondary}`,
                    }}
                  >
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{format(date, 'EEE')}</div>
                    <div style={{ fontSize: 18, fontWeight: 600 }}>{format(date, 'd')}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, marginBottom: 12, color: colors.textPrimary }}>
              Available Time Slots
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {availableSlots.length > 0 ? (
                availableSlots.map((slot) => (
                  <TimeSlotButton
                    key={slot.id}
                    slot={slot}
                    selected={selectedTimeSlot?.id === slot.id}
                    onClick={() => setSelectedTimeSlot(slot)}
                  />
                ))
              ) : (
                <p style={{ color: colors.textMuted, fontSize: 14 }}>No available slots for this date</p>
              )}
            </div>
          </div>

          {businessReviews.length > 0 && (
            <div>
              <h3 style={{ fontSize: 18, marginBottom: 12, color: colors.textPrimary }}>
                Reviews
              </h3>
              {businessReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: 480,
          padding: 16,
          background: colors.surface,
          borderTop: '1px solid ' + colors.secondary,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 100,
        }}
      >
        <div>
          <span style={{ fontSize: 14, color: colors.textMuted }}>Total</span>
          <div style={{ fontSize: 20, fontWeight: 600, color: colors.textPrimary }}>
            ${selectedService ? businessServices.find(s => s.id === selectedService)?.price : '0'}
          </div>
        </div>
        <Button
          onClick={handleBook}
          disabled={!selectedTimeSlot || !selectedService}
          style={{ padding: '12px 32px' }}
        >
          Book Now
        </Button>
      </motion.div>

      {showAuthModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="overlay"
          onClick={() => setShowAuthModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bottom-sheet"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginBottom: 24, textAlign: 'center' }}>Sign In to Book</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Button onClick={() => router.push('/client/auth')} style={{ width: '100%' }}>
                Sign In
              </Button>
              <Button variant="secondary" onClick={() => router.push('/client/auth')} style={{ width: '100%' }}>
                Create Account
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}