'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Store, ClipboardList, ArrowLeft, Calendar, DollarSign, BarChart3 } from 'lucide-react';
import { useAuth } from '@/lib/authContext';
import { getBusinessByUserId } from '@/lib/actions';

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

export default function BusinessHome() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [business, setBusiness] = useState<any>(null);
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

  useEffect(() => {
    if (!mounted || !user) return;
    async function loadBusiness() {
      if (user) {
        const biz = await getBusinessByUserId(user.id);
        setBusiness(biz);
      }
      setLoading(false);
    }
    loadBusiness();
  }, [mounted, user]);

  if (!mounted || !user) return null;

  if (loading) {
    return <div style={{ minHeight: '100vh', background: colors.background, padding: 60, textAlign: 'center', color: colors.textPrimary }}>Loading...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: colors.background, padding: '60px 20px' }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <button onClick={() => router.push('/auth')} style={{ background: 'none', border: 'none', cursor: 'pointer', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <ArrowLeft size={20} color={colors.textMuted} />
          <span style={{ fontSize: 14, color: colors.textMuted }}>Back</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 16, background: 'linear-gradient(135deg, #fdfcd2 0%, #ffeb8a 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Store size={32} stroke={colors.secondary} />
          </div>
          <div>
            <h1 style={{ fontSize: 24, color: colors.primary, fontWeight: 900 }}>Business Portal</h1>
            <p style={{ fontSize: 14, color: colors.textMuted }}>{user.name}</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {!business ? (
            <motion.div onClick={() => router.push('/business/apply')} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{
              display: 'flex', alignItems: 'center', gap: 16, padding: 24, background: 'linear-gradient(135deg, #fdfcd2 0%, #ffeb8a 100%)', borderRadius: 16, cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(253, 252, 210, 0.3)'
            }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: colors.secondary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ClipboardList size={28} stroke={colors.primary} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4, color: colors.secondary }}>Apply to List Your Business</h3>
                <p style={{ fontSize: 14, color: colors.secondary, opacity: 0.7 }}>Start accepting bookings today</p>
              </div>
            </motion.div>
          ) : business.status === 'pending' ? (
            <div style={{ padding: 24, background: 'linear-gradient(135deg, #fdfcd2 0%, #ffeb8a 100%)', borderRadius: 16, textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: colors.secondary, margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ClipboardList size={32} stroke={colors.primary} />
              </div>
              <h3 style={{ fontSize: 18, marginBottom: 8, color: colors.secondary, fontWeight: 700 }}>Pending Approval</h3>
              <p style={{ color: colors.secondary, opacity: 0.7 }}>Your application is under review. We'll notify you once approved.</p>
            </div>
          ) : business.status === 'approved' ? (
            <>
              <motion.div onClick={() => router.push('/business/dashboard')} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{
                display: 'flex', alignItems: 'center', gap: 16, padding: 24, background: 'linear-gradient(135deg, #fdfcd2 0%, #ffeb8a 100%)', borderRadius: 16, cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(253, 252, 210, 0.3)'
              }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: colors.secondary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Store size={28} stroke={colors.primary} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4, color: colors.secondary }}>Dashboard</h3>
                  <p style={{ fontSize: 14, color: colors.secondary, opacity: 0.7 }}>Manage bookings and schedule</p>
                </div>
              </motion.div>

              <motion.div onClick={() => router.push('/business/calendar')} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{
                display: 'flex', alignItems: 'center', gap: 16, padding: 24, background: 'linear-gradient(135deg, #fdfcd2 0%, #ffeb8a 100%)', borderRadius: 16, cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(253, 252, 210, 0.3)'
              }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: colors.secondary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Calendar size={28} stroke={colors.primary} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4, color: colors.secondary }}>Working Hours</h3>
                  <p style={{ fontSize: 14, color: colors.secondary, opacity: 0.7 }}>Set your availability and schedule</p>
                </div>
              </motion.div>

              <motion.div onClick={() => router.push('/business/earnings')} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{
                display: 'flex', alignItems: 'center', gap: 16, padding: 24, background: 'linear-gradient(135deg, #fdfcd2 0%, #ffeb8a 100%)', borderRadius: 16, cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(253, 252, 210, 0.3)'
              }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: colors.secondary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <DollarSign size={28} stroke={colors.primary} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4, color: colors.secondary }}>Earnings</h3>
                  <p style={{ fontSize: 14, color: colors.secondary, opacity: 0.7 }}>Track your revenue from card payments</p>
                </div>
              </motion.div>

              {!business.bankAccount && (
                <motion.div onClick={() => router.push('/business/onboarding')} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{
                  display: 'flex', alignItems: 'center', gap: 16, padding: 24, background: colors.surface, borderRadius: 16, cursor: 'pointer',
                  border: `1px solid ${colors.border}`
                }}>
                  <div style={{ width: 56, height: 56, borderRadius: 16, background: colors.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Store size={28} stroke="white" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4, color: colors.textPrimary }}>Complete Setup</h3>
                    <p style={{ fontSize: 14, color: colors.textSecondary }}>Connect bank account to receive payments</p>
                  </div>
                </motion.div>
              )}
            </>
          ) : business.status === 'rejected' ? (
            <div style={{ padding: 24, background: 'linear-gradient(135deg, #ff6b9d33 0%, #ff6b9d22 100%)', borderRadius: 16, textAlign: 'center', border: `1px solid ${colors.accent}` }}>
              <h3 style={{ fontSize: 18, marginBottom: 8, color: colors.accent, fontWeight: 700 }}>Application Rejected</h3>
              <p style={{ color: colors.textSecondary }}>Your application was not approved. Please contact support.</p>
            </div>
          ) : null}
        </div>
      </motion.div>
    </div>
  );
}