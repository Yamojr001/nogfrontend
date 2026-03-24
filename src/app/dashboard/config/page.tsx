'use client';

import { useState, useEffect } from "react";
import { 
  Box, Typography, Paper, TextField, Button, 
  CircularProgress, Alert, Card, Grid, IconButton,
  Divider, Tooltip, Chip
} from "@mui/material";
import { 
  Settings as SettingsIcon, 
  Save as SaveIcon, 
  Refresh as RefreshIcon,
  HelpOutline as HelpIcon,
  AdminPanelSettings as AdminIcon
} from "@mui/icons-material";
import api from '@/lib/api';

export default function ConfigPage() {
    const [configs, setConfigs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<number | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        fetchConfigs();
    }, []);

    const fetchConfigs = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/config');
            setConfigs(res.data);
        } catch (e) {
            console.error(e);
            setMessage({ type: 'error', text: 'Failed to load configurations.' });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (id: number, key: string, value: string) => {
        setSaving(id);
        setMessage(null);
        try {
            await api.put('/admin/config/update', { key, value });
            setMessage({ type: 'success', text: `Configuration '${key}' updated successfully!` });
            fetchConfigs(); // Refresh to get latest descriptions/groups
        } catch (e) {
            setMessage({ type: 'error', text: 'Error occurred while saving configuration.' });
        } finally {
            setSaving(null);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <CircularProgress sx={{ color: '#0f766e' }} />
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <AdminIcon sx={{ fontSize: 40, color: '#0f766e' }} />
                        System Configuration
                    </Typography>
                    <Typography sx={{ color: '#64748b', mt: 0.5 }}>Fine-tune platform parameters and financial rules.</Typography>
                </Box>
                <Tooltip title="Refresh Configurations">
                    <IconButton onClick={fetchConfigs} sx={{ color: '#64748b', '&:hover': { color: '#0f766e' } }}>
                        <RefreshIcon />
                    </IconButton>
                </Tooltip>
            </Box>

            {message && (
                <Alert 
                    severity={message.type} 
                    sx={{ mb: 4, borderRadius: '12px', fontWeight: 600 }}
                    onClose={() => setMessage(null)}
                >
                    {message.text}
                </Alert>
            )}

            <Grid container spacing={3}>
                {configs.map((config) => (
                    <Grid size={{ xs: 12 }} key={config.id}>
                        <Card sx={{ 
                            p: 3, 
                            borderRadius: '20px', 
                            border: '1px solid #f1f5f9', 
                            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                            transition: 'all 0.2s',
                            '&:hover': { boxShadow: '0 8px 30px rgba(0,0,0,0.06)', borderColor: '#e2e8f0' }
                        }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Box sx={{ p: 1, bgcolor: '#f8fafc', borderRadius: '10px' }}>
                                        <SettingsIcon sx={{ color: '#64748b', fontSize: 20 }} />
                                    </Box>
                                    <Box>
                                        <Typography sx={{ fontWeight: 800, color: '#1e293b', fontSize: '1.1rem' }}>{config.key}</Typography>
                                        <Chip 
                                            label={config.group || 'GENERAL'} 
                                            size="small" 
                                            sx={{ 
                                                fontSize: '0.65rem', 
                                                fontWeight: 800, 
                                                letterSpacing: '0.05em',
                                                bgcolor: '#f1f5f9',
                                                color: '#64748b',
                                                height: 20
                                            }} 
                                        />
                                    </Box>
                                </Box>
                                <Typography sx={{ fontSize: '0.7rem', color: '#cbd5e1', fontFamily: 'monospace' }}>ID: {config.id}</Typography>
                            </Box>

                            <Box sx={{ mt: 2 }}>
                                <Typography variant="caption" sx={{ fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', mb: 1, display: 'block' }}>
                                    Value (String or JSON)
                                </Typography>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    defaultValue={config.value}
                                    onBlur={(e) => { config.value = e.target.value; }}
                                    variant="outlined"
                                    placeholder="Enter configuration value..."
                                    sx={{ 
                                        '& .MuiOutlinedInput-root': { 
                                            borderRadius: '12px', 
                                            bgcolor: '#fcfdfe',
                                            fontFamily: 'monospace',
                                            fontSize: '0.9rem'
                                        } 
                                    }}
                                />
                                {config.description && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1, color: '#94a3b8' }}>
                                        <HelpIcon sx={{ fontSize: 14 }} />
                                        <Typography variant="caption">{config.description}</Typography>
                                    </Box>
                                )}
                            </Box>

                            <Divider sx={{ my: 3, opacity: 0.5 }} />

                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Button
                                    variant="contained"
                                    startIcon={saving === config.id ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
                                    disabled={saving !== null}
                                    onClick={() => handleSave(config.id, config.key, config.value)}
                                    sx={{ 
                                        bgcolor: '#0f172a', 
                                        '&:hover': { bgcolor: '#334155' },
                                        borderRadius: '10px',
                                        textTransform: 'none',
                                        fontWeight: 700,
                                        px: 3
                                    }}
                                >
                                    {saving === config.id ? 'Saving...' : 'Save Configuration'}
                                </Button>
                            </Box>
                        </Card>
                    </Grid>
                ))}

                {configs.length === 0 && (
                    <Grid size={{ xs: 12 }}>
                        <Paper sx={{ p: 10, textAlign: 'center', borderRadius: '24px', border: '2px dashed #e2e8f0' }}>
                            <Typography sx={{ color: '#94a3b8', fontWeight: 600 }}>No system configurations found.</Typography>
                        </Paper>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
}
