"use client";

import React from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, List, ListItem, ListItemText, Chip, Button } from '@mui/material';
import { CheckCircle, Cancel, PendingActions } from '@mui/icons-material';

export default function Page() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 900, color: '#065f46', mb: 0.5 }}>Approvals</Typography>
      <Typography sx={{ color: '#64748b', mb: 3 }}>Review requests before they advance to the next hierarchy level.</Typography>
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {[{ label: 'Pending', value: '8' }, { label: 'Approved', value: '22' }, { label: 'Rejected', value: '3' }].map((item) => (<Grid key={item.label} size={{ xs: 12, md: 4 }}><Card sx={{ borderRadius: '24px', border: '1px solid #d1fae5' }}><CardContent><Typography sx={{ color: '#64748b', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase' }}>{item.label}</Typography><Typography sx={{ fontWeight: 900, color: '#065f46', fontSize: '1.8rem' }}>{item.value}</Typography></CardContent></Card></Grid>))}
      </Grid>
      <Paper sx={{ p: 3, borderRadius: '24px', border: '1px solid #d1fae5' }}>
        <Typography sx={{ fontWeight: 800, color: '#065f46', mb: 2 }}>Pending Requests</Typography>
        <List disablePadding>
          {[
            { title: 'Loan request — Amina Yusuf', meta: 'Step 2 of 3' },
            { title: 'Withdrawal — Lagos group', meta: 'Step 1 of 2' },
          ].map((item) => (
            <ListItem key={item.title} sx={{ px: 0, borderBottom: '1px solid #f1f5f9', '&:last-child': { borderBottom: 'none' } }} secondaryAction={<Box sx={{ display: 'flex', gap: 1 }}><Button size="small" variant="contained" sx={{ bgcolor: '#10b981', textTransform: 'none', fontWeight: 800 }}>Approve</Button><Button size="small" variant="outlined" sx={{ borderColor: '#ef4444', color: '#ef4444', textTransform: 'none', fontWeight: 800 }}>Reject</Button></Box>}>
              <PendingActions sx={{ color: '#0f8a62', mr: 2 }} />
              <ListItemText primary={<Typography sx={{ fontWeight: 800 }}>{item.title}</Typography>} secondary={item.meta} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
}
