"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
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
import { Add, Delete, Person, Mail, Search, Stadium, LocationOn, Edit, Assessment as AssessmentIcon, Phone } from "@mui/icons-material";
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
    const [searchPhone, setSearchPhone] = useState("");
    const [selectedManager, setSelectedManager] = useState<User | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [managerToDelete, setManagerToDelete] = useState<User | null>(null);

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
                phoneNumber: searchPhone || undefined,
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
    }, [page, rowsPerPage, searchEmail, searchName, searchPhone]);

    const openDeleteDialog = (manager: User) => {
        setManagerToDelete(manager);
        setDeleteDialogOpen(true);
    };

    const closeDeleteDialog = () => {
        setDeleteDialogOpen(false);
        setManagerToDelete(null);
    };

    const handleConfirmDelete = async () => {
        if (!managerToDelete) return;
        try {
            await managerService.deleteManager(managerToDelete.id);
            toast.success("Manager deleted successfully");
            fetchManagers();
        } catch (error) {
            toast.error("Failed to delete manager");
            console.error(error);
        } finally {
            closeDeleteDialog();
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
                <TextField
                    placeholder="Search by phone..."
                    value={searchPhone}
                    onChange={(e) => {
                        setSearchPhone(e.target.value);
                        setPage(0);
                    }}
                    size="small"
                    sx={{ width: 300 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Phone />
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
                                        <Stack spacing={1}>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Mail fontSize="small" sx={{ color: 'text.secondary', fontSize: 16 }} />
                                                <Typography variant="body2" sx={{ fontWeight: 500 }}>{manager.email}</Typography>
                                            </Stack>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Phone fontSize="small" sx={{ color: 'text.secondary', fontSize: 16 }} />
                                                <Typography variant="body2">{manager.phoneNumber || 'N/A'}</Typography>
                                            </Stack>
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
                                            onClick={() => openDeleteDialog(manager)}
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

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={closeDeleteDialog}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle>Delete Manager</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete {managerToDelete?.firstName} {managerToDelete?.lastName}?
                        <Box component="span" sx={{ display: 'block', mt: 1, color: 'error.main' }}>
                            This action cannot be undone and will also delete their playground.
                        </Box>
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={closeDeleteDialog} color="inherit">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirmDelete}
                        color="error"
                        variant="contained"
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
