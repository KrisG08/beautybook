'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, Calendar, DollarSign, CheckCircle, XCircle } from 'lucide-react';
import { Badge } from '@/components/UI';
import { useStore } from '@/lib/store';
import { format } from 'date-fns';

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

export default function AdminBookings() {
  const router = useRouter();
  const { bookings, businesses, services } = useStore();

  const totalRevenue = bookings.reduce((sum, b) => sum + b.totalPrice, 0);
  const platformRevenue = totalRevenue * 0.1;

  return (
    <div className="container" style={{ paddingTop: 20, paddingBottom: 40 }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <motion.div
            onClick={() => router.push('/admin')}
            whileTap={{ scale: 0.95 }}
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: colors.surface,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <ArrowLeft size={20} stroke={colors.textPrimary} />
          </motion.div>
          <h1 style={{ fontSize: 24, color: colors.textPrimary }}>Bookings</h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 24 }}>
          <div style={{
            background: colors.surface,
            borderRadius: 16,
            padding: 20,
            textAlign: 'center',
          }}>
            <Calendar size={24} stroke={colors.primary} />
            <div style={{ fontSize: 28, fontWeight: 700, color: colors.textPrimary, marginTop: 8 }}>
              {bookings.length}
            </div>
            <div style={{ fontSize: 12, color: colors.textMuted }}>Total Bookings</div>
          </div>

          <div style={{
            background: colors.surface,
            borderRadius: 16,
            padding: 20,
            textAlign: 'center',
          }}>
            <DollarSign size={24} stroke={colors.success} />
            <div style={{ fontSize: 28, fontWeight: 700, color: colors.success, marginTop: 8 }}>
              ${platformRevenue.toFixed(0)}
            </div>
            <div style={{ fontSize: 12, color: colors.textMuted }}>Platform Revenue</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {bookings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40 }}>
              <Calendar size={48} stroke={colors.textMuted} style={{ marginBottom: 16 }} />
              <p style={{ color: colors.textMuted }}>No bookings yet</p>
            </div>
          ) : (
            bookings.map((booking, index) => {
              const business = businesses.find(b => b.id === booking.businessId);
              const service = services.find(s => s.id === booking.serviceId);
              
              return (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  style={{
                    background: colors.surface,
                    borderRadius: 16,
                    padding: 16,
                    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: colors.textPrimary }}>
                      {business?.name}
                    </h3>
                    <Badge variant={booking.status === 'confirmed' ? 'success' : booking.status === 'completed' ? 'success' : 'warning'}>
                      {booking.status}
                    </Badge>
                  </div>
                  <div style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 4 }}>
                    {service?.name}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, color: colors.textMuted }}>
                      {format(booking.createdAt, 'MMM d, yyyy h:mm a')}
                    </span>
                    <span style={{ fontWeight: 600, color: colors.primary }}>
                      ${booking.totalPrice}
                    </span>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </motion.div>
    </div>
  );
}