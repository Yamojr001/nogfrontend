'use client';
import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, CircularProgress, TextField, InputAdornment,
  Button, Alert, Card, CardContent, Grid
} from '@mui/material';
import { Savings as SaveIcon, Search as SearchIcon, FileDownload as ExportIcon } from '@mui/icons-material';

export default function ContributionsPage() {
  const [contributions, setContributions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => { loadContributions(); }, []);

  async function loadContributions() {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/contributions');
      setContributions(res.data || []);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to load contributions.');
    } finally {
      setLoading(false);
    }
  }

  const filtered = contributions.filter(c =>
    c.member?.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.reference?.toLowerCase().includes(search.toLowerCase())
  );

  const totalAmount = contributions.reduce((s, c) => s + Number(c.amount || 0), 0);

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#004d40' }}>Member Contributions</Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>Track savings and periodic contributions across all groups.</Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<ExportIcon />}
          onClick={() => window.open(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/reports/members/export`, '_blank')}
          sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 700 }}
        >
          Export CSV
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ borderRadius: '20px', bgcolor: '#004d40', color: '#fff' }}>
            <CardContent sx={{ p: 3 }}>
              <SaveIcon sx={{ mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 900 }}>₦{totalAmount.toLocaleString()}</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>Total Contributions</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ borderRadius: '20px', border: '1px solid #eef2f6' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 900, color: '#004d40' }}>{contributions.length}</Typography>
              <Typography variant="body2" sx={{ color: '#64748b' }}>Total Records</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ borderRadius: '20px', border: '1px solid #eef2f6' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 900, color: '#10b981' }}>
                {contributions.filter(c => c.status === 'completed').length}
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b' }}>Completed</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid #eef2f6' }}>
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Contribution Records</Typography>
          <TextField
            size="small"
            placeholder="Search member or reference..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#94a3b8' }} /></InputAdornment> }}
            sx={{ width: 260 }}
          />
        </Box>
        <TableContainer>
          {loading ? (
            <Box sx={{ p: 10, display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>
          ) : filtered.length === 0 ? (
            <Box sx={{ p: 10, textAlign: 'center' }}>
              <SaveIcon sx={{ fontSize: 48, color: '#CBD5E1', mb: 2 }} />
              <Typography sx={{ color: '#64748B' }}>No contribution records found.</Typography>
            </Box>
          ) : (
            <Table>
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow>
                  {['Member', 'Amount', 'Period', 'Status', 'Date'].map(h => (
                    <TableCell key={h} sx={{ fontWeight: 700 }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map(c => (
                  <TableRow key={c.id} hover>
                    <TableCell>{c.member?.user?.name || c.memberId || '—'}</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>₦{Number(c.amount).toLocaleString()}</TableCell>
                    <TableCell>{c.period?.name || c.periodId || '—'}</TableCell>
                    <TableCell>
                      <Chip
                        label={c.status || 'pending'}
                        size="small"
                        color={c.status === 'completed' ? 'success' : c.status === 'failed' ? 'error' : 'warning'}
                      />
                    </TableCell>
                    <TableCell sx={{ color: '#64748b' }}>
                      {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '—'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      </Paper>
    </Box>
  );
}
