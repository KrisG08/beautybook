'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Clock, MapPin, CheckCircle, XCircle, Scissors, Palette, Sparkles, Hand, Eye } from 'lucide-react';
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

const mockAppointments = [
  { id: '1', date: '2024-01-28', time: '14:00', service: 'Haircut & Styling', business: 'Glamour Studio', address: 'ul. "Knyaz Alexander I" 12', status: 'upcoming', price: 45 },
  { id: '2', date: '2024-01-25', time: '10:30', service: 'Gel Manicure', business: 'Nail Art Studio', address: 'bul. "Vasil Aprilov" 34', status: 'completed', price: 40 },
  { id: '3', date: '2024-01-20', time: '16:00', service: 'Full Massage', business: 'Relax Center', address: 'ul. "Rakovska" 28', status: 'completed', price: 80 },
  { id: '4', date: '2024-01-15', time: '11:00', service: 'Facial Treatment', business: 'Beauty Zone', address: 'ul. "Hristo Botev" 45', status: 'cancelled', price: 55 },
  { id: '5', date: '2024-01-10', time: '15:30', service: 'Hair Coloring', business: 'Keys Hair Studio', address: 'bul. "Vasil Aprilov" 42', status: 'completed', price: 80 },
];

const upcomingAppointments = mockAppointments.filter(a => a.status === 'upcoming');
const pastAppointments = mockAppointments.filter(a => a.status === 'completed' || a.status === 'cancelled');

export default function ClientCalendar() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return '#00d4ff';
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
            <p style={{ fontSize: 13, color: colors.textMuted }}>Your upcoming and past bookings</p>
          </div>
        </div>

        {upcomingAppointments.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: colors.textPrimary, marginBottom: 16 }}>Upcoming</h2>
            {upcomingAppointments.map((apt, index) => (
              <motion.div
                key={apt.id}
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
                  }}>UPCOMING</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: colors.primary }}>€{apt.price}</span>
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: colors.textPrimary, marginBottom: 8 }}>{apt.service}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <Clock size={14} stroke={colors.textMuted} />
                  <span style={{ fontSize: 13, color: colors.textSecondary }}>{apt.date} at {apt.time}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <MapPin size={14} stroke={colors.textMuted} />
                  <span style={{ fontSize: 13, color: colors.textSecondary }}>{apt.business}</span>
                </div>
                <div style={{ fontSize: 12, color: colors.textMuted }}>{apt.address}</div>
              </motion.div>
            ))}
          </div>
        )}

        <div>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: colors.textPrimary, marginBottom: 16 }}>Past Appointments</h2>
          {pastAppointments.map((apt, index) => (
            <motion.div
              key={apt.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              style={{
                background: colors.surface,
                borderRadius: 14,
                padding: 16,
                marginBottom: 10,
                border: `1px solid ${colors.border}`,
                opacity: apt.status === 'cancelled' ? 0.6 : 1,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {apt.status === 'completed' ? (
                    <CheckCircle size={16} stroke="#00e676" />
                  ) : (
                    <XCircle size={16} stroke={colors.accent} />
                  )}
                  <span style={{ fontSize: 14, fontWeight: 700, color: colors.textPrimary }}>{apt.service}</span>
                </div>
                <span style={{ fontSize: 14, fontWeight: 600, color: apt.status === 'completed' ? colors.primary : colors.textMuted }}>
                  {apt.status === 'completed' ? `€${apt.price}` : '-'}
                </span>
              </div>
              <div style={{ fontSize: 12, color: colors.textMuted }}>
                {apt.date} • {apt.business}
              </div>
              <div style={{ 
                marginTop: 8, 
                fontSize: 10, 
                color: getStatusColor(apt.status), 
                textTransform: 'uppercase', 
                fontWeight: 700 
              }}>
                {apt.status}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}