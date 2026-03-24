'use client';
import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import {
  Box, Typography, Paper, Grid, Chip, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Button, Tab, Tabs, LinearProgress, CircularProgress
} from '@mui/material';
import { Lock as LockIcon, LockOpen as UnlockIcon, CheckCircle, Cancel } from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function FinancesPage() {
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [charts, setCharts] = useState<any>(null);
  const [wallets, setWallets] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [statsRes, chartsRes, walletsRes, txnsRes] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/dashboard/charts'),
        api.get('/wallets'),
        api.get('/transactions'),
      ]);
      setStats(statsRes.data);
      setCharts(chartsRes.data);
      setWallets(walletsRes.data);
      setTransactions(txnsRes.data);
    } catch (e) {
      console.error("Failed to load financial data", e);
    } finally {
      setLoading(false);
    }
  }

  const fmt = (n: number) => `₦${(Number(n) / 1000000).toFixed(1)}M`;
  const fmtFull = (n: number) => `₦${Number(n).toLocaleString()}`;

  if (loading) return <Box sx={{ p: 10, display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>;

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#004d40' }}>Financial Control</Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>Custodial oversight of all platform wallets, ledgers, and settlements.</Typography>
        </Box>
        <Button variant="outlined" onClick={loadData} sx={{ borderRadius: '12px' }}>Refresh Data</Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {wallets.slice(0, 3).map((w) => {
          const utilization = Math.min(100, (Number(w.balance) / 1000000000) * 100); // Simulated utilization
          return (
            <Grid size={{ xs: 12, md: 4 }} key={w.id}>
              <Paper sx={{ p: 3, borderRadius: '20px', border: '1px solid #eef2f6', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#64748b' }}>WLT-{String(w.id).padStart(4, '0')} ({w.type})</Typography>
                  <Chip
                    label={w.status || 'active'}
                    size="small"
                    color={w.status === 'active' || !w.status ? 'success' : 'default'}
                    sx={{ fontWeight: 700, borderRadius: '8px', textTransform: 'capitalize' }}
                  />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 900, color: '#1e293b', mb: 0.5 }}>{fmt(w.balance)}</Typography>
                <Typography variant="caption" sx={{ color: '#94a3b8' }}>{w.currency || 'NGN'} • {utilization.toFixed(0)}% used</Typography>
                <LinearProgress
                  variant="determinate"
                  value={utilization}
                  sx={{ mt: 2, height: 6, borderRadius: 4, bgcolor: '#f1f5f9', '& .MuiLinearProgress-bar': { bgcolor: w.status === 'locked' ? '#ef4444' : '#004d40', borderRadius: 4 } }}
                />
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 4, borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>Monthly Revenue & Disbursements</Typography>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={charts?.financialData || []} barGap={6}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 20px rgba(0,0,0,0.08)' }} />
                <Bar dataKey="revenue" fill="#004d40" radius={[6, 6, 0, 0]} name="Inflow" />
                <Bar dataKey="loans" fill="#80cbc4" radius={[6, 6, 0, 0]} name="Outflow" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>

          <Paper sx={{ borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
            <Box sx={{ borderBottom: '1px solid #eef2f6' }}>
              <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ px: 3, '& .MuiTab-root': { textTransform: 'none', fontWeight: 700 }, '& .Mui-selected': { color: '#004d40' }, '& .MuiTabs-indicator': { bgcolor: '#004d40' } }}>
                <Tab label="Recent Transactions" />
                <Tab label="Pending Approvals" />
              </Tabs>
            </Box>
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: '#f8fafc' }}>
                  <TableRow>
                    {['TX Ref', 'Type', 'Amount', 'Source → Dest', 'Date', 'Status'].map(h => (
                      <TableCell key={h} sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions
                    .filter(tx => tab === 0 || tx.status === 'pending')
                    .slice(0, 10)
                    .map((tx) => (
                      <TableRow key={tx.id} sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                        <TableCell sx={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '0.8rem', color: '#004d40' }}>{tx.reference.substring(0, 12)}</TableCell>
                        <TableCell><Chip label={tx.type} size="small" variant="outlined" /></TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>{fmtFull(tx.amount)}</TableCell>
                        <TableCell sx={{ fontSize: '0.8rem', color: '#64748b' }}>WLT-{tx.fromWalletId || 'SYS'} → WLT-{tx.toWalletId || 'SYS'}</TableCell>
                        <TableCell sx={{ fontSize: '0.85rem', color: '#64748b' }}>{new Date(tx.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Chip label={tx.status} color={tx.status === 'completed' ? 'success' : 'warning'} size="small" sx={{ fontWeight: 600 }} />
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 4, borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', bgcolor: '#004d40', color: 'white' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>Custodial Summary</Typography>
            {[
              { label: 'Total Custody', value: fmtFull(stats?.totalCustodialFunds || 0), icon: '🏦' },
              { label: 'Pending Approvals', value: fmtFull(stats?.pendingApprovalsAmount || 0), icon: '⏳' },
              { label: 'Today\'s Inflow', value: fmtFull(stats?.todayInflow || 0), icon: '📈' },
              { label: 'Today\'s Outflow', value: fmtFull(stats?.todayOutflow || 0), icon: '📉' },
            ].map((item) => (
              <Box key={item.label} sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, pb: 2, borderBottom: '1px solid rgba(255,255,255,0.1)', '&:last-child': { borderBottom: 'none', mb: 0, pb: 0 } }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Typography sx={{ fontSize: '1.4rem' }}>{item.icon}</Typography>
                  <Typography sx={{ opacity: 0.8, fontWeight: 600 }}>{item.label}</Typography>
                </Box>
                <Typography sx={{ fontWeight: 800, fontSize: '1.1rem' }}>{item.value}</Typography>
              </Box>
            ))}
            <Button fullWidth variant="contained" onClick={loadData} sx={{ mt: 2, bgcolor: 'rgba(255,255,255,0.15)', borderRadius: '12px', textTransform: 'none', fontWeight: 700, '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' } }}>
              Trigger Reconciliation
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
