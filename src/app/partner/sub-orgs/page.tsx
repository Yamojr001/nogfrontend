'use client';

import { useEffect, useMemo, useState } from 'react';
import { Box, Typography, Paper, TextField, InputAdornment, Grid, Chip, CircularProgress, Button, Dialog, DialogTitle, DialogContent, DialogActions, Stack } from '@mui/material';
import { AccountTree, Search as SearchIcon, Layers, CheckCircle, Apartment } from '@mui/icons-material';
import { createSubOrganisation, fetchHierarchySubOrgs } from '@/lib/api';

type SubOrgItem = {
    id: number;
    name: string;
    code: string;
    type?: string;
};

export default function Page() {
    const [subOrgs, setSubOrgs] = useState<SubOrgItem[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [orgName, setOrgName] = useState('Partner Organization');
    const [addOpen, setAddOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({ name: '', acronym: '', email: '', phone: '', hqAddress: '', state: '' });

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setError('');
                const orgIdStr = typeof window !== 'undefined' ? localStorage.getItem('organisation_id') : null;
                setOrgName(typeof window !== 'undefined' ? localStorage.getItem('org_name') || 'Federal Cooperative Partner' : 'Federal Cooperative Partner');

                if (!orgIdStr) {
                    setError('No partner organisation was found for this account.');
                    setSubOrgs([]);
                    return;
                }

                const data = await fetchHierarchySubOrgs(Number(orgIdStr));
                setSubOrgs(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('Failed to load partner sub-organisations', err);
                setError('Unable to load sub-organisations right now. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    const filteredSubOrgs = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return subOrgs;
        return subOrgs.filter((item) => item.name.toLowerCase().includes(query) || String(item.code || '').toLowerCase().includes(query));
    }, [search, subOrgs]);

    const latestSubOrgName = useMemo(() => {
        if (subOrgs.length === 0) return 'No sub-org yet';
        return subOrgs[0]?.name || 'No sub-org yet';
    }, [subOrgs]);

    const stats = [
        { label: 'Total sub-organisations', value: subOrgs.length, hint: 'Under this partner', icon: <AccountTree /> },
        { label: 'Current matches', value: filteredSubOrgs.length, hint: 'Based on your search', icon: <SearchIcon /> },
        { label: 'Latest listed sub-org', value: latestSubOrgName, hint: 'Most recent in this list', icon: <CheckCircle /> },
    ];

    const handleCreate = async () => {
        try {
            setSaving(true);
            const created = await createSubOrganisation({
                ...form,
                name: form.name.trim(),
                acronym: form.acronym.trim() || undefined,
                email: form.email.trim() || undefined,
                phone: form.phone.trim() || undefined,
                hqAddress: form.hqAddress.trim() || undefined,
                state: form.state.trim() || undefined,
            });

            setSubOrgs((current) => [{ id: created.id, name: created.name, code: created.code, type: created.type }, ...current]);
            setAddOpen(false);
            setForm({ name: '', acronym: '', email: '', phone: '', hqAddress: '', state: '' });
        } catch (err) {
            console.error('Failed to create sub-organisation', err);
            setError('Unable to create the sub-organisation. Please check the details and try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
        <Box>
            <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', gap: 2, alignItems: { xs: 'stretch', md: 'end' } }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: '#065f46' }}>Sub-Organisations</Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', mt: 0.75 }}>
                        View, search, and add sub-organisations under {orgName}.
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    onClick={() => setAddOpen(true)}
                    sx={{ bgcolor: '#0f8a62', borderRadius: '12px', textTransform: 'none', fontWeight: 800, px: 2.5, '&:hover': { bgcolor: '#047857' } }}
                >
                    Add Sub-Organisation
                </Button>
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                {stats.map((stat) => (
                    <Grid key={stat.label} size={{ xs: 12, sm: 4 }}>
                        <Paper sx={{ p: 3, borderRadius: '20px', border: '1px solid #d1fae5', boxShadow: 'none' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                <Box sx={{ width: 42, height: 42, borderRadius: '12px', bgcolor: '#d1fae5', color: '#0f8a62', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {stat.icon}
                                </Box>
                            </Box>
                            <Typography variant="h4" sx={{ fontWeight: 900, color: '#065f46' }}>{stat.value}</Typography>
                            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, mt: 0.5 }}>{stat.label}</Typography>
                            <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700 }}>{stat.hint}</Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            <Paper sx={{ p: 3, borderRadius: '24px', border: '1px solid #d1fae5', boxShadow: 'none', mb: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, justifyContent: 'space-between', alignItems: { xs: 'stretch', md: 'center' } }}>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 800, color: '#065f46' }}>Search sub-organisations</Typography>
                        <Typography variant="body2" sx={{ color: '#64748b' }}>Search by name or code.</Typography>
                    </Box>
                    <TextField
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search sub-organisations..."
                        size="small"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ width: { xs: '100%', md: 360 }, '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: '#f0fdf4' } }}
                    />
                </Box>
            </Paper>

            {loading ? (
                <Paper sx={{ p: 8, borderRadius: '24px', textAlign: 'center', border: '1px solid #d1fae5', boxShadow: 'none' }}>
                    <CircularProgress sx={{ color: '#0f8a62' }} />
                    <Typography sx={{ mt: 2, color: '#64748b' }}>Loading sub-organisations...</Typography>
                </Paper>
            ) : error ? (
                <Paper sx={{ p: 4, borderRadius: '24px', textAlign: 'center', border: '1px solid #fecaca', bgcolor: '#fef2f2', boxShadow: 'none' }}>
                    <Typography sx={{ fontWeight: 800, color: '#b91c1c' }}>{error}</Typography>
                </Paper>
            ) : filteredSubOrgs.length === 0 ? (
                <Paper sx={{ p: 6, borderRadius: '24px', textAlign: 'center', border: '1px dashed #d1fae5', bgcolor: '#f8fffb', boxShadow: 'none' }}>
                    <Layers sx={{ fontSize: 52, color: '#a7f3d0', mb: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#065f46' }}>No sub-organisations found</Typography>
                    <Typography sx={{ color: '#64748b', mt: 1 }}>
                        {search ? 'Try a different search term.' : 'This partner does not have any active sub-organisations yet.'}
                    </Typography>
                </Paper>
            ) : (
                <Grid container spacing={3}>
                    {filteredSubOrgs.map((subOrg) => (
                        <Grid key={subOrg.id} size={{ xs: 12, md: 6, xl: 4 }}>
                            <Paper sx={{ p: 3, height: '100%', borderRadius: '24px', border: '1px solid #d1fae5', boxShadow: 'none', transition: 'all 0.2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 12px 32px rgba(15,138,98,0.08)' } }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'flex-start' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Box sx={{ width: 48, height: 48, borderRadius: '16px', background: 'linear-gradient(135deg, #0f8a62 0%, #047857 100%)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(15,138,98,0.18)' }}>
                                            <Apartment />
                                        </Box>
                                        <Box>
                                            <Typography variant="h6" sx={{ fontWeight: 800, color: '#065f46', lineHeight: 1.2 }}>{subOrg.name}</Typography>
                                            <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>Sub-Organisation</Typography>
                                        </Box>
                                    </Box>
                                    <Chip
                                        icon={<CheckCircle />}
                                        label="Active"
                                        size="small"
                                        sx={{ bgcolor: '#f0fdf4', color: '#0f8a62', fontWeight: 800, '& .MuiChip-icon': { color: '#0f8a62' } }}
                                    />
                                </Box>

                                <Box sx={{ mt: 3, display: 'grid', gap: 1.25 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, p: 1.5, borderRadius: '14px', bgcolor: '#f8fffb' }}>
                                        <Typography sx={{ fontSize: '0.78rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Code</Typography>
                                        <Typography sx={{ fontWeight: 800, color: '#0f8a62', fontFamily: 'monospace' }}>{subOrg.code || '—'}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, p: 1.5, borderRadius: '14px', bgcolor: '#f8fffb' }}>
                                        <Typography sx={{ fontSize: '0.78rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Type</Typography>
                                        <Typography sx={{ fontWeight: 700, color: '#334155' }}>{subOrg.type || 'sub_org'}</Typography>
                                    </Box>
                                </Box>

                                <Button
                                    fullWidth
                                    variant="outlined"
                                    sx={{ mt: 3, borderRadius: '12px', textTransform: 'none', fontWeight: 800, borderColor: '#0f8a62', color: '#0f8a62', '&:hover': { borderColor: '#047857', bgcolor: '#f0fdf4' } }}
                                >
                                    View details
                                </Button>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>

        <Dialog open={addOpen} onClose={() => !saving && setAddOpen(false)} fullWidth maxWidth="sm">
            <DialogTitle sx={{ fontWeight: 900, color: '#065f46' }}>Add Sub-Organisation</DialogTitle>
            <DialogContent dividers>
                <Stack spacing={2} sx={{ pt: 1 }}>
                    <TextField label="Name *" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} fullWidth />
                    <TextField label="Acronym" value={form.acronym} onChange={(e) => setForm((f) => ({ ...f, acronym: e.target.value }))} fullWidth />
                    <TextField label="Email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} fullWidth />
                    <TextField label="Phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} fullWidth />
                    <TextField label="Address" value={form.hqAddress} onChange={(e) => setForm((f) => ({ ...f, hqAddress: e.target.value }))} fullWidth multiline minRows={2} />
                    <TextField label="State" value={form.state} onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))} fullWidth />
                </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 2.5 }}>
                <Button onClick={() => setAddOpen(false)} disabled={saving} sx={{ textTransform: 'none' }}>Cancel</Button>
                <Button
                    onClick={handleCreate}
                    disabled={saving || !form.name.trim()}
                    variant="contained"
                    sx={{ bgcolor: '#0f8a62', textTransform: 'none', fontWeight: 800, '&:hover': { bgcolor: '#047857' } }}
                >
                    {saving ? 'Saving...' : 'Create Sub-Organisation'}
                </Button>
            </DialogActions>
        </Dialog>
        </>
    );
}
