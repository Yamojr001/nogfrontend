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
  AccountTree as OrgIcon,
  Add as AddIcon,
  MoreVert as MoreIcon
} from '@mui/icons-material';

const orgData = [
  { id: 1, name: 'Federal Cooperative Partner', type: 'PARTNER', status: 'active', members: 1240, country: 'Nigeria', joined: '2024-01-15' },
  { id: 2, name: 'Lagos State Cooperative', type: 'PARTNER', status: 'active', members: 890, country: 'Nigeria', joined: '2024-03-20' },
  { id: 3, name: 'Abuja Regional Branch', type: 'SUB_ORG', status: 'suspended', members: 230, country: 'Nigeria', joined: '2024-06-05' },
  { id: 4, name: 'Port Harcourt District', type: 'SUB_ORG', status: 'pending', members: 0, country: 'Nigeria', joined: '2025-01-10' },
  { id: 5, name: 'Kano North Partner', type: 'PARTNER', status: 'active', members: 670, country: 'Nigeria', joined: '2024-09-01' },
];

const statusColor: Record<string, 'success' | 'error' | 'warning' | 'default'> = {
  active: 'success', suspended: 'error', pending: 'warning'
};

export default function OrgsPage() {
  const [search, setSearch] = useState('');
  const [orgs, setOrgs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);
  const [actionDialog, setActionDialog] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [newOrg, setNewOrg] = useState({ name: '', type: 'PARTNER' });

  useEffect(() => {
    loadOrgs();
  }, []);

  async function loadOrgs() {
    try {
      setLoading(true);
      const data = await api.get('/organisations').then(res => res.data);
      setOrgs(data);
    } catch (e) {
      console.error("Failed to load organisations", e);
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
      console.error("Failed to register organisation", e);
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

  const filtered = orgs.filter(o =>
    o.name.toLowerCase().includes(search.toLowerCase()) ||
    o.type.toLowerCase().includes(search.toLowerCase())
  );

  const handleAction = (org: any, action: string) => {
    setSelected(org);
    setActionDialog(action);
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#004d40' }}>Organisation Management</Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>Oversee all partner and sub-organisations across the platform.</Typography>
        </Box>
        <Button 
          startIcon={<AddIcon />} 
          variant="contained" 
          onClick={() => setIsRegistering(true)}
          sx={{ bgcolor: '#004d40', borderRadius: '12px', textTransform: 'none', fontWeight: 700, px: 3, '&:hover': { bgcolor: '#003d33' } }}
        >
          Register Organisation
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { label: 'Total Orgs', value: orgs.length, color: '#004d40' },
          { label: 'Active', value: orgs.filter(o => o.status === 'active').length, color: '#10b981' },
          { label: 'Suspended', value: orgs.filter(o => o.status === 'suspended').length, color: '#ef4444' },
          { label: 'Pending Approval', value: orgs.filter(o => o.status === 'pending').length, color: '#f59e0b' },
        ].map((s) => (
          <Grid key={s.label} size={{ xs: 6, md: 3 }}>
            <Paper sx={{ p: 3, borderRadius: '20px', border: '1px solid #eef2f6', boxShadow: 'none', textAlign: 'center' }}>
              <Typography variant="h3" sx={{ fontWeight: 900, color: s.color }}>{s.value}</Typography>
              <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>{s.label}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #eef2f6' }}>
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eef2f6' }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>All Organisations</Typography>
          <TextField
            placeholder="Search organisations..."
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
            <Box sx={{ p: 10, display: 'flex', justifyContent: 'center' }}><Typography>Loading organisations...</Typography></Box>
          ) : (
            <Table>
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow>
                  {['Organisation', 'Type', 'Status', 'Members', 'Country', 'Joined', 'Actions'].map(h => (
                    <TableCell key={h} sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((org) => (
                  <TableRow key={org.id} sx={{ '&:hover': { bgcolor: '#f8fafc' }, transition: 'background 0.2s' }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ width: 36, height: 36, bgcolor: '#004d40', fontSize: '0.9rem' }}>
                          {org.name[0]}
                        </Avatar>
                        <Typography sx={{ fontWeight: 600, color: '#1e293b', fontSize: '0.9rem' }}>{org.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={org.type} size="small" variant="outlined" sx={{ borderRadius: '8px', fontWeight: 600, fontSize: '0.75rem' }} />
                    </TableCell>
                    <TableCell>
                      <Chip label={org.status} color={statusColor[org.status] || 'default'} size="small" sx={{ borderRadius: '8px', textTransform: 'capitalize', fontWeight: 700 }} />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{(org as any).membersCount || 0}</TableCell>
                    <TableCell sx={{ color: '#64748b' }}>Nigeria</TableCell>
                    <TableCell sx={{ color: '#64748b', fontSize: '0.85rem' }}>{new Date(org.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {org.status !== 'active' ? (
                          <IconButton size="small" title="Approve" onClick={() => handleAction(org, 'approve')} sx={{ color: '#10b981', bgcolor: '#f0fdf4', borderRadius: '8px' }}>
                            <ApproveIcon fontSize="small" />
                          </IconButton>
                        ) : (
                          <IconButton size="small" title="Suspend" onClick={() => handleAction(org, 'suspend')} sx={{ color: '#ef4444', bgcolor: '#fff5f5', borderRadius: '8px' }}>
                            <SuspendIcon fontSize="small" />
                          </IconButton>
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

      <Dialog open={!!actionDialog} onClose={() => setActionDialog('')} PaperProps={{ sx: { borderRadius: '20px', p: 1, minWidth: 400 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>{actionDialog === 'approve' ? '✅ Approve Organisation' : '⛔ Suspend Organisation'}</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#64748b' }}>
            You are about to <strong>{actionDialog}</strong> <strong>{selected?.name}</strong>. This action will be logged in the audit trail.
          </Typography>
          {actionDialog === 'suspend' && (
            <TextField label="Reason for suspension *" multiline rows={3} fullWidth sx={{ mt: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setActionDialog('')} sx={{ borderRadius: '10px', textTransform: 'none' }}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleStatusChange}
            sx={{ bgcolor: actionDialog === 'approve' ? '#10b981' : '#ef4444', borderRadius: '10px', textTransform: 'none', fontWeight: 700, '&:hover': { bgcolor: actionDialog === 'approve' ? '#059669' : '#dc2626' } }}
          >
            Confirm {actionDialog}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Register Dialog */}
      <Dialog open={isRegistering} onClose={() => setIsRegistering(false)} PaperProps={{ sx: { borderRadius: '20px', p: 1, minWidth: 500 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>🆕 Register Organisation</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={12}>
              <TextField 
                label="Organisation Name" 
                fullWidth 
                value={newOrg.name}
                onChange={e => setNewOrg({...newOrg, name: e.target.value})}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} 
              />
            </Grid>
            <Grid size={12}>
              <TextField 
                label="Type" 
                select 
                fullWidth 
                value={newOrg.type}
                onChange={e => setNewOrg({...newOrg, type: e.target.value})}
                SelectProps={{ native: true }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} 
              >
                <option value="PARTNER">Partner</option>
                <option value="SUB_ORG">Sub-Organisation</option>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setIsRegistering(false)} sx={{ borderRadius: '10px', textTransform: 'none' }}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleRegister}
            disabled={!newOrg.name}
            sx={{ bgcolor: '#004d40', borderRadius: '10px', textTransform: 'none', fontWeight: 700, '&:hover': { bgcolor: '#003d33' } }}
          >
            Create Organisation
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
