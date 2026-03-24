'use client';

import { useState, useEffect } from "react";
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Chip, IconButton,
  TextField, InputAdornment, Avatar, CircularProgress,
  Pagination, Stack, Tooltip
} from "@mui/material";
import { 
  History as HistoryIcon,
  Search as SearchIcon,
  AccessTime as ClockIcon,
  Person as PersonIcon,
  BugReport as BugIcon,
  Security as SecurityIcon,
  Refresh as RefreshIcon
} from "@mui/icons-material";
import api from '@/lib/api';

export default function AuditLogsPage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 20;

    useEffect(() => {
        fetchLogs();
    }, [page]);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/admin/audit?limit=${limit}&offset=${(page - 1) * limit}`);
            // Assuming the backend returns something like { data: [], total: 0 } or just an array
            if (Array.isArray(res.data)) {
                setLogs(res.data);
            } else if (res.data.data) {
                setLogs(res.data.data);
                setTotalPages(Math.ceil(res.data.total / limit));
            }
        } catch (e) {
            console.error("Failed to fetch audit logs", e);
        } finally {
            setLoading(false);
        }
    };

    const getActionColor = (action: string) => {
        if (action.includes('CREATE')) return 'success';
        if (action.includes('UPDATE')) return 'warning';
        if (action.includes('DELETE')) return 'error';
        return 'primary';
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { md: 'center' }, gap: 3, mb: 4 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <SecurityIcon sx={{ fontSize: 40, color: '#004d40' }} />
                        System Audit Logs
                    </Typography>
                    <Typography sx={{ color: '#64748b', mt: 0.5 }}>Immutable record of all administrative and system activities.</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                        size="small"
                        placeholder="Search logs..."
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#94a3b8' }} /></InputAdornment>,
                            sx: { borderRadius: '12px', bgcolor: 'white' }
                        }}
                        sx={{ width: { xs: '100%', md: 260 } }}
                    />
                    <Tooltip title="Refresh Logs">
                        <IconButton onClick={fetchLogs} sx={{ bgcolor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>

            <TableContainer component={Paper} sx={{ borderRadius: '24px', border: '1px solid #eef2f6', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', overflow: 'hidden' }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f8fafc' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 800, color: '#475569', py: 2.5 }}>Timestamp</TableCell>
                            <TableCell sx={{ fontWeight: 800, color: '#475569', py: 2.5 }}>Performer</TableCell>
                            <TableCell sx={{ fontWeight: 800, color: '#475569', py: 2.5 }}>Action</TableCell>
                            <TableCell sx={{ fontWeight: 800, color: '#475569', py: 2.5 }}>Details</TableCell>
                            <TableCell sx={{ fontWeight: 800, color: '#475569', py: 2.5 }}>Source IP</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                                    <CircularProgress size={32} sx={{ color: '#004d40' }} />
                                    <Typography sx={{ mt: 2, color: '#94a3b8', fontWeight: 600 }}>Loading system logs...</Typography>
                                </TableCell>
                            </TableRow>
                        ) : logs.length > 0 ? (
                            logs.map((log) => (
                                <TableRow key={log.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <ClockIcon sx={{ fontSize: 16, color: '#94a3b8' }} />
                                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                                                {new Date(log.timestamp).toLocaleString()}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <Avatar sx={{ width: 32, height: 32, bgcolor: '#f1f5f9', color: '#64748b' }}>
                                                <PersonIcon sx={{ fontSize: 18 }} />
                                            </Avatar>
                                            <Box>
                                                <Typography variant="body2" sx={{ fontWeight: 800, color: '#1e293b' }}>
                                                    {log.user?.name || 'System Process'}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.65rem' }}>
                                                    {log.user?.role || 'SYSTEM_CORE'}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={log.action} 
                                            size="small" 
                                            color={getActionColor(log.action) as any}
                                            sx={{ fontWeight: 900, fontSize: '0.65rem', borderRadius: '6px' }} 
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" sx={{ color: '#475569', maxWidth: 300, fontWeight: 500 }}>
                                            {log.details}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: '#cbd5e1', fontWeight: 800, fontSize: '0.65rem' }}>
                                            {log.entityType} {log.entityId ? `#${log.entityId}` : ''}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="caption" sx={{ fontFamily: 'monospace', color: '#94a3b8' }}>
                                            {log.ipAddress || 'Internal'}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                                    <Typography sx={{ color: '#94a3b8' }}>No audit logs found for the selected criteria.</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                <Pagination 
                    count={totalPages} 
                    page={page} 
                    onChange={(_, p) => setPage(p)} 
                    color="primary"
                    sx={{
                        '& .MuiPaginationItem-root': { fontWeight: 700, borderRadius: '8px' },
                        '& .Mui-selected': { bgcolor: '#004d40 !important', color: 'white' }
                    }}
                />
            </Box>
        </Box>
    );
}
