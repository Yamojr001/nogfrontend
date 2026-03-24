'use client';
import React, { useState, useEffect } from 'react';
import { 
  Box, Drawer, AppBar, Toolbar, List, Typography, Divider, 
  IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Avatar, Menu, MenuItem, Badge, Tooltip
} from '@mui/material';
import { 
  Menu as MenuIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Logout as LogoutIcon,
  ChevronRight as ChevronRightIcon,
  AdminPanelSettings as AdminIcon
} from '@mui/icons-material';
import { useRouter, usePathname } from 'next/navigation';
import { NAVIGATION_CONFIG } from '@/lib/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { TourProvider } from '@/components/TourProvider';

const drawerWidth = 280;

const roleLabels: Record<string, { label: string; color: string }> = {
  super_admin: { label: 'Super Admin', color: '#004d40' },
  finance_admin: { label: 'Finance Admin', color: '#7c3aed' },
  auditor: { label: 'Auditor', color: '#b45309' },
  partner_admin: { label: 'Partner Admin', color: '#0369a1' },
  sub_org_admin: { label: 'Sub-Org Admin', color: '#065f46' },
  group_admin: { label: 'Group Admin', color: '#9a3412' },
  apex_admin: { label: 'Apex Admin', color: '#004d40' },
  member: { label: 'Member', color: '#1e40af' },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [role, setRole] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchVal, setSearchVal] = useState('');

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const storedRole = localStorage.getItem('user_role') || '';
      const storedToken = localStorage.getItem('access_token');
      if (!storedToken) {
        router.push('/login');
        return;
      }
      setRole(storedRole);
      setUserName(localStorage.getItem('user_name') || roleLabels[storedRole]?.label || storedRole);
    }
  }, [router]);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogout = () => { 
    localStorage.clear(); 
    document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/login'); 
  };

  const menuItems = NAVIGATION_CONFIG[role] || (mounted ? NAVIGATION_CONFIG['super_admin'] : []);

  if (!mounted) return null;

  const SidebarContent = () => (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#ffffff' }}>
      <Box sx={{ p: 3.5, display: 'flex', alignItems: 'center', gap: 2 }}>
        <img src="/logo.png" alt="NOGALSS" width={44} height={44} style={{ objectFit: 'contain' }} />
        <Box>
          <Typography sx={{ fontWeight: 900, color: '#004d40', fontSize: '1.1rem', lineHeight: 1.2 }}>NOGALSS</Typography>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', bgcolor: `${(roleLabels[role]?.color || '#004d40')}18`, borderRadius: '6px', px: 1, py: 0.25, mt: 0.25 }}>
            <Typography sx={{ fontSize: '0.65rem', fontWeight: 800, color: roleLabels[role]?.color || '#004d40', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {roleLabels[role]?.label || 'Portal'}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ borderColor: '#f1f5f9' }} />

      <Box sx={{ flexGrow: 1, overflowY: 'auto', px: 2, py: 2 }}>
        <Typography sx={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', px: 2, mb: 1.5 }}>
          Main Menu
        </Typography>
        <List disablePadding>
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            return (
              <ListItem key={item.name} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  id={`tour-menu-${item.name.toLowerCase()}`}
                  onClick={() => { router.push(item.path); setMobileOpen(false); }}
                  sx={{
                    borderRadius: '14px',
                    px: 2.5,
                    py: 1.5,
                    transition: 'all 0.2s ease',
                    bgcolor: isActive ? '#004d40' : 'transparent',
                    '&:hover': {
                      bgcolor: isActive ? '#003d33' : '#f1f5f9',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 40,
                      color: isActive ? '#ffffff' : '#64748b',
                      '& .MuiSvgIcon-root': { fontSize: 22 }
                    }}
                  >
                    <Icon />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.name}
                    primaryTypographyProps={{
                      fontSize: '0.92rem',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? '#ffffff' : '#374151',
                    }}
                  />
                  {isActive && (
                    <ChevronRightIcon sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 18 }} />
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      <Box sx={{ p: 2.5, borderTop: '1px solid #f1f5f9' }}>
        <Box
          onClick={handleMenuOpen}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: 2,
            borderRadius: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            '&:hover': { bgcolor: '#f8fafc' }
          }}
        >
          <Avatar sx={{ width: 40, height: 40, bgcolor: roleLabels[role]?.color || '#004d40', fontSize: '1rem', fontWeight: 800 }}>
            {userName?.[0]?.toUpperCase() || 'A'}
          </Avatar>
          <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
            <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: '#1e293b', textTransform: 'capitalize', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {userName}
            </Typography>
            <Typography sx={{ fontSize: '0.72rem', color: '#94a3b8' }}>Apex Portal</Typography>
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
    <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'rgba(248, 250, 252, 0.9)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #e2e8f0',
          color: '#1e293b',
          zIndex: (theme) => theme.zIndex.drawer - 1,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 4 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ display: { sm: 'none' } }}>
              <MenuIcon />
            </IconButton>
            <Box sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              bgcolor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              px: 2, py: 0.75, gap: 1, width: 300,
              transition: 'all 0.2s',
              '&:focus-within': { borderColor: '#004d40', boxShadow: '0 0 0 3px rgba(0,77,64,0.08)' }
            }}>
              <SearchIcon sx={{ fontSize: 18, color: '#94a3b8' }} />
              <input
                placeholder="Search anything..."
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '0.88rem', width: '100%', color: '#374151' }}
              />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Tooltip title="Notifications">
              <IconButton sx={{ bgcolor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', width: 42, height: 42 }}>
                <Badge id="tour-notifications" badgeContent={3} color="error">
                  <NotificationsIcon sx={{ fontSize: 20, color: '#374151' }} />
                </Badge>
              </IconButton>
            </Tooltip>
            <IconButton id="tour-profile" onClick={handleMenuOpen} sx={{ p: 0 }}>
              <Avatar sx={{ width: 42, height: 42, bgcolor: roleLabels[role]?.color || '#004d40', border: '2px solid #ffffff', boxShadow: '0 4px 12px rgba(0,0,0,0.12)', fontSize: '0.95rem', fontWeight: 800 }}>
                {userName?.[0]?.toUpperCase() || 'A'}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', border: 'none' } }}
        >
          <SidebarContent />
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', border: 'none', boxShadow: '2px 0 24px rgba(0,0,0,0.04)' } }}
          open
        >
          <SidebarContent />
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 4 }, width: { sm: `calc(100% - ${drawerWidth}px)` }, mt: '64px', minHeight: 'calc(100vh - 64px)' }}>
        <TourProvider>
          <AnimatePresence mode="wait">
            <motion.div key={pathname} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18, ease: 'easeOut' }}>
              {children}
            </motion.div>
          </AnimatePresence>
        </TourProvider>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{ sx: { mt: 1.5, borderRadius: '18px', minWidth: 200, boxShadow: '0 8px 30px rgba(0,0,0,0.1)', border: '1px solid #f1f5f9', overflow: 'visible' } }}
      >
        <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid #f1f5f9' }}>
          <Typography sx={{ fontWeight: 800, fontSize: '0.9rem' }}>{userName}</Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'capitalize' }}>{role?.replace('_', ' ')}</Typography>
        </Box>
        <MenuItem onClick={handleMenuClose} sx={{ py: 1.5, mx: 1, mt: 0.5, borderRadius: '10px', fontSize: '0.9rem', fontWeight: 600 }}>
          <AdminIcon sx={{ mr: 2, fontSize: 18, color: '#64748b' }} /> Profile Settings
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ py: 1.5, mx: 1, borderRadius: '10px', fontSize: '0.9rem', fontWeight: 600 }}>
          <NotificationsIcon sx={{ mr: 2, fontSize: 18, color: '#64748b' }} /> Notifications
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={handleLogout} sx={{ py: 1.5, mx: 1, mb: 0.5, borderRadius: '10px', fontSize: '0.9rem', fontWeight: 700, color: '#ef4444' }}>
          <LogoutIcon sx={{ mr: 2, fontSize: 18, color: '#ef4444' }} /> Sign Out
        </MenuItem>
      </Menu>
    </Box>
  );
}
