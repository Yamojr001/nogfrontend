'use client';
import React, { useState } from 'react';
import api from '@/lib/api';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button, Chip, Grid, Tab, Tabs,
  TextField, InputAdornment, Avatar, LinearProgress, Dialog,
  DialogTitle, DialogContent, DialogActions, CircularProgress
} from '@mui/material';
import { Search as SearchIcon, CheckCircle, Cancel, HourglassEmpty } from '@mui/icons-material';


const statusColor: Record<string, any> = { PENDING: 'warning', APPROVED: 'info', EXECUTED: 'success', REJECTED: 'error' };
const statusIcon: Record<string, React.ReactNode> = {
  PENDING: <HourglassEmpty sx={{ fontSize: 14 }} />,
  APPROVED: <CheckCircle sx={{ fontSize: 14 }} />,
  EXECUTED: <CheckCircle sx={{ fontSize: 14 }} />,
  REJECTED: <Cancel sx={{ fontSize: 14 }} />,
};

export default function ApprovalsPage() {
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<any>(null);
  const [reason, setReason] = useState('');
  const [approvals, setApprovals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    loadApprovals();
  }, []);

  async function loadApprovals() {
    try {
      setLoading(true);
      const data = await api.get('/approvals').then(res => res.data);
      setApprovals(data);
    } catch (e) {
      console.error("Failed to load approvals", e);
    } finally {
      setLoading(false);
    }
  }

  async function handleAction(id: number, action: 'approve' | 'reject') {
    try {
      await api.post(`/approvals/${id}/${action}`, { comments: reason });
      setSelected(null);
      setReason('');
      loadApprovals();
    } catch (e) {
      console.error(`Failed to ${action} approval`, e);
      alert(`Failed to ${action} approval. Please try again.`);
    }
  }

  const filtered = approvals.filter(a => {
    const requesterName = a.requester?.name || 'Unknown';
    const matchesSearch = requesterName.toLowerCase().includes(search.toLowerCase()) || a.requestType.toLowerCase().includes(search.toLowerCase());
    if (tab === 0) return matchesSearch;
    if (tab === 1) return matchesSearch && a.status === 'PENDING';
    if (tab === 2) return matchesSearch && (a.status === 'APPROVED' || a.status === 'EXECUTED');
    return matchesSearch && a.status === 'REJECTED';
  });

  const pendingCount = approvals.filter(a => a.status === 'PENDING').length;

  if (loading) return <Box sx={{ p: 10, textAlign: 'center' }}><CircularProgress /></Box>;

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#004d40' }}>Approval Management</Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>Multi-level workflow engine for financial and organisational decisions.</Typography>
        </Box>
        {pendingCount > 0 && (
          <Chip
            label={`${pendingCount} Pending Action${pendingCount > 1 ? 's' : ''}`}
            color="warning"
            sx={{ fontWeight: 800, borderRadius: '12px', fontSize: '0.9rem', px: 1 }}
          />
        )}
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { label: 'Total Requests', value: approvals.length, color: '#004d40' },
          { label: 'Pending', value: approvals.filter(a => a.status === 'PENDING').length, color: '#f59e0b' },
          { label: 'Approved/Executed', value: approvals.filter(a => ['APPROVED', 'EXECUTED'].includes(a.status)).length, color: '#10b981' },
          { label: 'Rejected', value: approvals.filter(a => a.status === 'REJECTED').length, color: '#ef4444' },
        ].map((s) => (
          <Grid size={{ xs: 6, md: 3 }} key={s.label}>
            <Paper sx={{ p: 3, borderRadius: '20px', border: '1px solid #eef2f6', boxShadow: 'none', textAlign: 'center' }}>
              <Typography variant="h3" sx={{ fontWeight: 900, color: s.color }}>{s.value}</Typography>
              <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>{s.label}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #eef2f6' }}>
        <Box sx={{ px: 3, pt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, borderBottom: '1px solid #eef2f6' }}>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            sx={{ '& .MuiTab-root': { textTransform: 'none', fontWeight: 700, py: 2 }, '& .Mui-selected': { color: '#004d40' }, '& .MuiTabs-indicator': { bgcolor: '#004d40' } }}
          >
            <Tab label="All" />
            <Tab label={`Pending (${pendingCount})`} />
            <Tab label="Approved" />
            <Tab label="Rejected" />
          </Tabs>
          <TextField
            placeholder="Search requests..."
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#94a3b8', fontSize: 20 }} /></InputAdornment>,
              sx: { borderRadius: '12px', bgcolor: '#f8fafc' }
            }}
            sx={{ width: 260 }}
          />
        </Box>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                {['Request ID', 'Type', 'Amount', 'Requester', 'Organisation', 'Level', 'Status', 'Action'].map(h => (
                  <TableCell key={h} sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((a) => (
                <TableRow key={a.id} hover>
                  <TableCell sx={{ fontWeight: 800, color: '#004d40' }}>APR-{a.id}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{a.requestType}</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>₦{Number(a.metadata?.amount || 0).toLocaleString()}</TableCell>
                  <TableCell>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 700 }}>{a.requester?.name || 'Unknown'}</Typography>
                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>{new Date(a.createdAt).toLocaleDateString()}</Typography>
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.85rem', color: '#64748b' }}>{a.organisation?.name || 'N/A'}</TableCell>
                  <TableCell>
                    <Box sx={{ width: 100 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" sx={{ fontWeight: 700 }}>L{a.currentLevel}/{a.totalLevelsRequired}</Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={(a.currentLevel / a.totalLevelsRequired) * 100} sx={{ height: 4, borderRadius: 2, bgcolor: '#e2e8f0', '& .MuiLinearProgress-bar': { bgcolor: '#004d40' } }} />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={statusIcon[a.status]}
                      label={a.status}
                      color={statusColor[a.status]}
                      size="small"
                      sx={{ fontWeight: 800, borderRadius: '8px', fontSize: '0.7rem' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => setSelected(a)}
                      sx={{ textTransform: 'none', fontWeight: 700, borderRadius: '8px', color: '#004d40', borderColor: '#004d40' }}
                    >
                      Detail
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={!!selected} onClose={() => setSelected(null)} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: '24px' } }}>
        {selected && (
          <>
            <DialogTitle sx={{ fontWeight: 800, borderBottom: '1px solid #eef2f6', px: 4, py: 3 }}>
              Approval Detail: APR-{selected.id}
            </DialogTitle>
            <DialogContent sx={{ px: 4, py: 3 }}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Requester</Typography>
                  <Typography sx={{ fontWeight: 700 }}>{selected.requester?.name || 'Unknown'}</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Amount</Typography>
                  <Typography sx={{ fontWeight: 800, color: '#004d40', fontSize: '1.2rem' }}>₦{Number(selected.metadata?.amount || 0).toLocaleString()}</Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Current Requirement</Typography>
                  <Paper sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', mt: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: '#004d40', width: 32, height: 32 }}>{selected.currentLevel}</Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>Awaiting {selected.requiredRole || 'Next Level'}</Typography>
                        <Typography variant="caption" sx={{ color: '#64748b' }}>Level {selected.currentLevel} of {selected.totalLevelsRequired} Approval Pipeline</Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
                {selected.status === 'PENDING' && (
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      placeholder="Add a reason for approval or rejection..."
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                    />
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 4, pt: 0, gap: 2 }}>
              <Button fullWidth onClick={() => setSelected(null)} sx={{ color: '#64748b', fontWeight: 700 }}>Close</Button>
              {selected.status === 'PENDING' && (
                <>
                  <Button 
                    fullWidth 
                    variant="outlined" 
                    color="error" 
                    sx={{ borderRadius: '12px', fontWeight: 700, textTransform: 'none' }}
                    onClick={() => handleAction(selected.id, 'reject')}
                  >
                    Reject
                  </Button>
                  <Button 
                    fullWidth 
                    variant="contained" 
                    sx={{ bgcolor: '#004d40', borderRadius: '12px', fontWeight: 700, textTransform: 'none' }}
                    onClick={() => handleAction(selected.id, 'approve')}
                  >
                    Approve
                  </Button>
                </>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
