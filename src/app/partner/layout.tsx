'use client';
import React, { useState, useEffect } from 'react';
import {
  Box, Drawer, AppBar, Toolbar, List, Typography, Divider,
  IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Avatar, Menu, MenuItem, Badge, Tooltip
} from '@mui/material';
import {
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material';
import { useRouter, usePathname } from 'next/navigation';
import { NAVIGATION_CONFIG } from '@/lib/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const drawerWidth = 280;

const roleLabels: Record<string, { label: string; color: string }> = {
  partner_admin: { label: 'Partner Admin', color: '#0369a1' },
  partner_officer: { label: 'Partner Officer', color: '#065f46' },
  finance_officer: { label: 'Finance Officer', color: '#7c3aed' },
  auditor: { label: 'Auditor', color: '#b45309' },
  sub_org_admin: { label: 'Sub-Org Admin', color: '#065f46' },
  group_admin: { label: 'Group Admin', color: '#9a3412' },
};

export default function PartnerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [role, setRole] = useState<string>('');
  const [orgName, setOrgName] = useState<string>('Partner Portal');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchVal, setSearchVal] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedRole = localStorage.getItem('user_role') || '';
      const token = localStorage.getItem('access_token');
      if (!token) { router.push('/login'); return; }
      setRole(storedRole);
      setOrgName(localStorage.getItem('org_name') || 'Federal Cooperative Partner');
    }
  }, [router]);

  const handleLogout = () => { 
    localStorage.clear(); 
    document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/login'); 
  };
  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const menuItems = NAVIGATION_CONFIG[role] || NAVIGATION_CONFIG['partner_admin'];

  const SidebarContent = () => (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#ffffff' }}>
      <Box sx={{ p: 3.5, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ width: 44, height: 44, borderRadius: '14px', bgcolor: '#0369a1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography sx={{ color: 'white', fontWeight: 900, fontSize: '1.2rem' }}>P</Typography>
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 900, color: '#0c4a6e', fontSize: '0.95rem', lineHeight: 1.3 }}>{orgName}</Typography>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', bgcolor: '#e0f2fe', borderRadius: '6px', px: 1, py: 0.25, mt: 0.25 }}>
            <Typography sx={{ fontSize: '0.6rem', fontWeight: 800, color: '#0369a1', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {roleLabels[role]?.label || 'Partner'}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Divider sx={{ borderColor: '#f1f5f9' }} />

      <Box sx={{ flexGrow: 1, overflowY: 'auto', px: 2, py: 2 }}>
        <Typography sx={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', px: 2, mb: 1.5 }}>
          Navigation
        </Typography>
        <List disablePadding>
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            return (
              <ListItem key={item.name} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => { router.push(item.path); setMobileOpen(false); }}
                  sx={{
                    borderRadius: '14px',
                    px: 2.5, py: 1.4,
                    transition: 'all 0.2s ease',
                    bgcolor: isActive ? '#0369a1' : 'transparent',
                    '&:hover': { bgcolor: isActive ? '#0284c7' : '#f0f9ff' },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40, color: isActive ? '#ffffff' : '#64748b', '& .MuiSvgIcon-root': { fontSize: 22 } }}>
                    <Icon />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.name}
                    primaryTypographyProps={{ fontSize: '0.92rem', fontWeight: isActive ? 700 : 500, color: isActive ? '#ffffff' : '#374151' }}
                  />
                  {isActive && <ChevronRightIcon sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 18 }} />}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      <Box sx={{ p: 2.5, borderTop: '1px solid #f1f5f9' }}>
        <Box
          onClick={handleMenuOpen}
          sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderRadius: '14px', cursor: 'pointer', transition: 'all 0.2s', '&:hover': { bgcolor: '#f0f9ff' } }}
        >
          <Avatar sx={{ width: 40, height: 40, bgcolor: '#0369a1', fontSize: '1rem', fontWeight: 800 }}>
            {orgName?.[0]?.toUpperCase() || 'P'}
          </Avatar>
          <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
            <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: '#1e293b', textTransform: 'capitalize', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {roleLabels[role]?.label || 'Partner Admin'}
            </Typography>
            <Typography sx={{ fontSize: '0.72rem', color: '#94a3b8' }}>Partner Portal</Typography>
          </Box>
          <LogoutIcon
            onClick={(e) => { e.stopPropagation(); handleLogout(); }}
            sx={{ fontSize: 18, color: '#94a3b8', cursor: 'pointer', '&:hover': { color: '#ef4444' }, transition: 'color 0.2s' }}
          />
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f0f9ff', minHeight: '100vh' }}>
      <AppBar position="fixed" elevation={0} sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        bgcolor: 'rgba(240,249,255,0.9)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #bae6fd',
        color: '#0c4a6e',
        zIndex: (theme) => theme.zIndex.drawer - 1,
      }}>
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 4 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton color="inherit" edge="start" onClick={() => setMobileOpen(!mobileOpen)} sx={{ display: { sm: 'none' } }}>
              <MenuIcon />
            </IconButton>
            <Box sx={{
              display: { xs: 'none', md: 'flex' }, alignItems: 'center',
              bgcolor: '#ffffff', border: '1px solid #bae6fd', borderRadius: '14px',
              px: 2, py: 0.75, gap: 1, width: 300,
              '&:focus-within': { borderColor: '#0369a1', boxShadow: '0 0 0 3px rgba(3,105,161,0.1)' }
            }}>
              <SearchIcon sx={{ fontSize: 18, color: '#94a3b8' }} />
              <input
                placeholder="Search members, transactions..."
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '0.88rem', width: '100%', color: '#374151' }}
              />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Tooltip title="Notifications">
              <IconButton sx={{ bgcolor: '#ffffff', border: '1px solid #bae6fd', borderRadius: '12px', width: 42, height: 42 }}>
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon sx={{ fontSize: 20, color: '#0369a1' }} />
                </Badge>
              </IconButton>
            </Tooltip>
            <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
              <Avatar sx={{ width: 42, height: 42, bgcolor: '#0369a1', border: '2px solid #fff', boxShadow: '0 4px 12px rgba(0,0,0,0.12)', fontSize: '0.95rem', fontWeight: 800 }}>
                {orgName?.[0]?.toUpperCase() || 'P'}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(false)} ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { width: drawerWidth, border: 'none' } }}>
          <SidebarContent />
        </Drawer>
        <Drawer variant="permanent"
          sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { width: drawerWidth, border: 'none', boxShadow: '2px 0 24px rgba(0,0,0,0.04)' } }}
          open>
          <SidebarContent />
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 4 }, width: { sm: `calc(100% - ${drawerWidth}px)` }, mt: '64px' }}>
        <AnimatePresence mode="wait">
          <motion.div key={pathname} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
            {children}
          </motion.div>
        </AnimatePresence>
      </Box>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }} anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{ sx: { mt: 1.5, borderRadius: '18px', minWidth: 200, boxShadow: '0 8px 30px rgba(0,0,0,0.1)', border: '1px solid #f1f5f9' } }}>
        <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid #f1f5f9' }}>
          <Typography sx={{ fontWeight: 800, fontSize: '0.9rem' }}>{orgName}</Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8' }}>{roleLabels[role]?.label}</Typography>
        </Box>
        <MenuItem onClick={handleMenuClose} sx={{ py: 1.5, mx: 1, mt: 0.5, borderRadius: '10px', fontSize: '0.9rem', fontWeight: 600 }}>Profile & Settings</MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={handleLogout} sx={{ py: 1.5, mx: 1, mb: 0.5, borderRadius: '10px', fontSize: '0.9rem', fontWeight: 700, color: '#ef4444' }}>
          <LogoutIcon sx={{ mr: 2, fontSize: 18, color: '#ef4444' }} /> Sign Out
        </MenuItem>
      </Menu>
    </Box>
  );
}
