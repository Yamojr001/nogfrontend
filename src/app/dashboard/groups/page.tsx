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
  Groups as GroupsIcon
} from '@mui/icons-material';

export default function GroupsPage() {
  const [search, setSearch] = useState('');
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGroups();
  }, []);

  async function loadGroups() {
    try {
      setLoading(true);
      const data = await api.get('/group').then(res => res.data);
      setGroups(data);
    } catch (e) {
      console.error("Failed to load groups", e);
    } finally {
      setLoading(false);
    }
  }

  const filtered = groups.filter(g =>
    g.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 900, color: '#004d40' }}>Group Management</Typography>
        <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>Overview of all cooperative groups across sub-organisations.</Typography>
      </Box>

      <Paper sx={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid #eef2f6' }}>
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>All Groups</Typography>
          <TextField
            placeholder="Search groups..."
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
            <Box sx={{ p: 10, display: 'flex', justifyContent: 'center' }}><Typography>Loading groups...</Typography></Box>
          ) : groups.length === 0 ? (
            <Box sx={{ p: 10, textAlign: 'center' }}>
              <GroupsIcon sx={{ fontSize: 48, color: '#CBD5E1', mb: 2 }} />
              <Typography sx={{ color: '#64748B' }}>No groups found.</Typography>
            </Box>
          ) : (
            <Table>
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow>
                  {['Group Name', 'Sub-Org', 'Members', 'Status', 'Actions'].map(h => (
                    <TableCell key={h} sx={{ fontWeight: 700, color: '#64748b' }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((group) => (
                  <TableRow key={group.id}>
                    <TableCell>{group.name}</TableCell>
                    <TableCell>{group.subOrg?.name}</TableCell>
                    <TableCell>{group.memberCount}</TableCell>
                    <TableCell><Chip label={group.status} size="small" /></TableCell>
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
