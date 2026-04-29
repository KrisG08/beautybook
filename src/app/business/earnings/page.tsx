'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, DollarSign, TrendingUp, Calendar, CreditCard, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '@/lib/authContext';
import { getBusinessByUserId } from '@/lib/actions';
import { BusinessBottomNav } from '@/components/UI';

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

interface Transaction {
  id: string;
  date: string;
  service: string;
  client: string;
  amount: number;
  status: 'completed' | 'pending' | 'paid';
}

const mockTransactions: Transaction[] = [
  { id: '1', date: '2024-01-28', service: 'Haircut & Styling', client: 'Maria Ivanova', amount: 45, status: 'paid' },
  { id: '2', date: '2024-01-27', service: 'Gel Manicure', client: 'Elena Petrova', amount: 40, status: 'paid' },
  { id: '3', date: '2024-01-26', service: 'Full Massage', client: 'Georgi Dimitrov', amount: 80, status: 'paid' },
  { id: '4', date: '2024-01-25', service: 'Facial Treatment', client: 'Anna Stoyanova', amount: 55, status: 'completed' },
  { id: '5', date: '2024-01-24', service: 'Bridal Makeup', client: 'Silviya Nikolova', amount: 150, status: 'paid' },
  { id: '6', date: '2024-01-23', service: 'Hair Coloring', client: 'Radostina Hristova', amount: 80, status: 'completed' },
  { id: '7', date: '2024-01-22', service: 'Nail Art', client: 'Marta Davidova', amount: 35, status: 'paid' },
  { id: '8', date: '2024-01-21', service: 'Eyebrow Lamination', client: 'Natalia Angelova', amount: 60, status: 'completed' },
];

export default function BusinessEarnings() {
  const router = useRouter();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('week');

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

  const totalEarnings = mockTransactions.reduce((sum, t) => sum + t.amount, 0);
  const thisWeek = mockTransactions.filter(t => {
    const date = new Date(t.date);
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return date >= weekAgo;
  }).reduce((sum, t) => sum + t.amount, 0);
  
  const thisMonth = mockTransactions.filter(t => {
    const date = new Date(t.date);
    const now = new Date();
    return date.getMonth() === now.getMonth();
  }).reduce((sum, t) => sum + t.amount, 0);

  const pendingPayouts = 0;

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
            <DollarSign size={24} stroke={colors.secondary} />
          </div>
          <div>
            <h1 style={{ fontSize: 22, color: colors.primary, fontWeight: 900 }}>Earnings</h1>
            <p style={{ fontSize: 13, color: colors.textMuted }}>Track your revenue from card payments</p>
          </div>
        </div>

        {/* Period Selector */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {['week', 'month', 'year'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              style={{
                flex: 1,
                padding: '12px 16px',
                background: selectedPeriod === period 
                  ? 'linear-gradient(135deg, #fdfcd2 0%, #ffeb8a 100%)' 
                  : colors.surface,
                border: `1px solid ${selectedPeriod === period ? colors.primary : colors.border}`,
                borderRadius: 12,
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              <span style={{ 
                color: selectedPeriod === period ? colors.secondary : colors.textMuted, 
                fontWeight: 700, 
                fontSize: 14 
              }}>
                This {period}
              </span>
            </button>
          ))}
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 24 }}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'linear-gradient(135deg, #fdfcd2 0%, #ffeb8a 100%)',
              borderRadius: 16,
              padding: 20,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <TrendingUp size={20} stroke={colors.secondary} />
              <span style={{ fontSize: 12, color: colors.secondary, opacity: 0.7 }}>This Week</span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 900, color: colors.secondary }}>€{thisWeek}</div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              background: colors.surface,
              borderRadius: 16,
              padding: 20,
              border: `1px solid ${colors.border}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Calendar size={20} stroke={colors.textSecondary} />
              <span style={{ fontSize: 12, color: colors.textSecondary }}>This Month</span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 900, color: colors.textPrimary }}>€{thisMonth}</div>
          </motion.div>
        </div>

        {/* Total Balance */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            background: 'linear-gradient(135deg, #140755 0%, #2a1a8a 100%)',
            borderRadius: 20,
            padding: 24,
            marginBottom: 24,
            boxShadow: '0 8px 32px rgba(20, 7, 85, 0.4)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 14, color: colors.textMuted }}>Total Balance</span>
            <CreditCard size={24} stroke={colors.primary} />
          </div>
          <div style={{ fontSize: 40, fontWeight: 900, color: colors.primary, marginBottom: 4 }}>€{totalEarnings}</div>
          <div style={{ fontSize: 12, color: '#00e676' }}>• All payments processed</div>
        </motion.div>

        {/* Recent Transactions */}
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: colors.textPrimary, marginBottom: 16 }}>Recent Transactions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {mockTransactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                style={{
                  background: colors.surface,
                  borderRadius: 14,
                  padding: 14,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  border: `1px solid ${colors.border}`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ 
                    width: 40, 
                    height: 40, 
                    borderRadius: 12, 
                    background: transaction.status === 'paid' ? 'linear-gradient(135deg, #00e676 0%, #00c853 100%)' : colors.surfaceLight,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {transaction.status === 'paid' ? (
                      <CheckCircle size={20} stroke="white" />
                    ) : (
                      <Clock size={20} stroke={colors.textMuted} />
                    )}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: colors.textPrimary }}>{transaction.service}</div>
                    <div style={{ fontSize: 12, color: colors.textMuted }}>{transaction.client} • {transaction.date}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: colors.primary }}>+€{transaction.amount}</div>
                  <div style={{ fontSize: 10, color: transaction.status === 'paid' ? '#00e676' : colors.textMuted, textTransform: 'capitalize' }}>
                    {transaction.status === 'paid' ? 'Paid to card' : transaction.status}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
      <BusinessBottomNav active="earnings" />
    </div>
  );
}