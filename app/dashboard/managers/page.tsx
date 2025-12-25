"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    IconButton,
    CircularProgress,
    Chip,
    Avatar,
    Stack,
    TablePagination,
    InputAdornment
} from "@mui/material";
import { Add, Delete, Person, Mail, Search, Stadium, LocationOn, Edit, Assessment as AssessmentIcon } from "@mui/icons-material";
import managerService, { User } from "@/services/managers.service";
import CreateManagerDialog from "@/components/managers/CreateManagerDialog";

export default function ManagersPage() {
    const [managers, setManagers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalElements, setTotalElements] = useState(0);
    const [searchEmail, setSearchEmail] = useState("");
    const [searchName, setSearchName] = useState("");
    const [selectedManager, setSelectedManager] = useState<User | null>(null);

    const handleEdit = (manager: User) => {
        setSelectedManager(manager);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedManager(null);
    };

    const fetchManagers = async () => {
        try {
            const response = await managerService.getManagers({
                email: searchEmail || undefined,
                name: searchName || undefined,
                page,
                size: rowsPerPage,
            });
            setManagers(response.content);
            setTotalElements(response.page.totalElements);

        } catch (error) {
            toast.error("Failed to fetch managers");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchManagers();
    }, [page, rowsPerPage, searchEmail, searchName]);

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this manager?")) return;
        try {
            await managerService.deleteManager(id);
            toast.success("Manager deleted successfully");
            fetchManagers();
        } catch (error) {
            toast.error("Failed to delete manager");
            console.error(error);
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" fontWeight="bold">Managers</Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => {
                        setSelectedManager(null);
                        setOpen(true);
                    }}
                >
                    Add Manager
                </Button>
            </Box>

            <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                <TextField
                    placeholder="Search by email..."
                    value={searchEmail}
                    onChange={(e) => {
                        setSearchEmail(e.target.value);
                        setPage(0);
                    }}
                    size="small"
                    sx={{ width: 300 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        ),
                    }}
                />
                <TextField
                    placeholder="Search by name..."
                    value={searchName}
                    onChange={(e) => {
                        setSearchName(e.target.value);
                        setPage(0);
                    }}
                    size="small"
                    sx={{ width: 300 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        ),
                    }}
                />
            </Stack>

            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
                <Table>
                    <TableHead sx={{ bgcolor: 'grey.50' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem', color: 'text.secondary', letterSpacing: '0.05em' }}>Manager</TableCell>
                            <TableCell sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem', color: 'text.secondary', letterSpacing: '0.05em' }}>Contact</TableCell>
                            <TableCell sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem', color: 'text.secondary', letterSpacing: '0.05em' }}>Playground Info</TableCell>
                            <TableCell sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem', color: 'text.secondary', letterSpacing: '0.05em' }}>Status</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem', color: 'text.secondary', letterSpacing: '0.05em' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                                    <CircularProgress size={32} />
                                </TableCell>
                            </TableRow>
                        ) : (!managers || managers.length === 0) ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                                        <Person sx={{ fontSize: 48, color: 'text.disabled' }} />
                                        <Typography color="text.secondary">No managers found.</Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ) : (
                            managers.map((manager) => (
                                <TableRow
                                    key={manager.id}
                                    hover
                                    sx={{
                                        '&:hover': { bgcolor: 'primary.lighter' },
                                        transition: 'background-color 0.2s'
                                    }}
                                >
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Avatar sx={{
                                                bgcolor: 'primary.main',
                                                width: 40,
                                                height: 40,
                                                fontSize: '1rem',
                                                fontWeight: 'bold',
                                                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)'
                                            }}>
                                                {manager.firstName[0]}{manager.lastName[0]}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="subtitle2" fontWeight="bold" sx={{ color: 'text.primary' }}>
                                                    {manager.firstName} {manager.lastName}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>
                                                    ID: #{manager.id}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Box sx={{
                                                p: 0.5,
                                                borderRadius: 1,
                                                bgcolor: 'orange.50',
                                                color: 'orange.600',
                                                display: 'flex'
                                            }}>
                                                <Mail fontSize="small" sx={{ fontSize: 16 }} />
                                            </Box>
                                            <Typography variant="body2" sx={{ fontWeight: 500 }}>{manager.email}</Typography>
                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        {manager.ground ? (
                                            <Box sx={{
                                                p: 1.5,
                                                borderRadius: 2,
                                                bgcolor: 'background.paper',
                                                border: '1px solid',
                                                borderColor: 'grey.100',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 0.5,
                                                maxWidth: 220
                                            }}>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Stadium fontSize="small" sx={{ color: 'primary.main', fontSize: 18 }} />
                                                    <Typography variant="subtitle2" fontWeight="bold" noWrap>{manager.ground.name}</Typography>
                                                </Stack>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <LocationOn fontSize="small" sx={{ color: 'text.secondary', fontSize: 16 }} />
                                                    <Typography variant="caption" color="text.secondary" noWrap>
                                                        {manager.ground.address}
                                                    </Typography>
                                                </Stack>
                                            </Box>
                                        ) : (
                                            <Chip label="No Ground" size="small" color="warning" variant="outlined" sx={{ borderRadius: 1 }} />
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label="Active"
                                            size="small"
                                            sx={{
                                                bgcolor: 'success.lighter',
                                                color: 'success.dark',
                                                fontWeight: 600,
                                                borderRadius: 1,
                                                '& .MuiChip-label': { px: 1.5 }
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton
                                            size="small"
                                            onClick={() => handleEdit(manager)}
                                            sx={{
                                                mr: 1,
                                                color: 'text.secondary',
                                                '&:hover': { color: 'primary.main', bgcolor: 'primary.lighter' }
                                            }}
                                        >
                                            <Edit fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleDelete(manager.id)}
                                            sx={{
                                                color: 'text.secondary',
                                                '&:hover': { color: 'error.main', bgcolor: 'error.lighter' }
                                            }}
                                        >
                                            <Delete fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            href={`/dashboard/managers/${manager.id}`}
                                            sx={{
                                                color: 'text.secondary',
                                                '&:hover': { color: 'info.main', bgcolor: 'info.lighter' }
                                            }}
                                        >
                                            <AssessmentIcon fontSize="small" />
                                        </IconButton>
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
                    onPageChange={(_, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(e) => {
                        setRowsPerPage(parseInt(e.target.value, 10));
                        setPage(0);
                    }}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    sx={{ borderTop: '1px solid', borderColor: 'divider' }}
                    showFirstButton
                    showLastButton
                    labelDisplayedRows={({ count }) => `Page ${page + 1} of ${Math.ceil(count / rowsPerPage)}`}
                />
            </TableContainer>

            <CreateManagerDialog
                open={open}
                onClose={handleClose}
                onSuccess={() => {
                    fetchManagers();
                }}
                initialData={selectedManager}
            />
        </Box>
    );
}
