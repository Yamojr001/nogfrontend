"use client";

import React from 'react';
import { Box, Typography, Paper, Chip, List, ListItem, ListItemText, Avatar, Button } from '@mui/material';
import { Notifications, Schedule, ArrowForward } from '@mui/icons-material';

const notifications = [
    { id: 1, title: 'Loan request awaiting review', meta: 'Amina Yusuf · ₦250,000', time: '12 mins ago', type: 'loan' },
    { id: 2, title: 'New member approved', meta: 'Grace Nnamdi', time: '1 hour ago', type: 'member' },
    { id: 3, title: 'Withdrawal processed', meta: 'Lagos Sub-Org', time: 'Today', type: 'transaction' },
];

export default function Page() {
    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', mb: 3 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: '#065f46' }}>Notifications</Typography>
                    <Typography sx={{ color: '#64748b' }}>Stay updated on approvals, members, and transactions.</Typography>
                </Box>
                <Chip icon={<Notifications />} label="3 unread" sx={{ bgcolor: '#d1fae5', color: '#0f8a62', fontWeight: 700 }} />
            </Box>

            <Paper sx={{ borderRadius: '24px', p: 2, border: '1px solid #d1fae5', boxShadow: 'none' }}>
                <List>
                    {notifications.map((item) => (
                        <ListItem key={item.id} sx={{ borderBottom: '1px solid #f1f5f9', '&:last-child': { borderBottom: 'none' } }} secondaryAction={<Button size="small" endIcon={<ArrowForward />} sx={{ textTransform: 'none', color: '#0f8a62', fontWeight: 700 }}>Open</Button>}>
                            <Avatar sx={{ mr: 2, bgcolor: '#d1fae5', color: '#0f8a62' }}><Schedule /></Avatar>
                            <ListItemText primary={<Typography sx={{ fontWeight: 800, color: '#1e293b' }}>{item.title}</Typography>} secondary={<Box><Typography sx={{ color: '#64748b', fontSize: '0.85rem' }}>{item.meta}</Typography><Typography sx={{ color: '#94a3b8', fontSize: '0.75rem' }}>{item.time}</Typography></Box>} />
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Box>
    );
}
