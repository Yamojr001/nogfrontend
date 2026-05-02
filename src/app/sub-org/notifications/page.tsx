"use client";

import React from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, Avatar, Chip } from '@mui/material';
import { NotificationsActive, AccessTime, ArrowForward } from '@mui/icons-material';

export default function Page() {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#065f46' }}>Notifications</Typography>
          <Typography sx={{ color: '#64748b' }}>Approvals, member updates, and operational alerts.</Typography>
        </Box>
        <Chip label="2 unread" icon={<NotificationsActive />} sx={{ bgcolor: '#d1fae5', color: '#0f8a62', fontWeight: 700 }} />
      </Box>
      <Paper sx={{ p: 3, borderRadius: '24px', border: '1px solid #d1fae5' }}>
        <List disablePadding>
          {[
            { title: 'Loan approved for Amina Yusuf', meta: 'Awaiting partner routing', time: '10 mins ago' },
            { title: 'New group created', meta: 'Lagos Central added under sub-org', time: '2 hours ago' },
          ].map((item) => (
            <ListItem key={item.title} sx={{ px: 0, borderBottom: '1px solid #f1f5f9', '&:last-child': { borderBottom: 'none' } }} secondaryAction={<ArrowForward sx={{ color: '#0f8a62' }} />}>
              <Avatar sx={{ mr: 2, bgcolor: '#d1fae5', color: '#0f8a62' }}><AccessTime /></Avatar>
              <ListItemText primary={<Typography sx={{ fontWeight: 800 }}>{item.title}</Typography>} secondary={<Typography sx={{ color: '#64748b' }}>{item.meta} · {item.time}</Typography>} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
}
