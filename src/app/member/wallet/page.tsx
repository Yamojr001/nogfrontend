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
  CreditCard as CardIcon,
  ContentCopy as CopyIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { fetchMemberWallet, fetchParallexBanks, addBankAccount, provisionVirtualAccount } from '@/lib/api';
import { 
  Stack, Chip, Dialog, DialogTitle, DialogContent, 
  DialogActions, TextField, MenuItem, FormControl, InputLabel, Select 
} from '@mui/material';

export default function MemberWallet() {
  const [wallet, setWallet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Bank Account Modal State
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [banks, setBanks] = useState<any[]>([]);
  const [bankLoading, setBankLoading] = useState(false);
  const [newAccount, setNewAccount] = useState({
    bankName: '',
    bankCode: '',
    accountNumber: '',
    accountName: '',
  });

  // VA Provisioning State
  const [isVAModalOpen, setIsVAModalOpen] = useState(false);
  const [vaLoading, setVALoading] = useState(false);
  const [vaData, setVAData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    phone: '',
    email: '',
    bvn: '',
    address: '',
  });

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

  const openConnectBank = async () => {
    setIsBankModalOpen(true);
    if (banks.length === 0) {
      setBankLoading(true);
      try {
        const res = await fetchParallexBanks();
        setBanks(res?.data?.banks || []);
      } catch (err) {
        console.error('Failed to fetch banks', err);
      } finally {
        setBankLoading(false);
      }
    }
  };

  const handleAddAccount = async () => {
    if (!newAccount.bankName || !newAccount.accountNumber || !newAccount.accountName) {
      alert('Please fill all fields');
      return;
    }
    try {
      await addBankAccount(newAccount);
      setIsBankModalOpen(false);
      setNewAccount({ bankName: '', bankCode: '', accountNumber: '', accountName: '' });
      loadWallet();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to add bank account');
    }
  };

  const handleProvisionVA = async () => {
    if (!vaData.firstName || !vaData.lastName || !vaData.phone || !vaData.bvn) {
      alert('Please fill all required fields (First Name, Last Name, Phone, and BVN)');
      return;
    }
    setVALoading(true);
    try {
      await provisionVirtualAccount(vaData);
      setIsVAModalOpen(false);
      loadWallet();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to provision virtual account');
    } finally {
      setVALoading(false);
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
        {!wallet?.virtualAccount && (
          <Grid size={{ xs: 12 }}>
            <Paper sx={{ p: 4, borderRadius: '24px', border: '1px dashed #cbd5e1', bgcolor: '#f8fafc', textAlign: 'center', mb: 3 }}>
              <Avatar sx={{ bgcolor: '#eff6ff', color: '#2563eb', mx: 'auto', mb: 2, width: 64, height: 64 }}>
                <WalletIcon sx={{ fontSize: 36 }} />
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, color: '#1e293b' }}>Get Your Virtual Account</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 450, mx: 'auto' }}>
                Generate a permanent Parallex bank account to receive payments instantly into your NOGALSS wallet.
              </Typography>
              <Button 
                variant="contained" 
                onClick={() => setIsVAModalOpen(true)}
                sx={{ 
                  bgcolor: '#2563eb', 
                  '&:hover': { bgcolor: '#1d4ed8' }, 
                  borderRadius: '12px', 
                  px: 5, 
                  py: 1.5, 
                  fontWeight: 700,
                  fontSize: '1rem',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
                }}
              >
                Apply Now
              </Button>
            </Paper>
          </Grid>
        )}
        
        {wallet?.virtualAccount && (
          <Grid size={{ xs: 12 }}>
            <Paper sx={{ p: 2.5, borderRadius: '20px', border: '1px solid #e2e8f0', bgcolor: '#f8fafc', mb: 2 }}>
              <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                <Avatar sx={{ bgcolor: '#eff6ff', color: '#2563eb' }}><BankIcon /></Avatar>
                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.95rem' }}>Personal Virtual Account</Typography>
                  <Typography variant="caption" color="text.secondary">{wallet.virtualAccount.bankName}</Typography>
                </Box>
                <Chip 
                  label={wallet.virtualAccount.status} 
                  size="small" 
                  color={wallet.virtualAccount.status === 'active' ? 'success' : 'warning'}
                  sx={{ ml: 'auto', fontWeight: 700, fontSize: '0.65rem' }} 
                />
              </Stack>
              <Box sx={{ p: 2, bgcolor: 'white', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>Account Number</Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: 2, color: '#0f172a' }}>{wallet.virtualAccount.accountNumber}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>Account Name: {wallet.virtualAccount.accountName}</Typography>
              </Box>
            </Paper>
          </Grid>
        )}
        
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 2.5, borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: 'none', display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: '#f0fdf4', color: '#059669' }}><BankIcon /></Avatar>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: '0.95rem' }}>Bank Account</Typography>
              <Typography variant="caption" color="text.secondary">
                {wallet?.bankAccount ? `Connected: ${wallet.bankAccount.bankName}` : (
                  <Button 
                    size="small" 
                    variant="text" 
                    sx={{ p: 0, textTransform: 'none', color: '#059669', minWidth: 'auto' }}
                    onClick={openConnectBank}
                  >
                    Connect Account
                  </Button>
                )}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Bank Account Modal */}
      <Dialog open={isBankModalOpen} onClose={() => setIsBankModalOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Connect Bank Account</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Add your personal bank account for withdrawals.
          </Typography>
          <Stack spacing={2.5}>
            <FormControl fullWidth size="small">
              <InputLabel>Select Bank</InputLabel>
              <Select
                value={newAccount.bankCode}
                label="Select Bank"
                onChange={(e) => {
                  const bank = banks.find(b => b.institutionCode === e.target.value);
                  setNewAccount({ ...newAccount, bankCode: e.target.value, bankName: bank?.institutionName || '' });
                }}
                disabled={bankLoading}
              >
                {banks.map((bank: any) => (
                  <MenuItem key={bank.institutionCode} value={bank.institutionCode}>
                    {bank.institutionName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Account Number"
              size="small"
              value={newAccount.accountNumber}
              onChange={(e) => setNewAccount({ ...newAccount, accountNumber: e.target.value })}
            />

            <TextField
              fullWidth
              label="Account Name"
              size="small"
              value={newAccount.accountName}
              onChange={(e) => setNewAccount({ ...newAccount, accountName: e.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setIsBankModalOpen(false)} color="inherit" sx={{ fontWeight: 600 }}>Cancel</Button>
          <Button 
            onClick={handleAddAccount} 
            variant="contained" 
            sx={{ bgcolor: '#059669', '&:hover': { bgcolor: '#047857' }, fontWeight: 700 }}
          >
            Connect Account
          </Button>
        </DialogActions>
      </Dialog>

      {/* Virtual Account Provisioning Modal */}
      <Dialog open={isVAModalOpen} onClose={() => !vaLoading && setIsVAModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Apply for Virtual Account</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Please provide your details as they appear on your BVN to generate your account.
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                label="First Name"
                size="small"
                required
                value={vaData.firstName}
                onChange={(e) => setVAData({ ...vaData, firstName: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                label="Last Name"
                size="small"
                required
                value={vaData.lastName}
                onChange={(e) => setVAData({ ...vaData, lastName: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Middle Name (Optional)"
                size="small"
                value={vaData.middleName}
                onChange={(e) => setVAData({ ...vaData, middleName: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Email Address"
                size="small"
                value={vaData.email}
                onChange={(e) => setVAData({ ...vaData, email: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                label="Phone Number"
                size="small"
                required
                value={vaData.phone}
                onChange={(e) => setVAData({ ...vaData, phone: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                label="BVN"
                size="small"
                required
                value={vaData.bvn}
                onChange={(e) => setVAData({ ...vaData, bvn: e.target.value })}
                helperText="11-digit number"
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Residential Address"
                size="small"
                multiline
                rows={2}
                value={vaData.address}
                onChange={(e) => setVAData({ ...vaData, address: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={() => setIsVAModalOpen(false)} disabled={vaLoading} color="inherit" sx={{ fontWeight: 600 }}>Cancel</Button>
          <Button 
            onClick={handleProvisionVA} 
            variant="contained" 
            disabled={vaLoading}
            sx={{ bgcolor: '#059669', '&:hover': { bgcolor: '#047857' }, fontWeight: 700, px: 4 }}
          >
            {vaLoading ? <CircularProgress size={24} color="inherit" /> : 'Generate Account'}
          </Button>
        </DialogActions>
      </Dialog>

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
