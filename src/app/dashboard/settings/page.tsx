'use client';

import { useState, useEffect } from "react";
import { 
  Box, Typography, Grid, Paper, Avatar, Divider, 
  Button, TextField, Card, IconButton, Stack,
  Switch, FormControlLabel, Badge, CardContent,
  CircularProgress, Alert, Tab, Tabs
} from "@mui/material";
import { 
  Person as PersonIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  Room as MapIcon,
  CameraAlt as CameraIcon,
  Shield as ShieldIcon,
  Notifications as BellIcon,
  Lock as LockIcon,
  Save as SaveIcon,
  QrCode as QrCodeIcon
} from "@mui/icons-material";
import api from '@/lib/api';

export default function SettingsPage() {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [tabValue, setTabValue] = useState(0);

    // Form states
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/auth/profile');
            const data = res.data;
            setProfile(data);
            const names = (data.name || '').split(' ');
            setFirstName(names[0] || '');
            setLastName(names.slice(1).join(' ') || '');
            setPhoneNumber(data.phoneNumber || '');
            setAddress(data.address || '');
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProfile = async () => {
        setSaving(true);
        setMessage(null);
        try {
            await api.patch('/auth/profile', {
                name: `${firstName} ${lastName}`.trim(),
                phoneNumber,
                address
            });
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (e) {
            setMessage({ type: 'error', text: 'An error occurred while updating profile.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}>
                <CircularProgress sx={{ color: '#004d40' }} />
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 900, color: '#1e293b' }}>Account Settings</Typography>
                <Typography sx={{ color: '#64748b' }}>Update your personal details and security preferences.</Typography>
            </Box>

            {message && (
                <Alert severity={message.type} sx={{ mb: 4, borderRadius: '12px', fontWeight: 600 }}>
                    {message.text}
                </Alert>
            )}

            <Card sx={{ borderRadius: '32px', border: '1px solid #f1f5f9', boxShadow: '0 10px 40px rgba(0,0,0,0.02)', overflow: 'hidden' }}>
                <Tabs 
                    value={tabValue} 
                    onChange={(_, v) => setTabValue(v)}
                    sx={{ 
                        px: 3, pt: 2, borderBottom: '1px solid #f1f5f9',
                        '& .MuiTab-root': { fontWeight: 800, textTransform: 'none', fontSize: '0.95rem', minWidth: 120 },
                        '& .Mui-selected': { color: '#004d40 !important' },
                        '& .MuiTabs-indicator': { bgcolor: '#004d40', height: 3, borderRadius: '3px 3px 0 0' }
                    }}
                >
                    <Tab icon={<PersonIcon sx={{ fontSize: 20 }} />} iconPosition="start" label="General" />
                    <Tab icon={<ShieldIcon sx={{ fontSize: 20 }} />} iconPosition="start" label="Security" />
                    <Tab icon={<BellIcon sx={{ fontSize: 20 }} />} iconPosition="start" label="Notifications" />
                </Tabs>

                <CardContent sx={{ p: 4 }}>
                    {tabValue === 0 && (
                        <Box sx={{ animate: 'fade-in 0.3s' }}>
                            <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, color: '#1e293b' }}>Public Profile</Typography>
                            <Grid container spacing={3}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField 
                                        fullWidth label="First Name" 
                                        value={firstName}
                                        onChange={e => setFirstName(e.target.value)}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField 
                                        fullWidth label="Last Name" 
                                        value={lastName}
                                        onChange={e => setLastName(e.target.value)}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField 
                                        fullWidth label="Email Address" 
                                        value={profile?.email} 
                                        disabled 
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: '#f8fafc' } }}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField 
                                        fullWidth label="Phone Number" 
                                        value={phoneNumber}
                                        onChange={e => setPhoneNumber(e.target.value)}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <TextField 
                                        fullWidth multiline rows={3} label="Office Address" 
                                        value={address}
                                        onChange={e => setAddress(e.target.value)}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                    />
                                </Grid>
                            </Grid>
                            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                                <Button
                                    variant="contained"
                                    startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
                                    onClick={handleSaveProfile}
                                    disabled={saving}
                                    sx={{ 
                                        bgcolor: '#004d40', 
                                        '&:hover': { bgcolor: '#065f46' },
                                        borderRadius: '12px',
                                        textTransform: 'none',
                                        fontWeight: 700,
                                        px: 4, py: 1.2
                                    }}
                                >
                                    Update Profile
                                </Button>
                            </Box>
                        </Box>
                    )}

                    {tabValue === 1 && (
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, color: '#1e293b' }}>Multi-Factor Authentication</Typography>
                            <Typography variant="body2" sx={{ color: '#64748b', mb: 4 }}>Enhance your account security using Google Authenticator.</Typography>
                            
                            {!profile?.twoFactorEnabled ? (
                                <Box sx={{ p: 4, textAlign: 'center', bgcolor: '#f8fafc', borderRadius: '24px', border: '1px dashed #e2e8f0' }}>
                                    <QrCodeIcon sx={{ fontSize: 64, color: '#cbd5e1', mb: 2 }} />
                                    <Typography sx={{ fontWeight: 700, mb: 1 }}>2FA is currently DISABLED</Typography>
                                    <Typography variant="body2" sx={{ color: '#94a3b8', mb: 3 }}>Secure your account from unauthorized access.</Typography>
                                    <Button variant="outlined" sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 800 }}>Setup Authenticator</Button>
                                </Box>
                            ) : (
                                <Box sx={{ p: 3, bgcolor: '#f0fdf4', color: '#166534', borderRadius: '16px', border: '1px solid #d1fae5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <ShieldIcon />
                                        <Typography sx={{ fontWeight: 800 }}>Two-Factor Authentication is Active</Typography>
                                    </Box>
                                    <Button color="error" sx={{ fontWeight: 800, textTransform: 'none' }}>Deactivate</Button>
                                </Box>
                            )}
                        </Box>
                    )}

                    {tabValue === 2 && (
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, color: '#1e293b' }}>Notification Preferences</Typography>
                            <Stack spacing={2}>
                                <FormControlLabel control={<Switch defaultChecked />} label={<Typography sx={{ fontWeight: 600 }}>Loan status update emails</Typography>} />
                                <FormControlLabel control={<Switch defaultChecked />} label={<Typography sx={{ fontWeight: 600 }}>Monthly contribution reminders</Typography>} />
                                <FormControlLabel control={<Switch />} label={<Typography sx={{ fontWeight: 600 }}>Marketing and promotional broadcasts</Typography>} />
                            </Stack>
                        </Box>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
}
