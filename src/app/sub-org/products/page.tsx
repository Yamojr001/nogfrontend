'use client';

import { useState, useEffect } from "react";
import { 
  Box, Typography, Grid, Paper, Card, Button, 
  Avatar, LinearProgress, Divider, Stack,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Tooltip, CircularProgress, Chip, TextField, InputAdornment,
  Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";
import { 
  Inventory as ProductIcon,
  Search as SearchIcon,
  Add as AddIcon,
  FilterList as FilterIcon,
  BusinessCenter as PartnerIcon,
  ArrowForward as ArrowIcon
} from "@mui/icons-material";
import api from '@/lib/api';

export default function SubOrgProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await api.get('/partner/products');
            setProducts(res.data);
        } catch (e) {
            console.error('Failed to fetch products', e);
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
                        <PartnerIcon sx={{ fontSize: 40, color: '#004d40' }} />
                        Partner Products
                    </Typography>
                    <Typography sx={{ color: '#64748b', mt: 0.5 }}>Manage and view products assigned to this sub-organization.</Typography>
                </Box>
            </Box>

            <Paper sx={{ p: 4, borderRadius: '32px', border: '1px solid #f1f5f9', boxShadow: '0 10px 40px rgba(0,0,0,0.02)' }}>
                <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                    <TextField
                        placeholder="Search products..."
                        size="small"
                        fullWidth
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#94a3b8' }} /></InputAdornment>,
                            sx: { borderRadius: '12px', bgcolor: '#f8fafc', border: 'none' }
                        }}
                    />
                    <Button variant="outlined" startIcon={<FilterIcon />} sx={{ borderRadius: '12px', textTransform: 'none', px: 3, fontWeight: 700 }}>
                        Filter
                    </Button>
                </Box>

                <Grid container spacing={3}>
                    {products.length > 0 ? (
                        products.map((product) => (
                            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={product.id}>
                                <Card sx={{ borderRadius: '24px', border: '1px solid #eef2f6', boxShadow: 'none', '&:hover': { boxShadow: '0 8px 30px rgba(0,0,0,0.04)', transform: 'translateY(-4px)' }, transition: 'all 0.3s' }}>
                                    <Box sx={{ p: 3 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                            <Avatar sx={{ bgcolor: '#f0fdf4', color: '#004d40', borderRadius: '12px', width: 48, height: 48 }}>
                                                <ProductIcon />
                                            </Avatar>
                                            <Chip label={product.category || 'General'} size="small" sx={{ fontWeight: 800, fontSize: '0.65rem' }} />
                                        </Box>
                                        <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>{product.name}</Typography>
                                        <Typography variant="body2" sx={{ color: '#64748b', mb: 3, height: 40, overflow: 'hidden' }}>{product.description}</Typography>
                                        
                                        <Divider sx={{ mb: 2, opacity: 0.5 }} />
                                        
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Box>
                                                <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 800 }}>INTEREST RATE</Typography>
                                                <Typography variant="h6" sx={{ fontWeight: 900, color: '#004d40' }}>{product.interestRate}%</Typography>
                                            </Box>
                                            <Button size="small" endIcon={<ArrowIcon />} sx={{ fontWeight: 800 }}>Details</Button>
                                        </Box>
                                    </Box>
                                </Card>
                            </Grid>
                        ))
                    ) : (
                        <Grid size={{ xs: 12 }}>
                            <Box sx={{ py: 10, textAlign: 'center', bgcolor: '#f8fafc', borderRadius: '24px', border: '1px dashed #e2e8f0' }}>
                                <ProductIcon sx={{ fontSize: 48, color: '#cbd5e1', mb: 2 }} />
                                <Typography sx={{ color: '#64748b', fontWeight: 700 }}>No products available for this branch.</Typography>
                            </Box>
                        </Grid>
                    )}
                </Grid>
            </Paper>
        </Box>
    );
}
