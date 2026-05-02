"use client";

import React from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, Chip, Button, List, ListItem, ListItemText } from '@mui/material';
import { Groups, Add, ArrowForward } from '@mui/icons-material';

export default function Page() {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#065f46' }}>Groups</Typography>
          <Typography sx={{ color: '#64748b' }}>Manage grassroots groups under the sub-organisation.</Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} sx={{ bgcolor: '#0f8a62', '&:hover': { bgcolor: '#047857' }, borderRadius: '12px', textTransform: 'none', fontWeight: 700 }}>Create Group</Button>
      </Box>
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {[{ label: 'Total Groups', value: '18' }, { label: 'Active Members', value: '246' }, { label: 'Open Requests', value: '7' }].map((item) => (
          <Grid key={item.label} size={{ xs: 12, md: 4 }}>
            <Card sx={{ borderRadius: '24px', border: '1px solid #d1fae5', boxShadow: 'none' }}><CardContent><Typography sx={{ color: '#64748b', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase' }}>{item.label}</Typography><Typography sx={{ fontWeight: 900, color: '#065f46', fontSize: '1.8rem' }}>{item.value}</Typography></CardContent></Card>
          </Grid>
        ))}
      </Grid>
      <Paper sx={{ p: 3, borderRadius: '24px', border: '1px solid #d1fae5' }}>
        <Typography sx={{ fontWeight: 800, color: '#065f46', mb: 2 }}>Group List</Typography>
        <List disablePadding>
          {[
            { title: 'Lagos Central', meta: 'Members: 42 · Leader: Chinedu', status: 'active' },
            { title: 'Abuja Women Wing', meta: 'Members: 28 · Leader: Aisha', status: 'active' },
          ].map((item) => (
            <ListItem key={item.title} sx={{ px: 0, borderBottom: '1px solid #f1f5f9', '&:last-child': { borderBottom: 'none' } }} secondaryAction={<Button endIcon={<ArrowForward />} size="small" sx={{ textTransform: 'none', color: '#0f8a62', fontWeight: 800 }}>Open</Button>}>
              <Groups sx={{ color: '#0f8a62', mr: 2 }} />
              <ListItemText primary={<Typography sx={{ fontWeight: 800 }}>{item.title}</Typography>} secondary={item.meta} />
              <Chip size="small" label={item.status} sx={{ ml: 2, bgcolor: '#dcfce7', color: '#166534', fontWeight: 800 }} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
}
