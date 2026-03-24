'use client';
import React from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Grid } from '@mui/material';

// Mock data representing the appended-only Double Entry Ledger
const mockLedger = [
  { id: 1, date: '2023-11-01 10:00 AM', type: 'DEBIT', amount: 50000.00, wallet: 'Apex Central', ref: 'FUNDING_01', desc: 'Initial system provisioning' },
  { id: 2, date: '2023-11-01 10:00 AM', type: 'CREDIT', amount: 50000.00, wallet: 'Partner A Custodial', ref: 'FUNDING_01', desc: 'Initial system provisioning' },
  { id: 3, date: '2023-11-02 09:30 AM', type: 'DEBIT', amount: 1500.00, wallet: 'Partner A Custodial', ref: 'LOAN_DISB_101', desc: 'Disbursement to Group Alpha' },
  { id: 4, date: '2023-11-02 09:30 AM', type: 'CREDIT', amount: 1500.00, wallet: 'Group Alpha Operational', ref: 'LOAN_DISB_101', desc: 'Disbursement to Group Alpha' },
];

export default function FinancesPage() {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, color: 'primary.main', fontWeight: 'bold' }}>
        Virtual Ledger & Finances
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'primary.light', color: 'primary.contrastText', borderRadius: '16px' }}>
            <Typography variant="h6">Total Central Assets</Typography>
            <Typography variant="h3" sx={{ mt: 1, fontWeight: 'bold' }}>₦ 150,000,000</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, textAlign: 'center', border: '1px solid #e0e0e0', borderRadius: '16px' }}>
            <Typography variant="h6" color="textSecondary">Partner Wallets</Typography>
            <Typography variant="h3" sx={{ mt: 1, color: 'primary.main', fontWeight: 'bold' }}>₦ 45,000,000</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, textAlign: 'center', border: '1px solid #e0e0e0', borderRadius: '16px' }}>
            <Typography variant="h6" color="textSecondary">Active Savings</Typography>
            <Typography variant="h3" sx={{ mt: 1, color: 'secondary.main', fontWeight: 'bold' }}>₦ 12,500,000</Typography>
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
            {mockLedger.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.wallet}</TableCell>
                <TableCell>
                  <Chip 
                    label={row.type} 
                    color={row.type === 'CREDIT' ? 'success' : 'error'} 
                    size="small" 
                    variant="outlined" 
                    sx={{ fontWeight: 600 }}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>₦ {row.amount.toLocaleString()}</TableCell>
                <TableCell>{row.ref}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
