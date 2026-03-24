'use client';
import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Chip, Button, CircularProgress, Avatar } from '@mui/material';
import { People, AccountBalanceWallet, RequestQuote, Notifications, ListAlt, AddCircle } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { fetchGroupDashboard } from '@/lib/api';

const StatCard = ({ title, value, icon, color, delay }: any) => (
  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay }}>
    <Card sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: 'none', textAlign: 'center', p: 1 }}>
      <CardContent>
        <Box sx={{ display: 'inline-flex', bgcolor: `${color}15`, p: 1.5, borderRadius: '12px', color: color, mb: 1.5 }}>{icon}</Box>
        <Typography sx={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600, mb: 0.5, textTransform: 'uppercase' }}>{title}</Typography>
        <Typography sx={{ color: '#1e293b', fontSize: '1.4rem', fontWeight: 800 }}>{value}</Typography>
      </CardContent>
    </Card>
  </motion.div>
);

export default function GroupDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchGroupDashboard(1); // Demo Group ID
        setStats(data);
      } catch (error) {
        console.error("Failed to load group stats", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress sx={{ color: '#0f766e' }} /></Box>;

  return (
    <Box sx={{ px: 1, py: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4, px: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: '#0f766e', fontWeight: 800 }}>{stats?.groupName?.charAt(0) || 'G'}</Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b', lineHeight: 1.2 }}>
              {stats?.groupName || 'Group Dashboard'}
            </Typography>
            <Typography sx={{ color: '#64748b', fontSize: '0.8rem' }}>Grassroots Operations</Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button 
            size="small" 
            variant="contained" 
            onClick={async () => {
              await fetch('/api/group/sync/1', { method: 'POST' }); // Simplified trigger
              alert('Grassroots data synced with Sub-Org!');
            }}
            sx={{ bgcolor: '#0f766e', textTransform: 'none', fontWeight: 700, borderRadius: '8px' }}
          >
            Sync Offline
          </Button>
          <IconButton sx={{ bgcolor: '#f1f5f9' }}><Notifications sx={{ fontSize: 20, color: '#64748b' }} /></IconButton>
        </Box>
      </Box>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid size={{ xs: 6 }}>
          <StatCard title="Members" value={stats?.totalMembers || "0"} icon={<People />} color="#0ea5e9" delay={0.1} />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <StatCard title="Savings" value={`₦${(stats?.totalSavings || 0).toLocaleString()}`} icon={<AccountBalanceWallet />} color="#10b981" delay={0.2} />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <StatCard title="Active Loans" value={stats?.activeLoansCount || "0"} icon={<RequestQuote />} color="#f59e0b" delay={0.3} />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <StatCard title="Pending" value={stats?.pendingRequests || "0"} icon={<ListAlt />} color="#ef4444" delay={0.4} />
        </Grid>
      </Grid>

      <Typography sx={{ color: '#1e293b', fontWeight: 800, fontSize: '0.9rem', mb: 2, px: 1, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Quick Actions
      </Typography>

      <Grid container spacing={2}>
        {[
          { label: 'Register Member', icon: <AddCircle />, color: '#0f766e', link: '/group/members' },
          { label: 'Record Savings', icon: <AccountBalanceWallet />, color: '#10b981', link: '/group/finances' },
          { label: 'Request Loan', icon: <RequestQuote />, color: '#f59e0b', link: '/group/loans' },
          { label: 'Attendance', icon: <ListAlt />, color: '#6366f1', link: '/group/members' },
        ].map((action, i) => (
          <Grid size={{ xs: 6 }} key={i}>
            <Button
              fullWidth
              variant="outlined"
              href={action.link}
              sx={{
                flexDirection: 'column',
                height: 100,
                borderRadius: '16px',
                borderColor: '#e2e8f0',
                color: '#1e293b',
                textTransform: 'none',
                gap: 1,
                '&:hover': { bgcolor: '#f8fafc', borderColor: action.color }
              }}
            >
              <Box sx={{ color: action.color }}>{action.icon}</Box>
              <Typography sx={{ fontWeight: 700, fontSize: '0.85rem' }}>{action.label}</Typography>
            </Button>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

// Minimalist IconButton wrapper for consistency
const IconButton = ({ children, sx }: any) => (
  <Box sx={{ p: 1, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', ...sx }}>
    {children}
  </Box>
);
