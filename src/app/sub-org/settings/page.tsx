'use client';
import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Button, Switch, TextField, Divider } from '@mui/material';
import { Save, Store, Security, NotificationsActive } from '@mui/icons-material';

export default function SubOrgSettingsPage() {
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(true);

  return (
    <Box sx={{ maxWidth: 800 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b' }}>Branch Settings</Typography>
          <Typography sx={{ color: '#64748b', fontSize: '0.9rem' }}>Manage your sub-organization profile and preferences.</Typography>
        </Box>
        <Button variant="contained" startIcon={<Save />} sx={{ bgcolor: '#0f766e', '&:hover': { bgcolor: '#0d9488' }, borderRadius: '10px', textTransform: 'none', fontWeight: 600 }}>
          Save Changes
        </Button>
      </Box>

      {/* Profile Settings */}
      <Card sx={{ mb: 4, borderRadius: '20px', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <Box sx={{ width: 48, height: 48, borderRadius: '12px', bgcolor: '#f0fdfa', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0f766e' }}>
              <Store />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 700, color: '#1e293b', fontSize: '1.1rem' }}>Branch Profile</Typography>
              <Typography sx={{ color: '#64748b', fontSize: '0.85rem' }}>Basic details visible to members and Partner Admin.</Typography>
            </Box>
          </Box>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Branch Name" defaultValue="Abuja Branch Co-op" variant="outlined" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Registration ID" defaultValue="NGL-ABJ-001" InputProps={{ readOnly: true }} disabled variant="outlined" />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth label="Operating Address" defaultValue="14 Cooperative House, Maitama, Abuja" variant="outlined" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Contact Email" defaultValue="abuja@fedcoop.ng" type="email" variant="outlined" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Contact Phone" defaultValue="09080001001" variant="outlined" />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth multiline rows={2} label="Operating Hours (Note)" defaultValue="Monday - Friday: 8am - 4pm" variant="outlined" />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Security & Access */}
      <Card sx={{ mb: 4, borderRadius: '20px', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <Box sx={{ width: 48, height: 48, borderRadius: '12px', bgcolor: '#fff1f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e11d48' }}>
              <Security />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 700, color: '#1e293b', fontSize: '1.1rem' }}>Security & Access</Typography>
              <Typography sx={{ color: '#64748b', fontSize: '0.85rem' }}>Secure your Sub-Org admin account.</Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography sx={{ fontWeight: 600, color: '#1e293b', fontSize: '0.95rem' }}>Two-Factor Authentication (2FA)</Typography>
              <Typography sx={{ color: '#64748b', fontSize: '0.85rem' }}>Require OTP code from authenticator app on login.</Typography>
            </Box>
            <Switch checked={mfaEnabled} onChange={(e) => setMfaEnabled(e.target.checked)} color="primary" />
          </Box>
          <Divider sx={{ mb: 3 }} />
          <Button variant="outlined" color="error" sx={{ textTransform: 'none', fontWeight: 600, borderRadius: '10px' }}>
            Change Password
          </Button>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card sx={{ mb: 4, borderRadius: '20px', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <Box sx={{ width: 48, height: 48, borderRadius: '12px', bgcolor: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706' }}>
              <NotificationsActive />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 700, color: '#1e293b', fontSize: '1.1rem' }}>Notifications</Typography>
              <Typography sx={{ color: '#64748b', fontSize: '0.85rem' }}>Choose how you want to be alerted by the platform.</Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography sx={{ fontWeight: 600, color: '#1e293b', fontSize: '0.95rem' }}>Approval & Escrow Alerts</Typography>
              <Typography sx={{ color: '#64748b', fontSize: '0.85rem' }}>Email me when Partner Admin processes a branch request.</Typography>
            </Box>
            <Switch checked={emailAlerts} onChange={(e) => setEmailAlerts(e.target.checked)} color="primary" />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
