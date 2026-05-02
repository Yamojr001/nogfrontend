"use client";

import React from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, Button, List, ListItem, ListItemText, Avatar, Chip } from '@mui/material';
import { AccountBalanceWallet, ReceiptLong, Send } from '@mui/icons-material';

export default function Page() {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#065f46' }}>Sub-Org Wallet</Typography>
          <Typography sx={{ color: '#64748b' }}>Operational wallet overview for the sub-organisation.</Typography>
        </Box>
        <Button variant="contained" startIcon={<Send />} sx={{ bgcolor: '#0f8a62', '&:hover': { bgcolor: '#047857' }, borderRadius: '12px', textTransform: 'none', fontWeight: 700 }}>Transfer Funds</Button>
      </Box>
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ borderRadius: '24px', bgcolor: '#065f46', color: 'white' }}><CardContent><Typography sx={{ opacity: 0.8, fontWeight: 700, textTransform: 'uppercase', fontSize: '0.8rem' }}>Wallet Balance</Typography><Typography variant="h4" sx={{ fontWeight: 900, mt: 1 }}>₦2,840,000</Typography></CardContent></Card>
        </Grid>
        {[{ label: 'Reserve', value: '₦750K' }, { label: 'Pending', value: '₦190K' }].map(item => (<Grid key={item.label} size={{ xs: 6, md: 4 }}><Paper sx={{ p: 3, borderRadius: '24px', border: '1px solid #d1fae5' }}><Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>{item.label}</Typography><Typography sx={{ fontSize: '1.8rem', fontWeight: 900, color: '#065f46' }}>{item.value}</Typography></Paper></Grid>))}
      </Grid>
      <Paper sx={{ p: 3, borderRadius: '24px', border: '1px solid #d1fae5' }}>
        <Typography sx={{ fontWeight: 800, color: '#065f46', mb: 2 }}>Recent Wallet Entries</Typography>
        <List disablePadding>
          {[
            { title: 'Contributions credited', amount: '+₦120,000', time: 'Today' },
            { title: 'Member loan payout', amount: '-₦60,000', time: 'Yesterday' },
          ].map((item) => (
            <ListItem key={item.title} sx={{ px: 0, borderBottom: '1px solid #f1f5f9', '&:last-child': { borderBottom: 'none' } }} secondaryAction={<Chip size="small" label={item.amount} sx={{ bgcolor: item.amount.startsWith('+') ? '#dcfce7' : '#fee2e2', color: item.amount.startsWith('+') ? '#166534' : '#991b1b', fontWeight: 800 }} />}>
              <Avatar sx={{ mr: 2, bgcolor: '#d1fae5', color: '#0f8a62' }}><ReceiptLong /></Avatar>
              <ListItemText primary={<Typography sx={{ fontWeight: 800 }}>{item.title}</Typography>} secondary={item.time} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
}
