'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Plus, Calendar, DollarSign, Users, Clock, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button, Badge } from '@/components/UI';
import { useStore } from '@/lib/store';
import { format, addDays, addHours } from 'date-fns';

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
};

const TIME_SLOTS = [
  '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
];

export default function BusinessDashboard() {
  const router = useRouter();
  const { currentUser, businesses, bookings, services, timeSlots, addTimeSlot } = useStore();
  
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(format(addDays(new Date(), 1), 'yyyy-MM-dd'));
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);

  const userBusiness = businesses.find(b => b.userId === currentUser?.id);
  const businessBookings = bookings.filter(b => b.businessId === userBusiness?.id);
  const businessSlots = timeSlots.filter(s => s.businessId === userBusiness?.id && s.date === selectedDate);

  const todayEarnings = businessBookings
    .filter(b => b.status === 'completed')
    .reduce((sum, b) => sum + b.totalPrice, 0);
  
  const monthEarnings = todayEarnings;

  const handleAddSlots = () => {
    selectedSlots.forEach(time => {
      const index = TIME_SLOTS.indexOf(time);
      addTimeSlot({
        businessId: userBusiness!.id,
        date: selectedDate,
        startTime: time,
        endTime: TIME_SLOTS[index + 1] || '18:00',
        available: true,
      });
    });
    setShowSlotModal(false);
    setSelectedSlots([]);
  };

  const toggleSlot = (time: string) => {
    setSelectedSlots(prev => 
      prev.includes(time) 
        ? prev.filter(t => t !== time)
        : [...prev, time]
    );
  };

  return (
    <div className="container" style={{ paddingTop: 20, paddingBottom: 100 }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, color: colors.textPrimary }}>Dashboard</h1>
          <button
            onClick={() => router.push('/business')}
            style={{
              padding: '8px 16px',
              background: colors.surface,
              border: '2px solid ' + colors.secondary,
              borderRadius: 8,
              cursor: 'pointer',
            }}
          >
            Back
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 24 }}>
          <div style={{
            background: colors.surface,
            borderRadius: 16,
            padding: 16,
            textAlign: 'center',
          }}>
            <DollarSign size={24} stroke={colors.success} />
            <div style={{ fontSize: 24, fontWeight: 700, color: colors.success, marginTop: 8 }}>
              ${todayEarnings}
            </div>
            <div style={{ fontSize: 12, color: colors.textMuted }}>Today's Earnings</div>
          </div>

          <div style={{
            background: colors.surface,
            borderRadius: 16,
            padding: 16,
            textAlign: 'center',
          }}>
            <Calendar size={24} stroke={colors.primary} />
            <div style={{ fontSize: 24, fontWeight: 700, color: colors.primary, marginTop: 8 }}>
              {businessBookings.length}
            </div>
            <div style={{ fontSize: 12, color: colors.textMuted }}>Total Bookings</div>
          </div>
        </div>

        <div style={{
          background: colors.surface,
          borderRadius: 16,
          padding: 16,
          marginBottom: 24,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 18, color: colors.textPrimary }}>Schedule</h3>
            <button
              onClick={() => setShowSlotModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 16px',
                background: colors.primary,
                color: colors.surface,
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              <Plus size={16} />
              Add Slots
            </button>
          </div>

          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 12 }}>
            {Array.from({ length: 7 }, (_, i) => {
              const date = addDays(new Date(), i);
              const dateStr = format(date, 'yyyy-MM-dd');
              const slots = timeSlots.filter(s => s.businessId === userBusiness?.id && s.date === dateStr && s.available);
              const hasSlots = slots.length > 0;
              
              return (
                <div
                  key={dateStr}
                  onClick={() => setSelectedDate(dateStr)}
                  style={{
                    minWidth: 60,
                    padding: 12,
                    borderRadius: 12,
                    background: selectedDate === dateStr ? colors.primary : hasSlots ? colors.secondary : colors.surface,
                    color: selectedDate === dateStr ? colors.surface : colors.textPrimary,
                    textAlign: 'center',
                    cursor: 'pointer',
                    border: hasSlots ? `2px solid ${colors.primary}` : '2px solid transparent',
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{format(date, 'EEE')}</div>
                  <div style={{ fontSize: 18, fontWeight: 600 }}>{format(date, 'd')}</div>
                  {hasSlots && (
                    <div style={{ fontSize: 10, color: selectedDate === dateStr ? colors.surface : colors.textMuted }}>
                      {slots.length} slots
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 16 }}>
            <h4 style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 12 }}>
              Available Slots for {format(new Date(selectedDate), 'MMM d, yyyy')}
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {businessSlots.length > 0 ? (
                businessSlots.map((slot) => (
                  <div
                    key={slot.id}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 8,
                      background: slot.available ? colors.secondary : colors.surface,
                      color: slot.available ? colors.primary : colors.textMuted,
                      fontSize: 14,
                    }}
                  >
                    {slot.startTime} - {slot.endTime}
                  </div>
                ))
              ) : (
                <p style={{ color: colors.textMuted, fontSize: 14 }}>No available slots</p>
              )}
            </div>
          </div>
        </div>

        <div style={{
          background: colors.surface,
          borderRadius: 16,
          padding: 16,
        }}>
          <h3 style={{ fontSize: 18, marginBottom: 16, color: colors.textPrimary }}>Recent Bookings</h3>
          
          {businessBookings.length > 0 ? (
            businessBookings.slice(0, 5).map((booking) => {
              const service = services.find(s => s.id === booking.serviceId);
              const slot = timeSlots.find(t => t.id === booking.slotId);
              const user = 'User';
              
              return (
                <div
                  key={booking.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 12,
                    borderBottom: '1px solid ' + colors.secondary,
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, color: colors.textPrimary }}>{user}</div>
                    <div style={{ fontSize: 12, color: colors.textMuted }}>
                      {service?.name} • {slot ? format(new Date(slot.date), 'MMM d') : 'N/A'} at {slot?.startTime}
                    </div>
                  </div>
                  <Badge variant={booking.status === 'confirmed' ? 'success' : booking.status === 'completed' ? 'success' : 'warning'}>
                    {booking.status}
                  </Badge>
                </div>
              );
            })
          ) : (
            <p style={{ color: colors.textMuted, textAlign: 'center', padding: 20 }}>No bookings yet</p>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {showSlotModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="overlay"
            onClick={() => setShowSlotModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bottom-sheet"
              onClick={(e) => e.stopPropagation()}
              style={{ maxHeight: '70vh', overflow: 'auto' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h3>Add Available Slots</h3>
                <button
                  onClick={() => setShowSlotModal(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 8,
                  }}
                >
                  <X size={20} stroke={colors.textMuted} />
                </button>
              </div>

              <div style={{ marginBottom: 24 }}>
                <h4 style={{ fontSize: 14, marginBottom: 12 }}>Select Time Slots</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {TIME_SLOTS.map((time) => (
                    <div
                      key={time}
                      onClick={() => toggleSlot(time)}
                      style={{
                        padding: '12px 20px',
                        borderRadius: 8,
                        background: selectedSlots.includes(time) ? colors.primary : colors.secondary,
                        color: selectedSlots.includes(time) ? colors.surface : colors.textPrimary,
                        cursor: 'pointer',
                        fontWeight: 600,
                      }}
                    >
                      {time}
                    </div>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleAddSlots}
                disabled={selectedSlots.length === 0}
                style={{ width: '100%' }}
              >
                Add {selectedSlots.length} Slots
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}