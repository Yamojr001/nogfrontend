"use client";

import React from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, Button, Chip } from '@mui/material';
import { Assessment, Download, TrendingUp, People, RequestQuote } from '@mui/icons-material';

export default function Page() {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#065f46' }}>Reports</Typography>
          <Typography sx={{ color: '#64748b' }}>Performance summaries for the group and its members.</Typography>
        </Box>
        <Button variant="contained" startIcon={<Download />} sx={{ bgcolor: '#0f8a62', '&:hover': { bgcolor: '#047857' }, borderRadius: '12px', textTransform: 'none', fontWeight: 700 }}>Export PDF</Button>
      </Box>
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {[{ label: 'Members', value: '48', icon: <People /> }, { label: 'Savings', value: '₦820K', icon: <TrendingUp /> }, { label: 'Loans', value: '₦260K', icon: <RequestQuote /> }].map((item) => (<Grid key={item.label} size={{ xs: 12, md: 4 }}><Card sx={{ borderRadius: '24px', border: '1px solid #d1fae5' }}><CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><Box><Typography sx={{ color: '#64748b', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase' }}>{item.label}</Typography><Typography sx={{ fontWeight: 900, color: '#065f46', fontSize: '1.8rem' }}>{item.value}</Typography></Box><Box sx={{ color: '#0f8a62' }}>{item.icon}</Box></CardContent></Card></Grid>))}
      </Grid>
      <Paper sx={{ p: 3, borderRadius: '24px', border: '1px solid #d1fae5' }}>
        <Typography sx={{ fontWeight: 800, color: '#065f46', mb: 2 }}>Report Highlights</Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip label="Contribution trend up" sx={{ bgcolor: '#dcfce7', color: '#166534', fontWeight: 800 }} />
          <Chip label="Loan default rate low" sx={{ bgcolor: '#dbeafe', color: '#1d4ed8', fontWeight: 800 }} />
          <Chip label="All remittances reconciled" sx={{ bgcolor: '#f0fdf4', color: '#166534', fontWeight: 800 }} />
        </Box>
      </Paper>
    </Box>
  );
}
