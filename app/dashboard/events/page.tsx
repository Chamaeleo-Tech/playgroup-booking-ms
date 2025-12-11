"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
    Box,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    IconButton,
    CircularProgress,
    Tooltip,
    TablePagination
} from "@mui/material";
import { Add, Edit, Delete, Block } from "@mui/icons-material";
import eventService, { Event } from "@/services/events.service";
import EventDialog from "@/components/events/EventDialog";
import SecureAvatar from "@/components/SecureAvatar";

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalElements, setTotalElements] = useState(0);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const data = await eventService.getAllEvents(page, rowsPerPage);
            setEvents(data.content);
            setTotalElements(data.totalElements);
        } catch (error) {
            toast.error("Failed to fetch events");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, [page, rowsPerPage]);

    const handleOpenDialog = (event?: Event) => {
        setEditingEvent(event || null);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingEvent(null);
    };

    const handleSaveEvent = async (data: any) => {
        try {
            if (editingEvent) {
                await eventService.updateEvent(editingEvent.id, data);
                toast.success("Event updated successfully");
            } else {
                await eventService.createEvent(data);
                toast.success("Event created successfully");
            }
            fetchEvents();
        } catch (error) {
            toast.error("Operation failed");
            console.error(error);
            throw error;
        }
    };

    const handleDisableEvent = async (id: number) => {
        if (!confirm("Are you sure you want to cancel/disable this event?")) return;
        try {
            await eventService.disableEvent(id);
            toast.success("Event disabled successfully");
            fetchEvents();
        } catch (error) {
            toast.error("Failed to disable event");
            console.error(error);
        }
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" fontWeight="bold">Events</Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => handleOpenDialog()}
                >
                    Add Event
                </Button>
            </Box>

            <TableContainer component={Paper} elevation={3}>
                <Table>
                    <TableHead sx={{ bgcolor: 'background.default' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Image</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Ground</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Time</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Fees</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        ) : events.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                                    No events found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            events.map((event) => (
                                <TableRow key={event.id} hover>
                                    <TableCell>
                                        <SecureAvatar
                                            imagePath={event.image}
                                            fallbackLabel={event.title}
                                            sx={{ width: 60, height: 40, borderRadius: 1 }}
                                            variant="rounded"
                                        />
                                    </TableCell>
                                    <TableCell>{event.title}</TableCell>
                                    <TableCell>{event.ground?.name || 'N/A'}</TableCell>
                                    <TableCell>{event.startTournamentDate}</TableCell>
                                    <TableCell>{`${event.timeFrom} - ${event.timeTo}`}</TableCell>
                                    <TableCell>{event.registrationFees}</TableCell>
                                    <TableCell>
                                        <Box
                                            sx={{
                                                px: 1,
                                                py: 0.5,
                                                borderRadius: 1,
                                                bgcolor: event.isActive ? '#dcfce7' : '#fee2e2',
                                                color: event.isActive ? '#166534' : '#991b1b',
                                                display: 'inline-block',
                                                fontSize: '0.75rem',
                                                fontWeight: 600
                                            }}
                                        >
                                            {event.isActive ? 'Active' : 'Cancelled'}
                                        </Box>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="Edit">
                                            <IconButton color="primary" onClick={() => handleOpenDialog(event)}>
                                                <Edit />
                                            </IconButton>
                                        </Tooltip>
                                        {event.isActive && (
                                            <Tooltip title="Cancel Event">
                                                <IconButton color="error" onClick={() => handleDisableEvent(event.id)}>
                                                    <Block />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={totalElements}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>

            <EventDialog
                open={openDialog}
                onClose={handleCloseDialog}
                onSave={handleSaveEvent}
                event={editingEvent}
            />
        </Box>
    );
}
