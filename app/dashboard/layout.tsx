"use client";

import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
    AppBar,
    Box,
    CssBaseline,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
    Avatar,
    Chip,
    Stack
} from '@mui/material';
import {
    Menu as MenuIcon,
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    Category as CategoryIcon,
    Logout as LogoutIcon,
    AccountCircle
} from '@mui/icons-material';

const drawerWidth = 300;

interface Props {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [isClosing, setIsClosing] = React.useState(false);

    React.useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
        }
    }, [router]);

    const handleDrawerClose = () => {
        setIsClosing(true);
        setMobileOpen(false);
    };

    const handleDrawerTransitionEnd = () => {
        setIsClosing(false);
    };

    const handleDrawerToggle = () => {
        if (!isClosing) {
            setMobileOpen(!mobileOpen);
        }
    };

    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
        { text: 'Managers', icon: <PeopleIcon />, path: '/dashboard/managers' },
        { text: 'Playground Categories', icon: <CategoryIcon />, path: '/dashboard/categories' },
    ];

    const drawer = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#ffffff' }}>
            <Toolbar sx={{ px: 3, py: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                        sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 2,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '1.2rem'
                        }}
                    >
                        A
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b' }}>
                        AdminZone
                    </Typography>
                </Box>
            </Toolbar>
            <Divider />

            <List sx={{ px: 2, py: 2, flexGrow: 1 }}>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                        <ListItemButton
                            selected={pathname === item.path}
                            onClick={() => router.push(item.path)}
                            sx={{
                                borderRadius: 2,
                                py: 1.5,
                                transition: 'all 0.2s ease',
                                '&.Mui-selected': {
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: 'white',
                                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                                    '& .MuiListItemIcon-root': {
                                        color: 'white',
                                    },
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    }
                                },
                                '&:hover': {
                                    bgcolor: '#f1f5f9',
                                }
                            }}
                        >
                            <ListItemIcon sx={{
                                color: pathname === item.path ? 'white' : '#667eea',
                                minWidth: 40
                            }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.text}
                                primaryTypographyProps={{
                                    fontWeight: pathname === item.path ? 600 : 500,
                                    fontSize: '0.95rem'
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>

            <Divider />
            <List sx={{ px: 2, py: 2 }}>
                <ListItem disablePadding>
                    <ListItemButton
                        onClick={() => {
                            localStorage.clear();
                            window.location.href = "/login";
                        }}
                        sx={{
                            borderRadius: 2,
                            py: 1.5,
                            '&:hover': {
                                bgcolor: '#fef2f2',
                            }
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 40 }}>
                            <LogoutIcon sx={{ color: '#ef4444' }} />
                        </ListItemIcon>
                        <ListItemText
                            primary="Logout"
                            primaryTypographyProps={{
                                color: '#ef4444',
                                fontWeight: 500
                            }}
                        />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    bgcolor: 'white',
                    borderBottom: '1px solid #e2e8f0',
                    color: '#1e293b',
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
                        System Dashboard
                    </Typography>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Chip
                            icon={<AccountCircle />}
                            label="Admin"
                            variant="outlined"
                            size="small"
                            sx={{
                                borderColor: '#667eea',
                                color: '#667eea',
                                fontWeight: 600
                            }}
                        />
                        <Avatar
                            sx={{
                                width: 36,
                                height: 36,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                fontSize: '0.9rem',
                                fontWeight: 'bold'
                            }}
                        >
                            A
                        </Avatar>
                    </Stack>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onTransitionEnd={handleDrawerTransitionEnd}
                    onClose={handleDrawerClose}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                            borderRight: '1px solid #e2e8f0'
                        },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                            borderRight: '1px solid #e2e8f0'
                        },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    minHeight: '100vh',
                    bgcolor: '#f8fafc'
                }}
            >
                <Toolbar />
                {children}
            </Box>
        </Box>
    );
}
