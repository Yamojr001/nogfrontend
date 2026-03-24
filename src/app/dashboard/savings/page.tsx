'use client';
import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, Grid, Card, CardContent, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, Button, CircularProgress
} from '@mui/material';
import { TrendingUp, History, AccountBalanceWallet } from '@mui/icons-material';
import { fetchMemberSavings } from '@/lib/api';

export default function SavingsPage() {
  const [savings, setSavings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchMemberSavings();
        setSavings(data);
        const total = data.reduce((acc: number, curr: any) => acc + Number(curr.amount), 0);
        setBalance(total);
      } catch (e) {
        console.error("Failed to fetch savings", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
      <CircularProgress sx={{ color: '#004d40' }} />
    </Box>
  );

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#004d40' }}>Savings & Contributions</Typography>
          <Typography sx={{ color: '#64748b' }}>Track your cooperative wealth and contribution history.</Typography>
        </Box>
        <Button variant="contained" sx={{ bgcolor: '#004d40', borderRadius: '12px', textTransform: 'none', fontWeight: 700 }}>
          Make Contribution
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 4, borderRadius: '24px', bgcolor: '#004d40', color: 'white' }}>
            <Typography variant="body2" sx={{ opacity: 0.8, fontWeight: 600 }}>Total Savings Balance</Typography>
            <Typography variant="h3" sx={{ fontWeight: 900, mt: 1 }}>₦{balance.toLocaleString()}</Typography>
            <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrendingUp size={16} />
              <Typography variant="caption" sx={{ fontWeight: 700 }}>+4.2% from last month</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 4, borderRadius: '24px', border: '1px solid #eef2f6', height: '100%', display: 'flex', alignItems: 'center' }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>Active Tenure</Typography>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>8 Months</Typography>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>Next Due Date</Typography>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>March 31, 2026</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <History /> Contribution History
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: '24px', border: '1px solid #eef2f6', boxShadow: 'none' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Reference</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Amount</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Method</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {savings.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 8, color: '#94a3b8' }}>No contribution records found.</TableCell>
              </TableRow>
            )}
            {savings.map((row) => (
              <TableRow key={row.id}>
                <TableCell sx={{ fontWeight: 600 }}>{row.reference}</TableCell>
                <TableCell>{new Date(row.createdAt).toLocaleDateString()}</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>₦{Number(row.amount).toLocaleString()}</TableCell>
                <TableCell>
                  <Chip 
                    label={row.status} 
                    size="small" 
                    sx={{ 
                      bgcolor: row.status === 'completed' ? '#f0fdf4' : '#fff7ed', 
                      color: row.status === 'completed' ? '#166534' : '#9a3412',
                      fontWeight: 700,
                      textTransform: 'capitalize'
                    }} 
                  />
                </TableCell>
                <TableCell sx={{ color: '#64748b', textTransform: 'capitalize' }}>{row.channel}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
