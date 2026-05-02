"use client";

import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, Alert } from '@mui/material';
import { useRouter } from 'next/navigation';
import { changePassword, getRoleFromToken, authLogout } from '@/lib/api';

export default function ChangePasswordPage() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      setLoading(true);
      await changePassword(currentPassword, newPassword);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('must_change_password');
      }
      setMessage('Password updated successfully. Redirecting...');
      const role = getRoleFromToken();
      setTimeout(() => {
        if (role === 'partner_admin') router.push('/partner');
        else if (role === 'sub_org_admin') router.push('/sub-org');
        else if (role === 'group_admin') router.push('/group');
        else if (role === 'member') router.push('/member');
        else router.push('/dashboard');
      }, 1200);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Unable to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try { await authLogout(); } catch {}
    router.push('/login');
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3, background: 'linear-gradient(135deg, #008A62 0%, #004c35 100%)' }}>
      <Paper sx={{ width: '100%', maxWidth: 520, p: 4, borderRadius: '28px' }}>
        <Typography variant="h4" sx={{ fontWeight: 900, color: '#065f46', mb: 1 }}>Change Password</Typography>
        <Typography sx={{ color: '#64748b', mb: 3 }}>Use your phone number password on first login, then set a new password.</Typography>
        {message ? <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert> : null}
        {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2 }}>
          <TextField label="Current Password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} fullWidth />
          <TextField label="New Password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} fullWidth />
          <TextField label="Confirm New Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} fullWidth />
          <Button type="submit" variant="contained" disabled={loading} sx={{ bgcolor: '#0f8a62', '&:hover': { bgcolor: '#047857' }, textTransform: 'none', fontWeight: 800, py: 1.3 }}>
            {loading ? 'Saving...' : 'Update Password'}
          </Button>
          <Button type="button" variant="text" onClick={handleLogout} sx={{ textTransform: 'none' }}>Logout</Button>
        </Box>
      </Paper>
    </Box>
  );
}