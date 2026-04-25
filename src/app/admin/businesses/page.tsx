'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, X, Search, Filter } from 'lucide-react';
import { Button, Badge, TabButton } from '@/components/UI';
import { useStore } from '@/lib/store';

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

export default function AdminBusinesses() {
  const router = useRouter();
  const { businesses, approveBusiness, rejectBusiness } = useStore();
  const [activeTab, setActiveTab] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBusinesses = businesses.filter(b => {
    if (activeTab === 'pending') return b.status === 'pending';
    if (activeTab === 'approved') return b.status === 'approved';
    if (activeTab === 'rejected') return b.status === 'rejected';
    return true;
  }).filter(b => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <h1 style={{ fontSize: 24, color: colors.textPrimary }}>Businesses</h1>
        </div>

        <div style={{ 
          display: 'flex', 
          borderBottom: '2px solid ' + colors.secondary,
          marginBottom: 24 
        }}>
          <TabButton 
            label="Pending" 
            active={activeTab === 'pending'} 
            onClick={() => setActiveTab('pending')} 
          />
          <TabButton 
            label="Approved" 
            active={activeTab === 'approved'} 
            onClick={() => setActiveTab('approved')} 
          />
          <TabButton 
            label="Rejected" 
            active={activeTab === 'rejected'} 
            onClick={() => setActiveTab('rejected')} 
          />
        </div>

        <div style={{ position: 'relative', marginBottom: 24 }}>
          <Search size={18} stroke={colors.textMuted} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search businesses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 12px 12px 40px',
              border: '2px solid ' + colors.secondary,
              borderRadius: 12,
              fontSize: 14,
              background: colors.surface,
            }}
          />
        </div>

        <p style={{ fontSize: 14, color: colors.textMuted, marginBottom: 16 }}>
          {filteredBusinesses.length} businesses
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filteredBusinesses.map((business, index) => (
            <motion.div
              key={business.id}
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
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: colors.textPrimary }}>
                    {business.name}
                  </h3>
                  <p style={{ fontSize: 12, color: colors.textMuted }}>
                    {business.contactPerson} • {business.category}
                  </p>
                </div>
                <Badge variant={
                  business.status === 'approved' ? 'success' : 
                  business.status === 'rejected' ? 'error' : 'warning'
                }>
                  {business.status}
                </Badge>
              </div>

              <div style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 12 }}>
                {business.description?.substring(0, 100)}...
              </div>

              <div style={{ fontSize: 12, color: colors.textMuted, marginBottom: 12 }}>
                {business.address} • {business.email}
              </div>

              {business.status === 'pending' && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <Button
                    onClick={() => approveBusiness(business.id)}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                  >
                    <Check size={16} />
                    Approve
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => rejectBusiness(business.id)}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                  >
                    <X size={16} />
                    Reject
                  </Button>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {filteredBusinesses.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <p style={{ color: colors.textMuted }}>No businesses found</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}