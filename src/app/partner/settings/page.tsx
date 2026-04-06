'use client';

import { useState, useEffect } from "react";
import { 
  Box, Typography, Grid, Paper, Card, Button, 
  Avatar, Divider, Stack, TextField, IconButton, 
  Switch, FormControlLabel, CircularProgress, Chip,
  InputAdornment
} from "@mui/material";
import { 
  Settings as SettingsIcon,
  Security as SecurityIcon,
  Notifications as NotifyIcon,
  Save as SaveIcon,
  Key as KeyIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Business as AdminIcon,
  VpnKey as AuthIcon
} from "@mui/icons-material";
import api from '@/lib/api';

export default function PartnerSettingsPage() {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/auth/profile');
            setProfile(res.data);
        } catch (e) {
            console.error('Failed to fetch profile', e);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setUpdating(true);
        try {
            await api.patch('/auth/profile', profile);
            alert('Settings updated successfully');
        } catch (e) {
            console.error('Update failed', e);
        } finally {
            setUpdating(false);
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
                        <SettingsIcon sx={{ fontSize: 40, color: '#004d40' }} />
                        Partner Configuration
                    </Typography>
                    <Typography sx={{ color: '#64748b', mt: 0.5 }}>Manage organization-wide settings, security, and preferences.</Typography>
                </Box>
                <Button 
                    variant="contained" 
                    startIcon={updating ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                    onClick={handleSave}
                    disabled={updating}
                    sx={{ bgcolor: '#004d40', '&:hover': { bgcolor: '#065f46' }, borderRadius: '12px', textTransform: 'none', px: 4, fontWeight: 700 }}
                >
                    Save Changes
                </Button>
            </Box>

            <Grid container spacing={4}>
                <Grid size={{ xs: 12, lg: 8 }}>
                    <Stack spacing={4}>
                        <Paper sx={{ p: 4, borderRadius: '32px', border: '1px solid #f1f5f9', boxShadow: '0 10px 40px rgba(0,0,0,0.02)' }}>
                            <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <AdminIcon sx={{ color: '#004d40' }} />
                                Organization Profile
                            </Typography>
                            <Grid container spacing={3}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField fullWidth label="Organization Name" value={profile?.name || ''} InputProps={{ sx: { borderRadius: '12px' } }} onChange={e => setProfile({...profile, name: e.target.value})} />
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField fullWidth label="Admin Email" value={profile?.email || ''} InputProps={{ sx: { borderRadius: '12px' }, readOnly: true }} />
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <TextField fullWidth multiline rows={2} label="Official Address" value={profile?.address || ''} InputProps={{ sx: { borderRadius: '12px' } }} onChange={e => setProfile({...profile, address: e.target.value})} />
                                </Grid>
                            </Grid>
                        </Paper>

                        <Paper sx={{ p: 4, borderRadius: '32px', border: '1px solid #f1f5f9', boxShadow: '0 10px 40px rgba(0,0,0,0.02)' }}>
                            <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <AuthIcon sx={{ color: '#004d40' }} />
                                Security & Authentication
                            </Typography>
                            <Stack spacing={2}>
                                <FormControlLabel control={<Switch defaultChecked sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#004d40' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#004d40' } }} />} label="Two-Factor Authentication (2FA) Required" />
                                <FormControlLabel control={<Switch defaultChecked sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#004d40' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#004d40' } }} />} label="Session Timeout (15 minutes)" />
                            </Stack>
                            <Divider sx={{ my: 3 }} />
                            <Button variant="outlined" startIcon={<KeyIcon />} sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 700, borderColor: '#004d40', color: '#004d40' }}>
                                Rotate API Keys
                            </Button>
                        </Paper>
                    </Stack>
                </Grid>

                <Grid size={{ xs: 12, lg: 4 }}>
                    <Paper sx={{ p: 4, borderRadius: '32px', border: '1px solid #f1f5f9', boxShadow: '0 10px 40px rgba(0,0,0,0.02)', bgcolor: '#f8fafc' }}>
                        <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <NotifyIcon sx={{ color: '#004d40' }} />
                            Communication
                        </Typography>
                        <Stack spacing={3}>
                            <Box sx={{ p: 1, px: 2, bgcolor: 'white', borderRadius: '16px', border: '1px solid #eef2f6' }}>
                                <FormControlLabel control={<Switch defaultChecked />} label={<Typography variant="body2" sx={{ fontWeight: 600 }}>Email Alerts</Typography>} />
                            </Box>
                            <Box sx={{ p: 1, px: 2, bgcolor: 'white', borderRadius: '16px', border: '1px solid #eef2f6' }}>
                                <FormControlLabel control={<Switch defaultChecked />} label={<Typography variant="body2" sx={{ fontWeight: 600 }}>SMS Notifications</Typography>} />
                            </Box>
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}
