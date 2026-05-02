'use client';

import { useState, useEffect } from "react";
import { 
  Box, Typography, Grid, Paper, Card, Button, 
  Avatar, LinearProgress, Divider, Stack,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Tooltip, CircularProgress, Chip
} from "@mui/material";
import { 
  Assessment as ReportIcon,
  Download as DownloadIcon,
  TrendingUp,
  People as UsersIcon,
  AccountBalance as FinanceIcon,
  Group as GroupIcon,
  Store as PartnerIcon
} from "@mui/icons-material";
import api from '@/lib/api';

export default function PartnerReportsPage() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPartnerReportData();
    }, []);

    const fetchPartnerReportData = async () => {
        try {
            const [financials, demographics] = await Promise.all([
                api.get('/reports/financial-performance').then(r => r.data),
                api.get('/reports/demographics').then(r => r.data)
            ]);
            setStats({ financials, demographics });
        } catch (e) {
            console.error('Failed to fetch partner reports', e);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}>
            <CircularProgress sx={{ color: '#0f8a62' }} />
        </Box>
    );

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 2 }}>
                        <PartnerIcon sx={{ fontSize: 40, color: '#0f8a62' }} />
                        Partner Performance Analytics
                    </Typography>
                    <Typography sx={{ color: '#64748b', mt: 0.5 }}>Consolidated insights across all sub-organizations and members.</Typography>
                </Box>
                <Button variant="outlined" startIcon={<DownloadIcon />} sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 700 }}>
                    Generate Master Report
                </Button>
            </Box>

            <Grid container spacing={4} sx={{ mb: 6 }}>
                <Grid size={{ xs: 12, md: 3 }}>
                    <Card sx={{ p: 3, borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                        <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 800 }}>TOTAL PARTNER REVENUE</Typography>
                        <Typography variant="h4" sx={{ fontWeight: 900, mt: 1 }}>₦{(stats?.financials?.revenue || 0).toLocaleString()}</Typography>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                    <Card sx={{ p: 3, borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                        <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 800 }}>ACTIVE SUB-ORGS</Typography>
                        <Typography variant="h4" sx={{ fontWeight: 900, mt: 1 }}>{stats?.demographics?.totalSubOrgs || 12}</Typography>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                    <Card sx={{ p: 3, borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                        <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 800 }}>TOTAL PARTNER MEMBERS</Typography>
                        <Typography variant="h4" sx={{ fontWeight: 900, mt: 1 }}>{(stats?.demographics?.totalMembers || 0).toLocaleString()}</Typography>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                    <Card sx={{ p: 3, borderRadius: '24px', bgcolor: '#0f8a62', color: 'white' }}>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 800 }}>SETTLED DISBURSEMENTS</Typography>
                        <Typography variant="h4" sx={{ fontWeight: 900, mt: 1 }}>₦8.4M</Typography>
                    </Card>
                </Grid>
            </Grid>

            {/* Additional report sections would go here */}
            <Paper sx={{ p: 4, borderRadius: '32px', border: '1px solid #f1f5f9', boxShadow: '0 10px 40px rgba(0,0,0,0.02)', textAlign: 'center', py: 10 }}>
                <ReportIcon sx={{ fontSize: 64, color: '#e2e8f0', mb: 2 }} />
                <Typography variant="h6" sx={{ color: '#64748b' }}>Enhanced Partner reporting visualizations are being calculated.</Typography>
            </Paper>
        </Box>
    );
}
