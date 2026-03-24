'use client';
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Button,
  Divider, CircularProgress, Alert, Paper, IconButton,
  List, ListItem, ListItemText, Avatar, Chip, LinearProgress,
  Modal, TextField, InputAdornment, Skeleton
} from '@mui/material';
import {
  AccountBalance as LoanIcon,
  History as HistoryIcon,
  Add as NewLoanIcon,
  Schedule as RepaymentIcon,
  CheckCircle as SuccessIcon,
  Timeline as ProgressIcon,
  Info as InfoIcon,
  Payments as PayIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchMemberLoans } from '@/lib/api';

export default function MemberLoans() {
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [payModal, setPayModal] = useState<any>(null);

  useEffect(() => {
    loadLoans();
  }, []);

  const loadLoans = async () => {
    try {
      const data = await fetchMemberLoans();
      setLoans(data);
    } catch (err) {
      setError('Failed to load your loan information');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalDue = (loan: any) => {
    const principal = parseFloat(loan.amount) || 0;
    const interest = principal * ((parseFloat(loan.interestRate) || 5) / 100);
    return principal + interest;
  };

  const calculateProgress = (loan: any) => {
    if (!loan.repaymentSchedule) return 0;
    const total = loan.repaymentSchedule.length;
    const paid = loan.repaymentSchedule.filter((s: any) => s.status === 'paid').length;
    return (paid / total) * 100;
  };

  if (loading) return (
    <Box sx={{ p: 4 }}>
      <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 6, mb: 4 }} />
      <Grid container spacing={3}>
        {[1, 2].map(i => (
          <Grid size={{ xs: 12, md: 6 }} key={i}>
            <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 6 }} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', mb: 10 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b' }}>Loan Management</Typography>
          <Typography variant="body2" color="text.secondary">Review your active credit and repayment plans</Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<NewLoanIcon />}
          sx={{ bgcolor: '#0f172a', '&:hover': { bgcolor: '#1e293b' }, borderRadius: '14px', px: 3, py: 1.2, textTransform: 'none', fontWeight: 700 }}
        >
          New Loan Request
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '16px' }}>{error}</Alert>}

      {loans.length > 0 ? (
        <Grid container spacing={3}>
          {loans.map((loan) => (
            <Grid size={{ xs: 12 }} key={loan.id}>
              <Card sx={{ borderRadius: '28px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
                <Box sx={{ p: 3, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: loan.status === 'active' ? '#059669' : '#f59e0b', color: 'white' }}>
                      <LoanIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        ID: LN-{loan.id.toString().padStart(4, '0')}
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 900, color: '#0f172a' }}>
                        ₦{parseFloat(loan.amount).toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                  <Chip 
                    label={loan.status.toUpperCase()} 
                    color={loan.status === 'active' ? 'success' : 'warning'} 
                    sx={{ fontWeight: 800, px: 1, borderRadius: '8px', height: 28 }} 
                  />
                </Box>
                <CardContent sx={{ p: 4 }}>
                  <Grid container spacing={4}>
                    <Grid size={{ xs: 12, md: 5 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2, color: '#64748b', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ProgressIcon sx={{ fontSize: 18 }} /> Loan Progress
                      </Typography>
                      <Box sx={{ mb: 4 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                          <Typography sx={{ fontWeight: 700, fontSize: '0.9rem' }}>Repayment Completeness</Typography>
                          <Typography sx={{ fontWeight: 900, color: '#059669' }}>{Math.round(calculateProgress(loan))}%</Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={calculateProgress(loan)} 
                          sx={{ height: 10, borderRadius: 5, bgcolor: '#f1f5f9', '& .MuiLinearProgress-bar': { bgcolor: '#059669', borderRadius: 5 } }} 
                        />
                      </Box>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Box sx={{ flex: 1, p: 2, bgcolor: '#f8fafc', borderRadius: '16px' }}>
                          <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>Interest Rate</Typography>
                          <Typography sx={{ fontWeight: 800, color: '#0f172a' }}>{loan.interestRate || '5'}%</Typography>
                        </Box>
                        <Box sx={{ flex: 1, p: 2, bgcolor: '#f8fafc', borderRadius: '16px' }}>
                          <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>Total Repayment</Typography>
                          <Typography sx={{ fontWeight: 800, color: '#0f172a' }}>₦{calculateTotalDue(loan).toLocaleString()}</Typography>
                        </Box>
                      </Box>
                    </Grid>

                    <Grid size={{ xs: 12, md: 7 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2, color: '#64748b', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <RepaymentIcon sx={{ fontSize: 18 }} /> Upcoming Repayments
                      </Typography>
                      <List disablePadding>
                        {(loan.repaymentSchedule || []).filter((s: any) => s.status === 'pending').slice(0, 3).map((item: any, idx: number) => (
                          <React.Fragment key={item.id}>
                            <ListItem sx={{ px: 0, py: 1.5 }}>
                              <ListItemText 
                                primary={`Installment #${item.installmentNumber}`} 
                                secondary={new Date(item.dueDate).toLocaleDateString()} 
                                primaryTypographyProps={{ fontSize: '0.95rem', fontWeight: 700 }}
                              />
                              <Box sx={{ textAlign: 'right', mr: 2 }}>
                                <Typography sx={{ fontWeight: 900, color: '#0f172a' }}>₦{parseFloat(item.totalDue).toLocaleString()}</Typography>
                                <Typography variant="caption" sx={{ color: '#f59e0b', fontWeight: 700, textTransform: 'uppercase' }}>Due Soon</Typography>
                              </Box>
                              <Button 
                                variant="outlined" 
                                size="small"
                                onClick={() => setPayModal({ loan, installment: item })}
                                sx={{ borderRadius: '10px', borderColor: '#e2e8f0', color: '#059669', fontWeight: 700, textTransform: 'none' }}
                              >
                                Pay Now
                              </Button>
                            </ListItem>
                            {idx < 2 && idx < (loan.repaymentSchedule?.length || 0) - 1 && <Divider component="li" />}
                          </React.Fragment>
                        ))}
                      </List>
                      {(!loan.repaymentSchedule || loan.repaymentSchedule.filter((s:any)=>s.status==='pending').length === 0) && (
                        <Box sx={{ py: 4, textAlign: 'center', bgcolor: '#f0fdf4', borderRadius: '16px' }}>
                          <SuccessIcon sx={{ color: '#059669', mb: 1 }} />
                          <Typography variant="body2" sx={{ fontWeight: 700, color: '#065f46' }}>All payments completed for this loan!</Typography>
                        </Box>
                      )}
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ p: 10, textAlign: 'center', bgcolor: 'white', borderRadius: '32px', border: '2px dashed #e2e8f0' }}>
          <Box sx={{ position: 'relative', display: 'inline-block', mb: 3 }}>
            <LoanIcon sx={{ fontSize: 80, color: '#f1f5f9' }} />
            <InfoIcon sx={{ position: 'absolute', bottom: 0, right: 0, color: '#cbd5e1', bgcolor: 'white', borderRadius: '50%' }} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#334155', mb: 1 }}>No Active Credit</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto', mb: 4 }}>
            You haven't requested any loans yet. Members with a 3-month contribution history are eligible for up to ₦500,000.
          </Typography>
          <Button variant="contained" sx={{ bgcolor: '#059669', '&:hover': { bgcolor: '#047857' }, borderRadius: '14px', px: 5, py: 1.5, fontWeight: 700, textTransform: 'none' }}>
            Get Started
          </Button>
        </Box>
      )}

      {/* Repayment Modal */}
      <Modal open={!!payModal} onClose={() => setPayModal(null)}>
        <Box sx={{ 
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 400 }, bgcolor: 'white', borderRadius: '28px', boxShadow: 24, p: 4
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>Repay Loan</Typography>
            <IconButton onClick={() => setPayModal(null)}><CloseIcon /></IconButton>
          </Box>
          
          <Box sx={{ p: 3, bgcolor: '#f8fafc', borderRadius: '20px', mb: 3, textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Amount to Pay</Typography>
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#059669', mt: 1 }}>
              ₦{parseFloat(payModal?.installment?.totalDue || 0).toLocaleString()}
            </Typography>
          </Box>

          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>Payment Method</Typography>
          <Paper sx={{ p: 2, borderRadius: '16px', border: '2px solid #059669', display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <PayIcon sx={{ color: '#059669' }} />
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: '0.9rem' }}>NOGALSS Wallet</Typography>
              <Typography variant="caption" color="text.secondary">Balance: ₦45,000</Typography>
            </Box>
          </Paper>

          <Button fullWidth variant="contained" sx={{ bgcolor: '#0f172a', py: 2, borderRadius: '16px', fontWeight: 800, textTransform: 'none' }}>
            Confirm Payment
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}
