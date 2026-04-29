'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Home, Calendar, Scissors, Clock, Users, Bell, BarChart2, Store, Settings, Plus, Minus, ChevronLeft, ChevronRight,
  DollarSign, User, X, Check, Edit2, Trash2, ToggleLeft, ToggleRight, Save, LogOut, Star
} from 'lucide-react';
import { 
  getBusinessByUserId, getServicesByBusinessId, createService, updateService, deleteService,
  getTimeSlotsByBusinessId, createTimeSlot, deleteTimeSlot,
  getBookingsByBusinessId, updateBookingStatus,
  getReviewsByBusinessId, updateUserRole
} from '@/lib/actions';
import { useAuth } from '@/lib/authContext';
import { BusinessBottomNav } from '@/components/UI';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';

const COLORS = {
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

const TIME_SLOTS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

type Tab = 'home' | 'calendar' | 'services' | 'availability' | 'bookings' | 'alerts' | 'reviews' | 'analytics' | 'profile' | 'settings';

interface Business {
  id: string;
  name: string;
  address: string;
  description: string;
  category: string;
  imageUrl: string;
  status: string;
  rating: number;
}

interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  description: string | null;
  active: boolean;
}

interface TimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  available: boolean;
}

interface Booking {
  id: string;
  userId: string;
  status: string;
  totalPrice: number;
  createdAt: Date;
  user: { name: string };
  service: { name: string };
  slot: { date: string; startTime: string };
}

interface Notification {
  id: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

export default function BusinessDashboard() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [business, setBusiness] = useState<Business | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const stored = localStorage.getItem('user');
    if (!stored) {
      router.push('/auth');
      return;
    }
    const userData = JSON.parse(stored);
    if (userData.role !== 'business') {
      router.push(userData.role === 'admin' ? '/admin' : '/client');
      return;
    }
  }, [mounted]);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));

  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceForm, setServiceForm] = useState({ name: '', duration: 30, price: 0, description: '', active: true });

  const [showSlotModal, setShowSlotModal] = useState(false);
  const [selectedSlotTime, setSelectedSlotTime] = useState<string | null>(null);

  useEffect(() => {
    if (!mounted || !user) return;
    loadData();
  }, [mounted, user]);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const biz = await getBusinessByUserId(user.id);
      setBusiness(biz);
      
      if (biz && biz.id) {
        const [svcs, slots, bks] = await Promise.all([
          getServicesByBusinessId(biz.id),
          getTimeSlotsByBusinessId(biz.id),
          getBookingsByBusinessId(biz.id)
        ]);
        setServices(svcs || []);
        setTimeSlots(slots || []);
        setBookings(bks || []);
        
        const notifRes = await fetch(`/api/notifications?businessId=${biz.id}`);
        const notifs = await notifRes.json();
        setNotifications(notifs || []);
        setUnreadCount((notifs || []).filter((n: Notification) => !n.read).length);
        
        const revs = await getReviewsByBusinessId(biz.id);
        setReviews(revs || []);
      }
    } catch (err) {
      console.error('Error loading data:', err);
    }
    setLoading(false);
  };

  const todayBookings = bookings.filter(b => isSameDay(new Date(b.createdAt), new Date()));
  const upcomingBookings = bookings.filter(b => b.status === 'confirmed');
  const completedBookings = bookings.filter(b => b.status === 'completed');
  const todayEarnings = completedBookings.reduce((sum, b) => sum + b.totalPrice, 0);

  const todayStr = format(selectedDate, 'yyyy-MM-dd');
  const daySlots = timeSlots.filter(s => s.date === todayStr);

  const handleSaveService = async () => {
    if (!business) return;
    if (editingService) {
      await updateService(editingService.id, serviceForm);
    } else {
      await createService(business.id, serviceForm);
    }
    setShowServiceModal(false);
    setEditingService(null);
    setServiceForm({ name: '', duration: 30, price: 0, description: '', active: true });
    loadData();
  };

  const handleDeleteService = async (id: string) => {
    await deleteService(id);
    loadData();
  };

  const handleAddSlot = async () => {
    if (!business || !selectedSlotTime) return;
    const idx = TIME_SLOTS.indexOf(selectedSlotTime);
    await createTimeSlot(business.id, {
      date: todayStr,
      startTime: selectedSlotTime,
      endTime: TIME_SLOTS[idx + 1] || '19:00',
    });
    setShowSlotModal(false);
    setSelectedSlotTime(null);
    loadData();
  };

  const handleDeleteSlot = async (id: string) => {
    await deleteTimeSlot(id);
    loadData();
  };

  const handleBookingAction = async (id: string, status: string) => {
    await updateBookingStatus(id, status);
    loadData();
  };

  const handleLogout = async () => {
    if (user) {
      await updateUserRole(user.id, 'client');
    }
    logout();
  };

  if (loading) {
    return <div style={{ minHeight: '100vh', background: COLORS.background, padding: 60, textAlign: 'center' }}>Loading...</div>;
  }

  if (!business) {
    return (
      <div style={{ minHeight: '100vh', background: COLORS.background, padding: '60px 20px' }}>
        <div style={{ textAlign: 'center', paddingTop: 60 }}>
          <h1 style={{ fontSize: 24, fontFamily: 'Playfair Display, serif', marginBottom: 16 }}>No Business Found</h1>
          <p style={{ color: COLORS.textMuted, marginBottom: 24 }}>Apply to list your business</p>
          <button onClick={() => router.push('/business/apply')} style={{
            padding: '14px 28px', background: COLORS.primary, border: 'none', borderRadius: 14,
            color: COLORS.secondary, fontWeight: 700, cursor: 'pointer'
          }}>Apply Now</button>
        </div>
      </div>
    );
  }

  if (business.status === 'pending') {
    return (
      <div style={{ minHeight: '100vh', background: COLORS.background, padding: '60px 20px' }}>
        <div style={{ textAlign: 'center', paddingTop: 60 }}>
          <div style={{ width: 80, height: 80, borderRadius: 24, background: COLORS.surface, margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={40} color={COLORS.textPrimary} />
          </div>
          <h1 style={{ fontSize: 24, fontFamily: 'Playfair Display, serif', marginBottom: 16 }}>Pending Approval</h1>
          <p style={{ color: COLORS.textMuted }}>Your application is under review. We'll notify you once approved.</p>
        </div>
      </div>
    );
  }

  const TABS = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'services', label: 'Services', icon: Scissors },
    { id: 'availability', label: 'Hours', icon: Clock },
    { id: 'bookings', label: 'Bookings', icon: Users },
    { id: 'alerts', label: 'Alerts', icon: Bell },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'analytics', label: 'Stats', icon: BarChart2 },
    { id: 'profile', label: 'Profile', icon: Store },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div style={{ minHeight: '100vh', background: COLORS.background, paddingBottom: 100 }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${COLORS.primary} 0%, #FFE066 100%)`, padding: '20px', borderRadius: '0 0 32px 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h1 style={{ fontSize: 22, fontFamily: 'Playfair Display, serif', fontWeight: 700, margin: 0, color: COLORS.secondary }}>{business.name}</h1>
          <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <LogOut size={22} color={COLORS.secondary} />
          </button>
        </div>
        
        {/* Quick Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          <div style={{ background: COLORS.secondary, borderRadius: 14, padding: 14, textAlign: 'center' }}>
            <DollarSign size={18} color={COLORS.primary} style={{ margin: '0 auto 6px' }} />
            <div style={{ fontSize: 18, fontWeight: 800, color: COLORS.primary }}>€{todayEarnings}</div>
            <div style={{ fontSize: 10, color: COLORS.textMuted }}>Today</div>
          </div>
          <div style={{ background: COLORS.secondary, borderRadius: 14, padding: 14, textAlign: 'center' }}>
            <Calendar size={18} color={COLORS.primary} style={{ margin: '0 auto 6px' }} />
            <div style={{ fontSize: 18, fontWeight: 800, color: COLORS.primary }}>{upcomingBookings.length}</div>
            <div style={{ fontSize: 10, color: COLORS.textMuted }}>Pending</div>
          </div>
          <div style={{ background: COLORS.secondary, borderRadius: 14, padding: 14, textAlign: 'center' }}>
            <Users size={18} color={COLORS.primary} style={{ margin: '0 auto 6px' }} />
            <div style={{ fontSize: 18, fontWeight: 800, color: COLORS.primary }}>{bookings.length}</div>
            <div style={{ fontSize: 10, color: COLORS.textMuted }}>Total</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ padding: '16px 12px', display: 'flex', gap: 4, overflowX: 'auto', borderBottom: `1px solid ${COLORS.border}` }}>
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as Tab)} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '10px 14px',
            borderRadius: 14, border: 'none', background: activeTab === tab.id ? COLORS.primary : 'transparent',
            color: activeTab === tab.id ? COLORS.secondary : COLORS.textPrimary, cursor: 'pointer', flexShrink: 0
          }}>
            <tab.icon size={18} stroke={activeTab === tab.id ? COLORS.secondary : 'currentColor'} />
            <span style={{ fontSize: 11, fontWeight: 600, color: activeTab === tab.id ? COLORS.secondary : COLORS.textPrimary }}>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ padding: 20 }}>
        {/* HOME */}
        {activeTab === 'home' && (
          <div>
            <h2 style={{ fontSize: 18, fontFamily: 'Playfair Display, serif', marginBottom: 16, color: COLORS.textPrimary }}>⚡ Today's Schedule</h2>
            
            {todayBookings.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {todayBookings.slice(0, 5).map(booking => (
                  <div key={booking.id} style={{
                    background: COLORS.surface, borderRadius: 16, padding: 16, border: `1px solid ${COLORS.border}`
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 14, background: COLORS.surfaceLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <User size={20} color={COLORS.textPrimary} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: COLORS.textPrimary }}>{booking.user.name}</div>
                          <div style={{ fontSize: 12, color: COLORS.textMuted }}>{booking.service.name} • {booking.slot.startTime}</div>
                        </div>
                      </div>
                      <span style={{
                        padding: '4px 12px', borderRadius: 10, fontSize: 12, fontWeight: 600,
                        background: booking.status === 'confirmed' ? '#00e67633' : '#ff6b9d33',
                        color: booking.status === 'confirmed' ? '#00e676' : COLORS.accent
                      }}>
                        {booking.status}
                      </span>
                    </div>
                    {booking.status === 'confirmed' && (
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => handleBookingAction(booking.id, 'completed')} style={{
                          flex: 1, padding: '10px', borderRadius: 12, border: 'none', background: COLORS.primary, color: COLORS.secondary, fontWeight: 700, cursor: 'pointer'
                        }}>✓ Complete</button>
                        <button onClick={() => handleBookingAction(booking.id, 'cancelled')} style={{
                          flex: 1, padding: '10px', borderRadius: 12, border: `1px solid ${COLORS.border}`, background: COLORS.surfaceLight, color: COLORS.accent, fontWeight: 700, cursor: 'pointer'
                        }}>✕ Cancel</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: 40, color: COLORS.textMuted }}>
                <Calendar size={48} stroke={COLORS.textMuted} style={{ margin: '0 auto 16px' }} />
                <p>No bookings today</p>
              </div>
            )}

            {/* Alerts */}
            {daySlots.length === 0 && (
              <div style={{ marginTop: 20, padding: 16, borderRadius: 16, background: COLORS.surface, border: `1px solid ${COLORS.accent}` }}>
                <strong style={{ color: COLORS.accent }}>⚠️ No slots available today</strong>
                <p style={{ fontSize: 14, marginTop: 8, color: COLORS.textSecondary }}>Add time slots to start receiving bookings</p>
              </div>
            )}
          </div>
        )}

        {/* CALENDAR */}
        {activeTab === 'calendar' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <button onClick={() => setSelectedDate(addDays(selectedDate, -7))} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}>
                <ChevronLeft size={24} />
              </button>
              <h2 style={{ fontSize: 18, fontFamily: 'Playfair Display, serif', margin: 0 }}>
                {format(selectedDate, 'MMMM yyyy')}
              </h2>
              <button onClick={() => setSelectedDate(addDays(selectedDate, 7))} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}>
                <ChevronRight size={24} />
              </button>
            </div>

            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 16, marginBottom: 16, borderBottom: `1px solid ${COLORS.border}` }}>
              {eachDayOfInterval({ start: weekStart, end: endOfWeek(weekStart) }).map(date => {
                const dateStr = format(date, 'yyyy-MM-dd');
                const slots = timeSlots.filter(s => s.date === dateStr && s.available);
                const isSelected = isSameDay(date, selectedDate);
                return (
                  <div key={dateStr} onClick={() => setSelectedDate(date)} style={{
                    minWidth: 50, padding: '12px 8px', borderRadius: 14,
                    background: isSelected ? COLORS.primary : 'white',
                    color: isSelected ? COLORS.secondary : COLORS.textPrimary,
                    textAlign: 'center', cursor: 'pointer', border: `1px solid ${COLORS.border}`, flexShrink: 0
                  }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: isSelected ? COLORS.secondary : COLORS.textPrimary }}>{format(date, 'EEE')}</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: isSelected ? COLORS.secondary : COLORS.textPrimary }}>{format(date, 'd')}</div>
                    {slots.length > 0 && <div style={{ fontSize: 9, color: COLORS.textMuted }}>{slots.length}</div>}
                  </div>
                );
              })}
            </div>

            <h3 style={{ fontSize: 14, marginBottom: 12 }}>{format(selectedDate, 'EEEE, MMMM d')}</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {daySlots.length > 0 ? daySlots.map(slot => (
                <div key={slot.id} style={{
                  padding: '10px 14px', borderRadius: 12, background: slot.available ? COLORS.surface : '#F5F5F5',
                  fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8
                }}>
                  {slot.startTime} - {slot.endTime}
                  <button onClick={() => handleDeleteSlot(slot.id)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    <X size={14} color={COLORS.error} />
                  </button>
                </div>
              )) : (
                <p style={{ color: COLORS.textMuted, background: COLORS.surface, padding: 12, borderRadius: 12 }}>No slots available</p>
              )}
            </div>

            <button onClick={() => setShowSlotModal(true)} style={{
              width: '100%', marginTop: 20, padding: 14, borderRadius: 14, border: 'none',
              background: COLORS.primary, color: COLORS.secondary, fontWeight: 700, cursor: 'pointer'
            }}>
              + Add Time Slot
            </button>
          </div>
        )}

        {/* SERVICES */}
        {activeTab === 'services' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: 18, fontFamily: 'Playfair Display, serif', margin: 0 }}>Services</h2>
              <button onClick={() => { setEditingService(null); setServiceForm({ name: '', duration: 30, price: 0, description: '', active: true }); setShowServiceModal(true); }} style={{
                padding: '10px 16px', borderRadius: 12, border: 'none', background: COLORS.primary, color: COLORS.secondary, fontWeight: 700, cursor: 'pointer'
              }}>
                + Add
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {services.map(service => (
                <div key={service.id} style={{
                  background: COLORS.surface, borderRadius: 16, padding: 16, border: `1px solid ${COLORS.border}`
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: COLORS.textPrimary }}>{service.name}</h3>
                        {!service.active && <span style={{ fontSize: 10, color: COLORS.error }}>Inactive</span>}
                      </div>
                      <div style={{ fontSize: 14, color: COLORS.textMuted, marginTop: 4 }}>{service.duration} min</div>
                      <div style={{ fontSize: 18, fontWeight: 800, marginTop: 8, color: COLORS.primary }}>€{service.price}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => { setEditingService(service); setServiceForm({ ...service, description: service.description || '' }); setShowServiceModal(true); }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <Edit2 size={18} color={COLORS.textMuted} />
                      </button>
                      <button onClick={() => handleDeleteService(service.id)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <Trash2 size={18} color={COLORS.error} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {services.length === 0 && (
              <div style={{ textAlign: 'center', padding: 40, color: COLORS.textMuted }}>
                <Scissors size={48} stroke={COLORS.textMuted} style={{ margin: '0 auto 16px' }} />
                <p>No services yet</p>
              </div>
            )}
          </div>
        )}

        {/* AVAILABILITY */}
        {activeTab === 'availability' && (
          <div>
            <h2 style={{ fontSize: 18, fontFamily: 'Playfair Display, serif', marginBottom: 16 }}>Weekly Hours</h2>
            <div style={{ background: COLORS.surface, borderRadius: 16, padding: 16, border: `1px solid ${COLORS.border}` }}>
              <p style={{ fontSize: 14, color: COLORS.textMuted, marginBottom: 16 }}>Set your regular working hours per day of week.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                  <div key={day} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${COLORS.border}` }}>
                    <span style={{ fontWeight: 600, color: COLORS.textPrimary }}>{day}</span>
                    <span style={{ fontSize: 14, color: COLORS.primary }}>09:00 - 18:00</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* BOOKINGS */}
        {activeTab === 'bookings' && (
          <div>
            <h2 style={{ fontSize: 18, fontFamily: 'Playfair Display, serif', marginBottom: 16 }}>All Bookings</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {bookings.map(booking => (
                <div key={booking.id} style={{
                  background: COLORS.surface, borderRadius: 16, padding: 16, border: `1px solid ${COLORS.border}`
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div>
                      <div style={{ fontWeight: 700, color: COLORS.textPrimary }}>{booking.user.name}</div>
                      <div style={{ fontSize: 12, color: COLORS.textMuted }}>{booking.service.name} • {booking.slot.date} {booking.slot.startTime}</div>
                    </div>
                    <span style={{
                      padding: '4px 12px', borderRadius: 10, fontSize: 12, fontWeight: 600,
                      background: booking.status === 'confirmed' ? '#00e67633' : booking.status === 'completed' ? '#00d4ff33' : '#ff6b9d33',
                      color: booking.status === 'confirmed' ? '#00e676' : booking.status === 'completed' ? '#00d4ff' : COLORS.accent
                    }}>
                      {booking.status}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: COLORS.primary }}>€{booking.totalPrice}</div>
                    {booking.status === 'confirmed' && (
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => handleBookingAction(booking.id, 'completed')} style={{ padding: '8px 12px', borderRadius: 10, border: 'none', background: COLORS.primary, color: COLORS.secondary, fontWeight: 700, cursor: 'pointer' }}>Complete</button>
                        <button onClick={() => handleBookingAction(booking.id, 'cancelled')} style={{ padding: '8px 12px', borderRadius: 10, border: `1px solid ${COLORS.border}`, background: COLORS.surfaceLight, color: COLORS.accent, fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ALERTS */}
        {activeTab === 'alerts' && (
          <div>
            <h2 style={{ fontSize: 18, fontFamily: 'Playfair Display, serif', marginBottom: 16 }}>Notifications</h2>
            {notifications.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {notifications.map(notif => (
                  <div key={notif.id} style={{
                    background: notif.read ? COLORS.surfaceLight : '#D1FAE5', 
                    borderRadius: 16, 
                    padding: 16, 
                    border: notif.read ? `1px solid ${COLORS.border}` : '1px solid #6EE7B7',
                    opacity: notif.read ? 0.7 : 1
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <strong>{notif.type === 'booking' ? '📅' : '⭐'} {notif.type === 'booking' ? 'Booking' : 'Review'}</strong>
                      {!notif.read && <span style={{ background: COLORS.accent, borderRadius: 10, padding: '2px 8px', fontSize: 10 }}>NEW</span>}
                    </div>
                    <div style={{ marginTop: 8 }}>{notif.message}</div>
                    <div style={{ fontSize: 12, color: COLORS.textMuted }}>{format(new Date(notif.createdAt), 'MMM d, HH:mm')}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: COLORS.textMuted }}>No notifications yet</p>
            )}
          </div>
        )}

        {/* REVIEWS */}
        {activeTab === 'reviews' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h2 style={{ fontSize: 18, fontFamily: 'Playfair Display, serif', margin: 0 }}>Reviews</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Star size={20} fill={COLORS.primary} stroke={COLORS.primary} />
                <span style={{ fontSize: 18, fontWeight: 700, color: COLORS.primary }}>{business?.rating?.toFixed(1) || '0.0'}</span>
                <span style={{ fontSize: 14, color: COLORS.textMuted }}>({reviews.length})</span>
              </div>
            </div>
            {reviews.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {reviews.map((review: any) => (
                  <div key={review.id} style={{
                    background: COLORS.surface, borderRadius: 16, padding: 16, border: `1px solid ${COLORS.border}`
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <div style={{ display: 'flex', gap: 2 }}>
                        {[1,2,3,4,5].map((star) => (
                          <Star key={star} size={14} fill={star <= review.rating ? COLORS.primary : 'none'} stroke={star <= review.rating ? COLORS.primary : COLORS.textMuted} />
                        ))}
                      </div>
                      <span style={{ fontSize: 14, color: COLORS.textMuted }}>{review.user?.name || 'Client'}</span>
                    </div>
                    {review.comment && (
                      <p style={{ fontSize: 14, color: COLORS.textSecondary, margin: 0 }}>{review.comment}</p>
                    )}
                    <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 8 }}>
                      {format(new Date(review.createdAt), 'MMM d, yyyy')}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: COLORS.textMuted }}>No reviews yet</p>
            )}
          </div>
        )}

        {/* ANALYTICS */}
        {activeTab === 'analytics' && (
          <div>
            <h2 style={{ fontSize: 18, fontFamily: 'Playfair Display, serif', marginBottom: 16 }}>Analytics</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 24 }}>
              <div style={{ background: COLORS.primary, borderRadius: 16, padding: 16, textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: COLORS.secondary }}>{bookings.length}</div>
                <div style={{ fontSize: 12, color: COLORS.secondary, opacity: 0.7 }}>Total Bookings</div>
              </div>
              <div style={{ background: COLORS.primary, borderRadius: 16, padding: 16, textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: COLORS.secondary }}>€{bookings.reduce((s, b) => s + b.totalPrice, 0)}</div>
                <div style={{ fontSize: 12, color: COLORS.secondary, opacity: 0.7 }}>Total Revenue</div>
              </div>
            </div>
            <div style={{ background: COLORS.surface, borderRadius: 16, padding: 16, border: `1px solid ${COLORS.border}` }}>
              <h3 style={{ fontSize: 14, marginBottom: 12, color: COLORS.textPrimary }}>Popular Services</h3>
              {services.slice(0, 3).map((s, i) => (
                <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: `1px solid ${COLORS.border}` }}>
                  <span style={{ color: COLORS.textSecondary }}>{s.name}</span>
                  <span style={{ fontWeight: 600, color: COLORS.primary }}>{i + 1}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROFILE */}
        {activeTab === 'profile' && (
          <div>
            <h2 style={{ fontSize: 18, fontFamily: 'Playfair Display, serif', marginBottom: 16 }}>Business Profile</h2>
            <div style={{ background: COLORS.surface, borderRadius: 16, padding: 16, border: `1px solid ${COLORS.border}` }}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, color: COLORS.textMuted }}>Business Name</label>
                <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.textPrimary }}>{business.name}</div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, color: COLORS.textMuted }}>Category</label>
                <div style={{ fontSize: 16, color: COLORS.textSecondary }}>{business.category}</div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, color: COLORS.textMuted }}>Address</label>
                <div style={{ fontSize: 16, color: COLORS.textSecondary }}>{business.address}</div>
              </div>
              <div>
                <label style={{ fontSize: 12, color: COLORS.textMuted }}>Description</label>
                <div style={{ fontSize: 14, color: COLORS.textSecondary }}>{business.description || 'No description'}</div>
              </div>
            </div>
          </div>
        )}

        {/* SETTINGS */}
        {activeTab === 'settings' && (
          <div>
            <h2 style={{ fontSize: 18, fontFamily: 'Playfair Display, serif', marginBottom: 16 }}>Settings</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button onClick={handleLogout} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: 16, borderRadius: 16, border: `1px solid ${COLORS.border}`,
                background: 'white', cursor: 'pointer', width: '100%', textAlign: 'left'
              }}>
                <LogOut size={20} />
                <div>
                  <div style={{ fontWeight: 700 }}>Sign Out</div>
                  <div style={{ fontSize: 12, color: COLORS.textMuted }}>Sign out and switch role</div>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Service Modal */}
      <AnimatePresence>
        {showServiceModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 100
          }} onClick={() => setShowServiceModal(false)}>
            <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} onClick={e => e.stopPropagation()} style={{
              background: COLORS.background, borderRadius: '24px 24px 0 0', padding: 24, width: '100%', maxWidth: 500
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h3 style={{ fontSize: 20, fontFamily: 'Playfair Display, serif', margin: 0 }}>{editingService ? 'Edit Service' : 'Add Service'}</h3>
                <button onClick={() => setShowServiceModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <X size={24} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, fontSize: 14 }}>Service Name</label>
                  <input value={serviceForm.name} onChange={e => setServiceForm({ ...serviceForm, name: e.target.value })} placeholder="Haircut"
                    style={{ width: '100%', padding: 14, borderRadius: 14, border: `1px solid ${COLORS.border}`, fontSize: 16 }} />
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, fontSize: 14 }}>Duration (min)</label>
                    <input type="number" value={serviceForm.duration} onChange={e => setServiceForm({ ...serviceForm, duration: parseInt(e.target.value) })} 
                      style={{ width: '100%', padding: 14, borderRadius: 14, border: `1px solid ${COLORS.border}`, fontSize: 16 }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, fontSize: 14 }}>Price ($)</label>
                    <input type="number" value={serviceForm.price} onChange={e => setServiceForm({ ...serviceForm, price: parseFloat(e.target.value) })} 
                      style={{ width: '100%', padding: 14, borderRadius: 14, border: `1px solid ${COLORS.border}`, fontSize: 16 }} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, fontSize: 14 }}>Description</label>
                  <textarea value={serviceForm.description} onChange={e => setServiceForm({ ...serviceForm, description: e.target.value })} placeholder="Optional description"
                    style={{ width: '100%', padding: 14, borderRadius: 14, border: `1px solid ${COLORS.border}`, fontSize: 16, minHeight: 80 }} />
                </div>
                <button onClick={handleSaveService} style={{
                  width: '100%', padding: 16, borderRadius: 14, border: 'none', background: COLORS.primary,
                  color: COLORS.secondary, fontSize: 16, fontWeight: 700, cursor: 'pointer'
                }}>
                  <Save size={18} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                  Save Service
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Slot Modal */}
      <AnimatePresence>
        {showSlotModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 100
          }} onClick={() => setShowSlotModal(false)}>
            <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} onClick={e => e.stopPropagation()} style={{
              background: COLORS.background, borderRadius: '24px 24px 0 0', padding: 24, width: '100%', maxWidth: 500
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h3 style={{ fontSize: 20, fontFamily: 'Playfair Display, serif', margin: 0 }}>Add Time Slot</h3>
                <button onClick={() => setShowSlotModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <X size={24} />
                </button>
              </div>

              <p style={{ marginBottom: 16 }}>Select time for {format(selectedDate, 'MMMM d, yyyy')}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {TIME_SLOTS.map(time => (
                  <div key={time} onClick={() => setSelectedSlotTime(time)} style={{
                    padding: '14px 22px', borderRadius: 14, cursor: 'pointer',
                    background: selectedSlotTime === time ? COLORS.primary : 'white',
                    color: selectedSlotTime === time ? COLORS.secondary : COLORS.textPrimary,
                    border: `2px solid ${selectedSlotTime === time ? COLORS.primary : COLORS.border}`, fontWeight: 700
                  }}>
                    {time}
                  </div>
                ))}
              </div>

              <button onClick={handleAddSlot} disabled={!selectedSlotTime} style={{
                width: '100%', marginTop: 20, padding: 16, borderRadius: 14, border: 'none', background: COLORS.primary,
                color: COLORS.secondary, fontSize: 16, fontWeight: 700, cursor: selectedSlotTime ? 'pointer' : 'not-allowed', opacity: selectedSlotTime ? 1 : 0.5
              }}>
                Add Slot
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BusinessBottomNav active="dashboard" />
    </div>
  );
}