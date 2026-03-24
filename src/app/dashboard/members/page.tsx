'use client';
import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, IconButton, TextField, InputAdornment, Avatar
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as ViewIcon,
  Person as PersonIcon
} from '@mui/icons-material';

export default function MembersPage() {
  const [search, setSearch] = useState('');
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMembers();
  }, []);

  async function loadMembers() {
    try {
      setLoading(true);
      const data = await api.get('/users').then(res => res.data);
      setMembers(data.filter((u: any) => u.role === 'member'));
    } catch (e) {
      console.error("Failed to load members", e);
    } finally {
      setLoading(false);
    }
  }

  const filtered = members.filter(m =>
    (m.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (m.email || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 900, color: '#004d40' }}>Member Directory</Typography>
        <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>Management of all cooperative members on the platform.</Typography>
      </Box>

      <Paper sx={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid #eef2f6' }}>
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>All Members</Typography>
          <TextField
            placeholder="Search email or name..."
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#94a3b8' }} /></InputAdornment>,
              sx: { borderRadius: '12px' }
            }}
          />
        </Box>
        <TableContainer>
          {loading ? (
            <Box sx={{ p: 10, display: 'flex', justifyContent: 'center' }}><Typography>Loading members...</Typography></Box>
          ) : members.length === 0 ? (
            <Box sx={{ p: 10, textAlign: 'center' }}>
              <PersonIcon sx={{ fontSize: 48, color: '#CBD5E1', mb: 2 }} />
              <Typography sx={{ color: '#64748B' }}>No members found.</Typography>
            </Box>
          ) : (
            <Table>
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow>
                  {['Member', 'Email', 'Group', 'Status', 'Actions'].map(h => (
                    <TableCell key={h} sx={{ fontWeight: 700, color: '#64748b' }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: '#004d40', fontSize: '0.8rem' }}>{(member.name || 'M')[0]}</Avatar>
                        <Typography sx={{ fontWeight: 600 }}>{member.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>{member.group?.name || 'Unassigned'}</TableCell>
                    <TableCell><Chip label="active" color="success" size="small" /></TableCell>
                    <TableCell>
                      <IconButton size="small"><ViewIcon fontSize="small" /></IconButton>
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
