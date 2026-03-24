'use client';
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Divider,
  CircularProgress, Alert, Paper, IconButton,
  List, ListItem, ListItemText, Avatar, Chip,
  TextField, InputAdornment
} from '@mui/material';
import {
  ReceiptLong as TransactionIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Add as CreditIcon,
  Remove as DebitIcon,
  Download as ExportIcon
} from '@mui/icons-material';
import { fetchMemberTransactions } from '@/lib/api';

export default function MemberTransactions() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const data = await fetchMemberTransactions();
      setTransactions(data);
    } catch (err) {
      setError('Failed to load transaction history');
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(tx => 
    tx.reference?.toLowerCase().includes(search.toLowerCase()) ||
    tx.description?.toLowerCase().includes(search.toLowerCase()) ||
    tx.type?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <CircularProgress sx={{ color: '#059669' }} />
    </Box>
  );

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mb: 10 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b' }}>Transactions</Typography>
          <Typography variant="body2" color="text.secondary">Keep track of all your financial movements</Typography>
        </Box>
        <IconButton sx={{ bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}>
          <ExportIcon sx={{ color: '#64748b' }} />
        </IconButton>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {/* Search & Filter */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <TextField
          fullWidth
          placeholder="Search transactions..."
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ 
            bgcolor: 'white',
            '& .MuiOutlinedInput-root': { borderRadius: '12px' }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#94a3b8' }} />
              </InputAdornment>
            ),
          }}
        />
        <IconButton sx={{ bgcolor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', width: 56 }}>
          <FilterIcon sx={{ color: '#64748b' }} />
        </IconButton>
      </Box>

      <Paper sx={{ borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: 'none', overflow: 'hidden' }}>
        <List disablePadding>
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((tx, idx) => (
              <React.Fragment key={tx.id}>
                <ListItem sx={{ py: 2.5, px: 3 }}>
                  <Avatar sx={{ 
                    bgcolor: tx.type === 'deposit' || tx.type === 'credit' ? '#f0fdf4' : '#fef2f2', 
                    color: tx.type === 'deposit' || tx.type === 'credit' ? '#059669' : '#ef4444',
                    mr: 2.5,
                    width: 48, height: 48
                  }}>
                    {tx.type === 'deposit' || tx.type === 'credit' ? <CreditIcon /> : <DebitIcon />}
                  </Avatar>
                  <ListItemText 
                    primary={tx.description || tx.type.charAt(0).toUpperCase() + tx.type.slice(1)} 
                    secondary={
                      <Box component="span" sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                        <Typography component="span" variant="caption" sx={{ fontWeight: 600, color: '#94a3b8' }}>{tx.reference}</Typography>
                        <Typography component="span" variant="caption" sx={{ color: '#cbd5e1' }}>•</Typography>
                        <Typography component="span" variant="caption" sx={{ fontWeight: 600, color: '#94a3b8' }}>{new Date(tx.createdAt).toLocaleDateString()}</Typography>
                      </Box>
                    }
                    primaryTypographyProps={{ fontWeight: 800, fontSize: '0.95rem', color: '#1e293b' }}
                  />
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography sx={{ 
                      fontWeight: 900, 
                      fontSize: '1.05rem',
                      color: tx.type === 'deposit' || tx.type === 'credit' ? '#059669' : '#ef4444' 
                    }}>
                      {tx.type === 'deposit' || tx.type === 'credit' ? '+' : '-'}₦{parseFloat(tx.amount).toLocaleString()}
                    </Typography>
                    <Chip 
                      label={tx.status?.toUpperCase() || 'COMPLETED'} 
                      size="small" 
                      sx={{ 
                        height: 20, 
                        fontSize: '0.65rem', 
                        fontWeight: 800, 
                        bgcolor: tx.status === 'failed' ? '#fef2f2' : '#f0fdf4',
                        color: tx.status === 'failed' ? '#ef4444' : '#059669',
                        mt: 0.5
                      }} 
                    />
                  </Box>
                </ListItem>
                {idx < filteredTransactions.length - 1 && <Divider component="li" sx={{ mx: 3 }} />}
              </React.Fragment>
            ))
          ) : (
            <Box sx={{ p: 8, textAlign: 'center' }}>
              <TransactionIcon sx={{ fontSize: 60, color: '#e2e8f0', mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#94a3b8' }}>No transactions found</Typography>
              <Typography variant="body2" color="text.secondary">Your financial history will appear here.</Typography>
            </Box>
          )}
        </List>
      </Paper>
    </Box>
  );
}
