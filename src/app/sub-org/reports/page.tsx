'use client';

import { useState, useEffect } from "react";
import { 
  Box, Typography, Grid, Paper, Card, Button, 
  Avatar, LinearProgress, Divider, Stack,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Tooltip, CircularProgress, Chip
} from "@mui/material";
import { 
  Description as ReportIcon,
  GetApp as DownloadIcon,
  TrendingUp,
  TrendingDown,
  BarChart,
  People as UsersIcon,
  Timeline,
  CalendarMonth as CalendarIcon,
  Business as OrgIcon
} from "@mui/icons-material";
import api from '@/lib/api';

export default function SubOrgReportsPage() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSubOrgStats();
    }, []);

    const fetchSubOrgStats = async () => {
        try {
            // Reusing general report endpoints or specific sub-org ones if they exist
            const [financials, demographics] = await Promise.all([
                api.get('/reports/financial-performance').then(r => r.data),
                api.get('/reports/demographics').then(r => r.data)
            ]);
            setStats({ financials, demographics });
        } catch (e) {
            console.error('Failed to fetch sub-org stats', e);
        } finally {
            setLoading(false);
        }
    };

    const financials = stats?.financials || { revenue: 0, expenses: 0, netSurplus: 0 };
    const demographics = stats?.demographics || { totalMembers: 0, byGender: { MALE: 0, FEMALE: 0 } };

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}>
            <CircularProgress sx={{ color: '#004d40' }} />
        </Box>
    );

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 2 }}>
                        <OrgIcon sx={{ fontSize: 40, color: '#004d40' }} />
                        Sub-Organization Analytics
                    </Typography>
                    <Typography sx={{ color: '#64748b', mt: 0.5 }}>Performance and demographic insights for your specific branch.</Typography>
                </Box>
                <Button variant="outlined" startIcon={<DownloadIcon />} sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 700 }}>
                    Export Data
                </Button>
            </Box>

            <Grid container spacing={4} sx={{ mb: 6 }}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ p: 3, borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                        <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>Branch Revenue</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, mt: 1 }}>
                            <Typography variant="h4" sx={{ fontWeight: 900, color: '#1e293b' }}>₦{financials.revenue.toLocaleString()}</Typography>
                            <Box sx={{ color: '#10b981', display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                <TrendingUp sx={{ fontSize: 16 }} />
                                <Typography variant="caption" sx={{ fontWeight: 700 }}>+4.2%</Typography>
                            </Box>
                        </Box>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ p: 3, borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                        <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>Branch Expenses</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, mt: 1 }}>
                            <Typography variant="h4" sx={{ fontWeight: 900, color: '#1e293b' }}>₦{financials.expenses.toLocaleString()}</Typography>
                            <Box sx={{ color: '#ef4444', display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                <TrendingDown sx={{ fontSize: 16 }} />
                                <Typography variant="caption" sx={{ fontWeight: 700 }}>-1.8%</Typography>
                            </Box>
                        </Box>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ p: 3, borderRadius: '24px', bgcolor: '#004d40', color: 'white', boxShadow: '0 10px 30px rgba(0,77,64,0.2)' }}>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 800, textTransform: 'uppercase' }}>Net Surplus</Typography>
                        <Typography variant="h4" sx={{ fontWeight: 900, mt: 1 }}>₦{financials.netSurplus.toLocaleString()}</Typography>
                    </Card>
                </Grid>
            </Grid>

            <Grid container spacing={4}>
                <Grid size={{ xs: 12, lg: 8 }}>
                    <Paper sx={{ p: 4, borderRadius: '32px', border: '1px solid #f1f5f9', boxShadow: '0 10px 40px rgba(0,0,0,0.02)' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                            <Typography variant="h6" sx={{ fontWeight: 800 }}>Member Demographics</Typography>
                            <Box sx={{ textAlign: 'right' }}>
                                <Typography variant="h3" sx={{ fontWeight: 900, color: '#1e293b' }}>{demographics.totalMembers}</Typography>
                                <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 800 }}>TOTAL BRANCH MEMBERSHIP</Typography>
                            </Box>
                        </Box>
                        
                        <Stack spacing={3}>
                            <Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#3b82f6' }}>Male Members</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 800 }}>{demographics.byGender['MALE']}</Typography>
                                </Box>
                                <LinearProgress variant="determinate" value={(demographics.byGender['MALE'] / (demographics.totalMembers || 1)) * 100} sx={{ height: 10, borderRadius: 5, bgcolor: '#eff6ff', '& .MuiLinearProgress-bar': { bgcolor: '#3b82f6' } }} />
                            </Box>
                            <Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#ec4899' }}>Female Members</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 800 }}>{demographics.byGender['FEMALE']}</Typography>
                                </Box>
                                <LinearProgress variant="determinate" value={(demographics.byGender['FEMALE'] / (demographics.totalMembers || 1)) * 100} sx={{ height: 10, borderRadius: 5, bgcolor: '#fdf2f8', '& .MuiLinearProgress-bar': { bgcolor: '#ec4899' } }} />
                            </Box>
                        </Stack>
                    </Paper>
                </Grid>
                
                <Grid size={{ xs: 12, lg: 4 }}>
                    <Paper sx={{ p: 4, borderRadius: '32px', border: '1px solid #f1f5f9', boxShadow: '0 10px 40px rgba(0,0,0,0.02)', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
                        <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: '#f0fdf4', color: '#16a34a' }}>
                            <Timeline sx={{ fontSize: 40 }} />
                        </Avatar>
                        <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>Growth Rate</Typography>
                        <Typography variant="h2" sx={{ fontWeight: 900, color: '#16a34a' }}>+12%</Typography>
                        <Typography variant="body2" sx={{ color: '#64748b' }}>Month-over-month increase in active memberships for this sub-organization.</Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}
