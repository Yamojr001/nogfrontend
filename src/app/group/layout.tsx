'use client';
import React, { useState, useEffect } from 'react';
import {
  Box, Drawer, AppBar, Toolbar, List, Typography, Divider,
  IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Avatar, Menu, MenuItem, Badge, Tooltip
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Logout as LogoutIcon,
  ChevronRight as ChevronRightIcon,
  Groups as GroupIcon
} from '@mui/icons-material';
import { useRouter, usePathname } from 'next/navigation';
import { NAVIGATION_CONFIG } from '@/lib/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const drawerWidth = 280;

const roleLabels: Record<string, { label: string; color: string }> = {
  group_admin: { label: 'Group Admin', color: '#065f46' },
  group_treasurer: { label: 'Group Treasurer', color: '#047857' },
  group_secretary: { label: 'Group Secretary', color: '#059669' },
};

export default function GroupLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [role, setRole] = useState<string>('');
  const [groupName, setGroupName] = useState<string>('Farmers Prosperity Group');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedRole = localStorage.getItem('user_role') || '';
      const token = localStorage.getItem('access_token');
      if (!token) { router.push('/login'); return; }
      setRole(storedRole);
      setGroupName(localStorage.getItem('org_name') || 'Farmers Prosperity Group');
    }
  }, [router]);

  const handleLogout = () => { 
    localStorage.clear(); 
    document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/login'); 
  };
  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);

  const menuItems = NAVIGATION_CONFIG[role] || NAVIGATION_CONFIG['group_admin'];

  const SidebarContent = () => (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#ffffff' }}>
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#065f46', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <GroupIcon sx={{ color: 'white', fontSize: 24 }} />
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 800, color: '#064e3b', fontSize: '0.9rem', lineHeight: 1.2 }}>{groupName}</Typography>
          <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase' }}>
            {roleLabels[role]?.label || 'Group Operations'}
          </Typography>
        </Box>
      </Box>
      <Divider sx={{ borderColor: '#f1f5f9' }} />

      <Box sx={{ flexGrow: 1, overflowY: 'auto', px: 2, py: 2 }}>
        <List disablePadding>
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            return (
              <ListItem key={item.name} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => { router.push(item.path); setMobileOpen(false); }}
                  sx={{ borderRadius: '12px', py: 1.5, bgcolor: isActive ? '#065f46' : 'transparent', '&:hover': { bgcolor: isActive ? '#064e3b' : '#f0fdf4' } }}
                >
                  <ListItemIcon sx={{ minWidth: 40, color: isActive ? '#ffffff' : '#64748b' }}>
                    <Icon />
                  </ListItemIcon>
                  <ListItemText primary={item.name} primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: isActive ? 700 : 500, color: isActive ? '#ffffff' : '#475569' }} />
                  {isActive && <ChevronRightIcon sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 18 }} />}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      <Box sx={{ p: 2, borderTop: '1px solid #f1f5f9' }}>
        <Box onClick={handleMenuOpen} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, borderRadius: '12px', cursor: 'pointer', '&:hover': { bgcolor: '#f8fafc' } }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: '#065f46', fontSize: '0.8rem' }}>{groupName?.[0]?.toUpperCase() || 'G'}</Avatar>
          <Box sx={{ flexGrow: 1 }}>
             <Typography sx={{ fontWeight: 700, fontSize: '0.8rem', color: '#1e293b' }}>{roleLabels[role]?.label || 'Leader'}</Typography>
          </Box>
          <LogoutIcon sx={{ fontSize: 16, color: '#94a3b8', cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); handleLogout(); }} />
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <AppBar position="fixed" elevation={0} sx={{ width: { sm: `calc(100% - ${drawerWidth}px)` }, ml: { sm: `${drawerWidth}px` }, bgcolor: 'white', borderBottom: '1px solid #e2e8f0', color: '#1e293b' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <IconButton edge="start" onClick={() => setMobileOpen(!mobileOpen)} sx={{ display: { sm: 'none' }, mr: 2 }}><MenuIcon /></IconButton>
          <Typography variant="h6" noWrap sx={{ fontWeight: 800, fontSize: '1.1rem' }}>
            Coop-OS <Box component="span" sx={{ color: '#059669' }}>Group</Box>
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Badge badgeContent={3} color="error" overlap="circular"><NotificationsIcon sx={{ color: '#64748b' }} /></Badge>
            <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
              <Avatar sx={{ width: 36, height: 36, bgcolor: '#065f46' }}>{groupName?.[0]?.toUpperCase() || 'G'}</Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(false)} ModalProps={{ keepMounted: true }} sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { width: drawerWidth } }}><SidebarContent /></Drawer>
        <Drawer variant="permanent" sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { width: drawerWidth, borderRight: '1px solid #e2e8f0' } }} open><SidebarContent /></Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 1, sm: 3 }, width: { sm: `calc(100% - ${drawerWidth}px)` }, mt: '64px' }}>
        <AnimatePresence mode="wait">
          <motion.div key={pathname} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
            {children}
          </motion.div>
        </AnimatePresence>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{ sx: { mt: 1.5, borderRadius: '12px', minWidth: 180, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1px solid #f1f5f9' } }}
      >
        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #f1f5f9' }}>
          <Typography sx={{ fontWeight: 800, fontSize: '0.85rem' }}>{groupName}</Typography>
          <Typography sx={{ fontSize: '0.7rem', color: '#94a3b8' }}>{roleLabels[role]?.label || 'Group Admin'}</Typography>
        </Box>
        <MenuItem onClick={() => setAnchorEl(null)} sx={{ py: 1, mx: 0.5, mt: 0.5, borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600 }}>Profile Settings</MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={handleLogout} sx={{ py: 1, mx: 0.5, mb: 0.5, borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, color: '#ef4444' }}>Sign Out</MenuItem>
      </Menu>
    </Box>
  );
}
