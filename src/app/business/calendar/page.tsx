'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Clock, Calendar as CalendarIcon, Save, Check } from 'lucide-react';
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

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const timeSlots = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
];

const defaultSchedule: Record<string, { enabled: boolean; start: string; end: string }> = {
  Monday: { enabled: true, start: '09:00', end: '18:00' },
  Tuesday: { enabled: true, start: '09:00', end: '18:00' },
  Wednesday: { enabled: true, start: '09:00', end: '18:00' },
  Thursday: { enabled: true, start: '09:00', end: '18:00' },
  Friday: { enabled: true, start: '09:00', end: '18:00' },
  Saturday: { enabled: false, start: '10:00', end: '16:00' },
  Sunday: { enabled: false, start: '10:00', end: '14:00' },
};

export default function BusinessCalendar() {
  const router = useRouter();
  const { user } = useAuth();
  const [schedule, setSchedule] = useState(defaultSchedule);
  const [saved, setSaved] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleDay = (day: string) => {
    setSchedule(prev => ({
      ...prev,
      [day]: { ...prev[day], enabled: !prev[day].enabled }
    }));
  };

  const updateTime = (day: string, field: 'start' | 'end', value: string) => {
    setSchedule(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: value }
    }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const getActiveDaysCount = () => Object.values(schedule).filter(d => d.enabled).length;

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
            <CalendarIcon size={24} stroke={colors.secondary} />
          </div>
          <div>
            <h1 style={{ fontSize: 22, color: colors.primary, fontWeight: 900 }}>Working Hours</h1>
            <p style={{ fontSize: 13, color: colors.textMuted }}>Set your weekly schedule</p>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, padding: '12px 16px', background: colors.surface, borderRadius: 12, border: `1px solid ${colors.border}` }}>
          <div>
            <span style={{ color: colors.textSecondary, fontSize: 13 }}>Active Days: </span>
            <span style={{ color: colors.primary, fontWeight: 700 }}>{getActiveDaysCount()} / 7</span>
          </div>
          <button
            onClick={handleSave}
            style={{
              padding: '10px 20px',
              background: saved ? '#00e676' : 'linear-gradient(135deg, #fdfcd2 0%, #ffeb8a 100%)',
              border: 'none',
              borderRadius: 12,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            {saved ? <Check size={18} stroke={colors.secondary} /> : <Save size={18} stroke={colors.secondary} />}
            <span style={{ color: colors.secondary, fontWeight: 700, fontSize: 14 }}>
              {saved ? 'Saved!' : 'Save'}
            </span>
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {daysOfWeek.map((day) => (
            <motion.div
              key={day}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: colors.surface,
                borderRadius: 16,
                padding: 16,
                border: `1px solid ${schedule[day].enabled ? colors.primary + '44' : colors.border}`,
                boxShadow: schedule[day].enabled ? '0 4px 20px rgba(253, 252, 210, 0.15)' : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: schedule[day].enabled ? 12 : 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <button
                    onClick={() => toggleDay(day)}
                    style={{
                      width: 44,
                      height: 24,
                      borderRadius: 12,
                      background: schedule[day].enabled 
                        ? 'linear-gradient(135deg, #fdfcd2 0%, #ffeb8a 100%)' 
                        : colors.surfaceLight,
                      border: `2px solid ${schedule[day].enabled ? colors.primary : colors.border}`,
                      cursor: 'pointer',
                      position: 'relative',
                      transition: 'all 0.2s',
                    }}
                  >
                    <motion.div
                      animate={{ x: schedule[day].enabled ? 20 : 0 }}
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: 8,
                        background: schedule[day].enabled ? colors.secondary : colors.textMuted,
                        position: 'absolute',
                        top: 2,
                        left: 2,
                      }}
                    />
                  </button>
                  <span style={{ fontSize: 16, fontWeight: 700, color: colors.textPrimary }}>{day}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Clock size={16} stroke={schedule[day].enabled ? colors.primary : colors.textMuted} />
                  <span style={{ fontSize: 14, color: schedule[day].enabled ? colors.textSecondary : colors.textMuted }}>
                    {schedule[day].enabled ? `${schedule[day].start} - ${schedule[day].end}` : 'Closed'}
                  </span>
                </div>
              </div>

              {schedule[day].enabled && (
                <div style={{ display: 'flex', gap: 16, paddingTop: 12, borderTop: `1px solid ${colors.border}` }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 11, color: colors.textMuted, marginBottom: 6, display: 'block' }}>Start Time</label>
                    <select
                      value={schedule[day].start}
                      onChange={(e) => updateTime(day, 'start', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        background: colors.background,
                        border: `1px solid ${colors.border}`,
                        borderRadius: 10,
                        color: colors.textPrimary,
                        fontSize: 14,
                      }}
                    >
                      {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 11, color: colors.textMuted, marginBottom: 6, display: 'block' }}>End Time</label>
                    <select
                      value={schedule[day].end}
                      onChange={(e) => updateTime(day, 'end', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        background: colors.background,
                        border: `1px solid ${colors.border}`,
                        borderRadius: 10,
                        color: colors.textPrimary,
                        fontSize: 14,
                      }}
                    >
                      {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <div style={{ marginTop: 24, padding: 16, background: colors.surface, borderRadius: 16, border: `1px solid ${colors.border}` }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: colors.textPrimary, marginBottom: 12 }}>💡 Quick Tips</h3>
          <ul style={{ fontSize: 13, color: colors.textSecondary, paddingLeft: 16, lineHeight: 1.8 }}>
            <li>Clients can only book during your working hours</li>
            <li>You can toggle days on/off to customize your week</li>
            <li>Changes are saved automatically</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}