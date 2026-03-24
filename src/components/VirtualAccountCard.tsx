'use client';
import { useState, useEffect, useCallback } from 'react';
import {
  Box, Card, CardContent, Typography, Skeleton, Chip,
  IconButton, Tooltip, Button, Divider, Alert, Stack,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import RefreshIcon from '@mui/icons-material/Refresh';
import api from '@/lib/api';

interface VirtualAccountData {
  hasAccount: boolean;
  isReady: boolean;
  accountNumber: string | null;
  accountName: string | null;
  bankName: string | null;
  status: string;
  currency: string;
}

export default function VirtualAccountCard() {
  const [data, setData] = useState<VirtualAccountData | null>(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/virtual-accounts/mine');
      setData(res.data);
    } catch {
      setError('Could not load virtual account details.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const requestAccount = async () => {
    setRequesting(true);
    setError(null);
    try {
      await api.post('/virtual-accounts/request');
      await fetch();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Failed to request virtual account.');
    } finally {
      setRequesting(false);
    }
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── Loading skeleton ────────────────────────────────────────────────────
  if (loading) {
    return (
      <Card sx={{ borderRadius: 3, background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', color: 'white' }}>
        <CardContent>
          <Skeleton variant="text" width="60%" sx={{ bgcolor: 'grey.800' }} />
          <Skeleton variant="text" width="40%" sx={{ bgcolor: 'grey.800', my: 1 }} />
          <Skeleton variant="rectangular" height={48} sx={{ bgcolor: 'grey.800', borderRadius: 2 }} />
        </CardContent>
      </Card>
    );
  }

  // ── No account yet ───────────────────────────────────────────────────────
  if (!data?.hasAccount) {
    return (
      <Card sx={{ borderRadius: 3, border: '1px dashed rgba(99,102,241,0.5)', background: 'rgba(99,102,241,0.05)' }}>
        <CardContent sx={{ textAlign: 'center', py: 3 }}>
          <AccountBalanceIcon sx={{ fontSize: 48, color: '#6366f1', mb: 1 }} />
          <Typography variant="h6" fontWeight={600} mb={0.5}>No Virtual Account Yet</Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Request a dedicated virtual account to receive funds directly.
          </Typography>
          {error && <Alert severity="warning" sx={{ mb: 2, textAlign:'left' }}>{error}</Alert>}
          <Button
            variant="contained"
            onClick={requestAccount}
            disabled={requesting}
            sx={{ background: 'linear-gradient(90deg,#6366f1,#8b5cf6)', borderRadius: 2 }}
          >
            {requesting ? 'Processing…' : 'Request Virtual Account'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  // ── Pending / not yet activated ─────────────────────────────────────────
  if (!data.isReady) {
    return (
      <Card sx={{ borderRadius: 3, background: 'linear-gradient(135deg, #2d1b69 0%, #1a1a2e 100%)', color: 'white' }}>
        <CardContent>
          <Stack direction="row" alignItems="center" spacing={1} mb={1}>
            <PendingIcon sx={{ color: '#f59e0b' }} />
            <Typography variant="subtitle1" fontWeight={600}>Virtual Account Pending</Typography>
          </Stack>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            Your account is being set up. This usually takes a few minutes. Refresh to check status.
          </Typography>
          <Button variant="outlined" size="small" sx={{ mt: 2, color: 'white', borderColor: 'rgba(255,255,255,0.3)' }} onClick={fetch} startIcon={<RefreshIcon />}>
            Refresh
          </Button>
        </CardContent>
      </Card>
    );
  }

  // ── Active account card ──────────────────────────────────────────────────
  return (
    <Card sx={{
      borderRadius: 3,
      background: 'linear-gradient(135deg, #1a0533 0%, #0f172a 100%)',
      color: 'white',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""', position: 'absolute', top: -40, right: -40,
        width: 140, height: 140, borderRadius: '50%',
        background: 'rgba(99,102,241,0.15)',
      },
    }}>
      <CardContent>
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <AccountBalanceIcon sx={{ color: '#a78bfa' }} />
            <Typography variant="subtitle1" fontWeight={700}>Virtual Account</Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip
              icon={<CheckCircleIcon sx={{ fontSize: 14 }} />}
              label="Active"
              size="small"
              sx={{ bgcolor: 'rgba(16,185,129,0.2)', color: '#10b981', fontSize: 11 }}
            />
            <IconButton size="small" onClick={fetch} sx={{ color: 'rgba(255,255,255,0.5)' }}>
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Stack>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 1.5 }} />

        {/* Bank */}
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 1 }}>
          Bank
        </Typography>
        <Typography variant="body1" fontWeight={600} mb={1.5}>
          {data.bankName}
        </Typography>

        {/* Account Number */}
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 1 }}>
          Account Number
        </Typography>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="h5" fontWeight={800} letterSpacing={2} sx={{ fontVariantNumeric: 'tabular-nums' }}>
            {data.accountNumber}
          </Typography>
          <Tooltip title={copied ? 'Copied!' : 'Copy account number'}>
            <IconButton
              size="small"
              onClick={() => copy(data.accountNumber!)}
              sx={{ color: copied ? '#10b981' : 'rgba(255,255,255,0.5)', transition: 'color 0.2s' }}
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Account Name */}
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 1, mt: 1.5, display: 'block' }}>
          Account Name
        </Typography>
        <Typography variant="body1" fontWeight={500}>
          {data.accountName}
        </Typography>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 1.5 }} />

        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
          Transfer money to this account number to fund your NOGALSS wallet instantly.
        </Typography>
      </CardContent>
    </Card>
  );
}
