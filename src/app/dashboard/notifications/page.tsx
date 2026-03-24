'use client';
import React from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@mui/material';
import { Notifications as NotifIcon, Warning as WarnIcon, Info as InfoIcon } from '@mui/icons-material';

export default function NotificationsPage() {
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 900, color: '#004d40' }}>System Notifications</Typography>
        <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>Manage platform alerts, system updates, and broadcast messages.</Typography>
      </Box>

      <Paper sx={{ borderRadius: '24px', p: 2, border: '1px solid #eef2f6' }}>
        <List>
          {[
            { title: 'System Maintenance', desc: 'Platform update scheduled for Saturday 2PM.', type: 'warn' },
            { title: 'New Partner Registered', desc: 'Lagos State Cooperative has joined.', type: 'info' }
          ].map((n, i) => (
            <ListItem key={i} sx={{ borderBottom: '1px solid #f1f5f9' }}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: n.type === 'warn' ? '#fff7ed' : '#f0f9ff' }}>
                  {n.type === 'warn' ? <WarnIcon sx={{ color: '#f97316' }} /> : <InfoIcon sx={{ color: '#0ea5e9' }} />}
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={n.title} secondary={n.desc} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
}
