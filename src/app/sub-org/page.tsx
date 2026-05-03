'use client';
import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Chip, Button, CircularProgress } from '@mui/material';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { AccountBalance, People, AttachMoney, AssignmentLate, Add, UploadFile } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { fetchSubOrgDashboard } from '@/lib/api';

// Data will be fetched from API

const StatCard = ({ title, value, subtitle, icon, color, delay }: any) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay }}>
    <Card sx={{ borderRadius: '20px', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', position: 'relative', overflow: 'hidden' }}>
      <Box sx={{ position: 'absolute', top: -15, right: -15, width: 80, height: 80, borderRadius: '50%', bgcolor: `${color}15` }} />
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ bgcolor: `${color}15`, p: 1.2, borderRadius: '12px', color: color }}>{icon}</Box>
          <Chip label="+12.5%" size="small" sx={{ bgcolor: '#ecfdf5', color: '#10b981', fontWeight: 700, fontSize: '0.7rem' }} />
        </Box>
        <Typography sx={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600, mb: 0.5 }}>{title}</Typography>
        <Typography sx={{ color: '#1e293b', fontSize: '1.8rem', fontWeight: 800 }}>{value}</Typography>
        <Typography sx={{ color: '#94a3b8', fontSize: '0.75rem', mt: 1 }}>{subtitle}</Typography>
      </CardContent>
    </Card>
  </motion.div>
);

export default function SubOrgDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [collectionData, setCollectionData] = useState<any[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([]);

  useEffect(() => {
    async function loadStats() {
      try {
        const orgIdStr = localStorage.getItem('organisation_id');
        if (orgIdStr) {
          const data = await fetchSubOrgDashboard(Number(orgIdStr));
          setStats(data);
          
          // Transform API data into chart data if available
          if (data?.collectionData) {
            setCollectionData(data.collectionData);
          }
          if (data?.pendingApprovals) {
            setPendingApprovals(data.pendingApprovals);
          }
        }
      } catch (error) {
        console.error("Failed to load dashboard stats", error);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b', mb: 0.5, letterSpacing: '-0.02em' }}>
            {stats?.branchName || 'Branch Overview'}
          </Typography>
          <Typography sx={{ color: '#64748b', fontSize: '0.95rem' }}>Monitor collections and member activity.</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" startIcon={<UploadFile />} sx={{ color: '#0f766e', borderColor: '#0f766e', borderRadius: '10px', textTransform: 'none', fontWeight: 600 }}>
            Export Report
          </Button>
          <Button variant="contained" startIcon={<Add />} sx={{ bgcolor: '#0f766e', '&:hover': { bgcolor: '#0d9488' }, borderRadius: '10px', textTransform: 'none', fontWeight: 600, boxShadow: '0 4px 12px rgba(15, 118, 110, 0.2)' }}>
            New Transaction
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Members" value={stats?.totalMembers?.toLocaleString() || "0"} subtitle={`${stats?.activeMembers || 0} active profiles`} icon={<People />} color="#0ea5e9" delay={0.1} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Collections" value={`₦ ${(stats?.totalCollections || 0).toLocaleString()}`} subtitle="System validated" icon={<AttachMoney />} color="#10b981" delay={0.2} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Active Loans" value={stats?.activeLoans?.toLocaleString() || "0"} subtitle={stats?.activeLoanSummary || "No active loans"} icon={<AccountBalance />} color="#f59e0b" delay={0.3} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Pending Approvals" value={stats?.pendingApprovals?.toLocaleString() || "0"} subtitle="Awaiting Partner review" icon={<AssignmentLate />} color="#ef4444" delay={0.4} />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: '20px', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography sx={{ fontWeight: 700, color: '#1e293b', fontSize: '1.1rem' }}>Collection Trends (7 Days)</Typography>
                <Chip label="This Week" size="small" sx={{ bgcolor: '#f1f5f9', color: '#64748b', fontWeight: 600 }} />
              </Box>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={collectionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0f766e" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#0f766e" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(val) => `₦${val / 1000}k`} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} formatter={(value: any) => [`₦${Number(value).toLocaleString()}`, 'Collections']} />
                    <Area type="monotone" dataKey="amount" stroke="#0f766e" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: '20px', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ fontWeight: 700, color: '#1e293b', fontSize: '1.1rem', mb: 3 }}>Requests Tracking</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {pendingApprovals.map((req, i) => (
                  <Box key={req.id} sx={{ p: 2, borderRadius: '12px', bgcolor: '#f8fafc', border: '1px solid #f1f5f9', transition: 'all 0.2s', '&:hover': { bgcolor: '#ffffff', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: '#1e293b' }}>{req.member}</Typography>
                      <Typography sx={{ fontWeight: 800, fontSize: '0.85rem', color: '#0f766e' }}>₦{req.amount.toLocaleString()}</Typography>
                    </Box>
                    <Typography sx={{ fontSize: '0.75rem', color: '#64748b', mb: 1.5 }}>{req.type} · {req.id}</Typography>
                    <Chip label={req.status} size="small" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 600, bgcolor: req.status.includes('Partner') ? '#fef3c7' : '#e0f2fe', color: req.status.includes('Partner') ? '#b45309' : '#0369a1' }} />
                  </Box>
                ))}
                <Button fullWidth sx={{ mt: 1, py: 1, color: '#0f766e', fontWeight: 700, textTransform: 'none', fontSize: '0.85rem', '&:hover': { bgcolor: '#f0fdfa' } }}>
                  View All Requests
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
