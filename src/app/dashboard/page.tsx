'use client';

import React, { useState, useEffect } from 'react';
import { 
  Typography, Grid, Paper, Box, Button, Chip, 
  CircularProgress, IconButton, Avatar, Card, CardContent, Divider, Skeleton
} from '@mui/material';
import { 
  AccountBalanceWallet, History, 
  TrendingUp, Star, RequestQuote, SupportAgent, 
  People, PendingActions, Groups, AccountBalance
} from '@mui/icons-material';
import { fetchMemberDashboard, fetchApexDashboardStats, fetchApexDashboardCharts } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    async function load() {
      try {
        const storedRole = localStorage.getItem('user_role') || 'member';
        setRole(storedRole);
        
        let data;
        if (storedRole === 'super_admin' || storedRole === 'apex_admin') {
          data = await fetchApexDashboardStats();
        } else {
          data = await fetchMemberDashboard();
        }
        setStats(data);
      } catch (e) {
        console.error("Failed to load dashboard stats", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return (
    <Box sx={{ p: 4 }}>
      <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 4, mb: 4 }} />
      <Grid container spacing={3}>
        {[1, 2, 3, 4].map(i => (
          <Grid key={i} size={{ xs: 12, md: 3 }}><Skeleton variant="rectangular" height={120} sx={{ borderRadius: 6 }} /></Grid>
        ))}
      </Grid>
      <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 6, mt: 4 }} />
    </Box>
  );

  const isAdmin = role === 'super_admin' || role === 'apex_admin';

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#004d40' }}>
            {isAdmin ? 'System Intelligence' : 'Member Overview'}
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 500 }}>
            {isAdmin ? 'Global cooperative ecosystem performance and oversight.' : 'Welcome back! Here\s a summary of your cooperative position.'}
          </Typography>
        </Box>
        <Chip 
          label={new Date().toLocaleDateString('en-NG', { weekday: 'long', day: 'numeric', month: 'long' })} 
          sx={{ borderRadius: '10px', fontWeight: 700, bgcolor: '#f1f5f9', color: '#475569' }} 
        />
      </Box>

      {/* Admin Stats Grid */}
      {isAdmin ? (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, md: 3 }}>
            <Paper sx={{ p: 3, borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <Avatar sx={{ bgcolor: '#ecfdf5', color: '#059669', width: 44, height: 44 }}><AccountBalance /></Avatar>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#64748b', letterSpacing: 0.5 }}>CUSTODIAL FUNDS</Typography>
               </Box>
               <Typography variant="h4" sx={{ fontWeight: 900, color: '#1e293b' }}>₦{stats?.totalFunds?.toLocaleString()}</Typography>
               <Typography variant="caption" sx={{ color: '#059669', fontWeight: 700 }}>Active across all wallets</Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Paper sx={{ p: 3, borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <Avatar sx={{ bgcolor: '#f0f9ff', color: '#0ea5e9', width: 44, height: 44 }}><People /></Avatar>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#64748b', letterSpacing: 0.5 }}>TOTAL MEMBERS</Typography>
               </Box>
               <Typography variant="h4" sx={{ fontWeight: 900, color: '#1e293b' }}>{stats?.memberCount?.toLocaleString()}</Typography>
               <Typography variant="caption" sx={{ color: '#0ea5e9', fontWeight: 700 }}>National participation</Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Paper sx={{ p: 3, borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <Avatar sx={{ bgcolor: '#fff7ed', color: '#f97316', width: 44, height: 44 }}><RequestQuote /></Avatar>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#64748b', letterSpacing: 0.5 }}>LOAN PORTFOLIO</Typography>
               </Box>
               <Typography variant="h4" sx={{ fontWeight: 900, color: '#1e293b' }}>₦{stats?.loanTotal?.toLocaleString()}</Typography>
               <Typography variant="caption" sx={{ color: '#f97316', fontWeight: 700 }}>Disbursed & active</Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Paper sx={{ p: 3, borderRadius: '24px', border: '1px solid #fef2f2', bgcolor: stats?.pendingCount > 0 ? '#fff5f5' : 'white', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <Avatar sx={{ bgcolor: '#fef2f2', color: '#ef4444', width: 44, height: 44 }}><PendingActions /></Avatar>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#64748b', letterSpacing: 0.5 }}>PENDING ACTIONS</Typography>
               </Box>
               <Typography variant="h4" sx={{ fontWeight: 900, color: '#ef4444' }}>{stats?.pendingCount || 0}</Typography>
               <Typography variant="caption" sx={{ color: '#ef4444', fontWeight: 700 }}>Awaiting approval</Typography>
            </Paper>
          </Grid>
        </Grid>
      ) : (
        /* Original Member Grid (Enhanced) */
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 4, borderRadius: '24px', bgcolor: '#004d40', color: 'white', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0, 77, 64, 0.2)' }}>
              <Typography variant="body2" sx={{ opacity: 0.8, fontWeight: 700 }}>Savings Balance</Typography>
              <Typography variant="h3" sx={{ fontWeight: 900, mt: 1 }}>₦{(stats?.savingsBalance || 0).toLocaleString()}</Typography>
              <Box sx={{ mt: 3 }}>
                 <Button 
                  variant="contained" 
                  onClick={() => router.push('/dashboard/savings')}
                  sx={{ bgcolor: 'white', color: '#004d40', borderRadius: '10px', textTransform: 'none', fontWeight: 700, '&:hover': { bgcolor: '#f1f5f9' } }}>
                   View History
                 </Button>
              </Box>
              <TrendingUp sx={{ position: 'absolute', right: -10, bottom: -10, fontSize: 120, opacity: 0.1 }} />
            </Paper>
          </Grid>
          {/* ... other member cards ... */}
        </Grid>
      )}

      {/* Main Content Area */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: isAdmin ? 12 : 8 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b' }}>
              {isAdmin ? 'Ecosystem Health' : 'Recent Activity'}
            </Typography>
            {isAdmin && (
              <Button size="small" variant="outlined" sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700, borderColor: '#e2e8f0', color: '#475569' }}>
                Generate System Report
              </Button>
            )}
          </Box>
          <Paper sx={{ p: isAdmin ? 0 : 3, borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
            {isAdmin ? (
              /* Admin Specific View: Maybe a map or group status list */
              <Box sx={{ p: 6, textAlign: 'center', bgcolor: '#f8fafc' }}>
                <Groups sx={{ fontSize: 48, color: '#cbd5e1', mb: 2 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#64748b' }}>Organizational Analytics</Typography>
                <Typography variant="body2" color="text.secondary">Real-time performance tracking for all partner organizations is active.</Typography>
              </Box>
            ) : (
              /* Member Recent Activity List */
              stats?.recentActivities?.map((act: any, i: number) => (
                <Box key={act.id} sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, borderBottom: i === stats.recentActivities.length - 1 ? 'none' : '1px solid #f1f5f9' }}>
                  <Avatar sx={{ bgcolor: act.type === 'contribution' ? '#ecfdf5' : '#fff1f2', color: act.type === 'contribution' ? '#059669' : '#e11d48' }}>
                    {act.type === 'contribution' ? 'C' : 'T'}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography sx={{ fontSize: '0.9rem', fontWeight: 800, color: '#1e293b' }}>{act.type === 'contribution' ? 'Savings Deposit' : 'Transfer Out'}</Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>{new Date(act.createdAt).toLocaleDateString()}</Typography>
                  </Box>
                  <Typography sx={{ fontWeight: 900, color: act.type === 'contribution' ? '#059669' : '#e11d48' }}>
                    {act.type === 'contribution' ? '+' : '-'}₦{Number(act.amount).toLocaleString()}
                  </Typography>
                </Box>
              ))
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
