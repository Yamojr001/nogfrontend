"use client";

import React from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, Button, Chip, List, ListItem, ListItemText, Avatar } from '@mui/material';
import { AccountBalanceWallet, Send, Add, History, ArrowForward } from '@mui/icons-material';

const txns = [
  { id: 'WT-901', title: 'Contribution received', amount: '+₦45,000', time: 'Today' },
  { id: 'WT-902', title: 'Loan disbursed', amount: '-₦120,000', time: 'Yesterday' },
  { id: 'WT-903', title: 'Fees settled', amount: '-₦8,500', time: '2 days ago' },
];

export default function Page() {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', mb: 3, gap: 2, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#065f46' }}>Wallet</Typography>
          <Typography sx={{ color: '#64748b' }}>Track balances, transfers, and settlement activity.</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button startIcon={<Send />} variant="outlined" sx={{ borderRadius: '12px', textTransform: 'none', borderColor: '#0f8a62', color: '#0f8a62', fontWeight: 700 }}>Transfer</Button>
          <Button startIcon={<Add />} variant="contained" sx={{ borderRadius: '12px', textTransform: 'none', bgcolor: '#0f8a62', '&:hover': { bgcolor: '#047857' }, fontWeight: 700 }}>Fund Wallet</Button>
        </Box>
      </Box>

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ borderRadius: '24px', bgcolor: '#065f46', color: 'white', boxShadow: 'none' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ opacity: 0.8, fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase' }}>Available Balance</Typography>
              <Typography variant="h4" sx={{ fontWeight: 900, my: 1 }}>₦8,420,000</Typography>
              <Typography sx={{ opacity: 0.8, fontSize: '0.85rem' }}>Instantly available for operational use.</Typography>
            </CardContent>
          </Card>
        </Grid>
        {[{ label: 'Locked', value: '₦1.2M' }, { label: 'Pending', value: '₦320K' }].map((item) => (
          <Grid key={item.label} size={{ xs: 6, md: 4 }}>
            <Paper sx={{ p: 3, borderRadius: '24px', border: '1px solid #d1fae5', boxShadow: 'none' }}>
              <Typography sx={{ color: '#64748b', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase' }}>{item.label}</Typography>
              <Typography sx={{ color: '#065f46', fontSize: '1.8rem', fontWeight: 900 }}>{item.value}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper sx={{ p: 3, borderRadius: '24px', border: '1px solid #d1fae5', boxShadow: 'none' }}>
            <Typography sx={{ fontWeight: 800, color: '#065f46', mb: 2 }}>Recent Wallet Activity</Typography>
            <List disablePadding>
              {txns.map((item) => (
                <ListItem key={item.id} sx={{ px: 0, borderBottom: '1px solid #f1f5f9', '&:last-child': { borderBottom: 'none' } }} secondaryAction={<Chip size="small" label={item.amount} sx={{ bgcolor: item.amount.startsWith('+') ? '#dcfce7' : '#fee2e2', color: item.amount.startsWith('+') ? '#166534' : '#991b1b', fontWeight: 800 }} />}>
                  <Avatar sx={{ mr: 2, bgcolor: '#d1fae5', color: '#0f8a62' }}><History /></Avatar>
                  <ListItemText primary={<Typography sx={{ fontWeight: 800, color: '#1e293b' }}>{item.title}</Typography>} secondary={<Typography sx={{ color: '#94a3b8', fontSize: '0.8rem' }}>{item.id} · {item.time}</Typography>} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ p: 3, borderRadius: '24px', bgcolor: '#0f8a62', color: 'white', boxShadow: 'none' }}>
            <AccountBalanceWallet sx={{ fontSize: 44, mb: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 800 }}>Settlement Summary</Typography>
            <Typography sx={{ opacity: 0.85, mb: 2, fontSize: '0.9rem' }}>Wallet is healthy and ready for transfers.</Typography>
            <Chip label="100% Verified" sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: 'white', fontWeight: 800, mb: 2 }} />
            <Button fullWidth variant="contained" endIcon={<ArrowForward />} sx={{ bgcolor: 'white', color: '#0f8a62', '&:hover': { bgcolor: '#f0fdf4' }, textTransform: 'none', fontWeight: 800, borderRadius: '12px' }}>View Ledger</Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
