'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Clock, MapPin, CheckCircle, XCircle, Scissors, Palette, Sparkles, Hand, Eye, ListChecks, Bell, ChevronRight } from 'lucide-react';
import { useAuth } from '@/lib/authContext';

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

const categoryIcons: Record<string, any> = {
  hair: Scissors,
  nails: Hand,
  skin: Sparkles,
  massage: Palette,
  makeup: Palette,
  brows: Eye,
};

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function ClientCalendar() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [waitlistEntries, setWaitlistEntries] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'waitlist'>('upcoming');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        const userData = JSON.parse(stored);
        setUser(userData);
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchBookings();
      fetchWaitlist();
    }
  }, [user]);

  const fetchBookings = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/data/bookings?userId=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWaitlist = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/data/waitlist?userId=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setWaitlistEntries(data);
      }
    } catch (err) {
      console.error('Failed to fetch waitlist:', err);
    }
  };

  const cancelBooking = async (bookingId: string) => {
    try {
      const res = await fetch(`/api/data/bookings?bookingId=${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' }),
      });
      if (res.ok) {
        setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b));
      }
    } catch (err) {
      console.error('Failed to cancel booking:', err);
    }
  };

  const leaveWaitlist = async (entryId: string) => {
    try {
      const res = await fetch(`/api/data/waitlist?entryId=${entryId}`, { method: 'DELETE' });
      if (res.ok) {
        setWaitlistEntries(prev => prev.filter(e => e.id !== entryId));
      }
    } catch (err) {
      console.error('Failed to leave waitlist:', err);
    }
  };

  const upcomingBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'pending');
  const pastBookings = bookings.filter(b => b.status === 'completed' || b.status === 'cancelled');
  const activeWaitlist = waitlistEntries.filter(e => e.status === 'waiting');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return '#00d4ff';
      case 'pending': return '#ffab91';
      case 'completed': return '#00e676';
      case 'cancelled': return '#ff6b9d';
      default: return colors.textMuted;
    }
  };

  if (!mounted) return null;

  return (
    <div style={{ minHeight: '100vh', background: colors.background, padding: '60px 20px 100px' }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <ArrowLeft size={20} color={colors.textMuted} />
          <span style={{ fontSize: 14, color: colors.textMuted }}>Back</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg, #fdfcd2 0%, #ffeb8a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Calendar size={24} stroke={colors.secondary} />
          </div>
          <div>
            <h1 style={{ fontSize: 22, color: colors.primary, fontWeight: 900 }}>My Appointments</h1>
            <p style={{ fontSize: 13, color: colors.textMuted }}>Bookings and waitlist entries</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {(['upcoming', 'past', 'waitlist'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1,
                padding: '10px 12px',
                borderRadius: 12,
                border: `2px solid ${activeTab === tab ? colors.primary : colors.border}`,
                background: activeTab === tab ? 'rgba(253, 252, 210, 0.1)' : 'transparent',
                color: activeTab === tab ? colors.primary : colors.textMuted,
                fontWeight: 700,
                fontSize: 12,
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
              }}
            >
              {tab === 'waitlist' && <Bell size={14} />}
              {tab}
              {tab === 'waitlist' && activeWaitlist.length > 0 && (
                <span style={{ 
                  background: colors.accent, 
                  color: 'white', 
                  width: 18, 
                  height: 18, 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: 10,
                }}>
                  {activeWaitlist.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <p style={{ color: colors.textMuted, textAlign: 'center', padding: 40 }}>Loading...</p>
        ) : (
          <>
            {activeTab === 'upcoming' && (
              <div>
                {upcomingBookings.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: 40 }}>
                    <Calendar size={48} stroke={colors.textMuted} style={{ marginBottom: 16 }} />
                    <p style={{ color: colors.textMuted, fontSize: 14 }}>No upcoming appointments</p>
                    <button
                      onClick={() => router.push('/client/search')}
                      style={{
                        marginTop: 16,
                        padding: '12px 24px',
                        borderRadius: 14,
                        border: 'none',
                        background: colors.primary,
                        color: colors.secondary,
                        fontWeight: 700,
                        fontSize: 14,
                        cursor: 'pointer',
                      }}
                    >
                      Book Now
                    </button>
                  </div>
                ) : (
                  upcomingBookings.map((booking, index) => (
                    <motion.div
                      key={booking.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      style={{
                        background: colors.surface,
                        borderRadius: 16,
                        padding: 20,
                        marginBottom: 12,
                        border: `1px solid ${colors.accent2}44`,
                        boxShadow: '0 4px 20px rgba(0, 212, 255, 0.15)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                        <span style={{ 
                          background: colors.accent2 + '22', 
                          color: colors.accent2, 
                          padding: '4px 10px', 
                          borderRadius: 8, 
                          fontSize: 11, 
                          fontWeight: 700 
                        }}>{booking.status?.toUpperCase()}</span>
                        <span style={{ fontSize: 14, fontWeight: 700, color: colors.primary }}>€{booking.totalPrice}</span>
                      </div>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: colors.textPrimary, marginBottom: 8 }}>{booking.service?.name || 'Service'}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <Clock size={14} stroke={colors.textMuted} />
                        <span style={{ fontSize: 13, color: colors.textSecondary }}>{booking.slot?.date} at {booking.slot?.startTime}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                        <MapPin size={14} stroke={colors.textMuted} />
                        <span style={{ fontSize: 13, color: colors.textSecondary }}>{booking.business?.name}</span>
                      </div>
                      {booking.status !== 'cancelled' && (
                        <button
                          onClick={() => cancelBooking(booking.id)}
                          style={{
                            width: '100%',
                            padding: '10px 16px',
                            borderRadius: 10,
                            border: `1px solid ${colors.accent}`,
                            background: 'transparent',
                            color: colors.accent,
                            fontWeight: 600,
                            fontSize: 13,
                            cursor: 'pointer',
                          }}
                        >
                          Cancel Booking
                        </button>
                      )}
                    </motion.div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'past' && (
              <div>
                {pastBookings.length === 0 ? (
                  <p style={{ color: colors.textMuted, textAlign: 'center', padding: 40 }}>No past appointments</p>
                ) : (
                  pastBookings.map((booking, index) => (
                    <motion.div
                      key={booking.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      style={{
                        background: colors.surface,
                        borderRadius: 14,
                        padding: 16,
                        marginBottom: 10,
                        border: `1px solid ${colors.border}`,
                        opacity: booking.status === 'cancelled' ? 0.6 : 1,
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          {booking.status === 'completed' ? (
                            <CheckCircle size={16} stroke="#00e676" />
                          ) : (
                            <XCircle size={16} stroke={colors.accent} />
                          )}
                          <span style={{ fontSize: 14, fontWeight: 700, color: colors.textPrimary }}>{booking.service?.name}</span>
                        </div>
                        <span style={{ fontSize: 14, fontWeight: 600, color: booking.status === 'completed' ? colors.primary : colors.textMuted }}>
                          {booking.status === 'completed' ? `€${booking.totalPrice}` : '-'}
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: colors.textMuted }}>
                        {booking.slot?.date} • {booking.business?.name}
                      </div>
                      <div style={{ 
                        marginTop: 8, 
                        fontSize: 10, 
                        color: getStatusColor(booking.status), 
                        textTransform: 'uppercase', 
                        fontWeight: 700 
                      }}>
                        {booking.status}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'waitlist' && (
              <div>
                {activeWaitlist.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: 40 }}>
                    <ListChecks size={48} stroke={colors.textMuted} style={{ marginBottom: 16 }} />
                    <p style={{ color: colors.textMuted, fontSize: 14, marginBottom: 8 }}>No waitlist entries</p>
                    <p style={{ color: colors.textMuted, fontSize: 12 }}>When no slots are available, you can join a waitlist from the booking page</p>
                  </div>
                ) : (
                  activeWaitlist.map((entry, index) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      style={{
                        background: colors.surface,
                        borderRadius: 16,
                        padding: 20,
                        marginBottom: 12,
                        border: `1px solid ${colors.accent}44`,
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                        <span style={{ 
                          background: 'rgba(255, 107, 157, 0.15)', 
                          color: colors.accent, 
                          padding: '4px 10px', 
                          borderRadius: 8, 
                          fontSize: 11, 
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                        }}>
                          <Bell size={12} /> WAITING
                        </span>
                      </div>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: colors.textPrimary, marginBottom: 8 }}>{entry.service?.name}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <Calendar size={14} stroke={colors.textMuted} />
                        <span style={{ fontSize: 13, color: colors.textSecondary }}>{entry.preferredDate}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <Clock size={14} stroke={colors.textMuted} />
                        <span style={{ fontSize: 13, color: colors.textSecondary }}>Preferred: {entry.preferredTime}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                        <MapPin size={14} stroke={colors.textMuted} />
                        <span style={{ fontSize: 13, color: colors.textSecondary }}>{entry.business?.name}</span>
                      </div>
                      <button
                        onClick={() => leaveWaitlist(entry.id)}
                        style={{
                          width: '100%',
                          padding: '10px 16px',
                          borderRadius: 10,
                          border: `1px solid ${colors.accent}`,
                          background: 'transparent',
                          color: colors.accent,
                          fontWeight: 600,
                          fontSize: 13,
                          cursor: 'pointer',
                        }}
                      >
                        Leave Waitlist
                      </button>
                    </motion.div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}