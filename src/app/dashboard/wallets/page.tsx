'use client';
import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import {
  Box, Typography, Paper, Grid, Card, CardContent,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, CircularProgress, Button, Alert
} from '@mui/material';
import { AccountBalanceWallet as WalletIcon, TrendingUp, TrendingDown, Refresh as RefreshIcon, Send as TransferIcon } from '@mui/icons-material';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from '@mui/material';

export default function WalletsPage() {
  const [wallets, setWallets] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Transfer Modal State
  const [open, setOpen] = useState(false);
  const [transferData, setTransferData] = useState({ from: '', to: '', amount: '', desc: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    setError('');
    try {
      const [walletsRes, statsRes] = await Promise.all([
        api.get('/wallets'),
        api.get('/dashboard/stats'),
      ]);
      setWallets(walletsRes.data);
      setStats(statsRes.data);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to load wallet data.');
    } finally {
      setLoading(false);
    }
  }

  async function handleTransfer() {
    if (!transferData.from || !transferData.to || !transferData.amount) return;
    setSubmitting(true);
    try {
      await api.post('/wallets/transfer', {
        fromWalletId: +transferData.from,
        toWalletId: +transferData.to,
        amount: +transferData.amount,
        description: transferData.desc,
      });
      setOpen(false);
      setTransferData({ from: '', to: '', amount: '', desc: '' });
      loadData();
    } catch (e: any) {
      alert(e?.response?.data?.message || 'Transfer failed');
    } finally {
      setSubmitting(false);
    }
  }

  const totalBalance = wallets.reduce((s, w) => s + Number(w.balance), 0);
  const inflow = wallets.filter(w => w.type === 'MEMBER').reduce((s, w) => s + Number(w.balance), 0);
  const loans = stats?.pendingApprovalsAmount || 0;

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#004d40' }}>Wallet System</Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>Live overview of custodial accounts and system liquidity.</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button startIcon={<TransferIcon />} onClick={() => setOpen(true)} variant="contained" sx={{ borderRadius: '12px', bgcolor: '#004d40', '&:hover': { bgcolor: '#00332b' } }}>Transfer Funds</Button>
          <Button startIcon={<RefreshIcon />} onClick={loadData} variant="outlined" sx={{ borderRadius: '12px', textTransform: 'none' }}>Refresh</Button>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ borderRadius: '24px', bgcolor: '#004d40', color: '#fff' }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <WalletIcon />
                <Typography variant="overline">System Custodial Balance</Typography>
              </Box>
              {loading ? <CircularProgress color="inherit" size={28} /> : (
                <Typography variant="h3" sx={{ fontWeight: 900 }}>₦{totalBalance.toLocaleString()}</Typography>
              )}
              <Typography variant="body2" sx={{ opacity: 0.8 }}>{wallets.length} Wallets Active</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ borderRadius: '24px', border: '1px solid #eef2f6' }}>
            <CardContent sx={{ p: 4 }}>
              <TrendingUp sx={{ color: '#10b981', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 800 }}>₦{inflow.toLocaleString()}</Typography>
              <Typography variant="body2" sx={{ color: '#64748b' }}>Total Member Savings</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ borderRadius: '24px', border: '1px solid #eef2f6' }}>
            <CardContent sx={{ p: 4 }}>
              <TrendingDown sx={{ color: '#ef4444', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 800 }}>₦{loans.toLocaleString()}</Typography>
              <Typography variant="body2" sx={{ color: '#64748b' }}>Pending Approvals Value</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid #eef2f6' }}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>All Wallets</Typography>
        </Box>
        <TableContainer>
          {loading ? (
            <Box sx={{ p: 10, display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>
          ) : wallets.length === 0 ? (
            <Box sx={{ p: 10, textAlign: 'center' }}>
              <WalletIcon sx={{ fontSize: 48, color: '#CBD5E1', mb: 2 }} />
              <Typography sx={{ color: '#64748B' }}>No wallets found.</Typography>
            </Box>
          ) : (
            <Table>
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow>
                  {['Wallet ID', 'Type', 'Owner', 'Currency', 'Balance', 'Status'].map(h => (
                    <TableCell key={h} sx={{ fontWeight: 700 }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {wallets.map(w => (
                  <TableRow key={w.id} hover>
                    <TableCell sx={{ fontWeight: 600, fontFamily: 'monospace' }}>WLT-{String(w.id).padStart(4, '0')}</TableCell>
                    <TableCell><Chip label={w.type} size="small" variant="outlined" /></TableCell>
                    <TableCell>{w.ownerId || '—'}</TableCell>
                    <TableCell>{w.currency || 'NGN'}</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>₦{Number(w.balance).toLocaleString()}</TableCell>
                    <TableCell>
                      <Chip
                        label={w.status || 'active'}
                        size="small"
                        color={w.status === 'active' || !w.status ? 'success' : 'default'}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      </Paper>

      {/* Transfer Modal */}
      <Dialog open={open} onClose={() => setOpen(false)} PaperProps={{ sx: { borderRadius: '24px', p: 1, minWidth: 400 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Transfer Funds</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField select label="Source Wallet" fullWidth value={transferData.from} onChange={e => setTransferData({ ...transferData, from: e.target.value })}>
              {wallets.map(w => (
                <MenuItem key={w.id} value={w.id}>
                  WLT-{String(w.id).padStart(4, '0')} ({w.type} - ₦{Number(w.balance).toLocaleString()})
                </MenuItem>
              ))}
            </TextField>
            <TextField select label="Destination Wallet" fullWidth value={transferData.to} onChange={e => setTransferData({ ...transferData, to: e.target.value })}>
              {wallets.map(w => (
                <MenuItem key={w.id} value={w.id}>
                  WLT-{String(w.id).padStart(4, '0')} ({w.type})
                </MenuItem>
              ))}
            </TextField>
            <TextField label="Amount (NGN)" type="number" fullWidth value={transferData.amount} onChange={e => setTransferData({ ...transferData, amount: e.target.value })} />
            <TextField label="Description" fullWidth value={transferData.desc} onChange={e => setTransferData({ ...transferData, desc: e.target.value })} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpen(false)} color="inherit">Cancel</Button>
          <Button 
            onClick={handleTransfer} 
            variant="contained" 
            disabled={submitting}
            sx={{ borderRadius: '12px', bgcolor: '#004d40', '&:hover': { bgcolor: '#00332b' } }}
          >
            {submitting ? 'Processing...' : 'Execute Transfer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
