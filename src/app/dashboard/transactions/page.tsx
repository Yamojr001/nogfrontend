'use client';
import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, TextField, InputAdornment, Button, CircularProgress
} from '@mui/material';
import { Search as SearchIcon, ReceiptLong as TransIcon, FileDownload as DownloadIcon, PictureAsPdf as PdfIcon } from '@mui/icons-material';

export default function TransactionsPage() {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://nogbackend.vercel.app';

  useEffect(() => {
    loadTransactions();
  }, []);

  async function loadTransactions() {
    try {
      setLoading(true);
      const data = await api.get('/transactions').then(res => res.data);
      setTransactions(data);
    } catch (e) {
      console.error("Failed to load transactions", e);
    } finally {
      setLoading(false);
    }
  }

  const filtered = transactions.filter(t => 
    t.reference?.toLowerCase().includes(search.toLowerCase()) ||
    t.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#004d40' }}>Global Transactions</Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>Real-time audit of all financial movements across the platform.</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="outlined" 
            startIcon={<DownloadIcon />}
            onClick={() => window.open(`${API_URL}/api/reports/transactions/export`, '_blank')}
            sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 700 }}
          >
            CSV
          </Button>
          <Button 
            variant="contained" 
            startIcon={<PdfIcon />}
            onClick={() => window.open(`${API_URL}/api/reports/transactions/export/pdf`, '_blank')}
            sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 700, bgcolor: '#004d40', '&:hover': { bgcolor: '#00332b' } }}
          >
            PDF Report
          </Button>
        </Box>
      </Box>

      <Paper sx={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid #eef2f6' }}>
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Transaction Log</Typography>
          <TextField
            placeholder="Search reference..."
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{ startAdornment: <SearchIcon sx={{ color: '#94a3b8' }} /> }}
          />
        </Box>
        <TableContainer>
          {loading ? (
             <Box sx={{ p: 10, display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>
          ) : filtered.length === 0 ? (
            <Box sx={{ p: 10, textAlign: 'center' }}>
              <TransIcon sx={{ fontSize: 48, color: '#CBD5E1', mb: 2 }} />
              <Typography sx={{ color: '#64748B' }}>No recent transactions recorded.</Typography>
            </Box>
          ) : (
            <Table>
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Reference</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Source</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Destination</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Receipt</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell sx={{ fontWeight: 600 }}>{t.reference}</TableCell>
                    <TableCell><Chip label={t.type} size="small" variant="outlined" /></TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>₦{Number(t.amount).toLocaleString()}</TableCell>
                    <TableCell>WLT-{String(t.fromWalletId || t.sourceWalletId || '').padStart(4, '0')}</TableCell>
                    <TableCell>WLT-{String(t.toWalletId || t.destinationWalletId || '').padStart(4, '0')}</TableCell>
                    <TableCell sx={{ color: '#64748b' }}>{new Date(t.createdAt).toLocaleString()}</TableCell>
                    <TableCell>
                      <Button 
                        size="small" 
                        startIcon={<PdfIcon />} 
                        onClick={() => window.open(`${API_URL}/api/reports/transactions/${t.id}/receipt`, '_blank')}
                        sx={{ textTransform: 'none', color: '#004d40' }}
                      >
                        Receipt
                      </Button>
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
