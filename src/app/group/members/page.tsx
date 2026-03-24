'use client';
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, IconButton, Button, Avatar, Dialog, DialogTitle, DialogContent, TextField,
  MenuItem, Grid, CircularProgress
} from '@mui/material';
import { Search, MoreVert, AddCircle, CheckCircle } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import { fetchGroupMembers } from '@/lib/api';

export default function GroupMembersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchGroupMembers(1); // Demo Group ID
        setMembers(data || []);
      } catch (error) {
        console.error("Failed to load members", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredMembers = members.filter(m =>
    m.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

  return (
    <Box sx={{ p: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, px: 1 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b' }}>Group Members</Typography>
          <Typography sx={{ color: '#64748b', fontSize: '0.8rem' }}>{members.length} total members in your cell</Typography>
        </Box>
        <IconButton onClick={() => setIsAddOpen(true)} sx={{ color: '#0f766e' }}><AddCircle sx={{ fontSize: 32 }} /></IconButton>
      </Box>

      <Box sx={{ mb: 3, px: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#f1f5f9', borderRadius: '12px', px: 2, py: 1 }}>
          <Search sx={{ color: '#94a3b8', mr: 1, fontSize: 20 }} />
          <input
            placeholder="Find a member..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', fontSize: '0.9rem' }}
          />
        </Box>
      </Box>

      <Card sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: 'none', overflow: 'hidden' }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8fafc' }}>
                <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>Savings</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>Role</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: '#64748b' }}>Status/Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMembers.map((member) => (
                <TableRow key={member.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ width: 30, height: 30, bgcolor: '#0f766e', fontSize: '0.8rem' }}>{member.user?.name?.charAt(0)}</Avatar>
                      <Box>
                        <Typography sx={{ fontWeight: 700, color: '#1e293b', fontSize: '0.85rem' }}>{member.user?.name}</Typography>
                        <Typography sx={{ fontSize: '0.7rem', color: '#64748b' }}>{member.kycStatus === 'verified' ? 'Verified' : 'Pending'}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.85rem' }}>₦{Number(member.contributionBalance || 0).toLocaleString()}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={member.user?.role?.split('_').pop()?.toUpperCase()} 
                      size="small" 
                      sx={{ fontSize: '0.65rem', fontWeight: 800, height: 20, bgcolor: '#f1f5f9' }} 
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Mark Present">
                      <IconButton 
                        size="small" 
                        onClick={() => {
                          alert(`Marked ${member.user?.name} as present for today's session.`);
                        }}
                        sx={{ color: '#10b981' }}
                      >
                        <CheckCircle sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Tooltip>
                    <IconButton size="small"><MoreVert sx={{ fontSize: 18 }} /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Dialog open={isAddOpen} onClose={() => setIsAddOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 800 }}>Add New Member</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth label="Full Name" size="small" />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth label="Email/Phone" size="small" />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField select fullWidth label="Assigned Role" defaultValue="member" size="small">
                <MenuItem value="member">Standard Member</MenuItem>
                <MenuItem value="group_treasurer">Treasurer</MenuItem>
                <MenuItem value="group_secretary">Secretary</MenuItem>
              </TextField>
            </Grid>
          </Grid>
          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button fullWidth onClick={() => setIsAddOpen(false)} sx={{ textTransform: 'none', fontWeight: 700, color: '#64748b' }}>Cancel</Button>
            <Button fullWidth variant="contained" onClick={() => setIsAddOpen(false)} sx={{ bgcolor: '#0f766e', textTransform: 'none', fontWeight: 700 }}>Register</Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
