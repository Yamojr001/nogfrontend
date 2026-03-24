import { Box, Typography, Paper } from '@mui/material';

export default function Page() {
    return (
        <Box sx={{ p: 3 }}>
            <Paper sx={{ p: 4, borderRadius: '24px', textAlign: 'center' }}>
                <Typography variant='h5' sx={{ fontWeight: 800, color: '#1e293b' }}>
                    partner/transactions Module
                </Typography>
                <Typography sx={{ color: '#64748b', mt: 2 }}>
                    This module is currently being implemented. We appreciate your patience.
                </Typography>
            </Paper>
        </Box>
    );
}
