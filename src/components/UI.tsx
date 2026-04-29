'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  User, Store, Shield, Home, Search, Calendar, UserCircle, ArrowLeft,
  Star, Clock, MapPin, ChevronRight, Scissors, Hand, Sparkles, Heart, 
  Palette, CircleDollarSign, Droplets, Gem, SprayCan, Accessibility, Eye
} from 'lucide-react';

const colors = {
  primary: '#fdfcd2',
  secondary: '#140755',
  accent: '#ff6b9d',
  accent2: '#00d4ff',
  surface: '#12122a',
  surfaceLight: '#1a1a3a',
  textPrimary: '#fdfcd2',
  textSecondary: '#b8b8d0',
  textMuted: '#6a6a8a',
  border: '#2a2a4a',
};

const iconMap: Record<string, React.ComponentType<{ size?: number; stroke?: string; fill?: string }>> = {
  Hair: Scissors,
  Nails: Hand,
  Skin: Sparkles,
  Massage: Heart,
  Makeup: Palette,
  Brows: Eye,
  Aesthetic: Droplets,
  Barber: Gem,
  Spa: SprayCan,
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

export function BusinessBottomNav({ active }: { active: string }) {
  const router = useRouter();
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/business/dashboard' },
    { id: 'calendar', label: 'Hours', icon: Calendar, path: '/business/calendar' },
    { id: 'earnings', label: 'Earnings', icon: CircleDollarSign, path: '/business/earnings' },
    { id: 'account', label: 'Profile', icon: UserCircle, path: '/business' },
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
  const Icon = iconMap[category.icon] || iconMap.Hair;
  return (
    <motion.div className="category-card" onClick={onClick} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
      <div style={{ 
        width: 60, 
        height: 60, 
        borderRadius: 20, 
        background: `linear-gradient(135deg, ${category.color}22 0%, ${category.color}44 100%)`,
        border: `2px solid ${category.color}44`,
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        boxShadow: `0 4px 20px ${category.color}33`
      }}>
        <Icon size={28} stroke={category.color} />
      </div>
      <span style={{ fontSize: 13, fontWeight: 700, color: colors.textPrimary }}>{category.name}</span>
    </motion.div>
  );
}

export function BusinessCard({ business, onClick, isFavorite, onFavoriteClick }: { business: { id: string; name: string; address: string; rating: number; reviewCount: number; description: string; imageUrl?: string; serviceCount?: number; priceRange?: { min: number; max: number }; todaySlots?: number; category?: string }; onClick: () => void; isFavorite?: boolean; onFavoriteClick?: () => void }) {
  const categoryColors: Record<string, string> = {
    hair: '#fdfcd2',
    nails: '#ff6b9d',
    skin: '#00d4ff',
    massage: '#00e676',
    makeup: '#ffab91',
    brows: '#ce93d8',
  };

  const categoryNames: Record<string, string> = {
    hair: 'Hair',
    nails: 'Nails',
    skin: 'Skin',
    massage: 'Massage',
    makeup: 'Makeup',
    brows: 'Brows',
  };

  const categoryColor = business.category ? categoryColors[business.category] : colors.accent;
  const categoryName = business.category ? categoryNames[business.category] : 'Beauty';

  return (
    <motion.div onClick={onClick} whileHover={{ y: -4 }} whileTap={{ scale: 0.99 }} className="business-card" style={{ cursor: 'pointer', position: 'relative' }}>
      {business.imageUrl ? (
        <div style={{ position: 'relative' }}>
          <img src={business.imageUrl} alt={business.name} className="business-image" />
          <div style={{
            position: 'absolute',
            top: 12,
            left: 12,
            background: 'rgba(18, 18, 42, 0.85)',
            backdropFilter: 'blur(8px)',
            padding: '6px 12px',
            borderRadius: 20,
            border: `1px solid ${categoryColor}44`,
          }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: categoryColor }}>{categoryName}</span>
          </div>
          {onFavoriteClick && (
            <button
              onClick={(e) => { e.stopPropagation(); onFavoriteClick(); }}
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                background: isFavorite ? '#ff6b9d' : 'rgba(18, 18, 42, 0.85)',
                border: 'none',
                borderRadius: '50%',
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <Heart size={18} fill={isFavorite ? '#fff' : 'none'} stroke={isFavorite ? '#fff' : '#fff'} />
            </button>
          )}
          <div style={{
            position: 'absolute',
            bottom: 12,
            left: 12,
            background: 'linear-gradient(135deg, #ff6b9d 0%, #ff8fab 100%)',
            padding: '6px 10px',
            borderRadius: 12,
          }}>
            <span style={{ fontSize: 10, fontWeight: 800, color: 'white' }}>⚡ Available</span>
          </div>
        </div>
      ) : (
        <div style={{
          width: '100%',
          height: 140,
          background: 'linear-gradient(135deg, #1a1a3a 0%, #12122a 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <span style={{ fontSize: 40 }}>💅</span>
        </div>
      )}
      <div style={{ padding: 16 }}>
        <h3 style={{ fontSize: 17, fontFamily: 'Playfair Display, serif', fontWeight: 800, margin: '0 0 10px 0', color: colors.textPrimary, lineHeight: 1.3 }}>{business.name}</h3>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Star size={13} fill={colors.primary} stroke={colors.primary} />
            <span style={{ fontSize: 14, fontWeight: 700, color: colors.textPrimary }}>{business.rating}</span>
          </div>
          <span style={{ fontSize: 12, color: colors.textMuted }}>({business.reviewCount} reviews)</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
          <MapPin size={12} stroke={colors.textMuted} />
          <span style={{ fontSize: 12, color: colors.textMuted, lineHeight: 1.4 }}>{business.address}</span>
        </div>
        
        {business.serviceCount !== undefined && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            paddingTop: 12, 
            borderTop: `1px solid ${colors.border}` 
          }}>
            <span style={{ fontSize: 12, color: colors.textSecondary }}>
              {business.serviceCount} services
            </span>
            <span style={{ 
              fontSize: 13, 
              fontWeight: 700, 
              color: colors.primary,
              background: 'rgba(253, 252, 210, 0.1)',
              padding: '4px 10px',
              borderRadius: 12,
            }}>
              From ${business.priceRange?.min || 25}
            </span>
          </div>
        )}
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