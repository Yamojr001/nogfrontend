'use client';

import { useState, useEffect } from "react";
import { 
  Box, Typography, Grid, Paper, Avatar, Divider, 
  Button, TextField, Card, IconButton, Stack,
  Switch, FormControlLabel, Badge, CardContent,
  CircularProgress, Alert, Tab, Tabs, Chip
} from "@mui/material";
import { 
  Person as PersonIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
    LocationOn as MapIcon,
  CameraAlt as CameraIcon,
  Shield as ShieldIcon,
  Notifications as BellIcon,
  Lock as LockIcon,
  Save as SaveIcon,
  QrCode as QrCodeIcon,
  VerifiedUser as VerifiedIcon
} from "@mui/icons-material";
import api from '@/lib/api';

export default function MemberProfilePage() {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

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
            const res = await api.get('/profile');
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
            await api.put('/profile', {
                name: `${firstName} ${lastName}`.trim(),
                phoneNumber,
                address
            });
            setMessage({ type: 'success', text: 'Your profile has been updated successfully!' });
        } catch (e) {
            setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
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
                <Typography variant="h4" sx={{ fontWeight: 900, color: '#1e293b' }}>Member Profile</Typography>
                <Typography sx={{ color: '#64748b' }}>View and manage your membership details.</Typography>
            </Box>

            {message && (
                <Alert severity={message.type} sx={{ mb: 4, borderRadius: '12px', fontWeight: 600 }}>
                    {message.text}
                </Alert>
            )}

            <Grid container spacing={4}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ p: 4, borderRadius: '32px', textAlign: 'center', border: '1px solid #f1f5f9', boxShadow: '0 10px 40px rgba(0,0,0,0.02)' }}>
                        <Box sx={{ position: 'relative', display: 'inline-block', mb: 3 }}>
                            <Badge
                                overlap="circular"
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                badgeContent={
                                    <IconButton size="small" sx={{ bgcolor: '#004d40', color: 'white', border: '4px solid white' }}>
                                        <CameraIcon fontSize="small" />
                                    </IconButton>
                                }
                            >
                                <Avatar 
                                    sx={{ width: 120, height: 120, fontSize: '3rem', fontWeight: 800, bgcolor: '#f0fdf4', color: '#004d40', border: '1px solid #d1fae5' }}
                                >
                                    {firstName[0]}{lastName[0]}
                                </Avatar>
                            </Badge>
                        </Box>
                        <Typography variant="h5" sx={{ fontWeight: 900, color: '#1e293b' }}>{firstName} {lastName}</Typography>
                        <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 700, mb: 1.5 }}>Member ID: {profile?.memberId || 'N/A'}</Typography>
                        <Chip 
                            icon={<VerifiedIcon sx={{ fontSize: '1rem !important' }} />}
                            label="Active Member" 
                            size="small" 
                            sx={{ bgcolor: '#d1fae5', color: '#065f46', fontWeight: 800, px: 1 }} 
                        />
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 8 }}>
                    <Card sx={{ borderRadius: '32px', border: '1px solid #f1f5f9', boxShadow: '0 10px 40px rgba(0,0,0,0.02)' }}>
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <PersonIcon sx={{ color: '#004d40' }} />
                                Personal Information
                            </Typography>
                            
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
                                        fullWidth multiline rows={3} label="Resident Address" 
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
                                    Save Changes
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
