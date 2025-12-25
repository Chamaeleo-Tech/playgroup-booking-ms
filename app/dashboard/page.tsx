"use client";



"use client";

import React, { useEffect, useState } from 'react';
import {
    Box,
    Grid,
    Paper,
    Typography,
    Card,
    CardContent,
    Stack,
    CircularProgress,
    Alert,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip
} from '@mui/material';
import {
    People,
    SportsSoccer,
    EventAvailable,
    Block,
    TrendingUp
} from '@mui/icons-material';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    Legend
} from 'recharts';
import analyticsService, { DashboardAnalytics } from '@/services/analytics.service';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function DashboardPage() {
    const [data, setData] = useState<DashboardAnalytics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const analytics = await analyticsService.getDashboardData();
                setData(analytics);
            } catch (err) {
                console.error("Failed to fetch dashboard data", err);
                setError("Failed to load dashboard analytics.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error || !data) {
        return (
            <Alert severity="error" sx={{ mt: 2 }}>
                {error || "No data available"}
            </Alert>
        );
    }

    // Transform data for charts
    const trendData = Object.entries(data.bookingsLast30Days).map(([date, count]) => ({
        date,
        count
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const sportData = Object.entries(data.bookingsBySportType).map(([name, value]) => ({
        name,
        value
    }));

    const playgroundData = Object.entries(data.topBookedPlaygrounds).map(([name, value]) => ({
        name,
        value
    }));

    const peakHoursData = Object.entries(data.peakBookingHours).map(([hour, count]) => ({
        hour: `${hour}:00`,
        count
    })).sort((a, b) => parseInt(a.hour) - parseInt(b.hour));

    const dayOrder = { "MONDAY": 1, "TUESDAY": 2, "WEDNESDAY": 3, "THURSDAY": 4, "FRIDAY": 5, "SATURDAY": 6, "SUNDAY": 7 };
    const daysData = Object.entries(data.mostBookedDaysOfWeek).map(([day, count]) => ({
        day,
        count
    })).sort((a: any, b: any) => (dayOrder[a.day as keyof typeof dayOrder] || 0) - (dayOrder[b.day as keyof typeof dayOrder] || 0));

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1e293b', mb: 1 }}>
                    Dashboard Overview
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Real-time analytics and booking statistics.
                </Typography>
            </Box>

            {/* Overview Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        title="Bookings Today"
                        value={data.bookingsToday}
                        icon={<EventAvailable />}
                        color="#10b981"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        title="Bookings This Month"
                        value={data.bookingsThisMonth}
                        icon={<TrendingUp />}
                        color="#667eea"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        title="Active Playgrounds"
                        value={data.activePlaygrounds}
                        icon={<SportsSoccer />}
                        color="#f59e0b"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        title="Inactive Playgrounds"
                        value={data.inactivePlaygrounds}
                        icon={<Block />}
                        color="#ef4444"
                    />
                </Grid>
            </Grid>

            {/* Charts Row 1 */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <ChartPaper title="Booking Trends (Last 30 Days)">
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="date" tick={{ fontSize: 12 }} tickFormatter={(val) => val.split('-').slice(1).join('/')} />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartPaper>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <ChartPaper title="Sports Distribution">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={sportData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {sportData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartPaper>
                </Grid>
            </Grid>

            {/* Charts Row 2 */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <ChartPaper title="Top Booked Playgrounds">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={playgroundData} layout="vertical" margin={{ left: 40 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                                <Tooltip />
                                <Bar dataKey="value" fill="#82ca9d" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartPaper>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <ChartPaper title="Peak Booking Hours">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={peakHoursData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="hour" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#8884d8" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartPaper>
                </Grid>
            </Grid>

            {/* Recent Bookings */}
            <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                    Recent Bookings
                </Typography>
                <TableContainer>
                    <Table size="medium">
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Customer</TableCell>
                                <TableCell>Playground</TableCell>
                                <TableCell>Date/Time</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="right">Price</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.latestBookings.map((booking) => (
                                <TableRow key={booking.id} hover>
                                    <TableCell>#{booking.id}</TableCell>
                                    <TableCell>{booking.customerName}</TableCell>
                                    <TableCell>{booking.playgroundName}</TableCell>
                                    <TableCell>{new Date(booking.startTime).toLocaleString()}</TableCell>
                                    <TableCell>
                                        <StatusBadge status={booking.status} />
                                    </TableCell>
                                    <TableCell align="right">${booking.totalPrice.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
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
                                width: 56,
                                height: 56,
                                borderRadius: 2.5,
                                bgcolor: `${color}15`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            {React.cloneElement(icon, { sx: { color: color, fontSize: 28 } })}
                        </Box>
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
}

function ChartPaper({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: 'none', height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', fontSize: '1rem' }}>
                {title}
            </Typography>
            {children}
        </Paper>
    );
}

function StatusBadge({ status }: { status: string }) {
    let color: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" = "default";

    switch (status.toUpperCase()) {
        case 'CONFIRMED': color = 'success'; break;
        case 'PENDING': color = 'warning'; break;
        case 'CANCELLED': color = 'error'; break;
        case 'COMPLETED': color = 'info'; break;
    }

    return (
        <Chip
            label={status}
            color={color}
            size="small"
            variant="outlined"
            sx={{ fontWeight: 600, fontSize: '0.75rem' }}
        />
    );
}
