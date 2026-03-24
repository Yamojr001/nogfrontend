'use client';
import React, { useState } from 'react';
import { Box, Typography, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, IconButton, Button, Tabs, Tab, Avatar, Tooltip } from '@mui/material';
import { Add, Visibility, CheckCircle, HourglassEmpty, Cancel } from '@mui/icons-material';

const REQUESTS = [
  { id: 'REQ-2026-001', member: 'John Doe', type: 'Loan Approval', amount: 250000, date: '10 Mar 2026', status: 'Pending Partner', currentLevel: 'Partner Admin' },
  { id: 'REQ-2026-002', member: 'Jane Smith', type: 'Withdrawal', amount: 50000, date: '09 Mar 2026', status: 'Approved', currentLevel: 'Completed' },
  { id: 'REQ-2026-003', member: 'Mike Johnson', type: 'KYC Exceptions', amount: 0, date: '08 Mar 2026', status: 'Rejected', currentLevel: 'Partner Compliance' },
  { id: 'REQ-2026-004', member: 'Chioma Eze', type: 'Loan Approval', amount: 1500000, date: '07 Mar 2026', status: 'Pending Apex', currentLevel: 'Super Admin' },
];

const statusColor: any = {
  'Approved': 'success',
  'Pending Partner': 'warning',
  'Pending Apex': 'warning',
  'Rejected': 'error'
};

const statusIcon: any = {
  'Approved': <CheckCircle fontSize="small" color="success" sx={{ mr: 0.5 }} />,
  'Pending Partner': <HourglassEmpty fontSize="small" color="warning" sx={{ mr: 0.5 }} />,
  'Pending Apex': <HourglassEmpty fontSize="small" color="warning" sx={{ mr: 0.5 }} />,
  'Rejected': <Cancel fontSize="small" color="error" sx={{ mr: 0.5 }} />,
};

export default function SubOrgApprovalsPage() {
  const [tab, setTab] = useState(0);

  const filteredRequests = REQUESTS.filter(req => {
    if (tab === 0) return true;
    if (tab === 1) return req.status.includes('Pending');
    if (tab === 2) return req.status === 'Approved';
    if (tab === 3) return req.status === 'Rejected';
    return true;
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b' }}>Requests & Approvals</Typography>
          <Typography sx={{ color: '#64748b', fontSize: '0.9rem' }}>Track requests submitted to Partner and Apex levels.</Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} sx={{ bgcolor: '#0f766e', '&:hover': { bgcolor: '#0d9488' }, borderRadius: '10px', textTransform: 'none', fontWeight: 600, boxShadow: '0 4px 12px rgba(15, 118, 110, 0.2)' }}>
          New Request
        </Button>
      </Box>

      <Card sx={{ borderRadius: '20px', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
        <Box sx={{ borderBottom: 1, borderColor: '#f1f5f9', px: 2 }}>
          <Tabs value={tab} onChange={(e, v) => setTab(v)} TabIndicatorProps={{ sx: { bgcolor: '#0f766e', height: 3, borderRadius: '3px 3px 0 0' } }}>
            <Tab label="All Submissions" sx={{ textTransform: 'none', fontWeight: 600, color: tab === 0 ? '#0f766e' : '#64748b', '&.Mui-selected': { color: '#0f766e' } }} />
            <Tab label="Pending" sx={{ textTransform: 'none', fontWeight: 600, color: tab === 1 ? '#0f766e' : '#64748b', '&.Mui-selected': { color: '#0f766e' } }} />
            <Tab label="Approved" sx={{ textTransform: 'none', fontWeight: 600, color: tab === 2 ? '#0f766e' : '#64748b', '&.Mui-selected': { color: '#0f766e' } }} />
            <Tab label="Rejected" sx={{ textTransform: 'none', fontWeight: 600, color: tab === 3 ? '#0f766e' : '#64748b', '&.Mui-selected': { color: '#0f766e' } }} />
          </Tabs>
        </Box>

        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: '#64748b', py: 2 }}>Request ID / Date</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b', py: 2 }}>Type & Member</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b', py: 2 }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b', py: 2 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b', py: 2 }}>Currently With</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: '#64748b', py: 2 }}>Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRequests.map((req) => (
                <TableRow key={req.id} hover>
                  <TableCell>
                    <Typography sx={{ fontWeight: 700, color: '#1e293b', fontSize: '0.85rem' }}>{req.id}</Typography>
                    <Typography sx={{ color: '#64748b', fontSize: '0.75rem' }}>{req.date}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontWeight: 600, color: '#334155', fontSize: '0.9rem' }}>{req.type}</Typography>
                    <Typography sx={{ color: '#64748b', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Avatar sx={{ width: 16, height: 16, bgcolor: '#e2e8f0', color: '#64748b', fontSize: '0.6rem' }}>{req.member[0]}</Avatar> {req.member}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontWeight: 700, color: '#0f766e', fontSize: '0.9rem' }}>
                      {req.amount > 0 ? `₦${req.amount.toLocaleString()}` : '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {statusIcon[req.status]}
                      <Typography sx={{ color: `${statusColor[req.status]}.main`, fontWeight: 700, fontSize: '0.8rem' }}>{req.status}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={req.currentLevel} size="small" sx={{ bgcolor: '#f1f5f9', color: '#475569', fontWeight: 600, fontSize: '0.7rem' }} />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="View Request Details">
                      <IconButton size="small" sx={{ color: '#0f766e', bgcolor: '#f0fdfa', '&:hover': { bgcolor: '#ccfbf1' } }}>
                        <Visibility fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {filteredRequests.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <Typography sx={{ color: '#94a3b8', fontWeight: 600 }}>No requests found in this category.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}
