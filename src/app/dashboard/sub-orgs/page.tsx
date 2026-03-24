'use client';
import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, Button, IconButton, TextField, InputAdornment,
  Dialog, DialogTitle, DialogContent, DialogActions, Grid, Avatar
} from '@mui/material';
import {
  Search as SearchIcon,
  CheckCircle as ApproveIcon,
  Block as SuspendIcon,
  Add as AddIcon,
  MoreVert as MoreIcon
} from '@mui/icons-material';

const statusColor: Record<string, 'success' | 'error' | 'warning' | 'default'> = {
  active: 'success', suspended: 'error', pending: 'warning'
};

export default function SubOrgsPage() {
  const [search, setSearch] = useState('');
  const [orgs, setOrgs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);
  const [actionDialog, setActionDialog] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [newOrg, setNewOrg] = useState({ name: '', type: 'SUB_ORG' });

  useEffect(() => {
    loadOrgs();
  }, []);

  async function loadOrgs() {
    try {
      setLoading(true);
      const data = await api.get('/organisations').then(res => res.data);
      // Filter for SUB_ORG only
      setOrgs(data.filter((o: any) => o.type === 'SUB_ORG'));
    } catch (e) {
      console.error("Failed to load sub-organisations", e);
    } finally {
      setLoading(false);
    }
  }

  const handleRegister = async () => {
    try {
      await api.post('/organisations', newOrg);
      setIsRegistering(false);
      loadOrgs();
    } catch (e) {
      console.error("Failed to register sub-org", e);
    }
  };

  const handleStatusChange = async () => {
    if (!selected) return;
    try {
      const newStatus = actionDialog === 'approve' ? 'active' : 'suspended';
      await api.patch(`/organisations/${selected.id}`, { status: newStatus });
      setActionDialog('');
      loadOrgs();
    } catch (e) {
      console.error("Failed to update status", e);
    }
  };

  const handleAction = (org: any, action: string) => {
    setSelected(org);
    setActionDialog(action);
  };

  const filtered = orgs.filter(o =>
    o.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#004d40' }}>Sub-Organisation Management</Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>Manage all operational branches and sub-entities.</Typography>
        </Box>
        <Button 
          startIcon={<AddIcon />} 
          variant="contained" 
          onClick={() => setIsRegistering(true)}
          sx={{ bgcolor: '#004d40', borderRadius: '12px', textTransform: 'none', fontWeight: 700, px: 3, '&:hover': { bgcolor: '#003d33' } }}
        >
          Register Sub-Org
        </Button>
      </Box>

      <Paper sx={{ borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #eef2f6' }}>
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eef2f6' }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>All Sub-Organisations</Typography>
          <TextField
            placeholder="Search..."
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#94a3b8', fontSize: 20 }} /></InputAdornment>,
              sx: { borderRadius: '12px', bgcolor: '#f8fafc', fontSize: '0.9rem' }
            }}
            sx={{ width: 280 }}
          />
        </Box>
        <TableContainer>
          {loading ? (
            <Box sx={{ p: 10, display: 'flex', justifyContent: 'center' }}><Typography>Loading...</Typography></Box>
          ) : (
            <Table>
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow>
                  {['Sub-Org Name', 'Status', 'Members', 'Date Joined', 'Actions'].map(h => (
                    <TableCell key={h} sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase' }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((org) => (
                  <TableRow key={org.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ width: 36, height: 36, bgcolor: '#004d40' }}>{org.name[0]}</Avatar>
                        <Typography sx={{ fontWeight: 600 }}>{org.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={org.status} color={statusColor[org.status] || 'default'} size="small" sx={{ fontWeight: 700 }} />
                    </TableCell>
                    <TableCell>{org.membersCount || 0}</TableCell>
                    <TableCell>{new Date(org.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {org.status !== 'active' ? (
                          <IconButton size="small" onClick={() => handleAction(org, 'approve')} sx={{ color: '#10b981' }}><ApproveIcon fontSize="small" /></IconButton>
                        ) : (
                          <IconButton size="small" onClick={() => handleAction(org, 'suspend')} sx={{ color: '#ef4444' }}><SuspendIcon fontSize="small" /></IconButton>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      </Paper>

      <Dialog open={!!actionDialog} onClose={() => setActionDialog('')}>
        <DialogTitle>{actionDialog === 'approve' ? 'Approve' : 'Suspend'} Sub-Org</DialogTitle>
        <DialogContent>
          Are you sure you want to {actionDialog} {selected?.name}?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActionDialog('')}>Cancel</Button>
          <Button onClick={handleStatusChange} color="primary">Confirm</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isRegistering} onClose={() => setIsRegistering(false)}>
        <DialogTitle>Register Sub-Organisation</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField 
            label="Name" 
            fullWidth 
            value={newOrg.name}
            onChange={e => setNewOrg({...newOrg, name: e.target.value})}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsRegistering(false)}>Cancel</Button>
          <Button onClick={handleRegister} disabled={!newOrg.name}>Register</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
