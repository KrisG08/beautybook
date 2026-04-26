'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  User, Store, Shield, Home, Search, Calendar, UserCircle, ArrowLeft,
  Star, Clock, MapPin, ChevronRight, Scissors, Hand, Sparkles, Heart, Palette, CircleDollarSign
} from 'lucide-react';

const colors = {
  primary: '#FFD600',
  surface: '#FFF7E0',
  textPrimary: '#2A241C',
  textSecondary: '#6B6358',
  textMuted: '#9A9595',
  border: '#E8DDC7',
};

const iconMap: Record<string, React.ComponentType<{ size?: number; stroke?: string; fill?: string }>> = {
  Scissors: ({ size, stroke }) => <svg width={size||24} height={size||24} viewBox="0 0 24 24" fill="none" stroke={stroke||'currentColor'} strokeWidth="2"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/></svg>,
  Hand: ({ size, stroke }) => <svg width={size||24} height={size||24} viewBox="0 0 24 24" fill="none" stroke={stroke||'currentColor'} strokeWidth="2"><path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/><path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg>,
  Sparkles: ({ size, stroke }) => <svg width={size||24} height={size||24} viewBox="0 0 24 24" fill="none" stroke={stroke||'currentColor'} strokeWidth="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>,
  Heart: ({ size, stroke }) => <svg width={size||24} height={size||24} viewBox="0 0 24 24" fill="none" stroke={stroke||'currentColor'} strokeWidth="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>,
  Palette: ({ size, stroke }) => <svg width={size||24} height={size||24} viewBox="0 0 24 24" fill="none" stroke={stroke||'currentColor'} strokeWidth="2"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z"/></svg>,
  Eye: ({ size, stroke }) => <svg width={size||24} height={size||24} viewBox="0 0 24 24" fill="none" stroke={stroke||'currentColor'} strokeWidth="2"><path d="M2.062 12.348a1 2 2 0 0 1 0-.696 10.75 10.75 0 0 1 19.588 0 1 2 2 0 0 1 0 .696 10.75 10.75 0 0 1-19.588 0"/><circle cx="12" cy="12" r="3"/></svg>,
};

export function ClientBottomNav({ active }: { active: string }) {
  const router = useRouter();
  const navItems = [
    { id: 'home', label: 'Discover', icon: Home, path: '/client' },
    { id: 'search', label: 'Search', icon: Search, path: '/client/search' },
    { id: 'calendar', label: 'Bookings', icon: Calendar, path: '/client/calendar' },
    { id: 'account', label: 'Profile', icon: UserCircle, path: '/client/account' },
  ];
  return (
    <div className="bottom-nav">
      {navItems.map((item) => (
        <div key={item.id} className={`nav-item ${active === item.id ? 'active' : ''}`} onClick={() => router.push(item.path)}>
          <item.icon size={22} strokeWidth={2} />
          <span style={{ fontSize: 11, fontWeight: 600 }}>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export function CategoryCard({ category, onClick }: { category: { id: string; name: string; icon: string; color: string }; onClick: () => void }) {
  const Icon = iconMap[category.icon] || Hand;
  return (
    <motion.div className="category-card" onClick={onClick} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
      <div style={{ width: 56, height: 56, borderRadius: 20, background: category.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={26} stroke={category.color === '#FFD600' ? colors.textPrimary : 'white'} />
      </div>
      <span style={{ fontSize: 13, fontWeight: 700 }}>{category.name}</span>
    </motion.div>
  );
}

export function BusinessCard({ business, onClick }: { business: { id: string; name: string; address: string; rating: number; reviewCount: number; description: string; imageUrl?: string }; onClick: () => void }) {
  return (
    <motion.div onClick={onClick} whileHover={{ y: -4 }} whileTap={{ scale: 0.99 }} className="business-card" style={{ cursor: 'pointer' }}>
      {business.imageUrl && <img src={business.imageUrl} alt={business.name} className="business-image" />}
      <div style={{ padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <h3 style={{ fontSize: 17, fontFamily: 'Playfair Display, serif', fontWeight: 700, margin: 0 }}>{business.name}</h3>
          <div className="availability-badge">⚡ Available</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <Star size={14} fill={colors.primary} stroke={colors.primary} />
          <span style={{ fontSize: 14, fontWeight: 700 }}>{business.rating}</span>
          <span style={{ fontSize: 12, color: colors.textMuted }}>({business.reviewCount})</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <MapPin size={14} stroke={colors.textMuted} />
          <span style={{ fontSize: 13, color: colors.textMuted }}>{business.address}</span>
        </div>
      </div>
    </motion.div>
  );
}

export function TimeSlotButton({ slot, selected, onClick }: { slot: { id: string; startTime: string; endTime: string; available: boolean }; selected: boolean; onClick: () => void }) {
  return (
    <button className={`time-slot ${selected ? 'selected' : ''} ${!slot.available ? 'disabled' : ''}`} onClick={slot.available ? onClick : undefined} disabled={!slot.available}>
      {slot.startTime}
    </button>
  );
}

export function ReviewCard({ review }: { review: { userName: string; rating: number; comment: string; createdAt: Date } }) {
  return (
    <div style={{ background: colors.surface, borderRadius: 16, padding: 16, marginBottom: 12, border: `1px solid ${colors.border}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontWeight: 700 }}>{review.userName}</span>
        <div style={{ display: 'flex', gap: 2 }}>
          {[1,2,3,4,5].map((star) => (
            <Star key={star} size={14} fill={star <= review.rating ? colors.primary : 'transparent'} stroke={colors.primary} />
          ))}
        </div>
      </div>
      <p style={{ fontSize: 14, color: colors.textSecondary, lineHeight: 1.5, margin: 0 }}>{review.comment}</p>
    </div>
  );
}

export function Button({ children, variant = 'primary', onClick, disabled, style, type = 'button' }: { children: React.ReactNode; variant?: 'primary' | 'secondary' | 'outline'; onClick?: () => void; disabled?: boolean; style?: React.CSSProperties; type?: 'button' | 'submit' | 'reset' }) {
  return (
    <motion.button type={type} className="btn-primary" onClick={onClick} disabled={disabled} whileHover={{ scale: disabled ? 1 : 1.02 }} whileTap={{ scale: disabled ? 1 : 0.98 }} style={{ ...style, opacity: disabled ? 0.5 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}>
      {children}
    </motion.button>
  );
}

export function Input({ label, value, onChange, placeholder, type = 'text' }: { label?: string; value: string; onChange: (value: string) => void; placeholder?: string; type?: string }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>{label}</label>}
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="input" />
    </div>
  );
}

export function FilterChip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return <div className={`filter-chip ${selected ? 'active' : ''}`} onClick={onClick}>{label}</div>;
}

export function Badge({ children, variant = 'success' }: { children: React.ReactNode; variant?: 'success' | 'warning' | 'error' | 'urgent' }) {
  const colors_map = { success: { bg: '#D1FAE5', color: '#059669' }, warning: { bg: '#FEF3C7', color: '#D97706' }, error: { bg: '#FEE2E2', color: '#DC2626' }, urgent: { bg: colors.primary, color: colors.textPrimary } };
  return <span className="badge" style={{ background: colors_map[variant].bg, color: colors_map[variant].color }}>{children}</span>;
}

export function TabButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return <div className={`tab ${active ? 'active' : ''}`} onClick={onClick}>{label}</div>;
}