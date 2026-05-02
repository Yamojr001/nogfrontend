"use client";

import React from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, Chip, List, ListItem, ListItemText } from '@mui/material';
import { Savings, Groups, TrendingUp } from '@mui/icons-material';

export default function Page() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 900, color: '#065f46', mb: 0.5 }}>Group Contributions</Typography>
      <Typography sx={{ color: '#64748b', mb: 3 }}>Monitor group savings, deposits, and collection performance.</Typography>
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {[{ label: 'Collection Target', value: '₦500K' }, { label: 'Raised', value: '₦362K' }, { label: 'Growth', value: '+8.4%' }].map((item) => (<Grid key={item.label} size={{ xs: 12, md: 4 }}><Card sx={{ borderRadius: '24px', border: '1px solid #d1fae5' }}><CardContent><Typography sx={{ color: '#64748b', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase' }}>{item.label}</Typography><Typography sx={{ fontWeight: 900, color: '#065f46', fontSize: '1.8rem' }}>{item.value}</Typography></CardContent></Card></Grid>))}
      </Grid>
      <Paper sx={{ p: 3, borderRadius: '24px', border: '1px solid #d1fae5' }}>
        <Typography sx={{ fontWeight: 800, color: '#065f46', mb: 2 }}>Latest Contributions</Typography>
        <List disablePadding>
          {[
            { name: 'Amina Yusuf', amount: '₦25,000' },
            { name: 'John Okoro', amount: '₦15,000' },
          ].map((item) => (
            <ListItem key={item.name} sx={{ px: 0, borderBottom: '1px solid #f1f5f9', '&:last-child': { borderBottom: 'none' } }} secondaryAction={<Chip size="small" label={item.amount} sx={{ bgcolor: '#dcfce7', color: '#166534', fontWeight: 800 }} />}>
              <Savings sx={{ color: '#0f8a62', mr: 2 }} />
              <ListItemText primary={<Typography sx={{ fontWeight: 800 }}>{item.name}</Typography>} secondary="Recorded today" />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
}
