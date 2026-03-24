'use client';
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Button,
  Divider, CircularProgress, Alert, Paper, IconButton,
  List, ListItem, ListItemText, Avatar
} from '@mui/material';
import {
  AccountBalanceWallet as WalletIcon,
  Add as TopUpIcon,
  SwapHoriz as TransactionIcon,
  ArrowForward as ArrowIcon,
  AccountBalance as BankIcon,
  CreditCard as CardIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { fetchMemberWallet } from '@/lib/api';

export default function MemberWallet() {
  const [wallet, setWallet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadWallet();
  }, []);

  const loadWallet = async () => {
    try {
      const data = await fetchMemberWallet();
      setWallet(data);
    } catch (err) {
      setError('Failed to load wallet information');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <CircularProgress sx={{ color: '#059669' }} />
    </Box>
  );

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mb: 10 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b' }}>Payment Wallet</Typography>
        <Typography variant="body2" color="text.secondary">Manage your funds and transactions</Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {/* Main Balance Card */}
      <Card sx={{ 
        borderRadius: '24px', 
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        color: 'white',
        mb: 4,
        overflow: 'hidden',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
      }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
            <Box>
              <Typography sx={{ opacity: 0.7, fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Available Balance
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, mt: 1 }}>
                ₦{parseFloat(wallet?.balance || '0').toLocaleString()}
              </Typography>
            </Box>
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.1)', width: 56, height: 56 }}>
              <WalletIcon sx={{ fontSize: 30 }} />
            </Avatar>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              variant="contained" 
              startIcon={<TopUpIcon />}
              sx={{ bgcolor: '#059669', '&:hover': { bgcolor: '#047857' }, borderRadius: '12px', textTransform: 'none', fontWeight: 700, px: 3, py: 1.2 }}
            >
              Top Up
            </Button>
            <Button 
              variant="contained" 
              startIcon={<ArrowIcon sx={{ transform: 'rotate(-45deg)' }} />}
              sx={{ bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }, borderRadius: '12px', textTransform: 'none', fontWeight: 700, px: 3, py: 1.2 }}
            >
              Transfer
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2, color: '#334155' }}>Payment Methods</Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Paper sx={{ p: 2.5, borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: 'none', display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: '#f0fdf4', color: '#059669' }}><BankIcon /></Avatar>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: '0.95rem' }}>Bank Account</Typography>
              <Typography variant="caption" color="text.secondary">Connected: GT Bank</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Paper sx={{ p: 2.5, borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: 'none', display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: '#eff6ff', color: '#2563eb' }}><CardIcon /></Avatar>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: '0.95rem' }}>Debit Card</Typography>
              <Typography variant="caption" color="text.secondary">Linked: **** 4920</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#334155' }}>Wallet Settings</Typography>
      </Box>
      <Paper sx={{ borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: 'none', overflow: 'hidden' }}>
        <List disablePadding>
          <ListItem disablePadding>
            <Button fullWidth sx={{ justifyContent: 'space-between', p: 2, color: '#475569', textAlign: 'left', textTransform: 'none' }}>
              <Typography sx={{ fontWeight: 600 }}>Daily Transaction Limit</Typography>
              <Typography variant="body2" sx={{ fontWeight: 800, color: '#0f172a' }}>₦500,000</Typography>
            </Button>
          </ListItem>
          <Divider />
          <ListItem disablePadding>
            <Button fullWidth sx={{ justifyContent: 'space-between', p: 2, color: '#475569', textAlign: 'left', textTransform: 'none' }}>
              <Typography sx={{ fontWeight: 600 }}>Auto-Topup for Loan Repayment</Typography>
              <Typography variant="body2" sx={{ fontWeight: 800, color: '#059669' }}>Enabled</Typography>
            </Button>
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
}
