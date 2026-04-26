'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Home, Calendar, Scissors, Clock, Users, Bell, BarChart2, Store, Settings, Plus, Minus, ChevronLeft, ChevronRight,
  DollarSign, User, X, Check, Edit2, Trash2, ToggleLeft, ToggleRight, Save, LogOut
} from 'lucide-react';
import { 
  getBusinessByUserId, getServicesByBusinessId, createService, updateService, deleteService,
  getTimeSlotsByBusinessId, createTimeSlot, deleteTimeSlot,
  getBookingsByBusinessId, updateBookingStatus,
  getReviewsByBusinessId, updateUserRole
} from '@/lib/actions';
import { useAuth } from '@/lib/authContext';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';

const COLORS = {
  primary: '#FFD600',
  surface: '#FFF7E0',
  background: '#FFFDF5',
  textPrimary: '#2A241C',
  textSecondary: '#6B6358',
  textMuted: '#9A9595',
  border: '#E8DDC7',
  success: '#059669',
  error: '#DC2626',
  warning: '#D97706',
};

const TIME_SLOTS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

type Tab = 'home' | 'calendar' | 'services' | 'availability' | 'bookings' | 'alerts' | 'analytics' | 'profile' | 'settings';

interface Business {
  id: string;
  name: string;
  address: string;
  description: string;
  category: string;
  imageUrl: string;
  status: string;
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

export default function BusinessDashboard() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [business, setBusiness] = useState<Business | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));

  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceForm, setServiceForm] = useState({ name: '', duration: 30, price: 0, description: '', active: true });

  const [showSlotModal, setShowSlotModal] = useState(false);
  const [selectedSlotTime, setSelectedSlotTime] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    const biz = await getBusinessByUserId(user.id);
    setBusiness(biz as any);
    
    if (biz) {
      const [svcs, slots, bks] = await Promise.all([
        getServicesByBusinessId(biz.id),
        getTimeSlotsByBusinessId(biz.id),
        getBookingsByBusinessId(biz.id)
      ]);
      setServices(svcs as any);
      setTimeSlots(slots);
      setBookings(bks as any);
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
            fontWeight: 700, cursor: 'pointer'
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
    { id: 'analytics', label: 'Stats', icon: BarChart2 },
    { id: 'profile', label: 'Profile', icon: Store },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div style={{ minHeight: '100vh', background: COLORS.background, paddingBottom: 100 }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${COLORS.primary} 0%, #FFE066 100%)`, padding: '20px', borderRadius: '0 0 32px 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h1 style={{ fontSize: 22, fontFamily: 'Playfair Display, serif', fontWeight: 700, margin: 0 }}>{business.name}</h1>
          <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <LogOut size={22} color={COLORS.textPrimary} />
          </button>
        </div>
        
        {/* Quick Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          <div style={{ background: 'white', borderRadius: 14, padding: 14, textAlign: 'center' }}>
            <DollarSign size={18} color={COLORS.success} style={{ margin: '0 auto 6px' }} />
            <div style={{ fontSize: 18, fontWeight: 800 }}>${todayEarnings}</div>
            <div style={{ fontSize: 10, color: COLORS.textMuted }}>Today</div>
          </div>
          <div style={{ background: 'white', borderRadius: 14, padding: 14, textAlign: 'center' }}>
            <Calendar size={18} color={COLORS.primary} style={{ margin: '0 auto 6px' }} />
            <div style={{ fontSize: 18, fontWeight: 800 }}>{upcomingBookings.length}</div>
            <div style={{ fontSize: 10, color: COLORS.textMuted }}>Pending</div>
          </div>
          <div style={{ background: 'white', borderRadius: 14, padding: 14, textAlign: 'center' }}>
            <Users size={18} color={COLORS.textSecondary} style={{ margin: '0 auto 6px' }} />
            <div style={{ fontSize: 18, fontWeight: 800 }}>{bookings.length}</div>
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
            color: COLORS.textPrimary, cursor: 'pointer', flexShrink: 0
          }}>
            <tab.icon size={18} />
            <span style={{ fontSize: 11, fontWeight: 600 }}>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ padding: 20 }}>
        {/* HOME */}
        {activeTab === 'home' && (
          <div>
            <h2 style={{ fontSize: 18, fontFamily: 'Playfair Display, serif', marginBottom: 16 }}>⚡ Today's Schedule</h2>
            
            {todayBookings.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {todayBookings.slice(0, 5).map(booking => (
                  <div key={booking.id} style={{
                    background: 'white', borderRadius: 16, padding: 16, border: `1px solid ${COLORS.border}`
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 14, background: COLORS.surface, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <User size={20} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 700 }}>{booking.user.name}</div>
                          <div style={{ fontSize: 12, color: COLORS.textMuted }}>{booking.service.name} • {booking.slot.startTime}</div>
                        </div>
                      </div>
                      <span style={{
                        padding: '4px 12px', borderRadius: 10, fontSize: 12, fontWeight: 600,
                        background: booking.status === 'confirmed' ? '#D1FAE5' : '#FEE2E2',
                        color: booking.status === 'confirmed' ? COLORS.success : COLORS.error
                      }}>
                        {booking.status}
                      </span>
                    </div>
                    {booking.status === 'confirmed' && (
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => handleBookingAction(booking.id, 'completed')} style={{
                          flex: 1, padding: '10px', borderRadius: 12, border: 'none', background: COLORS.primary, fontWeight: 700, cursor: 'pointer'
                        }}>✓ Complete</button>
                        <button onClick={() => handleBookingAction(booking.id, 'cancelled')} style={{
                          flex: 1, padding: '10px', borderRadius: 12, border: `1px solid ${COLORS.border}`, background: 'white', color: COLORS.error, fontWeight: 700, cursor: 'pointer'
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
              <div style={{ marginTop: 20, padding: 16, borderRadius: 16, background: '#FEF3C7', border: '1px solid #FCD34D' }}>
                <strong>⚠️ No slots available today</strong>
                <p style={{ fontSize: 14, marginTop: 8 }}>Add time slots to start receiving bookings</p>
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
                    color: isSelected ? COLORS.textPrimary : COLORS.textPrimary,
                    textAlign: 'center', cursor: 'pointer', border: `1px solid ${COLORS.border}`, flexShrink: 0
                  }}>
                    <div style={{ fontSize: 11, fontWeight: 600 }}>{format(date, 'EEE')}</div>
                    <div style={{ fontSize: 18, fontWeight: 800 }}>{format(date, 'd')}</div>
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
                <p style={{ color: COLORS.textMuted }}>No slots available</p>
              )}
            </div>

            <button onClick={() => setShowSlotModal(true)} style={{
              width: '100%', marginTop: 20, padding: 14, borderRadius: 14, border: 'none',
              background: COLORS.primary, fontWeight: 700, cursor: 'pointer'
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
                padding: '10px 16px', borderRadius: 12, border: 'none', background: COLORS.primary, fontWeight: 700, cursor: 'pointer'
              }}>
                + Add
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {services.map(service => (
                <div key={service.id} style={{
                  background: 'white', borderRadius: 16, padding: 16, border: `1px solid ${COLORS.border}`
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>{service.name}</h3>
                        {!service.active && <span style={{ fontSize: 10, color: COLORS.error }}>Inactive</span>}
                      </div>
                      <div style={{ fontSize: 14, color: COLORS.textMuted, marginTop: 4 }}>{service.duration} min</div>
                      <div style={{ fontSize: 18, fontWeight: 800, marginTop: 8 }}>${service.price}</div>
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
            <div style={{ background: 'white', borderRadius: 16, padding: 16, border: `1px solid ${COLORS.border}` }}>
              <p style={{ fontSize: 14, color: COLORS.textMuted, marginBottom: 16 }}>Set your regular working hours per day of week.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                  <div key={day} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${COLORS.border}` }}>
                    <span style={{ fontWeight: 600 }}>{day}</span>
                    <span style={{ fontSize: 14, color: COLORS.textMuted }}>09:00 - 18:00</span>
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
                  background: 'white', borderRadius: 16, padding: 16, border: `1px solid ${COLORS.border}`
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div>
                      <div style={{ fontWeight: 700 }}>{booking.user.name}</div>
                      <div style={{ fontSize: 12, color: COLORS.textMuted }}>{booking.service.name} • {booking.slot.date} {booking.slot.startTime}</div>
                    </div>
                    <span style={{
                      padding: '4px 12px', borderRadius: 10, fontSize: 12, fontWeight: 600,
                      background: booking.status === 'confirmed' ? '#D1FAE5' : booking.status === 'completed' ? '#DBEAFE' : '#FEE2E2',
                      color: booking.status === 'confirmed' ? COLORS.success : booking.status === 'completed' ? '#1D4ED8' : COLORS.error
                    }}>
                      {booking.status}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 18, fontWeight: 800 }}>${booking.totalPrice}</div>
                    {booking.status === 'confirmed' && (
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => handleBookingAction(booking.id, 'completed')} style={{ padding: '8px 12px', borderRadius: 10, border: 'none', background: COLORS.primary, fontWeight: 700, cursor: 'pointer' }}>Complete</button>
                        <button onClick={() => handleBookingAction(booking.id, 'cancelled')} style={{ padding: '8px 12px', borderRadius: 10, border: `1px solid ${COLORS.border}`, background: 'white', color: COLORS.error, fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
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
            <h2 style={{ fontSize: 18, fontFamily: 'Playfair Display, serif', marginBottom: 16 }}>Real-time Alerts</h2>
            {upcomingBookings.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {upcomingBookings.map(booking => (
                  <div key={booking.id} style={{
                    background: '#D1FAE5', borderRadius: 16, padding: 16, border: '1px solid #6EE7B7'
                  }}>
                    <strong>🔔 New Booking</strong>
                    <div style={{ marginTop: 8 }}>{booking.user.name} booked {booking.service.name}</div>
                    <div style={{ fontSize: 12, color: COLORS.textMuted }}>{booking.slot.date} at {booking.slot.startTime}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: COLORS.textMuted }}>No new alerts</p>
            )}
          </div>
        )}

        {/* ANALYTICS */}
        {activeTab === 'analytics' && (
          <div>
            <h2 style={{ fontSize: 18, fontFamily: 'Playfair Display, serif', marginBottom: 16 }}>Analytics</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 24 }}>
              <div style={{ background: 'white', borderRadius: 16, padding: 16, textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 800 }}>{bookings.length}</div>
                <div style={{ fontSize: 12, color: COLORS.textMuted }}>Total Bookings</div>
              </div>
              <div style={{ background: 'white', borderRadius: 16, padding: 16, textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 800 }}>${bookings.reduce((s, b) => s + b.totalPrice, 0)}</div>
                <div style={{ fontSize: 12, color: COLORS.textMuted }}>Total Revenue</div>
              </div>
            </div>
            <div style={{ background: 'white', borderRadius: 16, padding: 16 }}>
              <h3 style={{ fontSize: 14, marginBottom: 12 }}>Popular Services</h3>
              {services.slice(0, 3).map((s, i) => (
                <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: `1px solid ${COLORS.border}` }}>
                  <span>{s.name}</span>
                  <span style={{ fontWeight: 600 }}>{i + 1}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROFILE */}
        {activeTab === 'profile' && (
          <div>
            <h2 style={{ fontSize: 18, fontFamily: 'Playfair Display, serif', marginBottom: 16 }}>Business Profile</h2>
            <div style={{ background: 'white', borderRadius: 16, padding: 16, border: `1px solid ${COLORS.border}` }}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, color: COLORS.textMuted }}>Business Name</label>
                <div style={{ fontSize: 16, fontWeight: 700 }}>{business.name}</div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, color: COLORS.textMuted }}>Category</label>
                <div style={{ fontSize: 16 }}>{business.category}</div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, color: COLORS.textMuted }}>Address</label>
                <div style={{ fontSize: 16 }}>{business.address}</div>
              </div>
              <div>
                <label style={{ fontSize: 12, color: COLORS.textMuted }}>Description</label>
                <div style={{ fontSize: 14 }}>{business.description || 'No description'}</div>
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
                  color: COLORS.textPrimary, fontSize: 16, fontWeight: 700, cursor: 'pointer'
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
                    border: `2px solid ${selectedSlotTime === time ? COLORS.primary : COLORS.border}`, fontWeight: 700
                  }}>
                    {time}
                  </div>
                ))}
              </div>

              <button onClick={handleAddSlot} disabled={!selectedSlotTime} style={{
                width: '100%', marginTop: 20, padding: 16, borderRadius: 14, border: 'none', background: COLORS.primary,
                color: COLORS.textPrimary, fontSize: 16, fontWeight: 700, cursor: selectedSlotTime ? 'pointer' : 'not-allowed', opacity: selectedSlotTime ? 1 : 0.5
              }}>
                Add Slot
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}