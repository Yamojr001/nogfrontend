'use client';

import { useState, useEffect } from "react";
import { 
  Box, Typography, Grid, Paper, Card, Button, 
  Avatar, LinearProgress, Divider, Stack,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Tooltip, CircularProgress
} from "@mui/material";
import { 
  Description as ReportIcon,
  GetApp as DownloadIcon,
  TrendingUp,
  TrendingDown,
  BarChart,
  People as UsersIcon,
  Timeline,
  CalendarMonth as CalendarIcon
} from "@mui/icons-material";
import api from '@/lib/api';

export default function ReportsPage() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [financials, demographics] = await Promise.all([
                api.get('/reports/financial-performance').then(r => r.data),
                api.get('/reports/demographics').then(r => r.data)
            ]);
            setStats({ financials, demographics });
        } catch (e) {
            console.error('Failed to fetch stats', e);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (type: string, format: 'pdf' | 'csv') => {
        try {
            const endpoint = type === 'Transactions' 
                ? `/reports/transactions/export${format === 'pdf' ? '/pdf' : ''}`
                : `/reports/members/export`;
            
            const response = await api.get(endpoint, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${type.toLowerCase()}.${format}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (e) {
            console.error('Download failed', e);
            alert('Failed to download report. Please ensure you have sufficient permissions.');
        }
    };

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}>
            <CircularProgress sx={{ color: '#0369a1' }} />
        </Box>
    );

    return (
        <Box>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: '#1e293b' }}>Reports & Analytics</Typography>
                    <Typography sx={{ color: '#64748b' }}>Real-time system insights and historical data.</Typography>
                </Box>
                <Stack direction="row" spacing={2}>
                    <Button 
                        variant="outlined" 
                        startIcon={<DownloadIcon />} 
                        onClick={() => handleDownload('Transactions', 'csv')}
                        sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 700 }}
                    >
                        Export CSV
                    </Button>
                    <Button 
                        variant="contained" 
                        startIcon={<DownloadIcon />} 
                        onClick={() => handleDownload('Transactions', 'pdf')}
                        sx={{ bgcolor: '#0369a1', borderRadius: '12px', textTransform: 'none', fontWeight: 700 }}
                    >
                        Export PDF
                    </Button>
                </Stack>
            </Box>

            <Grid container spacing={4} sx={{ mb: 6 }}>
                {/* Financial Performance Card */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card sx={{ p: 4, borderRadius: '32px', border: '1px solid #f1f5f9', boxShadow: '0 10px 40px rgba(0,0,0,0.03)' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                            <Avatar sx={{ bgcolor: '#eff6ff', color: '#2563eb', borderRadius: '14px', width: 48, height: 48 }}>
                                <BarChart />
                            </Avatar>
                            <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b' }}>Financial Performance</Typography>
                        </Box>

                        <Stack spacing={2.5}>
                            <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography sx={{ color: '#64748b', fontWeight: 600, fontSize: '0.9rem' }}>Total Revenue</Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <TrendingUp sx={{ color: '#10b981', fontSize: 18 }} />
                                    <Typography sx={{ fontWeight: 800, color: '#10b981' }}>₦{(financials.revenue || 0).toLocaleString()}</Typography>
                                </Box>
                            </Box>
                            <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography sx={{ color: '#64748b', fontWeight: 600, fontSize: '0.9rem' }}>Total Expenses</Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <TrendingDown sx={{ color: '#ef4444', fontSize: 18 }} />
                                    <Typography sx={{ fontWeight: 800, color: '#ef4444' }}>₦{(financials.expenses || 0).toLocaleString()}</Typography>
                                </Box>
                            </Box>
                            <Divider sx={{ my: 1 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 1 }}>
                                <Typography sx={{ fontWeight: 800, color: '#1e293b' }}>Net Surplus</Typography>
                                <Typography variant="h5" sx={{ fontWeight: 900, color: '#0369a1' }}>₦{(financials.netSurplus || 0).toLocaleString()}</Typography>
                            </Box>
                        </Stack>
                    </Card>
                </Grid>

                {/* Demographics Card */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card sx={{ p: 4, borderRadius: '32px', border: '1px solid #f1f5f9', boxShadow: '0 10px 40px rgba(0,0,0,0.03)' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                            <Avatar sx={{ bgcolor: '#f0fdf4', color: '#16a34a', borderRadius: '14px', width: 48, height: 48 }}>
                                <UsersIcon />
                            </Avatar>
                            <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b' }}>Demographics</Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', mb: 4 }}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h3" sx={{ fontWeight: 900, color: '#1e293b' }}>{demographics.totalMembers || 0}</Typography>
                                <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Total Members</Typography>
                            </Box>
                            <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h3" sx={{ fontWeight: 900, color: '#16a34a' }}>
                                    {Math.round(((demographics.byGender?.FEMALE || 0) / (demographics.totalMembers || 1)) * 100)}%
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Female Ratio</Typography>
                            </Box>
                        </Box>

                        <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, px: 0.5 }}>
                                <Typography variant="caption" sx={{ fontWeight: 700, color: '#3b82f6' }}>Male ({demographics.byGender?.MALE || 0})</Typography>
                                <Typography variant="caption" sx={{ fontWeight: 700, color: '#ec4899' }}>Female ({demographics.byGender?.FEMALE || 0})</Typography>
                            </Box>
                            <Box sx={{ height: 12, bgcolor: '#f1f5f9', borderRadius: '6px', overflow: 'hidden', display: 'flex' }}>
                                <Box sx={{ width: `${((demographics.byGender?.MALE || 0) / (demographics.totalMembers || 1)) * 100}%`, bgcolor: '#3b82f6', height: '100%' }} />
                                <Box sx={{ width: `${((demographics.byGender?.FEMALE || 0) / (demographics.totalMembers || 1)) * 100}%`, bgcolor: '#ec4899', height: '100%' }} />
                            </Box>
                        </Box>
                    </Card>
                </Grid>
            </Grid>

            {/* Archived Reports */}
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, px: 1 }}>Archived Statements</Typography>
            <Paper sx={{ borderRadius: '24px', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f8fafc' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 800, color: '#64748b' }}>Report Title</TableCell>
                            <TableCell sx={{ fontWeight: 800, color: '#64748b' }}>Period</TableCell>
                            <TableCell sx={{ fontWeight: 800, color: '#64748b' }}>Category</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 800, color: '#64748b' }}>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow hover>
                           <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <ReportIcon sx={{ color: '#3b82f6' }} />
                                    <Typography sx={{ fontWeight: 700, color: '#1e293b' }}>Full Transaction History Export</Typography>
                                </Box>
                            </TableCell>
                            <TableCell sx={{ color: '#64748b', fontWeight: 600 }}>All Time</TableCell>
                            <TableCell>
                                <Chip label="Financial" size="small" sx={{ fontWeight: 800, fontSize: '0.65rem', borderRadius: '6px' }} />
                            </TableCell>
                            <TableCell align="right">
                                <Button 
                                    size="small" 
                                    startIcon={<DownloadIcon />}
                                    onClick={() => handleDownload('Transactions', 'pdf')}
                                    sx={{ fontWeight: 700, color: '#0369a1' }}
                                >
                                    Download
                                </Button>
                            </TableCell>
                        </TableRow>
                        <TableRow hover>
                           <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <ReportIcon sx={{ color: '#10b981' }} />
                                    <Typography sx={{ fontWeight: 700, color: '#1e293b' }}>Member Directory List</Typography>
                                </Box>
                            </TableCell>
                            <TableCell sx={{ color: '#64748b', fontWeight: 600 }}>Active Members</TableCell>
                            <TableCell>
                                <Chip label="Membership" size="small" sx={{ fontWeight: 800, fontSize: '0.65rem', borderRadius: '6px' }} />
                            </TableCell>
                            <TableCell align="right">
                                <Button 
                                    size="small" 
                                    startIcon={<DownloadIcon />}
                                    onClick={() => handleDownload('Members', 'csv')}
                                    sx={{ fontWeight: 700, color: '#0369a1' }}
                                >
                                    Download
                                </Button>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Paper>
        </Box>
    );
}
