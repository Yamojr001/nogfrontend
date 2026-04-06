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
  Notifications as NotificationsIcon,
  Lock as LockIcon,
  Save as SaveIcon,
  QrCode as QrCodeIcon,
  Work as WorkIcon,
  AccountBalanceWallet as SavingsIcon,
  VerifiedUser as VerifiedIcon
} from "@mui/icons-material";
import api from '@/lib/api';

export default function MemberProfilePage() {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [tabValue, setTabValue] = useState(0);

    // Form states
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', phoneNumber: '', address: '',
        gender: '', dateOfBirth: '', maritalStatus: '', stateOfOrigin: '', nationality: '',
        occupation: '', educationalQualification: '',
        extOrgName: '', extPosition: '', extStateChapter: '',
        savingsFrequency: '', proposedSavingsAmount: '', empowermentInterest: '',
        nokName: '', nokRelationship: '', nokPhone: '', nokAddress: '', nokEmail: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/auth/profile');
            const data = res.data;
            setProfile(data);
            
            const names = (data.name || '').split(' ');
            const member = data.memberProfile || {};
            const nok = member.nextOfKin || {};

            setFormData({
                firstName: data.firstName || names[0] || '',
                lastName: data.lastName || names.slice(1).join(' ') || '',
                phoneNumber: data.phone || data.phoneNumber || '',
                address: member.address || '',
                gender: member.gender || '',
                dateOfBirth: member.dateOfBirth ? new Date(member.dateOfBirth).toISOString().split('T')[0] : '',
                maritalStatus: member.maritalStatus || '',
                stateOfOrigin: member.stateOfOrigin || '',
                nationality: member.nationality || '',
                occupation: member.occupation || '',
                educationalQualification: member.educationalQualification || '',
                extOrgName: member.extOrgName || '',
                extPosition: member.extPosition || '',
                extStateChapter: member.extStateChapter || '',
                savingsFrequency: member.savingsFrequency || '',
                proposedSavingsAmount: member.proposedSavingsAmount || '',
                empowermentInterest: member.empowermentInterest || '',
                nokName: nok.name || '',
                nokRelationship: nok.relationship || '',
                nokPhone: nok.phone || '',
                nokAddress: nok.address || '',
                nokEmail: nok.email || ''
            });
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveProfile = async () => {
        setSaving(true);
        setMessage(null);
        try {
            await api.patch('/auth/profile', {
                ...formData,
                name: `${formData.firstName} ${formData.lastName}`.trim()
            });
            setMessage({ type: 'success', text: 'Progress saved successfully!' });
            // Refresh to get any server-side computed updates
            fetchProfile();
        } catch (e) {
            setMessage({ type: 'error', text: 'Failed to save progress. Please try again.' });
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

    const sections = [
        { label: 'Personal Information', icon: <PersonIcon /> },
        { label: 'Contact & Next of Kin', icon: <PhoneIcon /> },
        { label: 'Occupation & Education', icon: <WorkIcon /> },
        { label: 'Savings & Empowerment', icon: <SavingsIcon /> }
    ];

    return (
        <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: '#1e293b' }}>Member Profile</Typography>
                    <Typography sx={{ color: '#64748b' }}>Complete your profile to access all features. You can save your progress at any point.</Typography>
                </Box>
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
                    Save Progress
                </Button>
            </Box>

            {message && (
                <Alert severity={message.type} sx={{ mb: 4, borderRadius: '12px', fontWeight: 600 }}>
                    {message.text}
                </Alert>
            )}

            <Grid container spacing={4}>
                <Grid size={{ xs: 12, md: 3 }}>
                    <Card sx={{ p: 2, borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 10px 40px rgba(0,0,0,0.02)' }}>
                        <Tabs
                            orientation="vertical"
                            value={tabValue}
                            onChange={(_, v) => setTabValue(v)}
                            sx={{
                                '& .MuiTab-root': {
                                    alignItems: 'flex-start',
                                    textAlign: 'left',
                                    borderRadius: '12px',
                                    mb: 1,
                                    minHeight: '48px',
                                    textTransform: 'none',
                                    fontWeight: 700,
                                    color: '#64748b',
                                },
                                '& .Mui-selected': {
                                    bgcolor: '#f0fdf4',
                                    color: '#004d40 !important'
                                },
                                '& .MuiTabs-indicator': { display: 'none' }
                            }}
                        >
                            {sections.map((s, i) => (
                                <Tab key={i} label={s.label} icon={s.icon} iconPosition="start" />
                            ))}
                        </Tabs>
                    </Card>

                    <Card sx={{ p: 3, mt: 3, borderRadius: '24px', textAlign: 'center', bgcolor: '#f8fafc' }}>
                        <Avatar 
                            sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: '#004d40' }}
                        >
                            {formData.firstName[0]}{formData.lastName[0]}
                        </Avatar>
                        <Typography sx={{ fontWeight: 800 }}>{formData.firstName} {formData.lastName}</Typography>
                        <Typography variant="caption" color="textSecondary">Member ID: {profile?.memberProfile?.membershipId || 'PENDING'}</Typography>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 9 }}>
                    <Card sx={{ borderRadius: '32px', border: '1px solid #f1f5f9', boxShadow: '0 10px 40px rgba(0,0,0,0.02)' }}>
                        <CardContent sx={{ p: 4 }}>
                            {tabValue === 0 && (
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>Personal Details</Typography>
                                    <Grid container spacing={3}>
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <TextField fullWidth label="First Name" name="firstName" value={formData.firstName} onChange={handleInputChange} />
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <TextField fullWidth label="Last Name" name="lastName" value={formData.lastName} onChange={handleInputChange} />
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <TextField fullWidth label="Gender" name="gender" value={formData.gender} onChange={handleInputChange} select SelectProps={{ native: true }}>
                                                <option value=""></option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                            </TextField>
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <TextField fullWidth label="Date of Birth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleInputChange} InputLabelProps={{ shrink: true }} />
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <TextField fullWidth label="Marital Status" name="maritalStatus" value={formData.maritalStatus} onChange={handleInputChange} select SelectProps={{ native: true }}>
                                                <option value=""></option>
                                                <option value="single">Single</option>
                                                <option value="married">Married</option>
                                                <option value="divorced">Divorced</option>
                                                <option value="widowed">Widowed</option>
                                            </TextField>
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <TextField fullWidth label="Nationality" name="nationality" value={formData.nationality} onChange={handleInputChange} />
                                        </Grid>
                                        <Grid size={{ xs: 12 }}>
                                            <TextField fullWidth label="State of Origin" name="stateOfOrigin" value={formData.stateOfOrigin} onChange={handleInputChange} />
                                        </Grid>
                                    </Grid>
                                </Box>
                            )}

                            {tabValue === 1 && (
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>Contact Info & Next of Kin</Typography>
                                    <Grid container spacing={3}>
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <TextField fullWidth label="Phone Number" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} />
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <TextField fullWidth label="Email" value={profile?.email} disabled />
                                        </Grid>
                                        <Grid size={{ xs: 12 }}>
                                            <TextField fullWidth multiline rows={2} label="Resident Address" name="address" value={formData.address} onChange={handleInputChange} />
                                        </Grid>
                                        <Grid size={{ xs: 12 }}>
                                            <Divider sx={{ my: 2 }}>Next of Kin</Divider>
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <TextField fullWidth label="Full Name" name="nokName" value={formData.nokName} onChange={handleInputChange} />
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <TextField fullWidth label="Relationship" name="nokRelationship" value={formData.nokRelationship} onChange={handleInputChange} />
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <TextField fullWidth label="NOK Phone" name="nokPhone" value={formData.nokPhone} onChange={handleInputChange} />
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <TextField fullWidth label="NOK Email" name="nokEmail" value={formData.nokEmail} onChange={handleInputChange} />
                                        </Grid>
                                    </Grid>
                                </Box>
                            )}

                            {tabValue === 2 && (
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>Occupation & Education</Typography>
                                    <Grid container spacing={3}>
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <TextField fullWidth label="Occupation" name="occupation" value={formData.occupation} onChange={handleInputChange} />
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <TextField fullWidth label="Qualification" name="educationalQualification" value={formData.educationalQualification} onChange={handleInputChange} />
                                        </Grid>
                                        <Grid size={{ xs: 12 }}>
                                            <Divider sx={{ my: 2 }}>Organization Info (If Applicable)</Divider>
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <TextField fullWidth label="Organization Name" name="extOrgName" value={formData.extOrgName} onChange={handleInputChange} />
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <TextField fullWidth label="Position" name="extPosition" value={formData.extPosition} onChange={handleInputChange} />
                                        </Grid>
                                        <Grid size={{ xs: 12 }}>
                                            <TextField fullWidth label="State Chapter" name="extStateChapter" value={formData.extStateChapter} onChange={handleInputChange} />
                                        </Grid>
                                    </Grid>
                                </Box>
                            )}

                            {tabValue === 3 && (
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>Savings & Empowerment</Typography>
                                    <Grid container spacing={3}>
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <TextField fullWidth label="Savings Frequency" name="savingsFrequency" value={formData.savingsFrequency} onChange={handleInputChange} select SelectProps={{ native: true }}>
                                                <option value=""></option>
                                                <option value="daily">Daily</option>
                                                <option value="weekly">Weekly</option>
                                                <option value="monthly">Monthly</option>
                                            </TextField>
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <TextField fullWidth label="Proposed Savings Amount" name="proposedSavingsAmount" type="number" value={formData.proposedSavingsAmount} onChange={handleInputChange} />
                                        </Grid>
                                        <Grid size={{ xs: 12 }}>
                                            <TextField 
                                                fullWidth multiline rows={3} 
                                                label="Empowerment Interests" 
                                                name="empowermentInterest"
                                                placeholder="Describe areas you need empowerment or training..."
                                                value={formData.empowermentInterest} 
                                                onChange={handleInputChange} 
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                            )}

                            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
                                <Button
                                    disabled={tabValue === 0}
                                    onClick={() => setTabValue(v => v - 1)}
                                    sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 700 }}
                                >
                                    Previous
                                </Button>
                                {tabValue < sections.length - 1 ? (
                                    <Button
                                        variant="outlined"
                                        onClick={() => setTabValue(v => v + 1)}
                                        sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 700, borderColor: '#004d40', color: '#004d40' }}
                                    >
                                        Next section
                                    </Button>
                                ) : (
                                    <Button
                                        variant="contained"
                                        onClick={handleSaveProfile}
                                        disabled={saving}
                                        sx={{ bgcolor: '#004d40', borderRadius: '12px', textTransform: 'none', fontWeight: 700 }}
                                    >
                                        Complete & Save
                                    </Button>
                                )}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
