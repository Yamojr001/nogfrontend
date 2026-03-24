'use client';

import { useState, useEffect } from "react";
import { 
  Box, Typography, Paper, Grid, Card, Button, 
  Chip, IconButton, Dialog, DialogTitle, DialogContent, 
  DialogActions, TextField, MenuItem, CircularProgress,
  Avatar, Tooltip, Divider
} from "@mui/material";
import { 
  ShoppingBag, 
  Add as Plus, 
  Edit as EditIcon, 
  Shield, 
  Forest as Sprout, 
  Close as CloseIcon,
  InfoOutlined as InfoIcon,
  Search as SearchIcon
} from "@mui/icons-material";
import api from '@/lib/api';

export default function ProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: "",
        description: "",
        type: "SAVINGS",
        interestRate: 0,
        minAmount: 0,
        lockPeriod: 0,
        maxAmount: 0,
        maxDuration: 0,
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await api.get('/partner/products');
            setProducts(res.data);
        } catch (e) {
            console.error("Failed to fetch products", e);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('/partner/products', newProduct);
            setShowModal(false);
            fetchProducts();
            setNewProduct({
                name: "", description: "", type: "SAVINGS", 
                interestRate: 0, minAmount: 0, lockPeriod: 0, 
                maxAmount: 0, maxDuration: 0 
            });
        } catch (e) {
            console.error("Failed to create product", e);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <CircularProgress sx={{ color: '#0369a1' }} />
            </Box>
        );
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: '#1e293b' }}>Products & Services</Typography>
                    <Typography sx={{ color: '#64748b', mt: 0.5 }}>Manage cooperative products available to your members.</Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<Plus />}
                    onClick={() => setShowModal(true)}
                    sx={{ 
                        bgcolor: '#0369a1', 
                        '&:hover': { bgcolor: '#0284c7' },
                        borderRadius: '12px',
                        textTransform: 'none',
                        fontWeight: 700,
                        px: 3, py: 1
                    }}
                >
                    Create Product
                </Button>
            </Box>

            <Grid container spacing={3}>
                {products.map((product) => (
                    <Grid size={{ xs: 12, md: 6, lg: 4 }} key={product.id}>
                        <Card sx={{ 
                            p: 3, 
                            borderRadius: '24px', 
                            border: '1px solid #f1f5f9',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 30px rgba(0,0,0,0.08)', borderColor: '#e0f2fe' }
                        }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Avatar sx={{ 
                                    bgcolor: product.type === 'SAVINGS' ? '#eff6ff' : '#f0fdf4', 
                                    color: product.type === 'SAVINGS' ? '#2563eb' : '#16a34a',
                                    borderRadius: '16px',
                                    width: 48, height: 48
                                }}>
                                    {product.type === 'SAVINGS' ? <ShoppingBag /> : <Sprout />}
                                </Avatar>
                                <IconButton size="small" sx={{ color: '#94a3b8' }}>
                                    <EditIcon fontSize="small" />
                                </IconButton>
                            </Box>

                            <Typography sx={{ fontWeight: 800, color: '#1e293b', fontSize: '1.2rem', mb: 1 }}>{product.name}</Typography>
                            <Typography variant="body2" sx={{ color: '#64748b', mb: 3, flexGrow: 1, lineClamp: 2, display: '-webkit-box', overflow: 'hidden', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2 }}>
                                {product.description || "No description provided."}
                            </Typography>

                            <Divider sx={{ mb: 2, opacity: 0.5 }} />

                            <Box sx={{ mt: 'auto', spaceY: 1.5 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#94a3b8' }}>Category</Typography>
                                    <Chip 
                                        label={product.type} 
                                        size="small" 
                                        sx={{ 
                                            fontWeight: 800, 
                                            fontSize: '0.65rem', 
                                            bgcolor: '#f1f5f9',
                                            color: '#475569',
                                            borderRadius: '6px'
                                        }} 
                                    />
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#94a3b8' }}>Interest / Rate</Typography>
                                    <Typography sx={{ fontWeight: 800, color: '#1e293b', fontSize: '0.9rem' }}>
                                        {(product.savingsPlan?.interestRate || product.loanProduct?.interestRate || 0)}% p.a.
                                    </Typography>
                                </Box>
                            </Box>
                        </Card>
                    </Grid>
                ))}

                <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                    <Box
                        onClick={() => setShowModal(true)}
                        sx={{ 
                            border: '2px dashed #e2e8f0', 
                            borderRadius: '24px', 
                            p: 3, 
                            height: '100%', 
                            minHeight: 250,
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            cursor: 'pointer',
                            color: '#94a3b8',
                            transition: 'all 0.2s',
                            '&:hover': { bgcolor: '#f8fafc', borderColor: '#0369a1', color: '#0369a1' }
                        }}
                    >
                        <Plus sx={{ fontSize: 48, mb: 1.5, opacity: 0.3 }} />
                        <Typography sx={{ fontWeight: 700 }}>Add New Product</Typography>
                    </Box>
                </Grid>
            </Grid>

            {/* Create Product Modal */}
            <Dialog 
                open={showModal} 
                onClose={() => setShowModal(false)} 
                fullWidth 
                maxWidth="sm"
                PaperProps={{ sx: { borderRadius: '24px', p: 1 } }}
            >
                <DialogTitle sx={{ fontWeight: 800, color: '#1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    Create New Product
                    <IconButton onClick={() => setShowModal(false)} size="small"><CloseIcon /></IconButton>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ mb: 3, color: '#64748b' }}>Define the terms and features for your new cooperative offering.</Typography>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12 }}>
                            <TextField 
                                fullWidth label="Product Name" 
                                value={newProduct.name}
                                onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField 
                                fullWidth multiline rows={2} label="Description" 
                                value={newProduct.description}
                                onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                            />
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                            <TextField 
                                select fullWidth label="Category" 
                                value={newProduct.type}
                                onChange={e => setNewProduct({ ...newProduct, type: e.target.value })}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                            >
                                <MenuItem value="SAVINGS">Savings Plan</MenuItem>
                                <MenuItem value="LOAN">Loan Product</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                            <TextField 
                                fullWidth type="number" label="Interest Rate (% p.a.)" 
                                value={newProduct.interestRate}
                                onChange={e => setNewProduct({ ...newProduct, interestRate: Number(e.target.value) })}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                            />
                        </Grid>

                        {newProduct.type === 'SAVINGS' ? (
                            <>
                                <Grid size={{ xs: 6 }}>
                                    <TextField 
                                        fullWidth type="number" label="Min. Deposit (₦)" 
                                        value={newProduct.minAmount}
                                        onChange={e => setNewProduct({ ...newProduct, minAmount: Number(e.target.value) })}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                    />
                                </Grid>
                                <Grid size={{ xs: 6 }}>
                                    <TextField 
                                        fullWidth type="number" label="Lock Period (Months)" 
                                        value={newProduct.lockPeriod}
                                        onChange={e => setNewProduct({ ...newProduct, lockPeriod: Number(e.target.value) })}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                    />
                                </Grid>
                            </>
                        ) : (
                            <>
                                <Grid size={{ xs: 6 }}>
                                    <TextField 
                                        fullWidth type="number" label="Max Loan (₦)" 
                                        value={newProduct.maxAmount}
                                        onChange={e => setNewProduct({ ...newProduct, maxAmount: Number(e.target.value) })}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                    />
                                </Grid>
                                <Grid size={{ xs: 6 }}>
                                    <TextField 
                                        fullWidth type="number" label="Max Duration (Months)" 
                                        value={newProduct.maxDuration}
                                        onChange={e => setNewProduct({ ...newProduct, maxDuration: Number(e.target.value) })}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                    />
                                </Grid>
                            </>
                        )}
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 0 }}>
                    <Button onClick={() => setShowModal(false)} sx={{ color: '#64748b', fontWeight: 700, textTransform: 'none' }}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleCreate}
                        disabled={submitting}
                        startIcon={submitting && <CircularProgress size={16} color="inherit" />}
                        sx={{ 
                            bgcolor: '#0369a1', 
                            '&:hover': { bgcolor: '#0284c7' },
                            borderRadius: '12px',
                            textTransform: 'none',
                            fontWeight: 700,
                            px: 4
                        }}
                    >
                        Create Product
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
