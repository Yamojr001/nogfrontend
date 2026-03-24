'use client';
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, List, 
  ListItem, ListItemText, Avatar, Divider,
  Button, Chip, Skeleton
} from '@mui/material';
import {
  Add as AddIcon,
  History as HistoryIcon,
  Download as DownloadIcon,
  Wallet as WalletIcon
} from '@mui/icons-material';
import { fetchMemberDashboard, fetchMemberSavings } from '@/lib/api';

export default function MemberSavings() {
  const [savings, setSavings] = useState<any[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const stats = await fetchMemberDashboard();
      const history = await fetchMemberSavings();
      setBalance(stats.savingsBalance);
      setSavings(history);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Box sx={{ p: 4 }}><Skeleton variant="rectangular" height={400} /></Box>;

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b' }}>Total Savings</Typography>
        <Button startIcon={<DownloadIcon />} variant="outlined" size="small" sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700 }}>
          Statement
        </Button>
      </Box>

      {/* Balance Highlight */}
      <Card sx={{ 
        borderRadius: '24px', 
        bgcolor: '#f0fdf4', 
        border: '2px solid #059669', 
        mb: 4,
        boxShadow: 'none'
      }}>
        <CardContent sx={{ p: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
          <Avatar sx={{ width: 60, height: 60, bgcolor: '#059669' }}><WalletIcon fontSize="large" /></Avatar>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#064e3b' }}>₦{balance.toLocaleString()}</Typography>
            <Typography variant="body2" color="text.secondary">Current Balance • Updated Just Now</Typography>
          </Box>
        </CardContent>
      </Card>

      <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1, ml: 1 }}>History</Typography>
      <Card sx={{ borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: 'none' }}>
        <List disablePadding>
          {savings.length > 0 ? (
            savings.map((txn: any, idx: number) => (
              <React.Fragment key={txn.id}>
                <ListItem sx={{ py: 2 }}>
                  <Avatar sx={{ bgcolor: '#f0fdf4', color: '#059669', mr: 2 }}><AddIcon /></Avatar>
                  <ListItemText 
                    primary="Contribution Payment" 
                    secondary={`${new Date(txn.createdAt).toLocaleDateString()} • ${txn.status || 'Success'}`} 
                    primaryTypographyProps={{ fontWeight: 700 }}
                  />
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography sx={{ fontWeight: 800, color: '#059669' }}>+₦{txn.amount.toLocaleString()}</Typography>
                    <Chip label="Verified" size="small" sx={{ height: 20, fontSize: '0.65rem', bgcolor: '#f0fdf4', color: '#059669', fontWeight: 800 }} />
                  </Box>
                </ListItem>
                {idx < savings.length - 1 && <Divider component="li" sx={{ mx: 2 }} />}
              </React.Fragment>
            ))
          ) : (
            <Box sx={{ p: 6, textAlign: 'center' }}>
              <HistoryIcon sx={{ color: '#cbd5e1', fontSize: 48, mb: 1 }} />
              <Typography variant="body2" color="text.secondary">No savings history found yet.</Typography>
            </Box>
          )}
        </List>
      </Card>

      <Box sx={{ mt: 4, mb: 10 }}>
        <Button fullWidth variant="contained" sx={{ bgcolor: '#059669', py: 2, borderRadius: '16px', fontWeight: 800, '&:hover': { bgcolor: '#047857' } }}>
          Make New Contribution
        </Button>
      </Box>
    </Box>
  );
}
