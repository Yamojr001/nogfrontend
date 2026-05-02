"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { Box, Typography, Grid, Paper, Card, CardContent, Chip, TextField, Button, Avatar, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress } from '@mui/material';
import { Search, AccountBalance, Schedule, CheckCircle, Add, FilterAlt, TrendingUp } from '@mui/icons-material';
import { fetchPartnerLoans } from '@/lib/api';

export default function Page() {
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [loans, setLoans] = useState<any[]>([]);

    useEffect(() => {
        async function load() {
            try {
                const data = await fetchPartnerLoans();
                const orgId = typeof window !== 'undefined' ? Number(localStorage.getItem('organisation_id') || 0) : 0;
                const list = Array.isArray(data) ? data : (data?.data || data?.items || []);
                const normalized = list
                    .filter((loan: any) => !orgId || Number(loan.organisationId || loan.organizationId || 0) === orgId)
                    .map((loan: any) => ({
                        id: loan.id,
                        ref: `LN-${String(loan.id).padStart(4, '0')}`,
                        member: loan.member?.user?.name || loan.member?.user?.fullName || loan.member?.name || `Member #${loan.memberId || loan.member?.id || loan.id}`,
                        amount: Number(loan.amount || 0),
                        tenor: loan.term ? `${loan.term} months` : loan.duration ? `${loan.duration} months` : '—',
                        status: (loan.status || 'pending').toLowerCase(),
                        stage: loan.approval?.currentLevel && loan.approval?.totalLevels
                            ? `Level ${loan.approval.currentLevel} of ${loan.approval.totalLevels}`
                            : loan.status || 'pending',
                        date: loan.createdAt ? new Date(loan.createdAt).toLocaleDateString('en-NG', { day: '2-digit', month: 'short', year: 'numeric' }) : '—',
                    }));
                setLoans(normalized);
            } catch (error) {
                console.error('Failed to load partner loans', error);
                setLoans([]);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const filtered = useMemo(() => loans.filter((loan) =>
        [loan.ref, loan.member, loan.stage, loan.status].join(' ').toLowerCase().includes(search.toLowerCase())
    ), [loans, search]);

    const metrics = useMemo(() => {
        const pending = loans.filter((l) => l.status === 'pending').length;
        const approved = loans.filter((l) => l.status === 'approved' || l.status === 'active' || l.status === 'completed').reduce((sum, l) => sum + l.amount, 0);
        const portfolio = loans.filter((l) => l.status !== 'rejected').reduce((sum, l) => sum + l.amount, 0);
        return [
            { label: 'Active Requests', value: loans.length, icon: <Schedule />, color: '#0f8a62' },
            { label: 'Approved Value', value: `₦${approved.toLocaleString()}`, icon: <CheckCircle />, color: '#10b981' },
            { label: 'Pending Review', value: pending, icon: <FilterAlt />, color: '#f59e0b' },
            { label: 'Portfolio Value', value: `₦${portfolio.toLocaleString()}`, icon: <TrendingUp />, color: '#7c3aed' },
        ];
    }, [loans]);

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 3, gap: 2, flexWrap: 'wrap' }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: '#065f46' }}>Loans</Typography>
                    <Typography sx={{ color: '#64748b', mt: 0.5 }}>Track member loan applications and approval progress.</Typography>
                </Box>
                <Button variant="contained" startIcon={<Add />} sx={{ bgcolor: '#0f8a62', '&:hover': { bgcolor: '#047857' }, borderRadius: '12px', textTransform: 'none', fontWeight: 700 }}>New Loan</Button>
            </Box>

            <Grid container spacing={2.5} sx={{ mb: 3 }}>
                {metrics.map((m) => (
                    <Grid key={m.label} size={{ xs: 12, sm: 6, md: 3 }}>
                        <Card sx={{ borderRadius: '20px', border: '1px solid #d1fae5', boxShadow: 'none' }}>
                            <CardContent sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box>
                                    <Typography sx={{ color: '#64748b', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase' }}>{m.label}</Typography>
                                    <Typography sx={{ color: '#065f46', fontSize: '1.5rem', fontWeight: 900 }}>{m.value}</Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: `${m.color}15`, color: m.color, width: 46, height: 46 }}>{m.icon}</Avatar>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Paper sx={{ p: 3, borderRadius: '24px', border: '1px solid #d1fae5', boxShadow: 'none' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 2, flexWrap: 'wrap' }}>
                    <Typography sx={{ fontWeight: 800, color: '#065f46' }}>Loan Applications</Typography>
                    <TextField size="small" placeholder="Search members, transactions..." value={search} onChange={(e) => setSearch(e.target.value)} InputProps={{ startAdornment: <Search sx={{ mr: 1, color: '#94a3b8' }} /> }} sx={{ minWidth: 280, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                </Box>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress sx={{ color: '#0f8a62' }} /></Box>
                ) : filtered.length === 0 ? (
                    <Box sx={{ py: 8, textAlign: 'center' }}>
                        <Typography sx={{ fontWeight: 800, color: '#1e293b' }}>No loans found</Typography>
                        <Typography sx={{ color: '#64748b', mt: 1 }}>There are no loan records available for this partner yet.</Typography>
                    </Box>
                ) : (
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 800, color: '#64748b' }}>Ref</TableCell>
                                <TableCell sx={{ fontWeight: 800, color: '#64748b' }}>Member</TableCell>
                                <TableCell sx={{ fontWeight: 800, color: '#64748b' }}>Amount</TableCell>
                                <TableCell sx={{ fontWeight: 800, color: '#64748b' }}>Tenor</TableCell>
                                <TableCell sx={{ fontWeight: 800, color: '#64748b' }}>Stage</TableCell>
                                <TableCell sx={{ fontWeight: 800, color: '#64748b' }}>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filtered.map((loan) => (
                                <TableRow key={loan.id} hover>
                                    <TableCell sx={{ fontWeight: 700, color: '#0f8a62' }}>{loan.ref}</TableCell>
                                    <TableCell sx={{ fontWeight: 700, color: '#1e293b' }}>{loan.member}</TableCell>
                                    <TableCell>₦{loan.amount.toLocaleString()}</TableCell>
                                    <TableCell>{loan.tenor}</TableCell>
                                    <TableCell>{loan.stage}</TableCell>
                                    <TableCell>
                                        <Chip size="small" label={loan.status.toUpperCase()} sx={{ bgcolor: loan.status === 'approved' || loan.status === 'active' ? '#dcfce7' : loan.status === 'pending' ? '#fef3c7' : '#fee2e2', color: loan.status === 'approved' || loan.status === 'active' ? '#166534' : loan.status === 'pending' ? '#92400e' : '#991b1b', fontWeight: 700 }} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </Paper>
        </Box>
    );
}
