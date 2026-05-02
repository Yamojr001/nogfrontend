"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, Chip, Button, List, ListItem, ListItemText, CircularProgress } from '@mui/material';
import { RequestQuote, Add, CheckCircle, PendingActions, FilterAlt } from '@mui/icons-material';
import { fetchAllLoans, fetchUserProfile } from '@/lib/api';

type LoanItem = {
  id: number;
  ref: string;
  member: string;
  amount: number;
  status: string;
  stage: string;
  date: string;
};

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [loans, setLoans] = useState<LoanItem[]>([]);
  const [branchName, setBranchName] = useState('Sub-Organisation');

  useEffect(() => {
    async function load() {
      try {
        const [profile, allLoans] = await Promise.all([fetchUserProfile(), fetchAllLoans()]);
        const branchId = profile?.branchId ?? profile?.memberProfile?.branchId ?? null;
        setBranchName(profile?.organisation?.name || profile?.memberProfile?.organisation?.name || profile?.organisationName || 'Sub-Organisation');

        const list = Array.isArray(allLoans) ? allLoans : (allLoans?.data || allLoans?.items || []);
        const normalized = list
          .filter((loan: any) => {
            if (!branchId) return true;
            return Number(loan?.member?.branchId ?? loan?.member?.branch?.id ?? loan?.branchId ?? 0) === Number(branchId);
          })
          .map((loan: any) => ({
            id: Number(loan.id),
            ref: `LN-${String(loan.id).padStart(4, '0')}`,
            member: loan?.member?.user?.name || loan?.member?.user?.firstName || loan?.member?.name || `Member #${loan?.memberId || loan?.member?.id || loan.id}`,
            amount: Number(loan?.amount || 0),
            status: String(loan?.status || 'pending').toLowerCase(),
            stage: loan?.approval?.currentLevel && loan?.approval?.totalLevels
              ? `Step ${loan.approval.currentLevel} of ${loan.approval.totalLevels}`
              : String(loan?.status || 'pending'),
            date: loan?.createdAt ? new Date(loan.createdAt).toLocaleDateString('en-NG', { day: '2-digit', month: 'short', year: 'numeric' }) : '—',
          }))
          .sort((a: LoanItem, b: LoanItem) => b.id - a.id);

        setLoans(normalized);
      } catch (error) {
        console.error('Failed to load sub-org loans', error);
        setLoans([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const metrics = useMemo(() => {
    const pending = loans.filter((l) => l.status === 'pending').length;
    const approved = loans.filter((l) => ['approved', 'active', 'completed'].includes(l.status)).length;
    const portfolio = loans.filter((l) => l.status !== 'rejected').reduce((sum, l) => sum + l.amount, 0);
    return [
      { label: 'Pending', value: pending, icon: <PendingActions />, color: '#f59e0b' },
      { label: 'Approved', value: approved, icon: <CheckCircle />, color: '#10b981' },
      { label: 'Portfolio', value: `₦${portfolio.toLocaleString()}`, icon: <FilterAlt />, color: '#7c3aed' },
    ];
  }, [loans]);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', mb: 3, gap: 2, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#065f46' }}>Loans</Typography>
          <Typography sx={{ color: '#64748b' }}>View and initiate sub-organisation loan requests.</Typography>
          <Typography sx={{ color: '#94a3b8', fontSize: '0.85rem', mt: 0.5 }}>Connected to {branchName}</Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} sx={{ bgcolor: '#0f8a62', '&:hover': { bgcolor: '#047857' }, borderRadius: '12px', textTransform: 'none', fontWeight: 700 }}>Request Loan</Button>
      </Box>

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {metrics.map((item) => (
          <Grid key={item.label} size={{ xs: 12, md: 4 }}>
            <Card sx={{ borderRadius: '24px', border: '1px solid #d1fae5', boxShadow: 'none' }}>
              <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography sx={{ color: '#64748b', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase' }}>{item.label}</Typography>
                  <Typography sx={{ fontWeight: 900, color: '#065f46', fontSize: '1.8rem' }}>{item.value}</Typography>
                </Box>
                <Box sx={{ bgcolor: `${item.color}15`, color: item.color, borderRadius: '14px', p: 1.2 }}>{item.icon}</Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ p: 3, borderRadius: '24px', border: '1px solid #d1fae5' }}>
        <Typography sx={{ fontWeight: 800, color: '#065f46', mb: 2 }}>Loan Pipeline</Typography>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress sx={{ color: '#0f8a62' }} /></Box>
        ) : loans.length === 0 ? (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <RequestQuote sx={{ fontSize: 44, color: '#cbd5e1', mb: 1 }} />
            <Typography sx={{ fontWeight: 800, color: '#1e293b' }}>No loan records yet</Typography>
            <Typography sx={{ color: '#64748b', mt: 1 }}>Loan applications will appear here once members submit requests.</Typography>
          </Box>
        ) : (
          <List disablePadding>
            {loans.map((item) => (
              <ListItem
                key={item.id}
                sx={{ px: 0, borderBottom: '1px solid #f1f5f9', '&:last-child': { borderBottom: 'none' } }}
                secondaryAction={
                  <Chip
                    size="small"
                    label={item.status}
                    sx={{
                      bgcolor: item.status === 'approved' || item.status === 'active' || item.status === 'completed' ? '#dcfce7' : item.status === 'rejected' ? '#fee2e2' : '#fef3c7',
                      color: item.status === 'approved' || item.status === 'active' || item.status === 'completed' ? '#166534' : item.status === 'rejected' ? '#991b1b' : '#92400e',
                      fontWeight: 800,
                    }}
                  />
                }
              >
                <RequestQuote sx={{ color: '#0f8a62', mr: 2 }} />
                <ListItemText
                  primary={<Typography sx={{ fontWeight: 800 }}>{item.member}</Typography>}
                  secondary={<Typography sx={{ color: '#64748b' }}>₦{item.amount.toLocaleString()} · {item.stage} · {item.ref} · {item.date}</Typography>}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
}
