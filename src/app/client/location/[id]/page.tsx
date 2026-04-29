'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Star, MapPin, Clock, ChevronLeft, ChevronRight, Calendar, Scissors } from 'lucide-react';
import { ClientBottomNav, Button, TimeSlotButton, ReviewCard } from '@/components/UI';
import { useStore } from '@/lib/store';
import { Business, TimeSlot, Review, Service } from '@/lib/types';
import { format, addDays } from 'date-fns';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
}

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

const BUSINESS_HOURS = {
  Monday: '09:00 - 20:00',
  Tuesday: '09:00 - 20:00',
  Wednesday: '09:00 - 20:00',
  Thursday: '09:00 - 20:00',
  Friday: '09:00 - 20:00',
  Saturday: '09:00 - 20:00',
  Sunday: 'Closed',
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
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [hydratedUser, setHydratedUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        const user = JSON.parse(stored);
        if (user.role === 'client') {
          setHydratedUser(user);
        }
      } catch {}
    }
  }, []);

  const activeUser = currentUser || hydratedUser;

  useEffect(() => {
    async function fetchBusinessData() {
      try {
        // Fetch business data
        const businessRes = await fetch(`/api/data/businesses?businessId=${params.id}`);
        if (!businessRes.ok) throw new Error('Business fetch failed');
        const businessData = await businessRes.json();
        
        // Fetch services for this business
        const servicesRes = await fetch(`/api/data/services?businessId=${params.id}`);
        const servicesData = servicesRes.ok ? await servicesRes.json() : [];
        
        // Fetch time slots for this business
        const timeSlotsRes = await fetch(`/api/data/timeSlots?businessId=${params.id}`);
        const timeSlotsData = timeSlotsRes.ok ? await timeSlotsRes.json() : [];
        
        // Fetch reviews for this business
        const reviewsRes = await fetch(`/api/reviews?businessId=${params.id}`);
        const reviewsData = reviewsRes.ok ? await reviewsRes.json() : [];
        
        setBusiness(Array.isArray(businessData) ? businessData[0] : businessData);
        setBusinessServices(servicesData || []);
        setAvailableSlots(timeSlotsData || []);
        setBusinessReviews(reviewsData || []);
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
    if (!activeUser) {
      setShowAuthModal(true);
      return;
    }

    if (!selectedTimeSlot || !selectedService) {
      return;
    }

    console.log('Creating booking with:', {
      userId: activeUser.id,
      businessId: business!.id,
      serviceId: selectedService.id,
      slotId: selectedTimeSlot.id,
      selectedDate,
      selectedTime: selectedTimeSlot.startTime,
      price: selectedService.price,
      serviceName: selectedService.name
    });

    createBooking(activeUser.id, business!.id, selectedService.id, selectedTimeSlot.id, selectedDate, selectedTimeSlot.startTime, selectedService.price, selectedService.name);
    setShowSuccessModal(true);
  };

  const handleSubmitReview = async () => {
    if (!activeUser) {
      setShowReviewModal(false);
      setShowAuthModal(true);
      return;
    }
    
    setSubmittingReview(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: activeUser.id,
          businessId: business!.id,
          rating: reviewRating,
          comment: reviewText
        })
      });
      
      if (res.ok) {
        const newReview = await res.json();
        setBusinessReviews([newReview, ...businessReviews]);
        setShowReviewModal(false);
        setReviewText('');
        setReviewRating(5);
      }
    } catch (err) {
      console.error('Failed to submit review:', err);
    }
    setSubmittingReview(false);
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
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
    <div className="container" style={{ paddingBottom: 100, background: colors.background, minHeight: '100vh' }}>
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
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: 26, marginBottom: 10, color: colors.textPrimary, fontFamily: 'Playfair Display, serif', fontWeight: 800 }}>
                {business.name}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 4, 
                  padding: '4px 10px',
                  background: 'rgba(255, 107, 157, 0.15)',
                  borderRadius: 8 
                }}>
                  <Star size={14} fill={colors.accent} stroke={colors.accent} />
                  <span style={{ fontWeight: 700, color: colors.textPrimary }}>{business.rating}</span>
                </div>
                <span style={{ fontSize: 13, color: colors.textMuted }}>({business.reviewCount} reviews)</span>
              </div>
              <span style={{
                padding: '4px 10px',
                background: colors.surface,
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                textTransform: 'capitalize',
                color: colors.textSecondary,
                display: 'inline-block',
              }}>
                {business.category}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <MapPin size={16} stroke={colors.accent} />
            <span style={{ fontSize: 14, color: colors.textPrimary, fontWeight: 500 }}>{business.address}</span>
          </div>

          <p style={{ fontSize: 14, color: colors.textSecondary, lineHeight: 1.6, marginBottom: 16 }}>
            {business.description}
          </p>

          <div style={{ 
            marginBottom: 24, 
            padding: 16, 
            background: 'linear-gradient(135deg, rgba(20, 7, 85, 0.4) 0%, rgba(26, 26, 58, 0.6) 100%)',
            borderRadius: 16,
            border: '1px solid rgba(253, 252, 210, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Clock size={18} stroke={colors.primary} />
              <span style={{ fontSize: 16, fontWeight: 700, color: colors.textPrimary }}>Business Hours</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {Object.entries(BUSINESS_HOURS).map(([day, hours]) => (
                <div key={day} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: colors.surface, borderRadius: 10, border: `1px solid ${colors.border}` }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: colors.textPrimary }}>{day}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: hours === 'Closed' ? colors.accent : '#00e676' }}>{hours}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Scissors size={18} stroke={colors.primary} />
              <h3 style={{ fontSize: 18, margin: 0, color: colors.textPrimary }}>
                Services & Pricing
              </h3>
            </div>
<div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
           {businessServices.slice(0, 8).map((service) => (
                 <motion.div
                   key={service.id}
                   onClick={() => setSelectedService(service)}
                   whileTap={{ scale: 0.98 }}
                   style={{
                     padding: 14,
                     borderRadius: 12,
                     border: `2px solid ${selectedService && selectedService.id === service.id ? colors.primary : colors.border}`,
                     background: selectedService && selectedService.id === service.id 
                       ? 'linear-gradient(135deg, rgba(253, 252, 210, 0.15) 0%, rgba(253, 252, 210, 0.05) 100%)' 
                       : colors.surface,
                     cursor: 'pointer',
                     display: 'flex',
                     justifyContent: 'space-between',
                     alignItems: 'center',
                   }}
                 >
                   <div>
                     <span style={{ fontWeight: 700, fontSize: 15, color: colors.textPrimary }}>{service.name}</span>
                     <span style={{ fontSize: 12, color: colors.textMuted, marginLeft: 8 }}>{service.duration} min</span>
                   </div>
                   <div style={{ textAlign: 'right' }}>
                     <span style={{ fontWeight: 800, fontSize: 16, color: colors.primary }}>${service.price}</span>
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
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 14, background: 'linear-gradient(135deg, #fdfcd2 0%, #fffb99 100%)', borderRadius: 10 }}>
                        <span style={{ fontSize: 16, fontWeight: 700, color: colors.secondary }}>{selectedService.name}</span>
                        <span style={{ fontSize: 14, fontWeight: 600, color: colors.secondary }}>{selectedService.duration} min</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 14, background: colors.secondary, borderRadius: 10 }}>
                        <span style={{ fontSize: 20, fontWeight: 800, color: colors.primary }}>${selectedService.price}</span>
                        <span style={{ fontSize: 14, color: colors.textSecondary }}>Total price</span>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Calendar size={18} stroke={colors.primary} />
              <h3 style={{ fontSize: 18, margin: 0, color: colors.textPrimary }}>
                Select Date
              </h3>
            </div>
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
                      color: selectedDate === dateStr ? colors.secondary : colors.textPrimary,
                      textAlign: 'center',
                      cursor: 'pointer',
                      border: `2px solid ${selectedDate === dateStr ? 'transparent' : colors.border}`,
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Clock size={18} stroke={colors.primary} />
              <h3 style={{ fontSize: 18, margin: 0, color: colors.textPrimary }}>
                Available Time Slots
              </h3>
            </div>
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

          <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Star size={18} stroke={colors.primary} />
                  <h3 style={{ fontSize: 18, margin: 0, color: colors.textPrimary }}>
                    Reviews
                  </h3>
                </div>
                <button 
                  onClick={() => setShowReviewModal(true)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 12,
                    background: colors.primary,
                    border: 'none',
                    color: colors.secondary,
                    fontWeight: 600,
                    fontSize: 13,
                    cursor: 'pointer'
                  }}
                >
                  + Review
                </button>
              </div>
              {businessReviews.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {businessReviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              ) : (
                <p style={{ color: colors.textMuted, fontSize: 14 }}>No reviews yet. Be the first to review!</p>
              )}
            </div>
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
          background: 'rgba(18, 18, 42, 0.98)',
          backdropFilter: 'blur(20px)',
          borderTop: `1px solid ${colors.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 100,
        }}
      >
        <div>
          <span style={{ fontSize: 14, color: colors.textMuted }}>Total</span>
          <div style={{ fontSize: 20, fontWeight: 600, color: colors.primary }}>
            ${selectedService ? selectedService.price : '0'}
          </div>
        </div>
        <button
          onClick={handleBook}
          disabled={!selectedTimeSlot || !selectedService}
          style={{
            padding: '14px 28px',
            borderRadius: 20,
            border: 'none',
            background: !selectedTimeSlot || !selectedService 
              ? 'rgba(253, 252, 210, 0.3)' 
              : 'linear-gradient(135deg, #fdfcd2 0%, #fffb99 100%)',
            color: !selectedTimeSlot || !selectedService 
              ? 'rgba(20, 7, 85, 0.5)' 
              : colors.secondary,
            fontWeight: 800,
            fontSize: 14,
            cursor: (!selectedTimeSlot || !selectedService) ? 'not-allowed' : 'pointer',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            boxShadow: (!selectedTimeSlot || !selectedService) 
              ? 'none' 
              : '0 4px 20px rgba(253, 252, 210, 0.3)',
          }}
        >
          Book Now
        </button>
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
            <h3 style={{ marginBottom: 24, textAlign: 'center', color: colors.textPrimary }}>Sign In to Book</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button 
                onClick={() => router.push('/client/auth')} 
                style={{
                  width: '100%',
                  padding: '16px 28px',
                  borderRadius: 20,
                  border: 'none',
                  background: 'linear-gradient(135deg, #fdfcd2 0%, #fffb99 100%)',
                  color: colors.secondary,
                  fontWeight: 800,
                  fontSize: 15,
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Sign In
              </button>
              <button 
                onClick={() => router.push('/client/auth')} 
                style={{
                  width: '100%',
                  padding: '16px 28px',
                  borderRadius: 20,
                  border: `2px solid ${colors.border}`,
                  background: 'transparent',
                  color: colors.textPrimary,
                  fontWeight: 700,
                  fontSize: 15,
                  cursor: 'pointer',
                }}
              >
                Create Account
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {showSuccessModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(10, 10, 26, 0.9)',
            backdropFilter: 'blur(8px)',
            zIndex: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{
              background: colors.surface,
              borderRadius: 24,
              padding: 32,
              maxWidth: 340,
              width: '100%',
              textAlign: 'center',
              border: `1px solid ${colors.border}`,
            }}
          >
            <div style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #00e676 0%, #00c853 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: '0 8px 32px rgba(0, 230, 118, 0.4)',
            }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: colors.textPrimary, marginBottom: 12, fontFamily: 'Playfair Display, serif' }}>
              Booking Confirmed!
            </h2>
            <p style={{ fontSize: 15, color: colors.textSecondary, marginBottom: 24, lineHeight: 1.5 }}>
              Your appointment has been booked successfully. You can view your booking details in the bookings section.
            </p>
            <button
              onClick={handleSuccessClose}
              style={{
                width: '100%',
                padding: '16px 28px',
                borderRadius: 20,
                border: 'none',
                background: 'linear-gradient(135deg, #fdfcd2 0%, #fffb99 100%)',
                color: colors.secondary,
                fontWeight: 800,
                fontSize: 15,
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              View My Bookings
            </button>
          </motion.div>
        </motion.div>
      )}

      {showReviewModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(10, 10, 26, 0.9)',
            backdropFilter: 'blur(8px)',
            zIndex: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{
              background: colors.surface,
              borderRadius: 24,
              padding: 32,
              maxWidth: 340,
              width: '100%',
              textAlign: 'center',
            }}
          >
            <h2 style={{ fontSize: 22, fontWeight: 800, color: colors.textPrimary, marginBottom: 20, fontFamily: 'Playfair Display, serif' }}>
              Write a Review
            </h2>
            
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 8 }}>Your Rating</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setReviewRating(star)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
                  >
                    <Star 
                      size={32} 
                      fill={star <= reviewRating ? colors.primary : 'none'}
                      stroke={star <= reviewRating ? colors.primary : colors.textMuted}
                    />
                  </button>
                ))}
              </div>
            </div>
            
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Share your experience..."
              style={{
                width: '100%',
                height: 100,
                padding: 14,
                borderRadius: 14,
                border: `2px solid ${colors.border}`,
                background: colors.surfaceLight,
                color: colors.textPrimary,
                fontSize: 14,
                resize: 'none',
                marginBottom: 20,
              }}
            />
            
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => setShowReviewModal(false)}
                style={{
                  flex: 1,
                  padding: '14px 20px',
                  borderRadius: 16,
                  border: `2px solid ${colors.border}`,
                  background: 'transparent',
                  color: colors.textSecondary,
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReview}
                disabled={submittingReview}
                style={{
                  flex: 1,
                  padding: '14px 20px',
                  borderRadius: 16,
                  border: 'none',
                  background: colors.primary,
                  color: colors.secondary,
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: submittingReview ? 'not-allowed' : 'pointer',
                  opacity: submittingReview ? 0.6 : 1,
                }}
              >
                {submittingReview ? 'Posting...' : 'Post Review'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}