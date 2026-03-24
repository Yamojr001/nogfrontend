'use client';
import React from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { ListAlt as LogsIcon } from '@mui/icons-material';

export default function LogsPage() {
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 900, color: '#004d40' }}>Audit Logs</Typography>
        <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>Comprehensive trail of all administrative actions on the platform.</Typography>
      </Box>

      <Paper sx={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid #eef2f6' }}>
        <TableContainer>
           <Box sx={{ p: 10, textAlign: 'center' }}>
            <LogsIcon sx={{ fontSize: 48, color: '#CBD5E1', mb: 2 }} />
            <Typography sx={{ color: '#64748B' }}>No audit logs available for the current period.</Typography>
          </Box>
        </TableContainer>
      </Paper>
    </Box>
  );
}
