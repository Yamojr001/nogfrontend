'use client';
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Grid, Tab, Tabs, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, Button, LinearProgress, TextField, InputAdornment
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Search as SearchIcon, Download as DownloadIcon } from '@mui/icons-material';
import { fetchPartnerFinances } from '@/lib/api';

const PIE_COLORS = ['#0f8a62', '#10b981', '#d1fae5'];
const statusColor: Record<string, any> = { paid: 'success', overdue: 'error', pending: 'warning', active: 'success' };

export default function FinancesPage() {
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState('');
  const [contributions, setContributions] = useState<any[]>([]);
  const [loans, setLoans] = useState<any[]>([]);
  const [txnData, setTxnData] = useState<any[]>([]);
  const [pieData, setPieData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const orgIdStr = localStorage.getItem('organisation_id');
        if (!orgIdStr) return;

        const data = await fetchPartnerFinances(Number(orgIdStr));
        const entries = Array.isArray(data) ? data : (data?.entries || []);

        const mappedConts = entries
          .filter((t: any) => t.type === 'contribution')
          .map((t: any) => ({
            member: t.member?.user?.fullName || 'Unknown',
            group: t.member?.group?.name || 'N/A',
            amount: Number(t.amount) || 0,
            month: new Date(t.createdAt || t.date || Date.now()).toLocaleString('default', { month: 'long', year: 'numeric' }),
            status: t.status === 'completed' ? 'paid' : (t.status || 'pending')
          }));

        const mappedLoans = entries
          .filter((t: any) => t.type === 'loan_disbursement')
          .map((t: any) => ({
            id: `LN-${String(t.id).padStart(3, '0')}`,
            member: t.member?.user?.fullName || 'Unknown',
            amount: Number(t.amount) || 0,
            outstanding: Number(t.outstanding ?? t.amount ?? 0),
            tenure: t.tenure || '12 months',
            rate: t.rate || '5%',
            status: t.status || 'active',
            nextDue: t.nextDue || '-',
          }));

        setContributions(mappedConts);
        setLoans(mappedLoans);

        if (Array.isArray(data?.monthlyFlow)) {
          setTxnData(data.monthlyFlow);
        }
        if (Array.isArray(data?.allocation)) {
          setPieData(data.allocation);
        }
      } catch (err) {
        console.error('Failed to load partner finances', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}><Typography>Loading...</Typography></Box>;
  }

  const chartTxnData = txnData.length > 0 ? txnData : [];
  const chartPieData = pieData.length > 0 ? pieData : [];

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#065f46' }}>Financial Management</Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>Contributions, loans, repayments, and transaction history.</Typography>
        </Box>
        <Button startIcon={<DownloadIcon />} variant="outlined" sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 700, borderColor: '#0f8a62', color: '#0f8a62' }}>Export</Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { label: 'Total Contributions (YTD)', value: `₦${contributions.reduce((s, c) => s + c.amount, 0).toLocaleString()}`, color: '#10b981' },
          { label: 'Loan Portfolio', value: `₦${loans.reduce((s, c) => s + c.amount, 0).toLocaleString()}`, color: '#0f8a62' },
          { label: 'Overdue Repayments', value: '₦0', color: '#ef4444' },
          { label: 'Reserve Fund', value: '₦0', color: '#7c3aed' },
        ].map(s => (
          <Grid size={{ xs: 6, md: 3 }} key={s.label}>
            <Paper sx={{ p: 3, textAlign: 'center', borderRadius: '20px', border: '1px solid #d1fae5', boxShadow: 'none' }}>
              <Typography variant="h4" sx={{ fontWeight: 900, color: s.color }}>{s.value}</Typography>
              <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>{s.label}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 4, borderRadius: '24px', border: '1px solid #d1fae5', boxShadow: 'none' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#065f46', mb: 3 }}>Monthly Flow (Contributions vs Disbursements)</Typography>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartTxnData} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={v => `₦${(v / 1000000).toFixed(1)}M`} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 20px rgba(0,0,0,0.08)' }} formatter={(v:any) => `₦${Number(v).toLocaleString()}`} />
                <Bar dataKey="contributions" name="Contributions" fill="#0f8a62" radius={[6, 6, 0, 0]} />
                <Bar dataKey="disbursed" name="Disbursed" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 4, borderRadius: '24px', border: '1px solid #d1fae5', boxShadow: 'none', height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#065f46', mb: 3 }}>Fund Allocation</Typography>
            {chartPieData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={chartPieData} innerRadius={45} outerRadius={65} paddingAngle={6} dataKey="value">
                      {chartPieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v:any) => `${v}%`} />
                  </PieChart>
                </ResponsiveContainer>
                {chartPieData.map((d, i) => (
                  <Box key={d.name} sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: PIE_COLORS[i % PIE_COLORS.length] }} />
                      <Typography sx={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>{d.name}</Typography>
                    </Box>
                    <Typography sx={{ fontSize: '0.82rem', fontWeight: 700 }}>{d.value}%</Typography>
                  </Box>
                ))}
              </>
            ) : (
              <Typography sx={{ color: '#94a3b8' }}>No allocation data available</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid #d1fae5', boxShadow: 'none' }}>
        <Box sx={{ px: 3, pt: 2, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, borderBottom: '1px solid #d1fae5' }}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ '& .MuiTab-root': { textTransform: 'none', fontWeight: 700 }, '& .Mui-selected': { color: '#0f8a62' }, '& .MuiTabs-indicator': { bgcolor: '#0f8a62' } }}>
            <Tab label="Contributions" />
            <Tab label="Loan Portfolio" />
          </Tabs>
          <TextField size="small" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#94a3b8', fontSize: 20 }} /></InputAdornment>, sx: { borderRadius: '12px', bgcolor: '#f0fdf4' } }}
            sx={{ width: 240 }} />
        </Box>
        <TableContainer>
          {tab === 0 ? (
            <Table>
              <TableHead sx={{ bgcolor: '#f0f9ff' }}>
                <TableRow>
                  {['Member', 'Group', 'Amount', 'Period', 'Status'].map(h => (
                    <TableCell key={h} sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {contributions.filter(c => c.member.toLowerCase().includes(search.toLowerCase())).map((c, i) => (
                  <TableRow key={i} sx={{ '&:hover': { bgcolor: '#f0fdf4' } }}>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.88rem' }}>{c.member}</TableCell>
                    <TableCell sx={{ color: '#64748b', fontSize: '0.85rem' }}>{c.group}</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>₦{c.amount.toLocaleString()}</TableCell>
                    <TableCell sx={{ color: '#64748b', fontSize: '0.85rem' }}>{c.month}</TableCell>
                    <TableCell><Chip label={c.status} color={statusColor[c.status] || 'default'} size="small" sx={{ borderRadius: '8px', textTransform: 'capitalize', fontWeight: 700 }} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Table>
              <TableHead sx={{ bgcolor: '#f0fdf4' }}>
                <TableRow>
                  {['Loan ID', 'Member', 'Amount', 'Outstanding', 'Tenure', 'Rate', 'Next Due', 'Status', 'Actions'].map(h => (
                    <TableCell key={h} sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {loans.filter(l => l.member.toLowerCase().includes(search.toLowerCase())).map(l => (
                  <TableRow key={l.id} sx={{ '&:hover': { bgcolor: '#f0fdf4' } }}>
                    <TableCell sx={{ fontWeight: 700, color: '#0f8a62', fontFamily: 'monospace', fontSize: '0.82rem' }}>{l.id}</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.88rem' }}>{l.member}</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>₦{l.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Box>
                        <Typography sx={{ fontWeight: 700, fontSize: '0.85rem' }}>₦{l.outstanding.toLocaleString()}</Typography>
                        <LinearProgress variant="determinate" value={l.amount ? ((l.amount - l.outstanding) / l.amount) * 100 : 0} sx={{ height: 4, borderRadius: 4, mt: 0.5, bgcolor: '#e0f2fe', '& .MuiLinearProgress-bar': { bgcolor: '#0369a1' } }} />
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: '#64748b' }}>{l.tenure}</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#10b981' }}>{l.rate}</TableCell>
                    <TableCell sx={{ color: '#64748b', fontSize: '0.85rem' }}>{l.nextDue}</TableCell>
                    <TableCell><Chip label={l.status} color={statusColor[l.status] || 'default'} size="small" sx={{ borderRadius: '8px', textTransform: 'capitalize', fontWeight: 700 }} /></TableCell>
                    <TableCell />
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      </Paper>
    </Box>
  );
}
