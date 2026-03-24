'use client';
import React, { useState } from 'react';
import {
  Box, Typography, Paper, Grid, Button, Chip, Tab, Tabs,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Avatar, LinearProgress, Dialog, DialogTitle, DialogContent, DialogActions, TextField
} from '@mui/material';
import { HourglassEmpty, CheckCircle, Cancel } from '@mui/icons-material';
import { fetchPartnerApprovals, approveRequest, rejectRequest } from '@/lib/api';

const typeIcon: Record<string, string> = { 'Loan Request': '💰', 'loan': '💰', 'Member Registration': '👤', 'Fund Disbursement': '🏦', 'withdrawal': '💸', 'transfer': '🔄' };
const priorityColor: Record<string, any> = { high: 'error', medium: 'warning', low: 'default' };
const statusColor: Record<string, any> = { pending: 'warning', approved: 'success', rejected: 'error' };

export default function PartnerApprovalsPage() {
  const [tab, setTab] = useState(0);
  const [selected, setSelected] = useState<any>(null);
  const [reason, setReason] = useState('');
  const [approvals, setApprovals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const orgIdStr = localStorage.getItem('organisation_id');
      if (orgIdStr) {
        const data = await fetchPartnerApprovals(Number(orgIdStr));
        const mapped = data.map((a:any) => ({
          dbId: a.id,
          id: `PA-${a.id.toString().padStart(3, '0')}`,
          type: a.requestType || 'Unknown',
          requester: a.initiator?.email || 'System',
          amount: null,
          level: `${a.currentLevel} of ${a.totalLevels}`,
          status: a.status,
          date: new Date(a.createdAt).toISOString().split('T')[0],
          priority: 'medium'
        }));
        setApprovals(mapped);
      }
    } catch (err) {
      console.error("Failed to load partner approvals", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadData();
  }, []);

  const handleConfirm = async () => {
    try {
      if (selected.action === 'approve') {
        await approveRequest(selected.dbId, 1, reason); // mock approverId = 1
      } else {
        await rejectRequest(selected.dbId, 1, reason);
      }
      setSelected(null);
      setReason('');
      await loadData();
    } catch (err) {
      console.error('Failed to process approval', err);
    }
  };

  const filtered = approvals.filter(a => {
    if (tab === 1) return a.status === 'pending';
    if (tab === 2) return a.status === 'approved';
    if (tab === 3) return a.status === 'rejected';
    return true;
  });

  const pending = approvals.filter(a => a.status === 'pending');

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#0c4a6e' }}>Approval Workflow</Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>Multi-level approvals for loans, registrations, and disbursements.</Typography>
        </Box>
        {pending.length > 0 && <Chip label={`${pending.length} Pending`} color="warning" sx={{ fontWeight: 800, borderRadius: '12px', fontSize: '0.9rem', px: 1 }} />}
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { label: 'Total', value: approvals.length, color: '#0369a1' },
          { label: 'Pending', value: pending.length, color: '#f59e0b' },
          { label: 'Approved', value: approvals.filter(a => a.status === 'approved').length, color: '#10b981' },
          { label: 'Rejected', value: approvals.filter(a => a.status === 'rejected').length, color: '#ef4444' },
        ].map(s => (
          <Grid size={{ xs: 6, md: 3 }} key={s.label}>
            <Paper sx={{ p: 3, textAlign: 'center', borderRadius: '20px', border: '1px solid #e0f2fe', boxShadow: 'none' }}>
              <Typography variant="h3" sx={{ fontWeight: 900, color: s.color }}>{s.value}</Typography>
              <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>{s.label}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid #e0f2fe', boxShadow: 'none' }}>
        <Box sx={{ px: 3, pt: 2, borderBottom: '1px solid #e0f2fe' }}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ '& .MuiTab-root': { textTransform: 'none', fontWeight: 700 }, '& .Mui-selected': { color: '#0369a1' }, '& .MuiTabs-indicator': { bgcolor: '#0369a1' } }}>
            <Tab label="All" />
            <Tab label={`Pending (${pending.length})`} />
            <Tab label="Approved" />
            <Tab label="Rejected" />
          </Tabs>
        </Box>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#f0f9ff' }}>
              <TableRow>
                {['ID', 'Type', 'Requester', 'Amount', 'Level', 'Priority', 'Status', 'Date', 'Actions'].map(h => (
                  <TableCell key={h} sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map(a => (
                <TableRow key={a.id} sx={{ '&:hover': { bgcolor: '#f0f9ff' } }}>
                  <TableCell sx={{ fontWeight: 700, color: '#0369a1', fontFamily: 'monospace', fontSize: '0.82rem' }}>{a.id}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Typography sx={{ fontSize: '1.2rem' }}>{typeIcon[a.type] || '📋'}</Typography>
                      <Typography sx={{ fontWeight: 600, fontSize: '0.88rem' }}>{a.type}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.88rem' }}>{a.requester}</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>{a.amount ? `₦${a.amount.toLocaleString()}` : '—'}</TableCell>
                  <TableCell sx={{ color: '#64748b', fontSize: '0.85rem' }}>{a.level}</TableCell>
                  <TableCell><Chip label={a.priority} color={priorityColor[a.priority]} size="small" sx={{ borderRadius: '8px', textTransform: 'capitalize', fontWeight: 700 }} /></TableCell>
                  <TableCell><Chip label={a.status} color={statusColor[a.status]} size="small" sx={{ borderRadius: '8px', textTransform: 'capitalize', fontWeight: 700 }} /></TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontSize: '0.82rem' }}>{a.date}</TableCell>
                  <TableCell>
                    {a.status === 'pending' && (
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button size="small" onClick={() => setSelected({ ...a, action: 'approve' })} sx={{ bgcolor: '#f0fdf4', color: '#10b981', borderRadius: '8px', textTransform: 'none', fontWeight: 700, fontSize: '0.78rem', px: 1.5 }}>Approve</Button>
                        <Button size="small" onClick={() => setSelected({ ...a, action: 'reject' })} sx={{ bgcolor: '#fff5f5', color: '#ef4444', borderRadius: '8px', textTransform: 'none', fontWeight: 700, fontSize: '0.78rem', px: 1.5 }}>Reject</Button>
                      </Box>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={!!selected} onClose={() => setSelected(null)} PaperProps={{ sx: { borderRadius: '20px', p: 1, minWidth: 420 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>{selected?.action === 'approve' ? '✅ Approve Request' : '❌ Reject Request'}</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#64748b', mb: 2 }}>
            {selected?.action === 'approve' ? 'Confirm approval of' : 'Reject'} <strong>{selected?.id}</strong> — {selected?.type} by <strong>{selected?.requester}</strong>
            {selected?.amount ? ` for ₦${selected.amount.toLocaleString()}` : ''}.
          </Typography>
          <TextField label={selected?.action === 'reject' ? 'Reason for rejection *' : 'Note (optional)'} multiline rows={3} fullWidth value={reason} onChange={e => setReason(e.target.value)} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
        </DialogContent>
        <DialogActions sx={{ p: 2.5, gap: 1 }}>
          <Button onClick={() => { setSelected(null); setReason(''); }} sx={{ borderRadius: '10px', textTransform: 'none' }}>Cancel</Button>
          <Button variant="contained" disabled={selected?.action === 'reject' && !reason}
            onClick={handleConfirm}
            sx={{ bgcolor: selected?.action === 'approve' ? '#10b981' : '#ef4444', borderRadius: '10px', textTransform: 'none', fontWeight: 700, '&:hover': { bgcolor: selected?.action === 'approve' ? '#059669' : '#dc2626' }, '&:disabled': { bgcolor: '#e2e8f0' } }}>
            Confirm {selected?.action === 'approve' ? 'Approval' : 'Rejection'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
