'use client';
import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, Grid, Button, TextField, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, CircularProgress, Dialog, DialogTitle, DialogContent, 
  DialogActions, MenuItem, Stack, Divider
} from '@mui/material';
import { 
  SupportAgent as SupportIcon, 
  Add as AddIcon,
  Message as MessageIcon
} from '@mui/icons-material';
import { fetchMemberTickets, createSupportTicket } from '@/lib/api';

export default function SupportPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({ subject: '', category: 'technical', description: '', priority: 'medium' });

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const data = await fetchMemberTickets();
      setTickets(data);
    } catch (e) {
      console.error("Failed to fetch tickets", e);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async () => {
    try {
      await createSupportTicket(newTicket);
      setOpen(false);
      load();
    } catch (e) {
      console.error("Failed to create ticket", e);
    }
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
      <CircularProgress sx={{ color: '#004d40' }} />
    </Box>
  );

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#004d40' }}>Support & Help Center</Typography>
          <Typography sx={{ color: '#64748b' }}>Need help? Submit a ticket and track its progress.</Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
          sx={{ bgcolor: '#004d40', borderRadius: '12px', textTransform: 'none', fontWeight: 700, px: 3 }}
        >
          New Ticket
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 4, borderRadius: '24px', border: '1px solid #eef2f6', textAlign: 'center' }}>
            <Box sx={{ width: 60, height: 60, borderRadius: '16px', bgcolor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
              <SupportIcon sx={{ color: '#004d40' }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>Assigned Agent</Typography>
            <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>A support officer will be assigned shortly after you create a ticket.</Typography>
            <Divider sx={{ mb: 3 }} />
            <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700 }}>AVG RESPONSE TIME</Typography>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>24 Hours</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <MessageIcon /> My Tickets
          </Typography>
          <TableContainer component={Paper} sx={{ borderRadius: '24px', border: '1px solid #eef2f6', boxShadow: 'none' }}>
            <Table>
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Ticket ID</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Subject</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Last Updated</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tickets.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 6, color: '#94a3b8' }}>No support tickets found.</TableCell>
                  </TableRow>
                )}
                {tickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell sx={{ fontWeight: 600 }}>#TK-{ticket.id}</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>{ticket.subject}</TableCell>
                    <TableCell sx={{ textTransform: 'capitalize' }}>{ticket.category}</TableCell>
                    <TableCell>
                      <Chip 
                        label={ticket.status} 
                        size="small" 
                        sx={{ 
                          bgcolor: ticket.status === 'open' ? '#f0fdf4' : '#f1f5f9', 
                          color: ticket.status === 'open' ? '#166534' : '#64748b',
                          fontWeight: 700,
                          textTransform: 'capitalize'
                        }} 
                      />
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.85rem' }}>{new Date(ticket.updatedAt || ticket.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      {/* New Ticket Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} PaperProps={{ sx: { borderRadius: '24px', p: 2 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Create New Support Ticket</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2, minWidth: 400 }}>
            <TextField 
              label="Subject" 
              fullWidth 
              value={newTicket.subject}
              onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
            />
            <TextField 
              select 
              label="Category" 
              fullWidth
              value={newTicket.category}
              onChange={(e) => setNewTicket({...newTicket, category: e.target.value})}
            >
              <MenuItem value="technical">Technical Support</MenuItem>
              <MenuItem value="finance">Financial Issue</MenuItem>
              <MenuItem value="loan">Loan Inquiry</MenuItem>
              <MenuItem value="account">Account Access</MenuItem>
            </TextField>
            <TextField 
              label="Description" 
              multiline 
              rows={4} 
              fullWidth
              value={newTicket.description}
              onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpen(false)} sx={{ color: '#64748b', fontWeight: 700 }}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" sx={{ bgcolor: '#004d40', borderRadius: '10px' }}>Submit Ticket</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
