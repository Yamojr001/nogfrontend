'use client';
import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, Grid, Button, Chip, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  CircularProgress, Card, CardContent, LinearProgress
} from '@mui/material';
import { AccountBalance as LoanIcon, CalendarMonth, RequestQuote, Add as AddIcon } from '@mui/icons-material';
import { fetchMemberLoans, applyLoan } from '@/lib/api';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';

export default function LoansPage() {
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ amount: '', interest: '10', term: '6' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadLoans();
  }, []);

  async function loadLoans() {
    try {
      setLoading(true);
      const data = await fetchMemberLoans();
      setLoans(data);
    } catch (e) {
      console.error("Failed to fetch loans", e);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit() {
    try {
      setSubmitting(true);
      await applyLoan(Number(form.amount), Number(form.interest), Number(form.term));
      setOpen(false);
      setForm({ amount: '', interest: '10', term: '6' });
      loadLoans();
    } catch (e) {
      console.error("Failed to apply for loan", e);
      alert("Failed to submit loan request. Please check your inputs.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
      <CircularProgress sx={{ color: '#004d40' }} />
    </Box>
  );

  const activeLoan = loans.find(l => l.status === 'active' || l.status === 'approved');

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#004d40' }}>My Loans</Typography>
          <Typography sx={{ color: '#64748b' }}>Manage your loan applications and repayment schedules.</Typography>
        </Box>
        <Button 
          variant="contained" 
          onClick={() => setOpen(true)}
          startIcon={<AddIcon />}
          sx={{ bgcolor: '#004d40', borderRadius: '12px', textTransform: 'none', fontWeight: 700, px: 3 }}
        >
          New Loan Request
        </Button>
      </Box>

      {/* New Loan Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: '24px' } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Apply for a Loan</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
            <TextField
              label="Loan Amount (NGN)"
              fullWidth
              type="number"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            />
            <TextField
              label="Interest Rate (%)"
              fullWidth
              type="number"
              value={form.interest}
              disabled
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            />
            <TextField
              label="Duration (Months)"
              fullWidth
              type="number"
              value={form.term}
              onChange={(e) => setForm({ ...form, term: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpen(false)} sx={{ fontWeight: 700, color: '#64748b' }}>Cancel</Button>
          <Button 
            variant="contained" 
            disabled={submitting || !form.amount}
            onClick={handleSubmit}
            sx={{ bgcolor: '#004d40', borderRadius: '10px', px: 4, fontWeight: 700 }}
          >
            {submitting ? 'Submitting...' : 'Submit Choice'}
          </Button>
        </DialogActions>
      </Dialog>

      {activeLoan ? (
        <Grid container spacing={3} sx={{ mb: 5 }}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper sx={{ p: 4, borderRadius: '24px', position: 'relative', overflow: 'hidden', border: '1px solid #eef2f6' }}>
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>Active Loan Overview</Typography>
                <Typography variant="body2" sx={{ color: '#64748b', mb: 4 }}>ID: LOAN-{activeLoan.id} | Issued: {new Date(activeLoan.createdAt).toLocaleDateString()}</Typography>
                
                <Grid container spacing={4}>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700 }}>REMAINING BALANCE</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: '#004d40' }}>₦{Number(activeLoan.amount).toLocaleString()}</Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700 }}>INTEREST RATE</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 900 }}>{activeLoan.interestRate}%</Typography>
                  </Grid>
                </Grid>

                <Box sx={{ mt: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="caption" sx={{ fontWeight: 700 }}>REPAYMENT PROGRESS</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 700 }}>0% completed</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={0} sx={{ height: 10, borderRadius: 5, bgcolor: '#f1f5f9', '& .MuiLinearProgress-bar': { bgcolor: '#004d40' } }} />
                </Box>
              </Box>
              <LoanIcon sx={{ position: 'absolute', right: -20, bottom: -20, fontSize: 180, opacity: 0.03, transform: 'rotate(-15deg)' }} />
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 4, borderRadius: '24px', height: '100%', bgcolor: '#f8fafc', border: '1px solid #eef2f6' }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>Next Repayment</Typography>
              <Box sx={{ p: 3, borderRadius: '16px', bgcolor: 'white', mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 900, color: '#004d40', mb: 1 }}>₦{(activeLoan.amount / activeLoan.duration).toLocaleString()}</Typography>
                <Typography variant="body2" sx={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarMonth sx={{ fontSize: 16 }} /> Due in 15 days
                </Typography>
              </Box>
              <Button variant="contained" fullWidth sx={{ bgcolor: '#004d40', borderRadius: '12px', py: 1.5, textTransform: 'none', fontWeight: 700 }}>
                Pay Now
              </Button>
            </Paper>
          </Grid>
        </Grid>
      ) : (
        <Paper sx={{ p: 8, textAlign: 'center', borderRadius: '24px', border: '1px dashed #cbd5e1', mb: 5 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#64748b' }}>No Active Loans</Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8', mt: 1 }}>Apply for a loan to see your repayment schedule here.</Typography>
        </Paper>
      )}

      <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>Loan History</Typography>
      <TableContainer component={Paper} sx={{ borderRadius: '24px', border: '1px solid #eef2f6', boxShadow: 'none' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Request ID</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Principal</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Duration</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loans.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 8, color: '#94a3b8' }}>No loan history found.</TableCell>
              </TableRow>
            )}
            {loans.map((loan) => (
              <TableRow key={loan.id}>
                <TableCell sx={{ fontWeight: 600 }}>LOAN-{loan.id}</TableCell>
                <TableCell>{new Date(loan.createdAt).toLocaleDateString()}</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>₦{Number(loan.amount).toLocaleString()}</TableCell>
                <TableCell>{loan.duration} Months</TableCell>
                <TableCell>
                  <Chip 
                    label={loan.status} 
                    size="small" 
                    sx={{ 
                      bgcolor: loan.status === 'active' || loan.status === 'approved' ? '#f0fdf4' : (loan.status === 'pending' ? '#fefce8' : '#fef2f2'), 
                      color: loan.status === 'active' || loan.status === 'approved' ? '#166534' : (loan.status === 'pending' ? '#854d0e' : '#991b1b'),
                      fontWeight: 700,
                      textTransform: 'capitalize'
                    }} 
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
