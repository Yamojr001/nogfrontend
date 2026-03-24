'use client';
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Divider,
  CircularProgress, Alert, Paper, IconButton,
  List, ListItem, ListItemText, Avatar, Chip,
  Button, Badge
} from '@mui/material';
import {
  Notifications as NotificationIcon,
  DoneAll as ReadIcon,
  Info as InfoIcon,
  Error as AlertIcon,
  CheckCircle as SuccessIcon,
  DeleteOutline as DeleteIcon
} from '@mui/icons-material';
import { fetchMemberNotifications } from '@/lib/api';

export default function MemberNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await fetchMemberNotifications();
      setNotifications(data);
    } catch (err) {
      // Don't show full error for empty notifications
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <CircularProgress sx={{ color: '#059669' }} />
    </Box>
  );

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mb: 10 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b' }}>Notifications</Typography>
          <Typography variant="body2" color="text.secondary">Stay updated with your account activity</Typography>
        </Box>
        {notifications.length > 0 && (
          <Button 
            startIcon={<ReadIcon />} 
            onClick={markAllRead}
            sx={{ textTransform: 'none', fontWeight: 700, color: '#059669' }}
          >
            Mark all read
          </Button>
        )}
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Paper sx={{ borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: 'none', overflow: 'hidden' }}>
        <List disablePadding>
          {notifications.length > 0 ? (
            notifications.map((n, idx) => (
              <React.Fragment key={n.id}>
                <ListItem 
                  sx={{ 
                    py: 3, 
                    px: 3, 
                    bgcolor: n.isRead ? 'transparent' : 'rgba(5, 150, 105, 0.03)',
                    transition: 'background 0.2s',
                    '&:hover': { bgcolor: '#f8fafc' }
                  }}
                  secondaryAction={
                    <IconButton size="small"><DeleteIcon sx={{ fontSize: 20, color: '#cbd5e1' }} /></IconButton>
                  }
                >
                  <Avatar sx={{ 
                    bgcolor: n.type === 'alert' ? '#fef2f2' : n.type === 'success' ? '#f0fdf4' : '#f8fafc',
                    color: n.type === 'alert' ? '#ef4444' : n.type === 'success' ? '#059669' : '#64748b',
                    mr: 2.5
                  }}>
                    {n.type === 'alert' ? <AlertIcon /> : n.type === 'success' ? <SuccessIcon /> : <InfoIcon />}
                  </Avatar>
                  <ListItemText 
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {n.title}
                        {!n.isRead && <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#059669' }} />}
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" sx={{ color: '#475569', mt: 0.5, lineHeight: 1.5 }}>{n.message}</Typography>
                        <Typography variant="caption" sx={{ color: '#94a3b8', mt: 1, display: 'block', fontWeight: 600 }}>
                          {n.createdAt ? new Date(n.createdAt).toLocaleString() : 'Just now'}
                        </Typography>
                      </Box>
                    }
                    primaryTypographyProps={{ fontWeight: 800, fontSize: '0.95rem', component: 'div' }}
                    secondaryTypographyProps={{ component: 'div' }}
                  />
                </ListItem>
                {idx < notifications.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))
          ) : (
            <Box sx={{ p: 10, textAlign: 'center' }}>
              <Box sx={{ mb: 2 }}>
                <Badge badgeContent={0} color="primary">
                  <NotificationIcon sx={{ fontSize: 60, color: '#e2e8f0' }} />
                </Badge>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#94a3b8' }}>All caught up!</Typography>
              <Typography variant="body2" color="text.secondary">You don't have any new notifications.</Typography>
            </Box>
          )}
        </List>
      </Paper>
    </Box>
  );
}
