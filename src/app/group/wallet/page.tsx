"use client";

import React from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, List, ListItem, ListItemText, Chip } from '@mui/material';
import { AccountBalanceWallet, ReceiptLong, ArrowForward } from '@mui/icons-material';

export default function Page() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 900, color: '#065f46', mb: 0.5 }}>Wallet</Typography>
      <Typography sx={{ color: '#64748b', mb: 3 }}>Cashflow and ledger view for the group wallet.</Typography>
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 4 }}><Card sx={{ borderRadius: '24px', bgcolor: '#065f46', color: 'white' }}><CardContent><Typography sx={{ opacity: 0.8, fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Balance</Typography><Typography variant="h4" sx={{ fontWeight: 900 }}>₦1,620,000</Typography></CardContent></Card></Grid>
        <Grid size={{ xs: 6, md: 4 }}><Paper sx={{ p: 3, borderRadius: '24px', border: '1px solid #d1fae5' }}><Typography sx={{ color: '#64748b', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase' }}>Pending</Typography><Typography sx={{ fontSize: '1.8rem', fontWeight: 900, color: '#065f46' }}>₦145K</Typography></Paper></Grid>
        <Grid size={{ xs: 6, md: 4 }}><Paper sx={{ p: 3, borderRadius: '24px', border: '1px solid #d1fae5' }}><Typography sx={{ color: '#64748b', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase' }}>Reserve</Typography><Typography sx={{ fontSize: '1.8rem', fontWeight: 900, color: '#065f46' }}>₦380K</Typography></Paper></Grid>
      </Grid>
      <Paper sx={{ p: 3, borderRadius: '24px', border: '1px solid #d1fae5' }}>
        <Typography sx={{ fontWeight: 800, color: '#065f46', mb: 2 }}>Ledger</Typography>
        {[{ title: 'Savings contributions', amount: '+₦56,000' }, { title: 'Loan settlement', amount: '-₦20,000' }].map((item) => (
          <ListItem key={item.title} sx={{ px: 0, borderBottom: '1px solid #f1f5f9', '&:last-child': { borderBottom: 'none' } }} secondaryAction={<Chip size="small" label={item.amount} sx={{ bgcolor: item.amount.startsWith('+') ? '#dcfce7' : '#fee2e2', color: item.amount.startsWith('+') ? '#166534' : '#991b1b', fontWeight: 800 }} />}>
            <ReceiptLong sx={{ color: '#0f8a62', mr: 2 }} />
            <ListItemText primary={<Typography sx={{ fontWeight: 800 }}>{item.title}</Typography>} secondary="Recorded this week" />
          </ListItem>
        ))}
      </Paper>
    </Box>
  );
}
