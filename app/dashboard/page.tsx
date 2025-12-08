"use client";

import { Box, Grid, Paper, Typography, Card, CardContent, Stack } from '@mui/material';
import { People, Category, Event, TrendingUp, ArrowUpward } from '@mui/icons-material';

const stats = [
    { title: "Total Managers", value: "24", change: "+12%", icon: People, color: "#667eea", bgColor: "#eef2ff" },
    { title: "Active Categories", value: "8", change: "+25%", icon: Category, color: "#ec4899", bgColor: "#fdf2f8" },
    { title: "Total Bookings", value: "1,240", change: "+18%", icon: Event, color: "#10b981", bgColor: "#f0fdf4" },
    { title: "Revenue", value: "$12.4k", change: "+23%", icon: TrendingUp, color: "#f59e0b", bgColor: "#fffbeb" },
];

export default function DashboardPage() {
    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1e293b', mb: 1 }}>
                    Dashboard Overview
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Welcome back! Here's what's happening with your platform today.
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {stats.map((stat, index) => (
                    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                        <Card
                            sx={{
                                height: '100%',
                                borderRadius: 3,
                                border: '1px solid #e2e8f0',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                                    transform: 'translateY(-4px)'
                                }
                            }}
                        >
                            <CardContent sx={{ p: 3 }}>
                                <Stack spacing={2}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <Box>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 500 }}>
                                                {stat.title}
                                            </Typography>
                                            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1e293b' }}>
                                                {stat.value}
                                            </Typography>
                                        </Box>
                                        <Box
                                            sx={{
                                                width: 56,
                                                height: 56,
                                                borderRadius: 2.5,
                                                bgcolor: stat.bgColor,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <stat.icon sx={{ color: stat.color, fontSize: 28 }} />
                                        </Box>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <ArrowUpward sx={{ fontSize: 16, color: '#10b981' }} />
                                        <Typography variant="body2" sx={{ color: '#10b981', fontWeight: 600 }}>
                                            {stat.change}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            vs last month
                                        </Typography>
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Paper
                        sx={{
                            p: 4,
                            height: 400,
                            borderRadius: 3,
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                            Analytics Overview
                        </Typography>
                        <Box sx={{
                            height: 300,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 2,
                            border: '2px dashed #e2e8f0',
                            bgcolor: '#fafbfc'
                        }}>
                            <Box sx={{
                                width: 80,
                                height: 80,
                                borderRadius: '50%',
                                bgcolor: '#eef2ff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mb: 2
                            }}>
                                <TrendingUp sx={{ fontSize: 40, color: '#667eea' }} />
                            </Box>
                            <Typography color="text.secondary" sx={{ fontWeight: 500 }}>
                                Analytics Chart Coming Soon
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                                Booking trends and revenue insights will appear here
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper
                        sx={{
                            p: 4,
                            height: 400,
                            borderRadius: 3,
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                            Recent Activity
                        </Typography>
                        <Stack spacing={2} sx={{ flexGrow: 1, overflow: 'auto' }}>
                            {[
                                { title: 'New Manager Added', time: '2 hours ago', color: '#667eea', icon: People },
                                { title: 'Category Updated', time: '5 hours ago', color: '#ec4899', icon: Category },
                                { title: 'Booking Confirmed', time: '1 day ago', color: '#10b981', icon: Event },
                                { title: 'Revenue Updated', time: '2 days ago', color: '#f59e0b', icon: TrendingUp }
                            ].map((activity, i) => (
                                <Box
                                    key={i}
                                    sx={{
                                        p: 2,
                                        borderRadius: 2,
                                        bgcolor: '#f8fafc',
                                        border: '1px solid #f1f5f9',
                                        transition: 'all 0.2s ease',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            bgcolor: '#f1f5f9',
                                            transform: 'translateX(4px)',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                                        }
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Box
                                            sx={{
                                                width: 36,
                                                height: 36,
                                                borderRadius: '50%',
                                                bgcolor: activity.color + '20',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0
                                            }}
                                        >
                                            <activity.icon sx={{ fontSize: 18, color: activity.color }} />
                                        </Box>
                                        <Box sx={{ flexGrow: 1 }}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                                                {activity.title}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {activity.time}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            ))}
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}
