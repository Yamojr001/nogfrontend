'use client';
import React, { useState, useEffect } from 'react';
import {
  Box, AppBar, Toolbar, Typography, IconButton, Avatar,
  BottomNavigation, BottomNavigationAction, Paper, Badge,
  Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Divider, useMediaQuery, useTheme
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Savings as SavingsIcon
} from '@mui/icons-material';
import { useRouter, usePathname } from 'next/navigation';
import { NAVIGATION_CONFIG } from '@/lib/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const drawerWidth = 280;

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userName, setUserName] = useState('Member');
  const [role, setRole] = useState('member');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
      return;
    }
    
    const storedRole = localStorage.getItem('user_role') || 'member';
    const isPaid = localStorage.getItem('is_registration_fee_paid') === 'true';
    
    setRole(storedRole);
    setUserName(localStorage.getItem('user_name') || 'Member');

    // Enforce payment for members
    if (storedRole === 'member' && !isPaid && pathname !== '/member/payment') {
      router.push('/member/payment');
    }
  }, [router, pathname]);

  const handleLogout = () => {
    localStorage.clear();
    document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/login');
  };

  const menuItems = NAVIGATION_CONFIG[role] || NAVIGATION_CONFIG['member'];
  // For bottom nav, we only show the first 5 items to keep it clean
  const bottomNavItems = menuItems.slice(0, 5);

  const SidebarContent = () => (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#ffffff' }}>
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <SavingsIcon sx={{ color: 'white', fontSize: 24 }} />
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 800, color: '#064e3b', fontSize: '1rem' }}>Coop-OS</Typography>
          <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: '#059669', textTransform: 'uppercase' }}>Member Access</Typography>
        </Box>
      </Box>
      <Divider sx={{ borderColor: '#f1f5f9' }} />
      <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto' }}>
        <List disablePadding>
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            return (
              <ListItem key={item.name} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  id={`tour-menu-${item.name.toLowerCase()}`}
                  onClick={() => { router.push(item.path); setMobileOpen(false); }}
                  sx={{
                    borderRadius: '12px',
                    py: 1.5,
                    bgcolor: isActive ? '#059669' : 'transparent',
                    color: isActive ? 'white' : '#64748b',
                    '&:hover': { bgcolor: isActive ? '#047857' : '#f0fdf4' }
                  }}
                >
                  <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}><Icon /></ListItemIcon>
                  <ListItemText primary={item.name} primaryTypographyProps={{ fontWeight: isActive ? 700 : 500, fontSize: '0.9rem' }} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
      <Box sx={{ p: 2, borderTop: '1px solid #f1f5f9' }}>
        <ListItemButton onClick={handleLogout} sx={{ borderRadius: '12px', color: '#ef4444' }}>
          <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}><LogoutIcon /></ListItemIcon>
          <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }} />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh', pb: isMobile ? '70px' : 0 }}>
      {/* Top App Bar */}
      <AppBar position="fixed" elevation={0} sx={{ 
        width: { sm: `calc(100% - ${drawerWidth}px)` }, 
        ml: { sm: `${drawerWidth}px` }, 
        bgcolor: 'white', 
        borderBottom: '1px solid #e2e8f0', 
        color: '#1e293b',
        zIndex: (theme) => theme.zIndex.drawer + 1
      }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isMobile && (
              <IconButton onClick={() => setMobileOpen(true)} edge="start" sx={{ mr: 1 }}>
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '1.1rem' }}>
               {isMobile ? 'Coop' : 'Member'} <Box component="span" sx={{ color: '#059669' }}>{isMobile ? 'OS' : 'Portal'}</Box>
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Badge id="tour-notifications" badgeContent={2} color="error">
              <NotificationsIcon sx={{ color: '#64748b' }} />
            </Badge>
            <Avatar id="tour-profile" sx={{ width: 36, height: 36, bgcolor: '#059669', cursor: 'pointer' }} onClick={() => router.push('/member/profile')}>
              {userName?.[0]?.toUpperCase()}
            </Avatar>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer for Mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { width: drawerWidth, border: 'none' } }}
      >
        <SidebarContent />
      </Drawer>

      {/* Sidebar for Desktop */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', borderRight: '1px solid #e2e8f0', borderLeft: 'none' },
          }}
        >
          <SidebarContent />
        </Drawer>
      )}

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 3 }, mt: '64px', width: '100%' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
      </Box>

      {/* Bottom Nav for Mobile */}
      {isMobile && (
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000 }} elevation={3}>
          <BottomNavigation
            value={pathname}
            onChange={(event, newValue) => {
              router.push(newValue);
            }}
            sx={{ height: 70, '& .Mui-selected': { color: '#059669' } }}
          >
            {bottomNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <BottomNavigationAction
                  key={item.name}
                  label={item.name}
                  value={item.path}
                  icon={<Icon />}
                  sx={{ minWidth: 'auto', px: 1, '& .MuiBottomNavigationAction-label': { fontSize: '0.65rem', fontWeight: 600 } }}
                />
              );
            })}
          </BottomNavigation>
        </Paper>
      )}
    </Box>
  );
}
