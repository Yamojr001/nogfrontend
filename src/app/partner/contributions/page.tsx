"use client";

import React from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, Chip, Button } from '@mui/material';
import { Savings, ReceiptLong, TrendingUp, Download } from '@mui/icons-material';

const rows = [
    { month: 'Apr', amount: '₦2.4M', count: 348 },
    { month: 'Mar', amount: '₦2.1M', count: 321 },
    { month: 'Feb', amount: '₦1.9M', count: 298 },
];

export default function Page() {
    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', mb: 3 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: '#065f46' }}>Contributions</Typography>
                    <Typography sx={{ color: '#64748b' }}>Monitor savings inflow and contribution performance.</Typography>
                </Box>
                <Button variant="contained" startIcon={<Download />} sx={{ bgcolor: '#0f8a62', '&:hover': { bgcolor: '#047857' }, borderRadius: '12px', textTransform: 'none', fontWeight: 700 }}>Export</Button>
            </Box>

            <Grid container spacing={2.5} sx={{ mb: 3 }}>
                {[{ label: 'This Month', value: '₦2.4M', icon: <Savings />, color: '#0f8a62' }, { label: 'Transactions', value: '348', icon: <ReceiptLong />, color: '#10b981' }, { label: 'Growth', value: '+11.2%', icon: <TrendingUp />, color: '#7c3aed' }].map((item) => (
                    <Grid key={item.label} size={{ xs: 12, sm: 4 }}>
                        <Card sx={{ borderRadius: '20px', border: '1px solid #d1fae5', boxShadow: 'none' }}>
                            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box>
                                    <Typography sx={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>{item.label}</Typography>
                                    <Typography sx={{ color: '#065f46', fontSize: '1.5rem', fontWeight: 900 }}>{item.value}</Typography>
                                </Box>
                                <Box sx={{ color: item.color, bgcolor: `${item.color}15`, p: 1.2, borderRadius: '14px' }}>{item.icon}</Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Paper sx={{ p: 3, borderRadius: '24px', border: '1px solid #d1fae5', boxShadow: 'none' }}>
                <Typography sx={{ fontWeight: 800, color: '#065f46', mb: 2 }}>Monthly Summary</Typography>
                {rows.map((row) => (
                    <Box key={row.month} sx={{ display: 'flex', justifyContent: 'space-between', py: 2, borderBottom: '1px solid #f1f5f9', '&:last-child': { borderBottom: 'none' } }}>
                        <Typography sx={{ fontWeight: 700 }}>{row.month}</Typography>
                        <Typography sx={{ fontWeight: 800, color: '#0f8a62' }}>{row.amount}</Typography>
                        <Chip size="small" label={`${row.count} deposits`} sx={{ bgcolor: '#f0fdf4', color: '#166534', fontWeight: 700 }} />
                    </Box>
                ))}
            </Paper>
        </Box>
    );
}
