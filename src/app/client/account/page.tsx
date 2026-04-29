'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { User, Phone, Mail, LogOut, Settings, HelpCircle, ChevronRight, Store, Scissors, Calendar, Star, CreditCard } from 'lucide-react';
import { ClientBottomNav, Button } from '@/components/UI';
import { useStore } from '@/lib/store';

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

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
}

export default function ClientAccount() {
  const router = useRouter();
  const { currentUser, logout, businesses, services, bookings, reviews } = useStore();
  const [hydratedUser, setHydratedUser] = useState<User | null>(null);

  useEffect(() => {
    // Check localStorage directly as fallback
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

  // Use hydrated user if store user is not set
  const activeUser = currentUser || hydratedUser;

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // Calculate user statistics
  const userBusinesses = businesses?.filter(b => b.userId === activeUser?.id) || [];
  const userServices = services?.filter(s => s.businessId && 
    userBusinesses.some(b => b.id === s.businessId)) || [];
  const userBookings = bookings?.filter(b => b.userId === activeUser?.id) || [];
  const userReviews = reviews?.filter(r => r.userId === activeUser?.id) || [];

  return (
    <div className="container" style={{ paddingBottom: 100 }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h1 style={{ fontSize: 28, marginBottom: 24, color: colors.textPrimary }}>
          Account
        </h1>

        {activeUser ? (
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
                {activeUser.name}
              </h2>
              <p style={{ fontSize: 14, color: colors.textMuted }}>
                {activeUser.email}
              </p>
              <p style={{ fontSize: 14, color: colors.textSecondary }}>
                {activeUser.role === 'business' ? 'Business Owner' : 
                 activeUser.role === 'admin' ? 'Administrator' : 'Customer'}
              </p>
            </div>

            {/* Account Statistics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 24 }}>
              <div style={{ 
                background: 'linear-gradient(135deg, rgba(253, 252, 210, 0.15) 0%, rgba(253, 252, 210, 0.05) 100%)', 
                borderRadius: 16, 
                padding: 20, 
                textAlign: 'center',
                border: '1px solid rgba(253, 252, 210, 0.2)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8
              }}>
                <div style={{ 
                  width: 48, height: 48, borderRadius: 14, 
                  background: colors.primary, 
                  display: 'flex', alignItems: 'center', justifyContent: 'center' 
                }}>
                  <Store size={24} stroke={colors.secondary} />
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, color: colors.primary }}>
                  {userBusinesses.length}
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: colors.textSecondary }}>Businesses</div>
              </div>
              
              <div style={{ 
                background: 'linear-gradient(135deg, rgba(255, 107, 157, 0.15) 0%, rgba(255, 107, 157, 0.05) 100%)', 
                borderRadius: 16, 
                padding: 20, 
                textAlign: 'center',
                border: '1px solid rgba(255, 107, 157, 0.2)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8
              }}>
                <div style={{ 
                  width: 48, height: 48, borderRadius: 14, 
                  background: colors.accent, 
                  display: 'flex', alignItems: 'center', justifyContent: 'center' 
                }}>
                  <Scissors size={24} stroke="white" />
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, color: colors.accent }}>
                  {userServices.length}
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: colors.textSecondary }}>Services</div>
              </div>
              
              <div style={{ 
                background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.15) 0%, rgba(0, 212, 255, 0.05) 100%)', 
                borderRadius: 16, 
                padding: 20, 
                textAlign: 'center',
                border: '1px solid rgba(0, 212, 255, 0.2)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8
              }}>
                <div style={{ 
                  width: 48, height: 48, borderRadius: 14, 
                  background: colors.accent2, 
                  display: 'flex', alignItems: 'center', justifyContent: 'center' 
                }}>
                  <Calendar size={24} stroke="white" />
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, color: colors.accent2 }}>
                  {userBookings.length}
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: colors.textSecondary }}>Bookings</div>
              </div>
              
              <div style={{ 
                background: 'linear-gradient(135deg, rgba(0, 230, 118, 0.15) 0%, rgba(0, 230, 118, 0.05) 100%)', 
                borderRadius: 16, 
                padding: 20, 
                textAlign: 'center',
                border: '1px solid rgba(0, 230, 118, 0.2)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8
              }}>
                <div style={{ 
                  width: 48, height: 48, borderRadius: 14, 
                  background: '#00e676', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center' 
                }}>
                  <Star size={24} stroke="white" />
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#00e676' }}>
                  {userReviews.length}
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: colors.textSecondary }}>Reviews</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 20 }}>
              <Button
                onClick={() => router.push('/client/calendar')}
                style={{ width: '100%' }}
              >
                <Calendar size={20} />
                My Appointments
              </Button>
              <Button
                onClick={() => router.push('/client/payments')}
                style={{ width: '100%' }}
              >
                <CreditCard size={20} />
                My Payments
              </Button>
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