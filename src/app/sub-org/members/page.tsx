'use client';
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, IconButton, Button, Avatar, Dialog, DialogTitle, DialogContent, TextField,
  MenuItem, Drawer, Divider, Tooltip, Grid, Tabs, Tab
} from '@mui/material';
import {
  Add, Search, FilterList, MoreVert, CheckCircle, Warning, Cancel, UploadFile
} from '@mui/icons-material';
import { fetchSubOrgMembers } from '@/lib/api';

const MOCK_MEMBERS = [
  { id: 'MBR-001', name: 'Alhaji Yusuf Kano', role: 'Member', joined: 'Jan 15, 2026', kyc: 'verified', balance: 145000, status: 'active', email: 'yusuf@example.com', phone: '08012345678' },
  { id: 'MBR-002', name: 'Chioma Eze', role: 'Sub-Org Officer', joined: 'Feb 10, 2026', kyc: 'verified', balance: 500000, status: 'active', email: 'chioma@example.com', phone: '08123456789' },
  { id: 'MBR-003', name: 'Oluwaseun Adebayo', role: 'Member', joined: 'Mar 01, 2026', kyc: 'pending', balance: 25000, status: 'active', email: 'olu@example.com', phone: '09011223344' },
  { id: 'MBR-004', name: 'Grace Nnamdi', role: 'Member', joined: 'Mar 05, 2026', kyc: 'rejected', balance: 0, status: 'suspended', email: 'grace@example.com', phone: '07099887766' },
];

const kycColor: any = { verified: 'success', pending: 'warning', rejected: 'error' };

export default function SubOrgMembersPage() {
  const [tab, setTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchSubOrgMembers(1); // Demo branch ID
        if (data) {
          // Map DB columns to our frontend expectations
          const mapped = data.map((m: any) => ({
            id: `MBR-${String(m.id).padStart(3, '0')}`,
            name: m.user?.name || 'Unknown',
            role: m.user?.role?.replace('_', ' ')?.toUpperCase() || 'MEMBER',
            joined: new Date(m.joinedDate).toLocaleDateString(),
            kyc: m.kycStatus || 'pending',
            balance: m.wallet?.balance || 0,
            status: m.status,
            email: m.user?.email,
            phone: m.user?.phone || 'N/A'
          }));
          setMembers(mapped.length > 0 ? mapped : MOCK_MEMBERS);
        }
      } catch (error) {
        console.error("Failed to load members", error);
        setMembers(MOCK_MEMBERS);
      }
    }
    load();
  },[]);

  const filteredMembers = members.filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (tab === 0 || (tab === 1 && m.kyc === 'pending') || (tab === 2 && m.status === 'suspended'))
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b' }}>Member Management</Typography>
          <Typography sx={{ color: '#64748b', fontSize: '0.9rem' }}>Manage 1,245 active members in your branch.</Typography>
        </Box>
        <Button onClick={() => setIsAddOpen(true)} variant="contained" startIcon={<Add />} sx={{ bgcolor: '#0f766e', '&:hover': { bgcolor: '#0d9488' }, borderRadius: '10px', textTransform: 'none', fontWeight: 600 }}>
          Register Member
        </Button>
      </Box>

      <Card sx={{ borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
        <Box sx={{ borderBottom: 1, borderColor: '#f1f5f9', px: 2 }}>
          <Tabs value={tab} onChange={(e, v) => setTab(v)} TabIndicatorProps={{ sx: { bgcolor: '#0f766e', height: 3, borderRadius: '3px 3px 0 0' } }}>
            <Tab label="All Members" sx={{ textTransform: 'none', fontWeight: 600, color: tab === 0 ? '#0f766e' : '#64748b', '&.Mui-selected': { color: '#0f766e' } }} />
            <Tab label="Pending KYC Reports" sx={{ textTransform: 'none', fontWeight: 600, color: tab === 1 ? '#eab308' : '#64748b', '&.Mui-selected': { color: '#eab308' } }} />
            <Tab label="Suspended" sx={{ textTransform: 'none', fontWeight: 600, color: tab === 2 ? '#ef4444' : '#64748b', '&.Mui-selected': { color: '#ef4444' } }} />
          </Tabs>
        </Box>

        <Box sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center', bgcolor: '#f8fafc' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', px: 1.5, py: 0.5, flexGrow: 1 }}>
            <Search sx={{ color: '#94a3b8', mr: 1, fontSize: 20 }} />
            <input
              placeholder="Search by name, ID, phone..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem', color: '#334155' }}
            />
          </Box>
          <Button variant="outlined" startIcon={<FilterList />} sx={{ color: '#64748b', borderColor: '#e2e8f0', borderRadius: '10px', textTransform: 'none' }}>
            Filters
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#ffffff' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: '#64748b', py: 2 }}>Member Info</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b', py: 2 }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b', py: 2 }}>Balance</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b', py: 2 }}>KYC Status</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b', py: 2 }}>Joined</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: '#64748b', py: 2 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMembers.map((member) => (
                <TableRow key={member.id} hover sx={{ cursor: 'pointer', transition: 'all 0.2s', '&:hover': { bgcolor: '#f0fdfa' } }} onClick={() => setSelectedMember(member)}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ width: 36, height: 36, bgcolor: '#0f766e', fontSize: '0.9rem', fontWeight: 700 }}>{member.name.charAt(0)}</Avatar>
                      <Box>
                        <Typography sx={{ fontWeight: 700, color: '#1e293b', fontSize: '0.9rem' }}>{member.name}</Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: '#64748b' }}>{member.id}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={member.role} size="small" sx={{ bgcolor: member.role === 'Member' ? '#f1f5f9' : '#e0f2fe', color: member.role === 'Member' ? '#475569' : '#0369a1', fontWeight: 600, fontSize: '0.7rem' }} />
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontWeight: 700, color: '#0f766e', fontSize: '0.9rem' }}>₦{member.balance.toLocaleString()}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={member.kyc.toUpperCase()} size="small" color={kycColor[member.kyc]} sx={{ fontWeight: 700, fontSize: '0.7rem', height: 22 }} />
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ color: '#475569', fontSize: '0.85rem' }}>{member.joined}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" sx={{ color: '#94a3b8' }} onClick={(e) => { e.stopPropagation(); setSelectedMember(member); }}><MoreVert /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Member Profile Drawer */}
      <Drawer anchor="right" open={!!selectedMember} onClose={() => setSelectedMember(null)} PaperProps={{ sx: { width: 450, bgcolor: '#f8fafc' } }}>
        {selectedMember && (
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Box sx={{ p: 4, bgcolor: '#ffffff', borderBottom: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar sx={{ width: 80, height: 80, bgcolor: '#0f766e', fontSize: '2rem', fontWeight: 800, mb: 2, boxShadow: '0 8px 24px rgba(15, 118, 110, 0.2)' }}>{selectedMember.name.charAt(0)}</Avatar>
              <Typography sx={{ fontWeight: 800, fontSize: '1.3rem', color: '#1e293b' }}>{selectedMember.name}</Typography>
              <Typography sx={{ color: '#64748b', fontSize: '0.9rem', mb: 1 }}>{selectedMember.id} · {selectedMember.role}</Typography>
              <Chip label={selectedMember.status.toUpperCase()} size="small" sx={{ bgcolor: selectedMember.status === 'active' ? '#ecfdf5' : '#fef2f2', color: selectedMember.status === 'active' ? '#10b981' : '#ef4444', fontWeight: 700, fontSize: '0.7rem' }} />
            </Box>

            <Box sx={{ p: 3, flexGrow: 1, overflowY: 'auto' }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 2 }}>Contact Details</Typography>
              <Card sx={{ p: 2, borderRadius: '12px', mb: 4, border: '1px solid #f1f5f9', boxShadow: 'none' }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                    <Typography sx={{ fontSize: '0.75rem', color: '#64748b' }}>Email</Typography>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e293b' }}>{selectedMember.email}</Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography sx={{ fontSize: '0.75rem', color: '#64748b' }}>Phone</Typography>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e293b' }}>{selectedMember.phone}</Typography>
                  </Grid>
                </Grid>
              </Card>

              <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 2 }}>KYC & Compliance</Typography>
              <Card sx={{ p: 2, borderRadius: '12px', mb: 4, border: '1px solid #f1f5f9', boxShadow: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 1 }}>
                    {selectedMember.kyc === 'verified' ? <CheckCircle color="success" fontSize="small" /> : selectedMember.kyc === 'pending' ? <Warning color="warning" fontSize="small" /> : <Cancel color="error" fontSize="small" />}
                    {selectedMember.kyc.toUpperCase()}
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: '#64748b', mt: 0.5 }}>{selectedMember.kyc === 'verified' ? 'Identity verified by Partner Admin' : 'Awaiting document upload/review'}</Typography>
                </Box>
                <Button variant="outlined" size="small" startIcon={<UploadFile />} sx={{ textTransform: 'none', borderRadius: '8px', color: '#0f766e', borderColor: '#0f766e' }}>Docs</Button>
              </Card>

              <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 2 }}>Financial Summary</Typography>
              <Card sx={{ p: 2, borderRadius: '12px', border: '1px solid #0f766e20', bgcolor: '#f0fdfa', boxShadow: 'none' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography sx={{ fontSize: '0.85rem', color: '#64748b' }}>Wallet Balance</Typography>
                  <Typography sx={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f766e' }}>₦{selectedMember.balance.toLocaleString()}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontSize: '0.85rem', color: '#64748b' }}>Active Loans</Typography>
                  <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: '#f59e0b' }}>₦0.00</Typography>
                </Box>
              </Card>
            </Box>

            <Box sx={{ p: 3, bgcolor: '#ffffff', borderTop: '1px solid #f1f5f9', display: 'flex', gap: 2 }}>
              <Button fullWidth variant="outlined" sx={{ color: '#ef4444', borderColor: '#ef4444', textTransform: 'none', fontWeight: 700, borderRadius: '10px' }}>Suspend</Button>
              <Button fullWidth variant="contained" sx={{ bgcolor: '#0f766e', textTransform: 'none', fontWeight: 700, borderRadius: '10px' }}>Edit Member</Button>
            </Box>
          </Box>
        )}
      </Drawer>

      <Dialog open={isAddOpen} onClose={() => setIsAddOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '20px', p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 800, color: '#1e293b' }}>Register New Member</DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: '0.85rem', color: '#64748b', mb: 3 }}>Add a new member to this branch. They will receive an email to complete their profile.</Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="First Name" variant="outlined" size="small" sx={{ mb: 2 }} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Last Name" variant="outlined" size="small" sx={{ mb: 2 }} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth label="Email Address" type="email" variant="outlined" size="small" sx={{ mb: 2 }} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Phone Number" variant="outlined" size="small" sx={{ mb: 2 }} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField select fullWidth label="Role Assignment" defaultValue="member" size="small" sx={{ mb: 2 }}>
                <MenuItem value="member">Standard Member</MenuItem>
                <MenuItem value="sub_org_officer">Sub-Org Officer</MenuItem>
                <MenuItem value="finance_officer">Finance Officer</MenuItem>
              </TextField>
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'flex-end' }}>
            <Button onClick={() => setIsAddOpen(false)} sx={{ color: '#64748b', textTransform: 'none', fontWeight: 600 }}>Cancel</Button>
            <Button onClick={() => setIsAddOpen(false)} variant="contained" sx={{ bgcolor: '#0f766e', '&:hover': { bgcolor: '#0d9488' }, textTransform: 'none', fontWeight: 700, borderRadius: '8px' }}>Register Member</Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
