'use client';

import { useState, useEffect } from "react";
import { 
  Box, Typography, Grid, Paper, Card, Button, 
  Avatar, LinearProgress, Divider, Stack,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Tooltip, CircularProgress, Chip, TextField, InputAdornment
} from "@mui/material";
import { 
  BusinessCenter as PartnerIcon,
  Search as SearchIcon,
  Add as AddIcon,
  FilterList as FilterIcon,
  Store as StoreIcon,
  ArrowForward as ArrowIcon,
  MonetizationOn as MoneyIcon
} from "@mui/icons-material";
import api from '@/lib/api';

export default function PartnerProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPartnerProducts();
    }, []);

    const fetchPartnerProducts = async () => {
        try {
            const res = await api.get('/partner/products');
            setProducts(res.data);
        } catch (e) {
            console.error('Failed to fetch partner products', e);
        } finally {
            setLoading(false);
        }
    };

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
                        <StoreIcon sx={{ fontSize: 40, color: '#004d40' }} />
                        Partner Product Management
                    </Typography>
                    <Typography sx={{ color: '#64748b', mt: 0.5 }}>Catalog of financial products and services offered through your partnership.</Typography>
                </Box>
                <Button variant="contained" startIcon={<AddIcon />} sx={{ bgcolor: '#004d40', '&:hover': { bgcolor: '#065f46' }, borderRadius: '12px', textTransform: 'none', px: 3, fontWeight: 700 }}>
                    Register New Product
                </Button>
            </Box>

            <Grid container spacing={4}>
                <Grid size={{ xs: 12, lg: 3 }}>
                    <Stack spacing={3}>
                        <Card sx={{ p: 3, borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                            <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 800 }}>TOTAL PRODUCTS</Typography>
                            <Typography variant="h4" sx={{ fontWeight: 900, color: '#1e293b' }}>{products.length}</Typography>
                        </Card>
                        <Card sx={{ p: 3, borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                            <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 800 }}>ACTIVE ENROLLMENTS</Typography>
                            <Typography variant="h4" sx={{ fontWeight: 900, color: '#004d40' }}>1,248</Typography>
                        </Card>
                    </Stack>
                </Grid>

                <Grid size={{ xs: 12, lg: 9 }}>
                    <Paper sx={{ p: 4, borderRadius: '32px', border: '1px solid #f1f5f9', boxShadow: '0 10px 40px rgba(0,0,0,0.02)' }}>
                        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                            <TextField
                                placeholder="Search catalog..."
                                size="small"
                                fullWidth
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#94a3b8' }} /></InputAdornment>,
                                    sx: { borderRadius: '12px', bgcolor: '#f8fafc', border: 'none' }
                                }}
                            />
                        </Box>

                        <TableContainer>
                            <Table>
                                <TableHead sx={{ bgcolor: '#f8fafc' }}>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 800, color: '#64748b' }}>Product Name</TableCell>
                                        <TableCell sx={{ fontWeight: 800, color: '#64748b' }}>Category</TableCell>
                                        <TableCell sx={{ fontWeight: 800, color: '#64748b' }}>Interest</TableCell>
                                        <TableCell sx={{ fontWeight: 800, color: '#64748b' }}>Status</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 800, color: '#64748b' }}>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {products.map((p) => (
                                        <TableRow key={p.id} hover>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Avatar sx={{ width: 32, height: 32, bgcolor: '#f1f5f9', color: '#64748b' }}><MoneyIcon fontSize="small" /></Avatar>
                                                    <Typography sx={{ fontWeight: 700 }}>{p.name}</Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell sx={{ color: '#64748b', fontWeight: 600 }}>{p.category || 'General'}</TableCell>
                                            <TableCell sx={{ fontWeight: 800, color: '#004d40' }}>{p.interestRate}%</TableCell>
                                            <TableCell>
                                                <Chip label="Active" size="small" color="success" sx={{ fontWeight: 800, fontSize: '0.65rem' }} />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Button size="small" sx={{ fontWeight: 800 }}>Manage</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}
