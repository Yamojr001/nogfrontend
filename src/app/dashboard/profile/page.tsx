'use client';

import { useState } from "react";
import { 
  Box, Typography, Grid, Paper, Avatar, Divider, 
  Button, TextField, Card, IconButton, Stack,
  Switch, FormControlLabel, Badge, Chip
} from "@mui/material";
import { 
  Person as PersonIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  Room as MapIcon,
  CameraAlt as CameraIcon,
  Shield as ShieldIcon,
  Notifications as BellIcon,
  Lock as LockIcon
} from "@mui/icons-material";

export default function ProfilePage() {
    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 900, color: '#1e293b' }}>My Profile</Typography>
                <Typography sx={{ color: '#64748b' }}>Manage your personal information and account security.</Typography>
            </Box>

            <Grid container spacing={4}>
                {/* Profile Overview Sidebar */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ p: 4, borderRadius: '32px', textAlign: 'center', border: '1px solid #f1f5f9', boxShadow: '0 10px 40px rgba(0,0,0,0.02)' }}>
                        <Box sx={{ position: 'relative', display: 'inline-block', mb: 3 }}>
                            <Badge
                                overlap="circular"
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                badgeContent={
                                    <IconButton size="small" sx={{ bgcolor: '#004d40', color: 'white', '&:hover': { bgcolor: '#065f46' }, border: '4px solid white' }}>
                                        <CameraIcon fontSize="small" />
                                    </IconButton>
                                }
                            >
                                <Avatar 
                                    sx={{ width: 120, height: 120, fontSize: '3rem', fontWeight: 800, bgcolor: '#f0fdf4', color: '#004d40', border: '1px solid #d1fae5' }}
                                >
                                    CA
                                </Avatar>
                            </Badge>
                        </Box>
                        <Typography variant="h5" sx={{ fontWeight: 900, color: '#1e293b' }}>Chioma Adebayo</Typography>
                        <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 700, mb: 1 }}>Member ID: NOG-1005</Typography>
                        <Chip 
                            label="Verified Member" 
                            size="small" 
                            sx={{ bgcolor: '#d1fae5', color: '#065f46', fontWeight: 800, fontSize: '0.7rem' }} 
                        />

                        <Divider sx={{ my: 4, opacity: 0.5 }} />

                        <Stack spacing={2.5} sx={{ textAlign: 'left' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar sx={{ width: 36, height: 36, bgcolor: '#f8fafc', color: '#64748b' }}><MailIcon sx={{ fontSize: 18 }} /></Avatar>
                                <Typography variant="body2" sx={{ color: '#475569', fontWeight: 600 }}>chioma@email.com</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar sx={{ width: 36, height: 36, bgcolor: '#f8fafc', color: '#64748b' }}><PhoneIcon sx={{ fontSize: 18 }} /></Avatar>
                                <Typography variant="body2" sx={{ color: '#475569', fontWeight: 600 }}>+234 801 234 5678</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar sx={{ width: 36, height: 36, bgcolor: '#f8fafc', color: '#64748b' }}><MapIcon sx={{ fontSize: 18 }} /></Avatar>
                                <Typography variant="body2" sx={{ color: '#475569', fontWeight: 600 }}>Ikeja, Lagos, Nigeria</Typography>
                            </Box>
                        </Stack>
                    </Card>
                </Grid>

                {/* Account Settings Main Area */}
                <Grid size={{ xs: 12, md: 8 }}>
                    <Stack spacing={4}>
                        <Card sx={{ p: 4, borderRadius: '32px', border: '1px solid #f1f5f9', boxShadow: '0 10px 40px rgba(0,0,0,0.02)' }}>
                            <Typography variant="h6" sx={{ fontWeight: 800, mb: 4, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <ShieldIcon sx={{ color: '#004d40' }} />
                                Security & Login
                            </Typography>
                            
                            <Stack spacing={3}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box>
                                        <Typography sx={{ fontWeight: 700, color: '#1e293b' }}>Password</Typography>
                                        <Typography variant="caption" sx={{ color: '#94a3b8' }}>Last changed 3 months ago</Typography>
                                    </Box>
                                    <Button variant="outlined" sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700, px: 3 }}>Change Password</Button>
                                </Box>
                                
                                <Divider sx={{ opacity: 0.5 }} />

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box>
                                        <Typography sx={{ fontWeight: 700, color: '#1e293b' }}>Two-Factor Authentication (2FA)</Typography>
                                        <Typography variant="caption" sx={{ color: '#94a3b8' }}>Add an extra layer of security to your account.</Typography>
                                    </Box>
                                    <FormControlLabel
                                        control={<Switch color="primary" />}
                                        label=""
                                    />
                                </Box>

                                <Divider sx={{ opacity: 0.5 }} />

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box>
                                        <Typography sx={{ fontWeight: 700, color: '#1e293b' }}>Active Sessions</Typography>
                                        <Typography variant="caption" sx={{ color: '#94a3b8' }}>Currently logged in from 2 devices.</Typography>
                                    </Box>
                                    <Button size="small" color="error" sx={{ fontWeight: 800, textTransform: 'none' }}>Log out all</Button>
                                </Box>
                            </Stack>
                        </Card>

                        <Card sx={{ p: 4, borderRadius: '32px', border: '1px solid #f1f5f9', boxShadow: '0 10px 40px rgba(0,0,0,0.02)' }}>
                            <Typography variant="h6" sx={{ fontWeight: 800, mb: 4, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <BellIcon sx={{ color: '#004d40' }} />
                                Notifications
                            </Typography>
                            
                            <Stack spacing={2}>
                                <FormControlLabel control={<Switch defaultChecked />} label={<Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>Email Notifications for Loan Status</Typography>} />
                                <FormControlLabel control={<Switch defaultChecked />} label={<Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>Monthly Contribution Reminders</Typography>} />
                                <FormControlLabel control={<Switch />} label={<Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>SMS Alerts for Disbursements</Typography>} />
                            </Stack>
                        </Card>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
}
