"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    Box,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    TextField,
    InputAdornment,
    Button,
    Card,
    CardContent,
    Stack,
    Chip,
    Avatar
} from "@mui/material";
import {
    Search,
    ArrowBack,
    Person,
    Event as EventIcon,
    AccessTime,
    Place,
    Groups
} from "@mui/icons-material";
import eventService, { Event, TeamRegistration } from "@/services/events.service";
import toast from "react-hot-toast";
import SecureAvatar from "@/components/SecureAvatar";

export default function EventRegistrationsPage() {
    const params = useParams();
    const router = useRouter();
    const eventId = Number(params.id);

    const [event, setEvent] = useState<Event | null>(null);
    const [registrations, setRegistrations] = useState<TeamRegistration[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterText, setFilterText] = useState("");

    useEffect(() => {
        if (eventId) {
            fetchData();
        }
    }, [eventId]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [eventData, registrationsData] = await Promise.all([
                eventService.getEventById(eventId),
                eventService.getEventRegistrations(eventId)
            ]);
            setEvent(eventData);
            setRegistrations(registrationsData);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    const filteredRegistrations = registrations.filter(reg =>
        reg.teamName.toLowerCase().includes(filterText.toLowerCase())
    );

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!event) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography variant="h5" color="error">Event not found</Typography>
                <Button startIcon={<ArrowBack />} onClick={() => router.back()} sx={{ mt: 2 }}>
                    Go Back
                </Button>
            </Box>
        );
    }

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => router.back()}
                    sx={{ mb: 2, color: 'text.secondary' }}
                >
                    Back to Events
                </Button>
                <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
                    Event Registrations
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Manage teams and view registration details
                </Typography>
            </Box>

            <Box sx={{ mb: 4 }}>
                <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                    <CardContent>
                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between">
                            <Box sx={{ flex: 1 }}>
                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                                    <SecureAvatar
                                        imagePath={event.image}
                                        fallbackLabel={event.title}
                                        variant="rounded"
                                        sx={{ width: 64, height: 64 }}
                                    />
                                    <Box>
                                        <Typography variant="h6" fontWeight="bold">{event.title}</Typography>
                                        <Chip
                                            label={event.isActive ? "Active" : "Inactive"}
                                            size="small"
                                            color={event.isActive ? "success" : "default"}
                                            sx={{ height: 24 }}
                                        />
                                    </Box>
                                </Box>
                                <Stack direction="row" spacing={3} color="text.secondary">
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <EventIcon fontSize="small" />
                                        <Typography variant="body2">{event.startTournamentDate}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <AccessTime fontSize="small" />
                                        <Typography variant="body2">{event.timeFrom} - {event.timeTo}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Place fontSize="small" />
                                        <Typography variant="body2">{event.ground?.name}</Typography>
                                    </Box>
                                </Stack>
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', md: 'flex-end' }, justifyContent: 'center' }}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 2,
                                        bgcolor: 'primary.lighter',
                                        color: 'primary.main',
                                        borderRadius: 2,
                                        textAlign: 'center',
                                        minWidth: 120
                                    }}
                                >
                                    <Typography variant="h4" fontWeight="bold">{registrations.length}</Typography>
                                    <Typography variant="caption" fontWeight="bold" sx={{ textTransform: 'uppercase' }}>Teams Registered</Typography>
                                </Paper>
                            </Box>
                        </Stack>
                    </CardContent>
                </Card>
            </Box>

            <Box sx={{ mb: 3 }}>
                <TextField
                    placeholder="Search by team name..."
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                    size="small"
                    sx={{ width: 300, bgcolor: 'background.paper' }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>

            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <Table>
                    <TableHead sx={{ bgcolor: 'grey.50' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 600 }}>Team Name</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Players</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Registered By</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Registered At</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredRegistrations.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, opacity: 0.6 }}>
                                        <Groups sx={{ fontSize: 48 }} />
                                        <Typography>No registrations found matching your search.</Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredRegistrations.map((reg) => (
                                <TableRow key={reg.id} hover>
                                    <TableCell>
                                        <Typography fontWeight="bold" color="primary.main">
                                            {reg.teamName}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            icon={<Person sx={{ '&&': { fontSize: 16 } }} />}
                                            label={`${reg.numberOfPlayers} Players`}
                                            size="small"
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {reg.user ? (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <SecureAvatar
                                                    imagePath={reg.user.profilePicture}
                                                    fallbackLabel={`${reg.user.firstName} ${reg.user.lastName}`}
                                                    sx={{ width: 32, height: 32 }}
                                                />
                                                <Box>
                                                    <Typography variant="body2" fontWeight="bold">
                                                        {reg.user.firstName} {reg.user.lastName}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {reg.user.email}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        ) : (
                                            <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.disabled' }}>
                                                Unknown User
                                            </Typography>
                                        )}
                                    </TableCell>
                                    <TableCell sx={{ color: 'text.secondary' }}>
                                        {new Date(reg.createdAt).toLocaleString()}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
