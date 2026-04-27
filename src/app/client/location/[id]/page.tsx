'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Star, MapPin, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { ClientBottomNav, Button, TimeSlotButton, ReviewCard } from '@/components/UI';
import { useStore } from '@/lib/store';
import { Business, TimeSlot, Review, Service } from '@/lib/types';
import { format, addDays } from 'date-fns';

const colors = {
  primary: '#fdfcd2',
  secondary: '#140755',
  accent: '#ff6b9d',
  accent2: '#00d4ff',
  surface: '#12122a',
  surfaceLight: '#1a1a3a',
  background: '#0a0a1a',
  textPrimary: '#fdfcd2',
  textSecondary: '#b8b8d0',
  textMuted: '#6a6a8a',
  border: '#2a2a4a',
};

export default function LocationPage() {
  const router = useRouter();
  const params = useParams();
  const { services, timeSlots, reviews, currentUser, createBooking } = useStore();
  
  const [business, setBusiness] = useState<Business | null>(null);
    const [businessServices, setBusinessServices] = useState<Service[]>([]);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [businessReviews, setBusinessReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  useEffect(() => {
    async function fetchBusinessData() {
      try {
        // Fetch business data
        const businessRes = await fetch(`/api/data/businesses?businessId=${params.id}`);
        const businessData = await businessRes.json();
        
        // Fetch services for this business
        const servicesRes = await fetch(`/api/data/services?businessId=${params.id}`);
        const servicesData = await servicesRes.json();
        
        // Fetch time slots for this business
        const timeSlotsRes = await fetch(`/api/data/timeSlots?businessId=${params.id}`);
        const timeSlotsData = await timeSlotsRes.json();
        
        // Fetch reviews for this business
        const reviewsRes = await fetch(`/api/reviews?businessId=${params.id}`);
        const reviewsData = await reviewsRes.json();
        
        setBusiness(Array.isArray(businessData) ? businessData[0] : businessData);
        setBusinessServices(servicesData);
        setAvailableSlots(timeSlotsData);
        setBusinessReviews(reviewsData);
      } catch (error) {
        console.error('Failed to fetch business data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    if (params.id) {
      fetchBusinessData();
    }
  }, [params.id]);

  const filteredSlots = availableSlots.filter(slot => slot.date === selectedDate && slot.available);

  const dates = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

  const handleBook = () => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }

    if (!selectedTimeSlot || !selectedService) {
      return;
    }

    createBooking(currentUser.id, business!.id, selectedService.id, selectedTimeSlot.id);
    router.push('/client/calendar');
  };

  if (loading) {
    return (
      <div className="container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Loading business details...</p>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                    onClick={() => setSelectedService(service)}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      padding: 12,
                      borderRadius: 12,
                      border: `2px solid ${selectedService && selectedService.id === service.id ? colors.primary : colors.secondary}`,
                      background: selectedService && selectedService.id === service.id ? colors.secondary : colors.surface,
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
               
               {/* Selected Service Details */}
               {selectedService && (
                 <div style={{ marginTop: 20, padding: 16, background: colors.surface, borderRadius: 12, border: `1px solid ${colors.border}` }}>
                   <h3 style={{ fontSize: 18, marginBottom: 16, color: colors.textPrimary }}>
                     Selected Service
                   </h3>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, background: colors.primary, borderRadius: 8 }}>
                       <span style={{ fontSize: 16, fontWeight: 600, color: colors.textPrimary }}>{selectedService.name}</span>
                       <span style={{ fontSize: 14, color: colors.surface }}>{selectedService.subtype}</span>
                     </div>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, background: colors.secondary, borderRadius: 8 }}>
                       <span style={{ fontSize: 16, fontWeight: 600, color: colors.textPrimary }}>${selectedService.price}</span>
                       <span style={{ fontSize: 14, color: colors.textSecondary }}>{selectedService.duration} min</span>
                     </div>
                      {/* Description is not in the current Service type, so we'll skip it for now */}
                      {/* 
                      {selectedService.description && (
                        <div style={{ padding: 12, background: colors.surface, borderRadius: 8, marginTop: 8 }}>
                          <p style={{ fontSize: 14, color: colors.textSecondary, lineHeight: 1.5 }}>{selectedService.description}</p>
                        </div>
                      )}
                      */}
                   </div>
                 </div>
               )}
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
              {filteredSlots.length > 0 ? (
                filteredSlots.map((slot) => (
                  <TimeSlotButton
                    key={slot.id}
                    slot={slot}
                    selected={selectedTimeSlot?.id === slot.id}
                    onClick={() => setSelectedTimeSlot(slot)}
                  />
                ))
              ) : (
                <p style={{ color: colors.textMuted, fontSize: 14 }}>No available slots for {format(new Date(selectedDate), 'MMM d')}</p>
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
            ${selectedService ? selectedService.price : '0'}
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