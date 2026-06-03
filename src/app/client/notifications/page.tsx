'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Bell, BellPlus, Calendar, Heart, Trash2, CheckCheck } from 'lucide-react';

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
}

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  businessId: string | null;
  read: boolean;
  actionUrl: string | null;
  createdAt: string;
}

export default function NotificationsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        const userData = JSON.parse(stored);
        setUser(userData);
        fetchNotifications(userData.id);
      } catch {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const fetchNotifications = async (userId: string) => {
    try {
      const res = await fetch(`/api/data/client-notifications?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notifId: string) => {
    try {
      await fetch('/api/data/client-notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId: notifId }),
      });
      setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n));
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const markAllRead = async () => {
    if (!user) return;
    try {
      await fetch('/api/data/client-notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const deleteNotification = async (notifId: string) => {
    try {
      await fetch(`/api/data/client-notifications?notificationId=${notifId}`, { method: 'DELETE' });
      setNotifications(prev => prev.filter(n => n.id !== notifId));
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'slot_available': return <BellPlus size={18} stroke={colors.accent2} />;
      case 'favorite_update': return <Heart size={18} stroke={colors.accent} fill={colors.accent} />;
      default: return <Bell size={18} stroke={colors.primary} />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: colors.background, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: colors.textMuted }}>Loading notifications...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: colors.background, padding: '60px 20px 100px' }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <ArrowLeft size={20} color={colors.textMuted} />
          <span style={{ fontSize: 14, color: colors.textMuted }}>Back</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg, #ff6b9d 0%, #ff8fab 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bell size={24} stroke="white" />
            </div>
            <div>
              <h1 style={{ fontSize: 22, color: colors.primary, fontWeight: 900 }}>Notifications</h1>
              <p style={{ fontSize: 13, color: colors.textMuted }}>{unreadCount} unread</p>
            </div>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              style={{
                padding: '8px 14px',
                borderRadius: 10,
                border: `1px solid ${colors.accent2}`,
                background: 'transparent',
                color: colors.accent2,
                fontWeight: 600,
                fontSize: 12,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <CheckCheck size={14} /> Mark all read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <Bell size={48} stroke={colors.textMuted} style={{ marginBottom: 16 }} />
            <p style={{ color: colors.textMuted, fontSize: 14 }}>No notifications yet</p>
            <p style={{ color: colors.textMuted, fontSize: 12, marginTop: 8 }}>We'll notify you when slots open at your favorite businesses</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {notifications.map((notif, index) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => {
                  markAsRead(notif.id);
                  if (notif.actionUrl) router.push(notif.actionUrl);
                }}
                style={{
                  padding: 16,
                  borderRadius: 16,
                  background: notif.read ? colors.surface : 'rgba(255, 107, 157, 0.08)',
                  border: `1px solid ${notif.read ? colors.border : colors.accent + '44'}`,
                  cursor: notif.actionUrl ? 'pointer' : 'default',
                  display: 'flex',
                  gap: 14,
                  alignItems: 'flex-start',
                }}
              >
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: notif.type === 'slot_available' ? 'rgba(0, 212, 255, 0.15)' : notif.type === 'favorite_update' ? 'rgba(255, 107, 157, 0.15)' : 'rgba(253, 252, 210, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {getIcon(notif.type)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: colors.textPrimary }}>{notif.title}</span>
                    {!notif.read && <div style={{ width: 6, height: 6, borderRadius: '50%', background: colors.accent, flexShrink: 0 }} />}
                  </div>
                  <p style={{ fontSize: 13, color: colors.textSecondary, margin: 0, lineHeight: 1.5 }}>{notif.message}</p>
                  <span style={{ fontSize: 11, color: colors.textMuted, marginTop: 6, display: 'block' }}>
                    {new Date(notif.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(notif.id);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 4,
                    opacity: 0.5,
                  }}
                >
                  <Trash2 size={14} stroke={colors.textMuted} />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
