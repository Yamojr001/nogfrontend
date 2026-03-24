'use client';
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Button, Avatar, Dialog, DialogTitle, DialogContent, TextField,
  MenuItem, CircularProgress, Chip, Tabs, Tab
} from '@mui/material';
import { AddCircle, History, AccountBalanceWallet, RequestQuote } from '@mui/icons-material';
import { fetchGroupFinances } from '@/lib/api';

export default function GroupFinancesPage() {
  const [tab, setTab] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDepositOpen, setIsDepositOpen] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchGroupFinances(1); // Demo Group ID
        setTransactions(data || []);
      } catch (error) {
        console.error("Failed to load finances", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

  return (
    <Box sx={{ p: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, px: 1 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b' }}>Group Finances</Typography>
          <Typography sx={{ color: '#64748b', fontSize: '0.8rem' }}>Record savings and repayments</Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AddCircle />} 
          onClick={() => setIsDepositOpen(true)}
          sx={{ bgcolor: '#10b981', '&:hover': { bgcolor: '#059669' }, textTransform: 'none', fontWeight: 700, borderRadius: '12px' }}
        >
          Collect
        </Button>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: '#f1f5f9', mb: 2 }}>
        <Tabs value={tab} onChange={(e, v) => setTab(v)} TabIndicatorProps={{ sx: { bgcolor: '#0f766e' } }}>
          <Tab icon={<History />} label="History" sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.8rem' }} />
          <Tab icon={<AccountBalanceWallet />} label="Balances" sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.8rem' }} />
        </Tabs>
      </Box>

      <Card sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: 'none', overflow: 'hidden' }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8fafc' }}>
                <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>Member</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b' }} align="right">Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((txn) => (
                <TableRow key={txn.id} hover>
                  <TableCell sx={{ fontSize: '0.75rem', color: '#64748b' }}>
                    {new Date(txn.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 24, height: 24, bgcolor: '#f1f5f9', color: '#0f766e', fontSize: '0.7rem' }}>
                        {txn.member?.user?.name?.charAt(0)}
                      </Avatar>
                      <Typography sx={{ fontWeight: 700, color: '#1e293b', fontSize: '0.8rem' }}>
                        {txn.member?.user?.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Typography sx={{ fontWeight: 800, color: txn.type === 'loan_repayment' ? '#0ea5e9' : '#10b981', fontSize: '0.85rem' }}>
                      ₦{Number(txn.amount).toLocaleString()}
                    </Typography>
                    <Typography sx={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'capitalize' }}>
                      {txn.type.replace('_', ' ')}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Dialog open={isDepositOpen} onClose={() => setIsDepositOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 800 }}>Record Contribution</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField select fullWidth label="Select Member" size="small">
               {/* This would be populated from group members */}
               <MenuItem value="1">John Member Doe</MenuItem>
            </TextField>
            <TextField fullWidth label="Amount (₦)" type="number" size="small" />
            <TextField select fullWidth label="Payment Type" defaultValue="contribution" size="small">
              <MenuItem value="contribution">Regular Savings</MenuItem>
              <MenuItem value="loan_repayment">Loan Repayment</MenuItem>
              <MenuItem value="fee">Registration Fee</MenuItem>
            </TextField>
          </Box>
          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button fullWidth onClick={() => setIsDepositOpen(false)} sx={{ textTransform: 'none', fontWeight: 700, color: '#64748b' }}>Cancel</Button>
            <Button fullWidth variant="contained" onClick={() => setIsDepositOpen(false)} sx={{ bgcolor: '#10b981', textTransform: 'none', fontWeight: 700 }}>Record Payment</Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
