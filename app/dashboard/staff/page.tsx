"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
    InputAdornment,
    Tooltip
} from "@mui/material";
import {
    Add,
    Delete,
    Person,
    Mail,
    Search,
    Edit,
    Phone,
    Security,
    CheckCircle,
    Cancel,
    Block,
    Refresh
} from "@mui/icons-material";
import staffService, {
    Staff,
    StaffPermission,
    PERMISSION_LABELS
} from "@/services/staff.service";
import CreateStaffDialog from "@/components/staff/CreateStaffDialog";

export default function StaffPage() {
    const router = useRouter();
    const [staff, setStaff] = useState<Staff[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalElements, setTotalElements] = useState(0);
    const [searchEmail, setSearchEmail] = useState("");
    const [searchName, setSearchName] = useState("");
    const [searchPhone, setSearchPhone] = useState("");
    const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [staffToDelete, setStaffToDelete] = useState<Staff | null>(null);
    const [statusDialogOpen, setStatusDialogOpen] = useState(false);
    const [statusAction, setStatusAction] = useState<'enable' | 'disable'>('disable');
    const [staffToToggle, setStaffToToggle] = useState<Staff | null>(null);

    useEffect(() => {
        const userStr = localStorage.getItem("user");
        if (!userStr) {
            router.push("/login");
            return;
        }

        try {
            const user = JSON.parse(userStr);
            if (!user.role?.includes("ROLE_SYSTEM_ADMIN")) {
                // toast.error("Unauthorized. Admin access only."); // Commented out to avoid double toast with login redirect or strict mode
                router.push("/dashboard");
            }
        } catch (e) {
            router.push("/login");
        }
    }, [router]);

    const handleEdit = (staffMember: Staff) => {
        setSelectedStaff(staffMember);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedStaff(null);
    };

    const fetchStaff = async () => {
        setLoading(true);
        try {
            const response = await staffService.getStaff({
                email: searchEmail || undefined,
                name: searchName || undefined,
                phoneNumber: searchPhone || undefined,
                page,
                size: rowsPerPage,
            });
            setStaff(response.content);
            setTotalElements(response.page.totalElements);
        } catch (error) {
            toast.error("Failed to fetch staff");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchStaff();
        }, 500);
        return () => clearTimeout(timer);
    }, [page, rowsPerPage, searchEmail, searchName, searchPhone]);

    const openDeleteDialog = (staffMember: Staff) => {
        setStaffToDelete(staffMember);
        setDeleteDialogOpen(true);
    };

    const closeDeleteDialog = () => {
        setDeleteDialogOpen(false);
        setStaffToDelete(null);
    };

    const handleConfirmDelete = async () => {
        if (!staffToDelete) return;
        try {
            await staffService.deleteStaff(staffToDelete.id);
            toast.success("Staff deleted successfully");
            fetchStaff();
        } catch (error) {
            toast.error("Failed to delete staff");
            console.error(error);
        } finally {
            closeDeleteDialog();
        }
    };

    const openStatusDialog = (staffMember: Staff, action: 'enable' | 'disable') => {
        setStaffToToggle(staffMember);
        setStatusAction(action);
        setStatusDialogOpen(true);
    };

    const closeStatusDialog = () => {
        setStatusDialogOpen(false);
        setStaffToToggle(null);
    };

    const handleConfirmStatusChange = async () => {
        if (!staffToToggle) return;
        try {
            if (statusAction === 'enable') {
                await staffService.enableStaff(staffToToggle.id);
                toast.success("Staff enabled successfully");
            } else {
                await staffService.disableStaff(staffToToggle.id);
                toast.success("Staff disabled successfully");
            }
            fetchStaff();
        } catch (error) {
            toast.error(`Failed to ${statusAction} staff`);
            console.error(error);
        } finally {
            closeStatusDialog();
        }
    };

    const getPermissionColor = (permission: StaffPermission): "primary" | "secondary" | "success" | "warning" | "info" | "error" => {
        const colors: Record<StaffPermission, "primary" | "secondary" | "success" | "warning" | "info" | "error"> = {
            [StaffPermission.MANAGE_USERS]: "primary",
            [StaffPermission.MANAGE_PLAYGROUND_CATEGORY]: "secondary",
            [StaffPermission.MANAGE_MANAGERS]: "success",
            [StaffPermission.MANAGE_POPULAR_GROUND]: "warning",
            [StaffPermission.MANAGE_EVENTS]: "info",
            [StaffPermission.VIEW_DASHBOARD]: "error"
        };
        return colors[permission] || "default";
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold">Staff</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Manage staff members and their permissions
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => {
                        setSelectedStaff(null);
                        setOpen(true);
                    }}
                    sx={{
                        background: 'linear-gradient(135deg, #00a195 0%, #00796b 100%)',
                        boxShadow: '0 4px 12px rgba(0, 161, 149, 0.3)',
                    }}
                >
                    Add Staff
                </Button>
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
                    onClick={fetchStaff}
                >
                    Refresh
                </Button>
            </Stack>

            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
                <Table>
                    <TableHead sx={{ bgcolor: 'grey.50' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem', color: 'text.secondary', letterSpacing: '0.05em' }}>Staff</TableCell>
                            <TableCell sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem', color: 'text.secondary', letterSpacing: '0.05em' }}>Contact</TableCell>
                            <TableCell sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem', color: 'text.secondary', letterSpacing: '0.05em' }}>Permissions</TableCell>
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
                        ) : (!staff || staff.length === 0) ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                                        <Security sx={{ fontSize: 48, color: 'text.disabled' }} />
                                        <Typography color="text.secondary">No staff found.</Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ) : (
                            staff.map((staffMember) => (
                                <TableRow
                                    key={staffMember.id}
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
                                                background: 'linear-gradient(135deg, #00a195 0%, #00796b 100%)'
                                            }}>
                                                {staffMember.firstName[0]}{staffMember.lastName[0]}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="subtitle2" fontWeight="bold" sx={{ color: 'text.primary' }}>
                                                    {staffMember.firstName} {staffMember.lastName}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>
                                                    ID: #{staffMember.id}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Stack spacing={1}>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Mail fontSize="small" sx={{ color: 'text.secondary', fontSize: 16 }} />
                                                <Typography variant="body2" sx={{ fontWeight: 500 }}>{staffMember.email}</Typography>
                                            </Stack>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Phone fontSize="small" sx={{ color: 'text.secondary', fontSize: 16 }} />
                                                <Typography variant="body2">{staffMember.phoneNumber || 'N/A'}</Typography>
                                            </Stack>
                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, maxWidth: 300 }}>
                                            {staffMember.permissions.slice(0, 3).map((permission) => (
                                                <Tooltip key={permission} title={PERMISSION_LABELS[permission]}>
                                                    <Chip
                                                        label={PERMISSION_LABELS[permission].replace('Manage ', '').replace('View ', '')}
                                                        size="small"
                                                        color={getPermissionColor(permission)}
                                                        variant="outlined"
                                                        sx={{ fontSize: '0.7rem' }}
                                                    />
                                                </Tooltip>
                                            ))}
                                            {staffMember.permissions.length > 3 && (
                                                <Tooltip title={staffMember.permissions.slice(3).map(p => PERMISSION_LABELS[p]).join(', ')}>
                                                    <Chip
                                                        label={`+${staffMember.permissions.length - 3}`}
                                                        size="small"
                                                        sx={{ fontSize: '0.7rem', bgcolor: 'grey.200' }}
                                                    />
                                                </Tooltip>
                                            )}
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        {staffMember.enabled !== false ? (
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
                                        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                                            <IconButton
                                                size="small"
                                                onClick={() => handleEdit(staffMember)}
                                                sx={{
                                                    color: 'text.secondary',
                                                    '&:hover': { color: 'primary.main', bgcolor: 'primary.lighter' }
                                                }}
                                            >
                                                <Edit fontSize="small" />
                                            </IconButton>
                                            {staffMember.enabled !== false ? (
                                                <IconButton
                                                    size="small"
                                                    onClick={() => openStatusDialog(staffMember, 'disable')}
                                                    sx={{
                                                        color: 'text.secondary',
                                                        '&:hover': { color: 'warning.main', bgcolor: 'warning.lighter' }
                                                    }}
                                                >
                                                    <Block fontSize="small" />
                                                </IconButton>
                                            ) : (
                                                <IconButton
                                                    size="small"
                                                    onClick={() => openStatusDialog(staffMember, 'enable')}
                                                    sx={{
                                                        color: 'text.secondary',
                                                        '&:hover': { color: 'success.main', bgcolor: 'success.lighter' }
                                                    }}
                                                >
                                                    <CheckCircle fontSize="small" />
                                                </IconButton>
                                            )}
                                            <IconButton
                                                size="small"
                                                onClick={() => openDeleteDialog(staffMember)}
                                                sx={{
                                                    color: 'text.secondary',
                                                    '&:hover': { color: 'error.main', bgcolor: 'error.lighter' }
                                                }}
                                            >
                                                <Delete fontSize="small" />
                                            </IconButton>
                                        </Stack>
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

            <CreateStaffDialog
                open={open}
                onClose={handleClose}
                onSuccess={() => {
                    fetchStaff();
                }}
                initialData={selectedStaff}
            />

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={closeDeleteDialog}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle>Delete Staff</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete {staffToDelete?.firstName} {staffToDelete?.lastName}?
                        <Box component="span" sx={{ display: 'block', mt: 1, color: 'error.main' }}>
                            This action cannot be undone.
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

            {/* Status Change Confirmation Dialog */}
            <Dialog
                open={statusDialogOpen}
                onClose={closeStatusDialog}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle>
                    {statusAction === 'enable' ? 'Enable Staff' : 'Disable Staff'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to {statusAction} {staffToToggle?.firstName} {staffToToggle?.lastName}?
                        {statusAction === 'disable' && (
                            <Box component="span" sx={{ display: 'block', mt: 1, color: 'warning.main' }}>
                                This staff member will not be able to access the system.
                            </Box>
                        )}
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={closeStatusDialog} color="inherit">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirmStatusChange}
                        color={statusAction === 'enable' ? 'success' : 'warning'}
                        variant="contained"
                    >
                        {statusAction === 'enable' ? 'Enable' : 'Disable'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
