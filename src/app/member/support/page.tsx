'use client';
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, List, ListItem, 
  ListItemText, TextField, Button, Dialog, DialogTitle, 
  DialogContent, DialogActions, MenuItem, Chip,
  Avatar, Divider, Skeleton, IconButton
} from '@mui/material';
import {
  SupportAgent as SupportIcon,
  Add as AddIcon,
  Help as HelpIcon,
  Chat as ChatIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { fetchMemberTickets, createSupportTicket } from '@/lib/api';

export default function MemberSupport() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({ subject: '', category: 'finance', description: '', priority: 'medium' });

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      const data = await fetchMemberTickets();
      setTickets(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async () => {
    try {
      await createSupportTicket(newTicket);
      setOpen(false);
      setNewTicket({ subject: '', category: 'finance', description: '', priority: 'medium' });
      loadTickets();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <Box sx={{ p: 4 }}><Skeleton variant="rectangular" height={400} /></Box>;

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mb: 10 }}>
      {/* Help Banner */}
      <Card sx={{ 
        borderRadius: '24px', 
        bgcolor: '#f8fafc', 
        border: '1px solid #e2e8f0', 
        mb: 4,
        boxShadow: 'none'
      }}>
        <CardContent sx={{ p: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
          <Avatar sx={{ width: 60, height: 60, bgcolor: '#0f172a' }}><HelpIcon /></Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>Need Help?</Typography>
            <Typography variant="body2" color="text.secondary">Contact our support team or browse FAQs.</Typography>
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 800, ml: 1 }}>My Support Tickets</Typography>
        <Button 
          startIcon={<AddIcon />} 
          variant="outlined" 
          onClick={() => setOpen(true)}
          sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700, borderColor: '#059669', color: '#059669' }}
        >
          New Ticket
        </Button>
      </Box>

      <Card sx={{ borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: 'none' }}>
        <List disablePadding>
          {tickets.length > 0 ? (
            tickets.map((ticket, idx) => (
              <React.Fragment key={ticket.id}>
                <ListItem sx={{ py: 2 }}>
                  <Avatar sx={{ bgcolor: '#f1f5f9', color: '#64748b', mr: 2 }}><ChatIcon /></Avatar>
                  <ListItemText 
                    primary={ticket.subject} 
                    secondary={`${ticket.category.toUpperCase()} • ${new Date(ticket.createdAt).toLocaleDateString()}`}
                    primaryTypographyProps={{ fontWeight: 700 }}
                  />
                  <Chip 
                    label={ticket.status.toUpperCase()} 
                    size="small" 
                    color={ticket.status === 'open' ? 'info' : 'success'}
                    sx={{ fontWeight: 700, fontSize: '0.7rem' }}
                  />
                </ListItem>
                {idx < tickets.length - 1 && <Divider component="li" sx={{ mx: 2 }} />}
              </React.Fragment>
            ))
          ) : (
            <Box sx={{ p: 6, textAlign: 'center' }}>
              <SupportIcon sx={{ color: '#cbd5e1', fontSize: 48, mb: 1 }} />
              <Typography variant="body2" color="text.secondary">No active support tickets.</Typography>
            </Box>
          )}
        </List>
      </Card>

      {/* New Ticket Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: '20px' } }}>
        <DialogTitle sx={{ fontWeight: 800, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Create New Ticket
          <IconButton onClick={() => setOpen(false)}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          <TextField
            fullWidth
            label="Subject"
            variant="outlined"
            margin="normal"
            value={newTicket.subject}
            onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
          />
          <TextField
            select
            fullWidth
            label="Category"
            variant="outlined"
            margin="normal"
            value={newTicket.category}
            onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
          >
            <MenuItem value="finance">Finance / Savings</MenuItem>
            <MenuItem value="loan">Loan Application</MenuItem>
            <MenuItem value="technical">Technical Issue</MenuItem>
            <MenuItem value="account">Account / KYC</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </TextField>
          <TextField
            fullWidth
            label="How can we help?"
            multiline
            rows={4}
            variant="outlined"
            margin="normal"
            value={newTicket.description}
            onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpen(false)} sx={{ color: '#64748b', fontWeight: 700 }}>Cancel</Button>
          <Button 
            onClick={handleCreateTicket} 
            variant="contained" 
            sx={{ bgcolor: '#059669', borderRadius: '12px', fontWeight: 700, px: 4, '&:hover': { bgcolor: '#047857' } }}
          >
            Submit Ticket
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
