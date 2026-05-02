"use client";

import React from 'react';
import { Box, Typography, Paper, TextField, InputAdornment, Table, TableHead, TableRow, TableCell, TableBody, Chip } from '@mui/material';
import { Search } from '@mui/icons-material';

const rows = [
  { ref: 'ST-301', member: 'Ibrahim Musa', type: 'Contribution', amount: 25000, status: 'successful' },
  { ref: 'ST-302', member: 'Ngozi Eze', type: 'Loan Repayment', amount: 60000, status: 'successful' },
  { ref: 'ST-303', member: 'Peter Ali', type: 'Withdrawal', amount: 15000, status: 'pending' },
];

export default function Page() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 900, color: '#065f46', mb: 0.5 }}>Transactions</Typography>
      <Typography sx={{ color: '#64748b', mb: 3 }}>Filter and review sub-organisation transaction history.</Typography>
      <Paper sx={{ p: 3, borderRadius: '24px', border: '1px solid #d1fae5' }}>
        <TextField fullWidth size="small" placeholder="Search transactions..." sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ color: '#94a3b8' }} /></InputAdornment> }} />
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 800, color: '#64748b' }}>Ref</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#64748b' }}>Member</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#64748b' }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#64748b' }}>Amount</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#64748b' }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.ref} hover>
                <TableCell sx={{ color: '#0f8a62', fontWeight: 800 }}>{row.ref}</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>{row.member}</TableCell>
                <TableCell>{row.type}</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>₦{row.amount.toLocaleString()}</TableCell>
                <TableCell><Chip size="small" label={row.status} sx={{ bgcolor: row.status === 'successful' ? '#dcfce7' : '#fef3c7', color: row.status === 'successful' ? '#166534' : '#92400e', fontWeight: 800 }} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
