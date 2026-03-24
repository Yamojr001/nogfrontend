'use client';
import { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, TextField,
  Button, Select, MenuItem, FormControl, InputLabel,
  Switch, FormControlLabel, Alert, Divider, Stack
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import PaymentIcon from '@mui/icons-material/Payment';
import api from '@/lib/api';

export default function PaymentSettings() {
  const [settings, setSettings] = useState({
    paystackEnabled: false,
    secretKeyConfigured: false,
    preferredBank: 'access-bank',
    availableBanks: ['access-bank', 'wema-bank', 'titan-bank'],
  });
  
  const [formData, setFormData] = useState({
    secretKey: '',
    preferredBank: '',
    enabled: false,
  });

  const [status, setStatus] = useState<{type: 'success'|'error', msg: string} | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const res = await api.get('/admin/payment-settings');
      setSettings(res.data);
      setFormData({
        secretKey: '', // never load the actual key to frontend
        preferredBank: res.data.preferredBank,
        enabled: res.data.paystackEnabled,
      });
    } catch (err: any) {
      setStatus({ type: 'error', msg: err?.response?.data?.message || 'Failed to load settings' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setStatus(null);
    try {
      const payload: any = {
        preferredBank: formData.preferredBank,
        enabled: formData.enabled,
      };
      // Only send secret key if the user typed a new one
      if (formData.secretKey.trim() !== '') {
        payload.secretKey = formData.secretKey;
      }

      await api.post('/admin/payment-settings', payload);
      setStatus({ type: 'success', msg: 'Payment settings saved successfully.' });
      setFormData(prev => ({ ...prev, secretKey: '' })); // clear input after save
      loadSettings();
    } catch (err: any) {
      setStatus({ type: 'error', msg: err?.response?.data?.message || 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Typography>Loading settings...</Typography>;

  return (
    <Box>
      <Typography variant="h4" fontWeight={800} mb={1}>Payment Gateway Settings</Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Configure Paystack integration for automated virtual accounts and wallet funding.
      </Typography>

      <Card sx={{ borderRadius: 3, maxWidth: 800 }}>
        <CardContent sx={{ p: 4 }}>
          <Stack direction="row" alignItems="center" spacing={2} mb={3}>
            <Avatar sx={{ bgcolor: '#0ba4db', width: 56, height: 56 }}>
              <PaymentIcon fontSize="large" sx={{ color: 'white' }} />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={700}>Paystack Integration</Typography>
              <Typography variant="body2" color="text.secondary">
                Status: {settings.secretKeyConfigured ? '🟢 Keys Configured' : '🔴 Keys Missing'}
              </Typography>
            </Box>
          </Stack>

          <Divider sx={{ mb: 4 }} />

          {status && (
            <Alert severity={status.type} sx={{ mb: 3 }}>
              {status.msg}
            </Alert>
          )}

          <Stack spacing={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.enabled}
                  onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                  color="primary"
                />
              }
              label={
                <Box>
                  <Typography fontWeight={600}>Enable Paystack Integration</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Turn on Virtual Account generation for verified members.
                  </Typography>
                </Box>
              }
            />

            <TextField
              fullWidth
              label="Paystack Secret Key"
              type="password"
              placeholder={settings.secretKeyConfigured ? "Update existing secret key (sk_...)" : "Enter Paystack secret key (sk_...)"}
              value={formData.secretKey}
              onChange={(e) => setFormData({ ...formData, secretKey: e.target.value })}
              helperText="Leave blank to keep the existing key. Requires Dedicated Accounts to be active on your Paystack dashboard."
            />

            <FormControl fullWidth>
              <InputLabel>Preferred Bank</InputLabel>
              <Select
                value={formData.preferredBank}
                label="Preferred Bank"
                onChange={(e) => setFormData({ ...formData, preferredBank: e.target.value })}
              >
                {settings.availableBanks.map((bank) => (
                  <MenuItem key={bank} value={bank}>{bank}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box display="flex" justifyContent="flex-end" pt={2}>
              <Button
                variant="contained"
                size="large"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                disabled={saving}
                sx={{ borderRadius: 2, px: 4 }}
              >
                {saving ? 'Saving...' : 'Save Settings'}
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

// Needed for the Avatar import that was missed above
import { Avatar } from '@mui/material';
