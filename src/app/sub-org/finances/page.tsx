'use client';
import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Grid, CircularProgress } from '@mui/material';
import { fetchSubOrgFinances } from '@/lib/api';

export default function FinancesPage() {
  const [ledger, setLedger] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [financials, setFinancials] = useState({
    totalAssets: 0,
    partnerWallets: 0,
    activeSavings: 0,
  });

  useEffect(() => {
    async function load() {
      try {
        const orgIdStr = localStorage.getItem('organisation_id');
        if (!orgIdStr) return;

        const data = await fetchSubOrgFinances(Number(orgIdStr));
        if (data?.summary) setFinancials(data.summary);
        setLedger(Array.isArray(data?.ledger) ? data.ledger : Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to load finances data', error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, color: 'primary.main', fontWeight: 'bold' }}>
        Virtual Ledger & Finances
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'primary.light', color: 'primary.contrastText', borderRadius: '16px' }}>
            <Typography variant="h6">Total Central Assets</Typography>
            <Typography variant="h3" sx={{ mt: 1, fontWeight: 'bold' }}>₦ {(financials.totalAssets || 0).toLocaleString()}</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, textAlign: 'center', border: '1px solid #e0e0e0', borderRadius: '16px' }}>
            <Typography variant="h6" color="textSecondary">Partner Wallets</Typography>
            <Typography variant="h3" sx={{ mt: 1, color: 'primary.main', fontWeight: 'bold' }}>₦ {(financials.partnerWallets || 0).toLocaleString()}</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, textAlign: 'center', border: '1px solid #e0e0e0', borderRadius: '16px' }}>
            <Typography variant="h6" color="textSecondary">Active Savings</Typography>
            <Typography variant="h3" sx={{ mt: 1, color: 'secondary.main', fontWeight: 'bold' }}>₦ {(financials.activeSavings || 0).toLocaleString()}</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Immutable Ledger (Double-Entry)</Typography>
      <TableContainer component={Paper} sx={{ borderRadius: '16px', overflow: 'hidden' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f5f5f5' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Wallet Affected</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Entry Type</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Reference</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ledger.length > 0 ? (
              ledger.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>{row.date ? new Date(row.date).toLocaleString() : '-'}</TableCell>
                  <TableCell>{row.wallet || row.walletName || '-'}</TableCell>
                  <TableCell>
                    <Chip
                      label={row.type || 'ENTRY'}
                      color={(row.type || '').toUpperCase() === 'CREDIT' ? 'success' : 'error'}
                      size="small"
                      variant="outlined"
                      sx={{ fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>₦ {Number(row.amount || 0).toLocaleString()}</TableCell>
                  <TableCell>{row.ref || row.reference || '-'}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4, color: '#94a3b8' }}>
                  No ledger entries found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
