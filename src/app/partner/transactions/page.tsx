"use client";

import React, { useMemo, useState } from 'react';
import { Box, Typography, Paper, TextField, InputAdornment, Table, TableHead, TableRow, TableCell, TableBody, Chip, Button } from '@mui/material';
import { Search, SwapHoriz, ReceiptLong } from '@mui/icons-material';

const rows = [
  { ref: 'TX-1001', type: 'Contribution', member: 'Amina Yusuf', amount: 45000, status: 'successful', date: 'Apr 28, 2026' },
  { ref: 'TX-1002', type: 'Loan Disbursement', member: 'John Okoro', amount: 120000, status: 'processing', date: 'Apr 27, 2026' },
  { ref: 'TX-1003', type: 'Withdrawal', member: 'Grace Nnamdi', amount: 30000, status: 'failed', date: 'Apr 24, 2026' },
];

export default function Page() {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => rows.filter((row) => [row.ref, row.type, row.member, row.status].join(' ').toLowerCase().includes(query.toLowerCase())), [query]);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', mb: 3, gap: 2, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#065f46' }}>Transactions</Typography>
          <Typography sx={{ color: '#64748b' }}>Search members, transactions, and settlement records.</Typography>
        </Box>
        <Button variant="outlined" startIcon={<SwapHoriz />} sx={{ borderRadius: '12px', textTransform: 'none', borderColor: '#0f8a62', color: '#0f8a62', fontWeight: 700 }}>Reconcile</Button>
      </Box>

      <Paper sx={{ p: 3, borderRadius: '24px', border: '1px solid #d1fae5', boxShadow: 'none' }}>
        <TextField fullWidth size="small" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by reference, member, or status..." InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ color: '#94a3b8' }} /></InputAdornment> }} sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 800, color: '#64748b' }}>Reference</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#64748b' }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#64748b' }}>Member</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#64748b' }}>Amount</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#64748b' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#64748b' }}>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((row) => (
              <TableRow key={row.ref} hover>
                <TableCell sx={{ fontWeight: 800, color: '#0f8a62' }}>{row.ref}</TableCell>
                <TableCell>{row.type}</TableCell>
                <TableCell>{row.member}</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>₦{row.amount.toLocaleString()}</TableCell>
                <TableCell>
                  <Chip size="small" label={row.status} sx={{ bgcolor: row.status === 'successful' ? '#dcfce7' : row.status === 'processing' ? '#fef3c7' : '#fee2e2', color: row.status === 'successful' ? '#166534' : row.status === 'processing' ? '#92400e' : '#991b1b', fontWeight: 800 }} />
                </TableCell>
                <TableCell>{row.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
