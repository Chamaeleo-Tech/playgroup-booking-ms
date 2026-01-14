"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    CircularProgress,
    Chip,
    Avatar,
    Stack,
    TablePagination,
    InputAdornment,
    Button,
    Card,
    CardContent,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions
} from "@mui/material";
import {
    Person,
    Mail,
    Search,
    Phone,
    CheckCircle,
    Cancel,
    Block,
    Refresh
} from "@mui/icons-material";
import userService, { User } from "@/services/users.service";

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalElements, setTotalElements] = useState(0);

    // Search states
    const [searchEmail, setSearchEmail] = useState("");
    const [searchName, setSearchName] = useState("");
    const [searchPhone, setSearchPhone] = useState("");

    // Stats
    const [totalUsers, setTotalUsers] = useState<number | null>(null);

    // Confirmation dialog state
    const [confirmDialog, setConfirmDialog] = useState<{
        open: boolean;
        user: User | null;
        action: 'enable' | 'disable';
    }>({ open: false, user: null, action: 'disable' });

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await userService.getUsers({
                email: searchEmail || undefined,
                name: searchName || undefined,
                phoneNumber: searchPhone || undefined,
                page,
                size: rowsPerPage,
            });
            setUsers(response.content);
            setTotalElements(response.page.totalElements);

            if (!searchEmail && !searchName && !searchPhone) {
                setTotalUsers(response.page.totalElements);
            }
        } catch (error) {
            toast.error("Failed to fetch users");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchUsers();
        }, 500);
        return () => clearTimeout(timer);
    }, [page, rowsPerPage, searchEmail, searchName, searchPhone]);

    const openConfirmDialog = (user: User, action: 'enable' | 'disable') => {
        setConfirmDialog({ open: true, user, action });
    };

    const closeConfirmDialog = () => {
        setConfirmDialog({ open: false, user: null, action: 'disable' });
    };

    const handleConfirmAction = async () => {
        if (!confirmDialog.user) return;

        try {
            if (confirmDialog.action === 'enable') {
                await userService.enableUser(confirmDialog.user.id);
                toast.success("User enabled successfully");
            } else {
                await userService.disableUser(confirmDialog.user.id);
                toast.success("User disabled successfully");
            }
            fetchUsers();
        } catch (error) {
            toast.error(`Failed to ${confirmDialog.action} user`);
        } finally {
            closeConfirmDialog();
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold">Users</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Manage your application users
                    </Typography>
                </Box>
                {totalUsers !== null && (
                    <Card sx={{ minWidth: 200, bgcolor: 'primary.main', color: 'white' }}>
                        <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
                            <Typography variant="overline" sx={{ opacity: 0.8 }}>Total Users</Typography>
                            <Typography variant="h4" fontWeight="bold">{totalUsers}</Typography>
                        </CardContent>
                    </Card>
                )}
            </Box>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
                <TextField
                    placeholder="Search by name..."
                    value={searchName}
                    onChange={(e) => {
                        setSearchName(e.target.value);
                        setPage(0);
                    }}
                    size="small"
                    sx={{ width: { xs: '100%', md: 250 } }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search color="action" />
                            </InputAdornment>
                        ),
                    }}
                />
                <TextField
                    placeholder="Search by email..."
                    value={searchEmail}
                    onChange={(e) => {
                        setSearchEmail(e.target.value);
                        setPage(0);
                    }}
                    size="small"
                    sx={{ width: { xs: '100%', md: 250 } }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Mail color="action" />
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
                    sx={{ width: { xs: '100%', md: 250 } }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Phone color="action" />
                            </InputAdornment>
                        ),
                    }}
                />
                <Button
                    variant="outlined"
                    startIcon={<Refresh />}
                    onClick={fetchUsers}
                >
                    Refresh
                </Button>
            </Stack>

            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
                <Table>
                    <TableHead sx={{ bgcolor: 'grey.50' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem', color: 'text.secondary', letterSpacing: '0.05em' }}>User</TableCell>
                            <TableCell sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem', color: 'text.secondary', letterSpacing: '0.05em' }}>Contact Info</TableCell>
                            <TableCell sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem', color: 'text.secondary', letterSpacing: '0.05em' }}>Status</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem', color: 'text.secondary', letterSpacing: '0.05em' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                                    <CircularProgress size={32} />
                                </TableCell>
                            </TableRow>
                        ) : (!users || users.length === 0) ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                                        <Person sx={{ fontSize: 48, color: 'text.disabled' }} />
                                        <Typography color="text.secondary">No users found.</Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((user) => (
                                <TableRow
                                    key={user.id}
                                    hover
                                    sx={{
                                        '&:hover': { bgcolor: 'primary.lighter' },
                                        transition: 'background-color 0.2s'
                                    }}
                                >
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Avatar
                                                src={user.profilePicture}
                                                sx={{
                                                    bgcolor: 'primary.main',
                                                    width: 40,
                                                    height: 40,
                                                    fontSize: '1rem',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                {user.firstName[0]}{user.lastName[0]}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="subtitle2" fontWeight="bold" sx={{ color: 'text.primary' }}>
                                                    {user.firstName} {user.lastName}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>
                                                    ID: #{user.id}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Stack spacing={1}>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Mail fontSize="small" sx={{ color: 'text.secondary', fontSize: 16 }} />
                                                <Typography variant="body2">{user.email}</Typography>
                                            </Stack>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Phone fontSize="small" sx={{ color: 'text.secondary', fontSize: 16 }} />
                                                <Typography variant="body2">{user.phoneNumber || 'N/A'}</Typography>
                                            </Stack>
                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        {user.enabled !== false ? (
                                            <Chip
                                                icon={<CheckCircle sx={{ fontSize: '1rem !important' }} />}
                                                label="Active"
                                                size="small"
                                                color="success"
                                                variant="outlined"
                                            />
                                        ) : (
                                            <Chip
                                                icon={<Cancel sx={{ fontSize: '1rem !important' }} />}
                                                label="Disabled"
                                                size="small"
                                                color="error"
                                                variant="outlined"
                                            />
                                        )}
                                    </TableCell>
                                    <TableCell align="right">
                                        {user.enabled !== false ? (
                                            <Button
                                                size="small"
                                                color="error"
                                                startIcon={<Block />}
                                                onClick={() => openConfirmDialog(user, 'disable')}
                                            >
                                                Disable
                                            </Button>
                                        ) : (
                                            <Button
                                                size="small"
                                                color="success"
                                                startIcon={<CheckCircle />}
                                                onClick={() => openConfirmDialog(user, 'enable')}
                                            >
                                                Enable
                                            </Button>
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
                    onPageChange={(_, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(e) => {
                        setRowsPerPage(parseInt(e.target.value, 10));
                        setPage(0);
                    }}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    showFirstButton
                    showLastButton
                />
            </TableContainer>

            {/* Confirmation Dialog */}
            <Dialog
                open={confirmDialog.open}
                onClose={closeConfirmDialog}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle>
                    {confirmDialog.action === 'enable' ? 'Enable User' : 'Disable User'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to {confirmDialog.action} {confirmDialog.user?.firstName} {confirmDialog.user?.lastName}?
                        {confirmDialog.action === 'disable' && (
                            <Box component="span" sx={{ display: 'block', mt: 1, color: 'error.main' }}>
                                This user will not be able to access the application.
                            </Box>
                        )}
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={closeConfirmDialog} color="inherit">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirmAction}
                        color={confirmDialog.action === 'enable' ? 'success' : 'error'}
                        variant="contained"
                    >
                        {confirmDialog.action === 'enable' ? 'Enable' : 'Disable'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
