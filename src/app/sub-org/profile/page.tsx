"use client";

import React from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, Avatar, List, ListItem, ListItemText, Chip } from '@mui/material';
import { Business, Email, Groups, Badge } from '@mui/icons-material';

export default function Page() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 900, color: '#065f46', mb: 0.5 }}>Sub-Org Profile</Typography>
      <Typography sx={{ color: '#64748b', mb: 3 }}>Profile, governance, and hierarchy details for the sub-organisation.</Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ borderRadius: '24px', border: '1px solid #d1fae5', boxShadow: 'none', textAlign: 'center' }}>
            <CardContent sx={{ p: 3 }}>
              <Avatar sx={{ width: 88, height: 88, mx: 'auto', bgcolor: '#d1fae5', color: '#0f8a62', fontWeight: 900, fontSize: '2rem' }}>S</Avatar>
              <Typography variant="h6" sx={{ mt: 2, fontWeight: 900 }}>Lagos Central Sub-Org</Typography>
              <Chip label="Sub-Org Admin" sx={{ mt: 1, bgcolor: '#f0fdf4', color: '#166534', fontWeight: 800 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3, borderRadius: '24px', border: '1px solid #d1fae5' }}>
            <List disablePadding>
              {[
                { icon: <Business />, title: 'Organization Code', value: 'SO-1024' },
                { icon: <Email />, title: 'Contact Email', value: 'lagos.central@nogalss.org' },
                { icon: <Groups />, title: 'Groups', value: '12 active groups' },
                { icon: <Badge />, title: 'Members', value: '248 verified members' },
              ].map((item) => (
                <ListItem key={item.title} sx={{ px: 0, py: 1.5, borderBottom: '1px solid #f1f5f9', '&:last-child': { borderBottom: 'none' } }}>
                  <Avatar sx={{ mr: 2, bgcolor: '#d1fae5', color: '#0f8a62' }}>{item.icon}</Avatar>
                  <ListItemText primary={<Typography sx={{ fontWeight: 800 }}>{item.title}</Typography>} secondary={item.value} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
