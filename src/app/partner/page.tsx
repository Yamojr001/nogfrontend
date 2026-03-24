'use client';
import React, { useState } from 'react';
import {
  Box, Typography, Grid, Paper, Button, Chip, CircularProgress,
  Avatar, LinearProgress, Card, CardContent, IconButton
} from '@mui/material';
import {
  People as PeopleIcon, AccountBalance, TrendingUp,
  Gavel as ApprovalIcon, Add as AddIcon, ArrowForward as ArrowIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, LineChart, Line
} from 'recharts';
import { useRouter } from 'next/navigation';
import { fetchPartnerDashboard } from '@/lib/api';

const memberGrowth = [
  { month: 'Oct', members: 182 },
  { month: 'Nov', members: 205 },
  { month: 'Dec', members: 228 },
  { month: 'Jan', members: 264 },
  { month: 'Feb', members: 287 },
  { month: 'Mar', members: 312 },
];

const loanData = [
  { month: 'Oct', disbursed: 4200, repaid: 3100 },
  { month: 'Nov', disbursed: 5100, repaid: 3800 },
  { month: 'Dec', disbursed: 6400, repaid: 4900 },
  { month: 'Jan', disbursed: 5800, repaid: 5200 },
  { month: 'Feb', disbursed: 7100, repaid: 5900 },
  { month: 'Mar', disbursed: 8200, repaid: 6800 },
];

const pendingActions = [
  { id: 1, title: 'Loan Request – John Doe', amount: '₦250,000', time: '2h ago', type: 'loan' },
  { id: 2, title: 'New Member KYC – Amina S.', amount: null, time: '4h ago', type: 'member' },
  { id: 3, title: 'Withdrawal – Lagos Group', amount: '₦80,000', time: '1d ago', type: 'withdrawal' },
];

export default function PartnerDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  React.useEffect(() => {
    async function load() {
      try {
        const orgIdStr = localStorage.getItem('organisation_id');
        if (orgIdStr) {
          const data = await fetchPartnerDashboard(Number(orgIdStr));
          setStats(data);
        }
      } catch (err) {
        console.error("Failed to load partner dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <CircularProgress sx={{ color: '#0369a1' }} />
    </Box>
  );

  const StatCard = ({ title, value, sub, icon, color, path }: any) => (
    <Paper
      onClick={() => path && router.push(path)}
      sx={{ p: 3, borderRadius: '20px', border: '1px solid #e0f2fe', boxShadow: 'none', cursor: path ? 'pointer' : 'default', transition: 'all 0.2s', '&:hover': path ? { transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(3,105,161,0.1)' } : {} }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box sx={{ p: 1.5, borderRadius: '14px', bgcolor: `${color}15`, color }}>
          {icon}
        </Box>
        <Chip label="↑ 8.2%" size="small" sx={{ borderColor: '#e0f2fe', fontWeight: 700, color: '#10b981', bgcolor: '#f0fdf4' }} />
      </Box>
      <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, mb: 0.5 }}>{title}</Typography>
      <Typography variant="h4" sx={{ fontWeight: 900, color: '#0c4a6e' }}>{value}</Typography>
      <Typography variant="caption" sx={{ color: '#94a3b8' }}>{sub}</Typography>
    </Paper>
  );

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#0c4a6e' }}>Partner Overview</Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>Welcome back. Here's the performance summary of Federal Cooperative Partner.</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            startIcon={<AddIcon />}
            variant="outlined"
            onClick={() => router.push('/partner/members')}
            sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 700, borderColor: '#0369a1', color: '#0369a1', px: 2.5 }}
          >
            Add Member
          </Button>
          <Button
            variant="contained"
            onClick={() => router.push('/partner/reports')}
            sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 700, bgcolor: '#0369a1', px: 2.5, '&:hover': { bgcolor: '#0284c7' } }}
          >
            Generate Report
          </Button>
        </Box>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Total Members" value={stats?.memberCount || 0} sub="Registered members" icon={<PeopleIcon />} color="#0369a1" path="/partner/members" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Total Funds" value={`₦${(stats?.totalFunds || 0).toLocaleString()}`} sub="Custodial balance" icon={<TrendingUp />} color="#10b981" path="/partner/finances" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Active Loans" value={`₦${(stats?.loanTotal || 0).toLocaleString()}`} sub="Disbursed portfolio" icon={<AccountBalance />} color="#7c3aed" path="/partner/finances" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Pending Actions" value={stats?.pendingCount || 0} sub="Awaiting review" icon={<ApprovalIcon />} color="#f59e0b" path="/partner/approvals" />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Member Growth Chart */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 4, borderRadius: '24px', border: '1px solid #e0f2fe', boxShadow: 'none', mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0c4a6e' }}>Member Growth</Typography>
              <Chip label="Last 6 months" size="small" sx={{ bgcolor: '#e0f2fe', color: '#0369a1', fontWeight: 700, borderRadius: '8px' }} />
            </Box>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={memberGrowth}>
                <defs>
                  <linearGradient id="memberGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0369a1" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#0369a1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 20px rgba(0,0,0,0.08)' }} />
                <Area type="monotone" dataKey="members" stroke="#0369a1" strokeWidth={3} fill="url(#memberGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>

          <Paper sx={{ p: 4, borderRadius: '24px', border: '1px solid #e0f2fe', boxShadow: 'none' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0c4a6e', mb: 3 }}>Loan Disbursement vs Repayment</Typography>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={loanData} barGap={6}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 20px rgba(0,0,0,0.08)' }} formatter={(v) => `₦${Number(v).toLocaleString()}`} />
                <Bar dataKey="disbursed" name="Disbursed" fill="#0369a1" radius={[6, 6, 0, 0]} />
                <Bar dataKey="repaid" name="Repaid" fill="#7dd3fc" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Right side */}
        <Grid size={{ xs: 12, md: 4 }}>
          {/* Pending approvals */}
          <Paper sx={{ p: 3, borderRadius: '24px', border: '1px solid #e0f2fe', boxShadow: 'none', mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0c4a6e' }}>Pending Actions</Typography>
              <IconButton size="small" onClick={() => router.push('/partner/approvals')} sx={{ color: '#0369a1' }}>
                <ArrowIcon />
              </IconButton>
            </Box>
            {pendingActions.map((a) => (
              <Box key={a.id} sx={{ display: 'flex', gap: 2, mb: 2.5, alignItems: 'center' }}>
                <Box sx={{ width: 40, height: 40, borderRadius: '12px', bgcolor: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <WarningIcon sx={{ fontSize: 20, color: '#0369a1' }} />
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: '#0c4a6e' }}>{a.title}</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8' }}>{a.amount ? `${a.amount} • ` : ''}{a.time}</Typography>
                </Box>
                <Button size="small" variant="contained" sx={{ bgcolor: '#0369a1', borderRadius: '8px', textTransform: 'none', py: 0.5, fontSize: '0.75rem', fontWeight: 700, whiteSpace: 'nowrap', '&:hover': { bgcolor: '#0284c7' } }}>
                  Review
                </Button>
              </Box>
            ))}
            <Button fullWidth variant="outlined" onClick={() => router.push('/partner/approvals')} sx={{ mt: 1, borderRadius: '12px', textTransform: 'none', fontWeight: 700, borderColor: '#0369a1', color: '#0369a1' }}>
              View All Approvals
            </Button>
          </Paper>

          {/* Repayment health */}
          <Paper sx={{ p: 3, borderRadius: '24px', bgcolor: '#0369a1', color: 'white', border: 'none', boxShadow: 'none' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>Loan Health</Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, mb: 3 }}>Current repayment performance for this cycle.</Typography>
            {[
              { label: 'On-time Repayments', value: 85 },
              { label: 'Loan Recovery Rate', value: 92 },
              { label: 'Active Borrowers', value: 67 },
            ].map((item) => (
              <Box key={item.label} sx={{ mb: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                  <Typography variant="caption" sx={{ fontWeight: 600, opacity: 0.9 }}>{item.label}</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 800 }}>{item.value}%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={item.value} sx={{ height: 8, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.15)', '& .MuiLinearProgress-bar': { bgcolor: 'white', borderRadius: 4 } }} />
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
