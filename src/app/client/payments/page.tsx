'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CreditCard, CheckCircle, Clock, DollarSign, Receipt } from 'lucide-react';

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

const mockPayments = [
  { id: '1', date: '2024-01-28', service: 'Haircut & Styling', business: 'Glamour Studio', amount: 45, status: 'paid', method: 'card' },
  { id: '2', date: '2024-01-25', service: 'Gel Manicure', business: 'Nail Art Studio', amount: 40, status: 'paid', method: 'card' },
  { id: '3', date: '2024-01-20', service: 'Full Massage', business: 'Relax Center', amount: 80, status: 'paid', method: 'card' },
  { id: '4', date: '2024-01-15', service: 'Facial Treatment', business: 'Beauty Zone', amount: 55, status: 'refunded', method: 'card' },
  { id: '5', date: '2024-01-10', service: 'Hair Coloring', business: 'Keys Hair Studio', amount: 80, status: 'paid', method: 'card' },
  { id: '6', date: '2024-01-05', service: 'Bridal Makeup', business: 'Glamour Studio', amount: 120, status: 'paid', method: 'card' },
  { id: '7', date: '2023-12-28', service: 'Haircut & Styling', business: 'Barber Shop 19', amount: 25, status: 'paid', method: 'cash' },
  { id: '8', date: '2023-12-20', service: 'Manicure', business: 'Nail Art Studio', amount: 20, status: 'paid', method: 'cash' },
];

const cardPayments = mockPayments.filter(p => p.method === 'card');
const totalSpent = cardPayments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
const refunded = cardPayments.filter(p => p.status === 'refunded').reduce((sum, p) => sum + p.amount, 0);

export default function ClientPayments() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
            <CreditCard size={24} stroke={colors.secondary} />
          </div>
          <div>
            <h1 style={{ fontSize: 22, color: colors.primary, fontWeight: 900 }}>My Payments</h1>
            <p style={{ fontSize: 13, color: colors.textMuted }}>Card payments for beauty services</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'linear-gradient(135deg, #fdfcd2 0%, #ffeb8a 100%)',
              borderRadius: 14,
              padding: 16,
            }}
          >
            <DollarSign size={20} stroke={colors.secondary} style={{ marginBottom: 8 }} />
            <div style={{ fontSize: 20, fontWeight: 900, color: colors.secondary }}>€{totalSpent}</div>
            <div style={{ fontSize: 11, color: colors.secondary, opacity: 0.7 }}>Total Paid</div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              background: colors.surface,
              borderRadius: 14,
              padding: 16,
              border: `1px solid ${colors.border}`,
            }}
          >
            <Receipt size={20} stroke={colors.textSecondary} style={{ marginBottom: 8 }} />
            <div style={{ fontSize: 20, fontWeight: 900, color: colors.textPrimary }}>{cardPayments.length}</div>
            <div style={{ fontSize: 11, color: colors.textSecondary }}>Transactions</div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              background: colors.surface,
              borderRadius: 14,
              padding: 16,
              border: `1px solid ${colors.accent}44`,
            }}
          >
            <Clock size={20} stroke={colors.accent} style={{ marginBottom: 8 }} />
            <div style={{ fontSize: 20, fontWeight: 900, color: colors.accent }}>€{refunded}</div>
            <div style={{ fontSize: 11, color: colors.textSecondary }}>Refunded</div>
          </motion.div>
        </div>

        {/* Card Payments List */}
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: colors.textPrimary, marginBottom: 16 }}>Card Payments</h2>
          {cardPayments.map((payment, index) => (
            <motion.div
              key={payment.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              style={{
                background: colors.surface,
                borderRadius: 14,
                padding: 16,
                marginBottom: 10,
                border: `1px solid ${payment.status === 'refunded' ? colors.accent : colors.border}`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: colors.textPrimary, marginBottom: 4 }}>{payment.service}</div>
                  <div style={{ fontSize: 12, color: colors.textMuted }}>{payment.business}</div>
                  <div style={{ fontSize: 11, color: colors.textMuted, marginTop: 4 }}>{payment.date}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: payment.status === 'refunded' ? colors.accent : colors.primary }}>
                    {payment.status === 'refunded' ? `-€${payment.amount}` : `€${payment.amount}`}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                    {payment.status === 'paid' ? (
                      <CheckCircle size={12} stroke="#00e676" />
                    ) : (
                      <Clock size={12} stroke={colors.accent} />
                    )}
                    <span style={{ fontSize: 10, color: payment.status === 'paid' ? '#00e676' : colors.accent, textTransform: 'uppercase' }}>
                      {payment.status}
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: 6, 
                background: colors.surfaceLight, 
                padding: '4px 8px', 
                borderRadius: 6 
              }}>
                <CreditCard size={12} stroke={colors.accent2} />
                <span style={{ fontSize: 10, color: colors.accent2 }}>Paid with card</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div style={{ marginTop: 24, padding: 16, background: colors.surface, borderRadius: 16, border: `1px solid ${colors.border}` }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: colors.textPrimary, marginBottom: 12 }}>💡 Payment Methods</h3>
          <ul style={{ fontSize: 13, color: colors.textSecondary, paddingLeft: 16, lineHeight: 1.8 }}>
            <li>Card payments are processed securely through the app</li>
            <li>You can request refunds within 14 days of payment</li>
            <li>Cash payments are handled directly at the business</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}