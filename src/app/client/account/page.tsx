'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { User, Phone, Mail, LogOut, Settings, HelpCircle, ChevronRight } from 'lucide-react';
import { ClientBottomNav, Button } from '@/components/UI';
import { useStore } from '@/lib/store';

const colors = {
  primary: '#E8B4B8',
  secondary: '#F5E6E8',
  accent: '#C9A87C',
  background: '#FFFBFA',
  surface: '#FFFFFF',
  textPrimary: '#2D2A2A',
  textSecondary: '#6B6565',
  textMuted: '#9A9595',
  border: '#E8DDC7',
};

const menuItems = [
  { id: 'profile', label: 'Edit Profile', icon: User },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'help', label: 'Help & Support', icon: HelpCircle },
];

export default function ClientAccount() {
  const router = useRouter();
  const { currentUser, logout, businesses, services, bookings, reviews } = useStore();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // Calculate user statistics
  const userBusinesses = businesses?.filter(b => b.userId === currentUser?.id) || [];
  const userServices = services?.filter(s => s.businessId && 
    userBusinesses.some(b => b.id === s.businessId)) || [];
  const userBookings = bookings?.filter(b => b.userId === currentUser?.id) || [];
  const userReviews = reviews?.filter(r => r.userId === currentUser?.id) || [];

  return (
    <div className="container" style={{ paddingBottom: 80 }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h1 style={{ fontSize: 28, marginBottom: 24, color: colors.textPrimary }}>
          Account
        </h1>

        {currentUser ? (
          <>
            {/* Profile Header */}
            <div style={{
              background: colors.surface,
              borderRadius: 16,
              padding: 24,
              marginBottom: 24,
              textAlign: 'center',
            }}>
              <div style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: colors.primary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}>
                <User size={40} stroke={colors.surface} />
              </div>
              <h2 style={{ fontSize: 20, marginBottom: 4, color: colors.textPrimary }}>
                {currentUser.name}
              </h2>
              <p style={{ fontSize: 14, color: colors.textMuted }}>
                {currentUser.email}
              </p>
              <p style={{ fontSize: 14, color: colors.textSecondary }}>
                {currentUser.role === 'business' ? 'Business Owner' : 
                 currentUser.role === 'admin' ? 'Administrator' : 'Customer'}
              </p>
            </div>

            {/* Account Statistics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 16, marginBottom: 24 }}>
              <div style={{ background: colors.primary, borderRadius: 12, padding: 16, textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: colors.textPrimary }}>
                  {userBusinesses.length}
                </div>
                <div style={{ fontSize: 12, color: colors.surface }}>Businesses</div>
              </div>
              <div style={{ background: colors.primary, borderRadius: 12, padding: 16, textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: colors.textPrimary }}>
                  {userServices.length}
                </div>
                <div style={{ fontSize: 12, color: colors.surface }}>Services</div>
              </div>
              <div style={{ background: colors.primary, borderRadius: 12, padding: 16, textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: colors.textPrimary }}>
                  {userBookings.length}
                </div>
                <div style={{ fontSize: 12, color: colors.surface }}>Bookings</div>
              </div>
              <div style={{ background: colors.primary, borderRadius: 12, padding: 16, textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: colors.textPrimary }}>
                  {userReviews.length}
                </div>
                <div style={{ fontSize: 12, color: colors.surface }}>Reviews</div>
              </div>
            </div>

            {/* Recent Activity */}
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 20, marginBottom: 16, color: colors.textPrimary }}>
                Recent Activity
              </h2>
              {userBookings.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {userBookings.slice(0, 3).map((booking) => {
                    // Find the service for this booking
                    const service = services?.find(s => s.id === booking.serviceId);
                    return (
                      <div key={booking.id} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: 12,
                        background: colors.surface,
                        borderRadius: 12,
                        border: `1px solid ${colors.border}`
                      }}>
                        <div>
                          <h3 style={{ fontSize: 16, marginBottom: 4, color: colors.textPrimary }}>
                            {service?.name || 'Service'}
                          </h3>
                          <p style={{ fontSize: 12, color: colors.textSecondary }}>
                            {new Date(booking.createdAt).toLocaleDateString()} • 
                            {booking.status === 'confirmed' ? 'Confirmed' : 
                             booking.status === 'completed' ? 'Completed' : 
                             booking.status === 'cancelled' ? 'Cancelled' : booking.status}
                          </p>
                        </div>
                        <div style={{ fontSize: 18, fontWeight: 700, color: colors.primary }}>
                          ${booking.totalPrice}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p style={{ color: colors.textMuted, textAlign: 'center' }}>
                  No recent bookings
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Button
                onClick={() => router.push('/client/settings')}
                style={{ width: '100%' }}
              >
                <Settings size={20} />
                Account Settings
              </Button>
              <Button
                onClick={() => router.push('/client/help')}
                style={{ width: '100%' }}
              >
                <HelpCircle size={20} />
                Help & Support
              </Button>
              <Button
                variant="secondary"
                onClick={handleLogout}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              >
                <LogOut size={20} />
                Sign Out
              </Button>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <p style={{ color: colors.textMuted, marginBottom: 24 }}>Sign in to view your account</p>
            <Button onClick={() => router.push('/client/auth')} style={{ marginBottom: 12 }}>
              Sign In
            </Button>
            <Button variant="secondary" onClick={() => router.push('/client/auth')}>
              Create Account
            </Button>
          </div>
        )}
      </motion.div>

      <ClientBottomNav active="account" />
    </div>
  );
}