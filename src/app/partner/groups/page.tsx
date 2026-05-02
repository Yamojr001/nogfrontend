'use client';

import { useEffect, useMemo, useState } from 'react';
import { Box, Typography, Paper, Grid, Chip, TextField, InputAdornment, MenuItem } from '@mui/material';
import { Group as GroupIcon, Search as SearchIcon, AccountTree, Apartment } from '@mui/icons-material';
import { fetchHierarchyGroups, fetchHierarchySubOrgs } from '@/lib/api';

type SubOrgItem = {
    id: number;
    name: string;
    code: string;
    type?: string;
};

type GroupItem = {
    id: number;
    name: string;
    code?: string;
    subOrgId: number;
    subOrgName: string;
};

export default function Page() {
    const [subOrgs, setSubOrgs] = useState<SubOrgItem[]>([]);
    const [groups, setGroups] = useState<GroupItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [subOrgFilter, setSubOrgFilter] = useState<'all' | string>('all');

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setError('');
                const orgIdStr = typeof window !== 'undefined' ? localStorage.getItem('organisation_id') : null;

                if (!orgIdStr) {
                    setError('No partner organisation was found for this account.');
                    setSubOrgs([]);
                    setGroups([]);
                    return;
                }

                const subOrgList = await fetchHierarchySubOrgs(Number(orgIdStr));
                const normalizedSubOrgs: SubOrgItem[] = Array.isArray(subOrgList) ? subOrgList : [];
                setSubOrgs(normalizedSubOrgs);

                const groupLists = await Promise.all(
                    normalizedSubOrgs.map(async (subOrg) => {
                        try {
                            const items = await fetchHierarchyGroups(subOrg.id);
                            const safeItems = Array.isArray(items) ? items : [];
                            return safeItems.map((item: any) => ({
                                id: item.id,
                                name: item.name,
                                code: item.code,
                                subOrgId: subOrg.id,
                                subOrgName: subOrg.name,
                            }));
                        } catch {
                            return [] as GroupItem[];
                        }
                    })
                );

                setGroups(groupLists.flat());
            } catch (err) {
                console.error('Failed to load partner groups', err);
                setError('Unable to load groups right now. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    const filteredGroups = useMemo(() => {
        const query = search.trim().toLowerCase();
        return groups.filter((item) => {
            const matchesSubOrg = subOrgFilter === 'all' ? true : String(item.subOrgId) === subOrgFilter;
            const matchesSearch = !query
                ? true
                : item.name.toLowerCase().includes(query) || String(item.code || '').toLowerCase().includes(query);
            return matchesSubOrg && matchesSearch;
        });
    }, [groups, search, subOrgFilter]);

    const stats = [
        { label: 'Total groups', value: groups.length, hint: 'Across all sub-orgs', icon: <GroupIcon /> },
        { label: 'Sub-organisations', value: subOrgs.length, hint: 'Under this partner', icon: <Apartment /> },
        { label: 'Filtered results', value: filteredGroups.length, hint: 'Current view', icon: <SearchIcon /> },
    ];

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 900, color: '#065f46' }}>Groups</Typography>
                <Typography variant="body2" sx={{ color: '#64748b', mt: 0.75 }}>
                    View all groups under your sub-organisations and filter by sub-org.
                </Typography>
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                {stats.map((stat) => (
                    <Grid key={stat.label} size={{ xs: 12, sm: 4 }}>
                        <Paper sx={{ p: 3, borderRadius: '20px', border: '1px solid #d1fae5', boxShadow: 'none' }}>
                            <Box sx={{ width: 42, height: 42, borderRadius: '12px', bgcolor: '#d1fae5', color: '#0f8a62', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                                {stat.icon}
                            </Box>
                            <Typography variant="h4" sx={{ fontWeight: 900, color: '#065f46' }}>{stat.value}</Typography>
                            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 700, mt: 0.5 }}>{stat.label}</Typography>
                            <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700 }}>{stat.hint}</Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            <Paper sx={{ p: 3, borderRadius: '24px', border: '1px solid #d1fae5', boxShadow: 'none', mb: 3 }}>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 7 }}>
                        <TextField
                            fullWidth
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search groups by name or code..."
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: '#f0fdf4' } }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 5 }}>
                        <TextField
                            select
                            fullWidth
                            value={subOrgFilter}
                            onChange={(e) => setSubOrgFilter(e.target.value)}
                            label="Filter by sub-organisation"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: '#f0fdf4' } }}
                        >
                            <MenuItem value="all">All sub-organisations</MenuItem>
                            {subOrgs.map((subOrg) => (
                                <MenuItem key={subOrg.id} value={String(subOrg.id)}>{subOrg.name}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                </Grid>
            </Paper>

            {loading ? (
                <Paper sx={{ p: 8, borderRadius: '24px', textAlign: 'center', border: '1px solid #d1fae5', boxShadow: 'none' }}>
                    <Typography sx={{ color: '#64748b' }}>Loading groups...</Typography>
                </Paper>
            ) : error ? (
                <Paper sx={{ p: 4, borderRadius: '24px', textAlign: 'center', border: '1px solid #fecaca', bgcolor: '#fef2f2', boxShadow: 'none' }}>
                    <Typography sx={{ fontWeight: 800, color: '#b91c1c' }}>{error}</Typography>
                </Paper>
            ) : filteredGroups.length === 0 ? (
                <Paper sx={{ p: 6, borderRadius: '24px', textAlign: 'center', border: '1px dashed #d1fae5', bgcolor: '#f8fffb', boxShadow: 'none' }}>
                    <AccountTree sx={{ fontSize: 52, color: '#a7f3d0', mb: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#065f46' }}>No groups found</Typography>
                    <Typography sx={{ color: '#64748b', mt: 1 }}>Adjust your filter or search to see available groups.</Typography>
                </Paper>
            ) : (
                <Grid container spacing={3}>
                    {filteredGroups.map((group) => (
                        <Grid key={`${group.subOrgId}-${group.id}`} size={{ xs: 12, md: 6, xl: 4 }}>
                            <Paper sx={{ p: 3, borderRadius: '24px', border: '1px solid #d1fae5', boxShadow: 'none' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                                    <Box sx={{ width: 40, height: 40, borderRadius: '12px', background: 'linear-gradient(135deg, #0f8a62 0%, #047857 100%)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <GroupIcon fontSize="small" />
                                    </Box>
                                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#065f46', lineHeight: 1.2 }}>{group.name}</Typography>
                                </Box>

                                <Box sx={{ display: 'grid', gap: 1.25 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1.25, borderRadius: '12px', bgcolor: '#f8fffb' }}>
                                        <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>Sub-Org</Typography>
                                        <Chip label={group.subOrgName} size="small" sx={{ bgcolor: '#f0fdf4', color: '#0f8a62', fontWeight: 700 }} />
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1.25, borderRadius: '12px', bgcolor: '#f8fffb' }}>
                                        <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>Code</Typography>
                                        <Typography sx={{ fontFamily: 'monospace', color: '#0f8a62', fontWeight: 800 }}>{group.code || '—'}</Typography>
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
}
