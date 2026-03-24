'use client';
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Button,
  Avatar, List, ListItem, ListItemText, Divider,
  CircularProgress, IconButton, Alert, Skeleton
} from '@mui/material';
import {
  Savings as SavingsIcon,
  AccountBalance as LoanIcon,
  Schedule as ScheduleIcon,
  ArrowForward as ArrowIcon,
  Add as AddIcon,
  History as HistoryIcon,
  SupportAgent as SupportIcon,
  AccountBalanceWallet as WalletIcon,
  Work as BriefcaseIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { fetchMemberDashboard } from '@/lib/api';
import { useRouter } from 'next/navigation';
import VirtualAccountCard from '@/components/VirtualAccountCard';

export default function MemberDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const data = await fetchMemberDashboard();
      setStats(data);
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <Box sx={{ p: 2 }}>
      <Skeleton variant="rectangular" height={150} sx={{ borderRadius: 4, mb: 3 }} />
      <Grid container spacing={2}>
        <Grid item xs={6}><Skeleton variant="rectangular" height={100} sx={{ borderRadius: 4 }} /></Grid>
        <Grid item xs={6}><Skeleton variant="rectangular" height={100} sx={{ borderRadius: 4 }} /></Grid>
      </Grid>
      <Skeleton variant="text" sx={{ mt: 4, mb: 1 }} />
      <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 4 }} />
    </Box>
  );

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', px: 2 }}>
      {/* Header / Welcome */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>
            Welcome back! 👋
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {stats?.groupName || 'Direct Member'} • {new Date().toLocaleDateString('en-NG', { month: 'long', day: 'numeric', year: 'numeric' })}
          </Typography>
        </Box>
      </Box>

      {/* Main Balance Card */}
      <Card sx={{ 
        borderRadius: '24px', 
        background: 'linear-gradient(135deg, #064e3b 0%, #065f46 60%, #047857 100%)',
        color: 'white',
        mb: 3,
        overflow: 'hidden',
        position: 'relative',
        boxShadow: '0 20px 25px -5px rgba(5, 150, 105, 0.2)'
      }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography sx={{ opacity: 0.8, fontSize: '0.8rem', fontWeight: 600, letterSpacing: 0.5 }}>WALLET BALANCE</Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, my: 1 }}>
                ₦{stats?.savingsBalance?.toLocaleString() || '0.00'}
              </Typography>
            </Box>
            <WalletIcon sx={{ opacity: 0.2, fontSize: 60 }} />
          </Box>
          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              sx={{ bgcolor: '#C9962B', '&:hover': { bgcolor: '#b08325' }, borderRadius: '12px', px: 3, textTransform: 'none', fontWeight: 700, boxShadow: '0 10px 15px -3px rgba(201, 150, 43, 0.3)' }}
              onClick={() => router.push('/member/savings')}
            >
              Deposit
            </Button>
            <Button 
              variant="outlined" 
              sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.05)' }, borderRadius: '12px', px: 3, textTransform: 'none', fontWeight: 700 }}
              onClick={() => router.push('/member/wallet')}
            >
              Transfer
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Virtual Account Card */}
      <Box mb={3}>
        <VirtualAccountCard />
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6}>
          <Card sx={{ borderRadius: '20px', border: '1px solid #f1f5f9', bgcolor: '#f8fafc', boxShadow: 'none' }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ color: '#C9962B', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <LoanIcon fontSize="small" />
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b' }}>ACTIVE LOANS</Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>{stats?.activeLoansCount || 0}</Typography>
              <Typography variant="caption" sx={{ color: '#059669', fontWeight: 600 }}>₦{stats?.loanBalance?.toLocaleString() || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card sx={{ borderRadius: '20px', border: '1px solid #f1f5f9', bgcolor: '#f8fafc', boxShadow: 'none' }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ color: '#10b981', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <BriefcaseIcon fontSize="small" />
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b' }}>EMPOWERMENT</Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>{stats?.applicationsCount || 0}</Typography>
              <Typography variant="caption" color="text.secondary">Active Applications</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Activities */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1e293b' }}>Recent Transactions</Typography>
          <Button size="small" sx={{ textTransform: 'none', fontWeight: 700, color: '#059669' }} onClick={() => router.push('/member/transactions')}>View All</Button>
        </Box>
        <Card sx={{ borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <List disablePadding>
            {stats?.recentActivities?.length > 0 ? (
              stats.recentActivities.map((txn: any, idx: number) => (
                <React.Fragment key={txn.id}>
                  <ListItem sx={{ py: 2, px: 2.5 }}>
                    <Avatar sx={{ 
                      bgcolor: txn.type === 'contribution' ? '#f0fdf4' : '#fef2f2', 
                      color: txn.type === 'contribution' ? '#059669' : '#ef4444', 
                      mr: 2,
                      width: 44,
                      height: 44
                    }}>
                      {txn.type === 'contribution' ? <AddIcon /> : <ArrowIcon sx={{ transform: 'rotate(225deg)' }} />}
                    </Avatar>
                    <ListItemText 
                      primary={txn.type === 'contribution' ? 'Savings Contribution' : 'Wallet Debit'} 
                      secondary={new Date(txn.createdAt).toLocaleDateString('en-NG', { day: '2-digit', month: 'short' })}
                      primaryTypographyProps={{ fontWeight: 800, fontSize: '0.95rem', color: '#1e293b' }}
                      secondaryTypographyProps={{ fontWeight: 600, fontSize: '0.8rem' }}
                    />
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography sx={{ fontWeight: 900, fontSize: '1rem', color: txn.type === 'contribution' ? '#059669' : '#ef4444' }}>
                        {txn.type === 'contribution' ? '+' : '-'}₦{txn.amount.toLocaleString()}
                      </Typography>
                      <Typography variant="caption" sx={{ textTransform: 'uppercase', fontWeight: 700, color: '#94a3b8', fontSize: '0.65rem' }}>
                        {txn.status}
                      </Typography>
                    </Box>
                  </ListItem>
                  {idx < stats.recentActivities.length - 1 && <Divider component="li" sx={{ mx: 2.5, borderColor: '#f8fafc' }} />}
                </React.Fragment>
              ))
            ) : (
              <Box sx={{ p: 6, textAlign: 'center' }}>
                <HistoryIcon sx={{ color: '#cbd5e1', fontSize: 48, mb: 1 }} />
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>No transaction history yet.</Typography>
              </Box>
            )}
          </List>
        </Card>
      </Box>

      {/* Quick Access Menu */}
      <Box sx={{ mb: 12 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1e293b', mb: 2 }}>Quick Services</Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 6 }}>
            <Button 
              fullWidth 
              variant="outlined" 
              sx={{ borderRadius: '16px', py: 2, borderColor: '#e2e8f0', bgcolor: 'white', color: '#1e293b', textTransform: 'none', fontWeight: 700, display: 'flex', flexDirection: 'column', gap: 1, '&:hover': { bgcolor: '#f8fafc' } }}
              onClick={() => router.push('/empowerment')}
            >
              <BriefcaseIcon color="primary" />
              Empowerment
            </Button>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Button 
              fullWidth 
              variant="outlined" 
              sx={{ borderRadius: '16px', py: 2, borderColor: '#e2e8f0', bgcolor: 'white', color: '#1e293b', textTransform: 'none', fontWeight: 700, display: 'flex', flexDirection: 'column', gap: 1, '&:hover': { bgcolor: '#f8fafc' } }}
              onClick={() => router.push('/member/support')}
            >
              <SupportIcon sx={{ color: '#C9962B' }} />
              Support
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
