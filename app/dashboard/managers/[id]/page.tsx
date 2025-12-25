"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
    Box,
    Grid,
    Paper,
    Typography,
    Card,
    CardContent,
    Stack,
    CircularProgress,
    Avatar,
    Chip,
    Container,
    Button,
    Divider,
    TextField,
    LinearProgress
} from '@mui/material';
import {
    ArrowBack,
    EventNote,
    AttachMoney,
    AccessTime,
    TrendingUp,
    Person
} from '@mui/icons-material';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip as RechartsTooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid
} from 'recharts';
import Link from 'next/link';
import managerService, { ManagerStats, User } from '@/services/managers.service';

const COLORS = ['#FFBB28', '#00C49F', '#FF8042', '#0088FE', '#EF4444'];

export default function ManagerStatsPage() {
    const params = useParams();
    const managerId = Number(params?.id);

    const [stats, setStats] = useState<ManagerStats | null>(null);
    const [manager, setManager] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Default to current month
    const [startDate, setStartDate] = useState(() => {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        return firstDay.toISOString().split('T')[0];
    });
    const [endDate, setEndDate] = useState(() => {
        const now = new Date();
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        return lastDay.toISOString().split('T')[0];
    });

    useEffect(() => {
        const fetchData = async () => {
            if (!managerId) return;
            // If we already have stats, we are refreshing
            if (stats) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            try {
                // Fetch manager details only once if not present
                let managerData = manager;
                if (!manager) {
                    managerData = await managerService.getManagerById(managerId);
                    setManager(managerData);
                }

                const statsData = await managerService.getManagerStats(managerId, startDate, endDate);
                setStats(statsData);
            } catch (error) {
                console.error("Failed to fetch manager data", error);
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        };

        fetchData();
    }, [managerId, startDate, endDate]);

    if (loading && !stats) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!manager) {
        // Handle case where manager load failed but we stopped loading
        // This can happen if getManagerById fails. 
        // For safety let's return error if loading is false and no manager
        if (!loading) {
            return (
                <Box sx={{ p: 3 }}>
                    <Typography variant="h6" color="error">Manager not found</Typography>
                    <Button component={Link} href="/dashboard/managers" startIcon={<ArrowBack />} sx={{ mt: 2 }}>
                        Back to Managers
                    </Button>
                </Box>
            );
        }
        return null;
    }

    // Safety check for stats as well
    if (!stats) return null;

    // Prepare chart data
    const bookingStatusData = [
        { name: 'Pending', value: stats.bookingStats['PENDING'] || stats.bookingStats['pending'] || 0 },
        { name: 'Confirmed', value: stats.bookingStats['CONFIRMED'] || stats.bookingStats['confirmed'] || 0 },
        { name: 'Rejected', value: stats.bookingStats['REJECTED'] || stats.bookingStats['rejected'] || 0 },
        { name: 'Completed', value: stats.bookingStats['COMPLETED'] || stats.bookingStats['completed'] || 0 },
        { name: 'Cancelled', value: stats.bookingStats['CANCELLED'] || stats.bookingStats['cancelled'] || 0 }
    ].filter(item => item.value > 0);

    return (
        <Container maxWidth="xl">
            <Box sx={{ mb: 4 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Button
                        component={Link}
                        href="/dashboard/managers"
                        startIcon={<ArrowBack />}
                        sx={{ color: 'text.secondary' }}
                    >
                        Back to Managers
                    </Button>
                    <Stack direction="row" spacing={2}>
                        <TextField
                            label="Start Date"
                            type="date"
                            size="small"
                            InputLabelProps={{ shrink: true }}
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            sx={{ bgcolor: 'white' }}
                        />
                        <TextField
                            label="End Date"
                            type="date"
                            size="small"
                            InputLabelProps={{ shrink: true }}
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            sx={{ bgcolor: 'white' }}
                        />
                    </Stack>
                </Stack>

                {refreshing && <LinearProgress sx={{ mb: 2, borderRadius: 1 }} />}

                <Paper sx={{ p: 4, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: 'white' }} elevation={0}>
                    <Grid container spacing={4} alignItems="center">
                        <Grid size="auto">
                            <Avatar sx={{
                                width: 80,
                                height: 80,
                                fontSize: '2rem',
                                bgcolor: 'primary.main',
                                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)'
                            }}>
                                {manager.firstName[0]}{manager.lastName[0]}
                            </Avatar>
                        </Grid>
                        <Grid size="grow">
                            <Typography variant="h4" fontWeight="bold" sx={{ color: '#1e293b' }}>
                                {manager.firstName} {manager.lastName}
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                                {manager.email}
                            </Typography>
                            {manager.ground && (
                                <Chip
                                    label={manager.ground.name}
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                    sx={{ fontWeight: 600 }}
                                />
                            )}
                        </Grid>
                        <Grid size="auto">
                            <Paper sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, textAlign: 'center', minWidth: 150 }} elevation={0}>
                                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
                                    Total Revenue
                                </Typography>
                                <Typography variant="h5" fontWeight="bold" color="success.main">
                                    ${stats.revenue.toLocaleString()}
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </Paper>
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        title="Total Bookings"
                        value={stats.totalBookings}
                        icon={<EventNote />}
                        color="#6366f1"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        title="Pending Reviews"
                        value={stats.bookingStats['PENDING'] || stats.bookingStats['pending'] || 0}
                        icon={<AccessTime />}
                        color="#f59e0b"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        title="Occupancy Rate"
                        value={`${stats.usageStats.occupancyRate}%`}
                        icon={<TrendingUp />}
                        color="#10b981"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        title="Hours Booked"
                        value={stats.usageStats.totalHoursBooked}
                        icon={<AccessTime />}
                        color="#8b5cf6"
                    />
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 3, height: 400, borderRadius: 3, border: '1px solid #e2e8f0' }} elevation={0}>
                        <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                            Booking Status Distribution
                        </Typography>
                        <ResponsiveContainer width="100%" height="85%">
                            <PieChart>
                                <Pie
                                    data={bookingStatusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {bookingStatusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 3, height: 400, borderRadius: 3, border: '1px solid #e2e8f0' }} elevation={0}>
                        <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                            Recent Activity
                        </Typography>
                        <Stack spacing={2} sx={{ overflow: 'auto', maxHeight: 320 }}>
                            {stats.recentActivity.map((activity) => (
                                <Box
                                    key={activity.id}
                                    sx={{
                                        p: 2,
                                        borderRadius: 2,
                                        bgcolor: '#f8fafc',
                                        border: '1px solid #f1f5f9'
                                    }}
                                >
                                    <Grid container alignItems="center" spacing={2}>
                                        <Grid size="auto">
                                            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.lighter', color: 'primary.main' }}>
                                                <EventNote sx={{ fontSize: 18 }} />
                                            </Avatar>
                                        </Grid>
                                        <Grid size="grow">
                                            <Typography variant="subtitle2" fontWeight="600">
                                                {activity.customerName} booked {activity.playgroundName}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {new Date(activity.startTime).toLocaleString()} • ${activity.totalPrice} • {activity.status}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                            ))}
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}

function StatCard({ title, value, icon, color }: any) {
    return (
        <Card sx={{ height: '100%', borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
            <CardContent sx={{ p: 3 }}>
                <Stack spacing={2}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 500 }}>
                                {title}
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1e293b' }}>
                                {value}
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                width: 48,
                                height: 48,
                                borderRadius: 2,
                                bgcolor: `${color}15`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            {React.cloneElement(icon, { sx: { color: color, fontSize: 24 } })}
                        </Box>
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
}
