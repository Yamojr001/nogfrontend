'use client';
import React, { useState } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, Button, TextField, InputAdornment, Avatar,
  Grid, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  Select, MenuItem, FormControl, InputLabel, Tab, Tabs, Drawer, CircularProgress
} from '@mui/material';
import { Search as SearchIcon, Add as AddIcon, Visibility as ViewIcon, Block as SuspendIcon, Close as CloseIcon, Edit as EditIcon, Verified as KycIcon } from '@mui/icons-material';
import { fetchPartnerMembers } from '@/lib/api';

const kycColor: Record<string, any> = { verified: 'success', pending: 'warning', rejected: 'error' };
const statusColor: Record<string, any> = { active: 'success', suspended: 'error', inactive: 'default' };

export default function MembersPage() {
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<any>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    async function load() {
      try {
        const orgIdStr = localStorage.getItem('organisation_id');
        if (orgIdStr) {
          const data = await fetchPartnerMembers(Number(orgIdStr));
          const mapped = data.map((m: any) => ({
            id: m.id,
            name: m.user?.fullName || 'Unknown',
            email: m.user?.email || 'N/A',
            phone: m.user?.phone || 'N/A',
            branch: m.branch?.name || 'Unassigned',
            group: m.group?.name || 'No Group',
            walletBalance: m.wallet?.balance ? Number(m.wallet.balance) : 0,
            loans: 0, 
            contributions: 0, 
            status: m.user?.status || 'active',
            kyc: m.kycStatus || 'pending',
            joined: new Date(m.createdAt).toISOString().split('T')[0]
          }));
          setMembers(mapped);
        }
      } catch (err) {
        console.error("Failed to load partner members", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = members.filter(m => {
    const q = search.toLowerCase();
    const matchQ = m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.branch.toLowerCase().includes(q);
    if (tab === 1) return matchQ && m.kyc === 'pending';
    if (tab === 2) return matchQ && m.status === 'suspended';
    return matchQ;
  });

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#0c4a6e' }}>Member Management</Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>Register, manage, and oversee all cooperative members.</Typography>
        </Box>
        <Button startIcon={<AddIcon />} variant="contained" onClick={() => setAddOpen(true)}
          sx={{ bgcolor: '#0369a1', borderRadius: '12px', textTransform: 'none', fontWeight: 700, px: 3, '&:hover': { bgcolor: '#0284c7' } }}>
          Register Member
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}><CircularProgress sx={{ color: '#0369a1' }} /></Box>
      ) : (
      <>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[
            { label: 'Total Members', value: members.length, color: '#0369a1' },
          { label: 'Active', value: members.filter(m => m.status === 'active').length, color: '#10b981' },
          { label: 'KYC Pending', value: members.filter(m => m.kyc === 'pending').length, color: '#f59e0b' },
          { label: 'Suspended', value: members.filter(m => m.status === 'suspended').length, color: '#ef4444' },
        ].map(s => (
          <Grid size={{ xs: 6, md: 3 }} key={s.label}>
            <Paper sx={{ p: 3, textAlign: 'center', borderRadius: '20px', border: '1px solid #e0f2fe', boxShadow: 'none' }}>
              <Typography variant="h3" sx={{ fontWeight: 900, color: s.color }}>{s.value}</Typography>
              <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>{s.label}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid #e0f2fe', boxShadow: 'none' }}>
        <Box sx={{ px: 3, pt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, borderBottom: '1px solid #e0f2fe' }}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ '& .MuiTab-root': { textTransform: 'none', fontWeight: 700 }, '& .Mui-selected': { color: '#0369a1' }, '& .MuiTabs-indicator': { bgcolor: '#0369a1' } }}>
            <Tab label="All Members" />
            <Tab label={`KYC Pending (${members.filter(m => m.kyc === 'pending').length})`} />
            <Tab label="Suspended" />
          </Tabs>
          <TextField size="small" placeholder="Search members..." value={search} onChange={e => setSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#94a3b8', fontSize: 20 }} /></InputAdornment>, sx: { borderRadius: '12px', bgcolor: '#f0f9ff' } }}
            sx={{ width: 280 }} />
        </Box>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#f0f9ff' }}>
              <TableRow>
                {['Member', 'Branch / Group', 'Wallet', 'Contributions', 'Loans', 'KYC', 'Status', 'Actions'].map(h => (
                  <TableCell key={h} sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map(m => (
                <TableRow key={m.id} sx={{ '&:hover': { bgcolor: '#f0f9ff' } }}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ width: 36, height: 36, bgcolor: '#0369a1', fontSize: '0.85rem', fontWeight: 700 }}>{m.name[0]}</Avatar>
                      <Box>
                        <Typography sx={{ fontWeight: 700, fontSize: '0.88rem' }}>{m.name}</Typography>
                        <Typography sx={{ color: '#94a3b8', fontSize: '0.75rem' }}>{m.email}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.85rem', color: '#64748b' }}>{m.branch}<br /><span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{m.group}</span></TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#0c4a6e' }}>₦{m.walletBalance.toLocaleString()}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>₦{m.contributions.toLocaleString()}</TableCell>
                  <TableCell sx={{ textAlign: 'center', fontWeight: 700 }}>{m.loans}</TableCell>
                  <TableCell><Chip label={m.kyc} color={kycColor[m.kyc]} size="small" icon={m.kyc === 'verified' ? <KycIcon sx={{ fontSize: '14px !important' }} /> : undefined} sx={{ borderRadius: '8px', fontWeight: 700, textTransform: 'capitalize' }} /></TableCell>
                  <TableCell><Chip label={m.status} color={statusColor[m.status]} size="small" sx={{ borderRadius: '8px', fontWeight: 700, textTransform: 'capitalize' }} /></TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton size="small" onClick={() => setSelected(m)} sx={{ color: '#0369a1', bgcolor: '#e0f2fe', borderRadius: '8px' }}><ViewIcon fontSize="small" /></IconButton>
                      <IconButton size="small" sx={{ color: '#ef4444', bgcolor: '#fff5f5', borderRadius: '8px' }}><SuspendIcon fontSize="small" /></IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      </>
      )}

      {/* Member Detail Drawer */}
      <Drawer anchor="right" open={!!selected} onClose={() => setSelected(null)} PaperProps={{ sx: { width: 420, p: 4 } }}>
        {selected && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>Member Profile</Typography>
              <IconButton onClick={() => setSelected(null)}><CloseIcon /></IconButton>
            </Box>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Avatar sx={{ width: 80, height: 80, bgcolor: '#0369a1', mx: 'auto', fontSize: '2rem', mb: 2, fontWeight: 800 }}>{selected.name[0]}</Avatar>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>{selected.name}</Typography>
              <Typography variant="body2" sx={{ color: '#64748b' }}>{selected.email}</Typography>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mt: 1.5 }}>
                <Chip label={selected.status} color={statusColor[selected.status]} size="small" sx={{ borderRadius: '8px', textTransform: 'capitalize', fontWeight: 700 }} />
                <Chip label={`KYC: ${selected.kyc}`} color={kycColor[selected.kyc]} size="small" sx={{ borderRadius: '8px', textTransform: 'capitalize', fontWeight: 700 }} />
              </Box>
            </Box>
            {[
              { label: 'Phone', value: selected.phone },
              { label: 'Branch', value: selected.branch },
              { label: 'Group', value: selected.group },
              { label: 'Wallet Balance', value: `₦${selected.walletBalance.toLocaleString()}` },
              { label: 'Total Contributions', value: `₦${selected.contributions.toLocaleString()}` },
              { label: 'Active Loans', value: selected.loans },
              { label: 'Date Joined', value: selected.joined },
            ].map(({ label, value }) => (
              <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5, borderBottom: '1px solid #f1f5f9' }}>
                <Typography sx={{ color: '#64748b', fontWeight: 600, fontSize: '0.9rem' }}>{label}</Typography>
                <Typography sx={{ fontWeight: 700, fontSize: '0.9rem' }}>{value}</Typography>
              </Box>
            ))}
            <Button fullWidth variant="contained" startIcon={<EditIcon />} sx={{ mt: 3, bgcolor: '#0369a1', borderRadius: '12px', textTransform: 'none', fontWeight: 700, '&:hover': { bgcolor: '#0284c7' } }}>Edit Member</Button>
            <Button fullWidth startIcon={<SuspendIcon />} sx={{ mt: 1.5, borderRadius: '12px', textTransform: 'none', fontWeight: 700, color: '#ef4444', border: '1px solid #fee2e2' }}>Suspend Account</Button>
          </Box>
        )}
      </Drawer>

      {/* Add Member Dialog */}
      <Dialog open={addOpen} onClose={() => setAddOpen(false)} PaperProps={{ sx: { borderRadius: '20px', p: 1, minWidth: 500 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Register New Member</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            {['Full Name', 'Email Address', 'Phone Number'].map(label => (
              <Grid size={{ xs: 12 }} key={label}>
                <TextField label={label} fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
              </Grid>
            ))}
            <Grid size={{ xs: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Branch</InputLabel>
                <Select label="Branch" defaultValue="" sx={{ borderRadius: '12px' }}>
                  {['Abuja', 'Lagos', 'Kano'].map(b => <MenuItem key={b} value={b}>{b}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Group</InputLabel>
                <Select label="Group" defaultValue="" sx={{ borderRadius: '12px' }}>
                  {['Farmers Prosperity', 'Women Traders', 'Tech Innovators', 'Agricultural'].map(g => <MenuItem key={g} value={g}>{g}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, gap: 1 }}>
          <Button onClick={() => setAddOpen(false)} sx={{ borderRadius: '10px', textTransform: 'none' }}>Cancel</Button>
          <Button variant="contained" sx={{ bgcolor: '#0369a1', borderRadius: '10px', textTransform: 'none', fontWeight: 700, px: 3, '&:hover': { bgcolor: '#0284c7' } }}>Register</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
