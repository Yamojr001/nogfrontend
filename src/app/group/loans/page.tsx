'use client';
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Button, Avatar, Dialog, DialogTitle, DialogContent, TextField,
  MenuItem, CircularProgress, Chip, LinearProgress
} from '@mui/material';
import { RequestQuote, Timer, CheckCircle, Cancel, AddCircle } from '@mui/icons-material';
import { fetchGroupLoans } from '@/lib/api';

export default function GroupLoansPage() {
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRequestOpen, setIsRequestOpen] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchGroupLoans(1); // Demo Group ID
        setLoans(data || []);
      } catch (error) {
        console.error("Failed to load loans", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

  return (
    <Box sx={{ p: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, px: 1 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b' }}>Loan Requests</Typography>
          <Typography sx={{ color: '#64748b', fontSize: '0.8rem' }}>Manage group support requests</Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AddCircle />} 
          onClick={() => setIsRequestOpen(true)}
          sx={{ bgcolor: '#f59e0b', '&:hover': { bgcolor: '#d97706' }, textTransform: 'none', fontWeight: 700, borderRadius: '12px' }}
        >
          New
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {loans.map((loan) => (
          <Card key={loan.id} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: 'none', p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar sx={{ bgcolor: '#f1f5f9', color: '#f59e0b' }}><RequestQuote /></Avatar>
                <Box>
                  <Typography sx={{ fontWeight: 800, color: '#1e293b', fontSize: '0.9rem' }}>{loan.member?.user?.name || 'Unknown Member'}</Typography>
                  <Typography sx={{ fontSize: '0.7rem', color: '#64748b' }}>Loan ID: LN-{String(loan.id).padStart(4, '0')}</Typography>
                </Box>
              </Box>
              <Chip 
                label={loan.status.toUpperCase()} 
                size="small" 
                color={loan.status === 'active' ? 'success' : 'warning'}
                sx={{ fontWeight: 800, fontSize: '0.65rem', height: 22 }} 
              />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 1 }}>
              <Typography sx={{ fontSize: '0.75rem', color: '#64748b' }}>Amount</Typography>
              <Typography sx={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e293b' }}>₦{Number(loan.amount).toLocaleString()}</Typography>
            </Box>

            <Box sx={{ bgcolor: '#f8fafc', borderRadius: '12px', p: 1.5, mb: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography sx={{ fontSize: '0.7rem', color: '#64748b' }}>Approval Progress</Typography>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#1e293b' }}>60%</Typography>
              </Box>
              <LinearProgress variant="determinate" value={60} sx={{ height: 6, borderRadius: 3, bgcolor: '#e2e8f0', '& .MuiLinearProgress-bar': { bgcolor: '#f59e0b' } }} />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ fontSize: '0.7rem', color: '#94a3b8' }}>Created: {new Date(loan.createdAt).toLocaleDateString()}</Typography>
              <Button size="small" sx={{ textTransform: 'none', fontWeight: 700, p: 0, fontSize: '0.75rem' }}>View Details</Button>
            </Box>
          </Card>
        ))}
      </Box>

      <Dialog open={isRequestOpen} onClose={() => setIsRequestOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 800 }}>Initiate Loan Request</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField select fullWidth label="Select Member" size="small">
               <MenuItem value="1">John Member Doe</MenuItem>
            </TextField>
            <TextField fullWidth label="Requested Amount (₦)" type="number" size="small" />
            <TextField fullWidth label="Reason for Loan" multiline rows={2} size="small" />
            <Typography sx={{ fontSize: '0.7rem', color: '#64748b', bgcolor: '#fffbeb', p: 1, borderRadius: '8px', border: '1px solid #fef3c7' }}>
              Note: This request will be submitted to the Sub-Org Admin for review and approval after validation.
            </Typography>
          </Box>
          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button fullWidth onClick={() => setIsRequestOpen(false)} sx={{ textTransform: 'none', fontWeight: 700, color: '#64748b' }}>Cancel</Button>
            <Button fullWidth variant="contained" onClick={() => setIsRequestOpen(false)} sx={{ bgcolor: '#f59e0b', textTransform: 'none', fontWeight: 700 }}>Submit Request</Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
