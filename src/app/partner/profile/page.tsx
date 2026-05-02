"use client";

import React from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, Avatar, Button, Chip, List, ListItem, ListItemText } from '@mui/material';
import { Business, Email, Phone, Badge, Edit } from '@mui/icons-material';

export default function Page() {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#065f46' }}>Partner Profile</Typography>
          <Typography sx={{ color: '#64748b' }}>Manage portal identity, contacts, and role access.</Typography>
        </Box>
        <Button variant="contained" startIcon={<Edit />} sx={{ bgcolor: '#0f8a62', '&:hover': { bgcolor: '#047857' }, borderRadius: '12px', textTransform: 'none', fontWeight: 700 }}>Edit Profile</Button>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ borderRadius: '24px', border: '1px solid #d1fae5', boxShadow: 'none', textAlign: 'center' }}>
            <CardContent sx={{ p: 3 }}>
              <Avatar sx={{ width: 90, height: 90, mx: 'auto', bgcolor: '#d1fae5', color: '#0f8a62', fontSize: '2rem', fontWeight: 900 }}>P</Avatar>
              <Typography variant="h6" sx={{ mt: 2, fontWeight: 900, color: '#1e293b' }}>Federal Cooperative Partner</Typography>
              <Chip label="Partner Admin" sx={{ mt: 1, bgcolor: '#f0fdf4', color: '#166534', fontWeight: 800 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3, borderRadius: '24px', border: '1px solid #d1fae5', boxShadow: 'none' }}>
            <Typography sx={{ fontWeight: 800, color: '#065f46', mb: 2 }}>Organization Details</Typography>
            <List disablePadding>
              {[
                { icon: <Business />, title: 'Organization', value: 'Federal Cooperative Partner' },
                { icon: <Email />, title: 'Email', value: 'partner@nogalss.org' },
                { icon: <Phone />, title: 'Phone', value: '+234 801 234 5678' },
                { icon: <Badge />, title: 'Role', value: 'Partner Admin' },
              ].map((item) => (
                <ListItem key={item.title} sx={{ px: 0, py: 1.5, borderBottom: '1px solid #f1f5f9', '&:last-child': { borderBottom: 'none' } }}>
                  <Avatar sx={{ mr: 2, bgcolor: '#d1fae5', color: '#0f8a62' }}>{item.icon}</Avatar>
                  <ListItemText primary={<Typography sx={{ fontWeight: 800, color: '#1e293b' }}>{item.title}</Typography>} secondary={<Typography sx={{ color: '#64748b' }}>{item.value}</Typography>} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
