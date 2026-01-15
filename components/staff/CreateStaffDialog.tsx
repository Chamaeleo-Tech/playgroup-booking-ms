"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Typography,
    IconButton,
    CircularProgress,
    Stack,
    InputAdornment,
    FormControlLabel,
    Checkbox,
    Paper,
    Divider
} from "@mui/material";
import {
    Person,
    Mail,
    Lock,
    BadgeOutlined,
    Close,
    Phone,
    Security
} from "@mui/icons-material";
import staffService, {
    Staff,
    StaffPermission,
    PERMISSION_LABELS,
    PERMISSION_DESCRIPTIONS
} from "@/services/staff.service";

interface CreateStaffDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialData?: Staff | null;
}

export default function CreateStaffDialog({ open, onClose, onSuccess, initialData }: CreateStaffDialogProps) {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        password: "",
        permissions: [] as StaffPermission[],
    });
    const [saving, setSaving] = useState(false);

    // Populate form data when initialData changes or dialog opens
    useEffect(() => {
        if (open) {
            if (initialData) {
                setFormData({
                    firstName: initialData.firstName || "",
                    lastName: initialData.lastName || "",
                    email: initialData.email || "",
                    phoneNumber: initialData.phoneNumber || "",
                    password: "",
                    permissions: initialData.permissions || [],
                });
            } else {
                // Reset form for create mode
                setFormData({
                    firstName: "",
                    lastName: "",
                    email: "",
                    phoneNumber: "",
                    password: "",
                    permissions: [],
                });
            }
        }
    }, [open, initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePermissionToggle = (permission: StaffPermission) => {
        setFormData(prev => {
            const hasPermission = prev.permissions.includes(permission);
            return {
                ...prev,
                permissions: hasPermission
                    ? prev.permissions.filter(p => p !== permission)
                    : [...prev.permissions, permission]
            };
        });
    };

    const handleSelectAll = () => {
        const allPermissions = Object.values(StaffPermission);
        const hasAll = allPermissions.every(p => formData.permissions.includes(p));
        setFormData(prev => ({
            ...prev,
            permissions: hasAll ? [] : allPermissions
        }));
    };

    const handleSubmit = async () => {
        // Validation
        if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
            toast.error("Please fill in all required fields");
            return;
        }

        if (!initialData && !formData.password.trim()) {
            toast.error("Password is required for new staff");
            return;
        }

        if (formData.permissions.length === 0) {
            toast.error("Please select at least one permission");
            return;
        }

        setSaving(true);
        try {
            if (initialData) {
                await staffService.updateStaff(initialData.id, {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    phoneNumber: formData.phoneNumber || undefined,
                    password: formData.password || undefined,
                    permissions: formData.permissions,
                });
                toast.success("Staff updated successfully");
            } else {
                await staffService.createStaff({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    phoneNumber: formData.phoneNumber || undefined,
                    password: formData.password,
                    permissions: formData.permissions,
                });
                toast.success("Staff created successfully");
            }

            onSuccess();
            onClose();
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            const msg = err.response?.data?.message || "Failed to save staff";
            toast.error(msg);
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    const allPermissions = Object.values(StaffPermission);
    const hasAllPermissions = allPermissions.every(p => formData.permissions.includes(p));

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
            PaperProps={{
                sx: { borderRadius: 3, overflow: 'hidden' }
            }}
        >
            <DialogTitle sx={{
                background: 'linear-gradient(135deg, #00a195 0%, #00796b 100%)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                py: 2.5
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Person sx={{ fontSize: 28 }} />
                    <Typography variant="h6" fontWeight="bold">
                        {initialData ? "Edit Staff" : "Add New Staff"}
                    </Typography>
                </Box>
                <IconButton onClick={onClose} sx={{ color: 'white' }}>
                    <Close />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, marginTop: 2 }}>
                    {/* Left Column - Personal Details */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="subtitle1" fontWeight="bold" color="primary" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <BadgeOutlined sx={{ fontSize: 20 }} />
                            Personal Details
                        </Typography>

                        <Stack spacing={2.5}>
                            <Stack direction="row" spacing={2}>
                                <TextField
                                    label="First Name"
                                    name="firstName"
                                    fullWidth
                                    required
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    placeholder="e.g. John"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><Person color="action" fontSize="small" /></InputAdornment>,
                                    }}
                                />
                                <TextField
                                    label="Last Name"
                                    name="lastName"
                                    fullWidth
                                    required
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    placeholder="e.g. Doe"
                                />
                            </Stack>
                            <TextField
                                label="Email Address"
                                name="email"
                                type="email"
                                fullWidth
                                required
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="e.g. john.doe@example.com"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><Mail color="action" fontSize="small" /></InputAdornment>,
                                }}
                            />
                            <TextField
                                label="Phone Number"
                                name="phoneNumber"
                                type="tel"
                                fullWidth
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                placeholder="e.g. +20 123 456 7890"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><Phone color="action" fontSize="small" /></InputAdornment>,
                                }}
                            />
                            <TextField
                                label={initialData ? "New Password (Optional)" : "Password"}
                                name="password"
                                type="password"
                                fullWidth
                                required={!initialData}
                                value={formData.password}
                                onChange={handleChange}
                                placeholder={initialData ? "Leave blank to keep current" : "Enter secure password"}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><Lock color="action" fontSize="small" /></InputAdornment>,
                                }}
                            />
                        </Stack>
                    </Box>

                    {/* Right Column - Permissions */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="subtitle1" fontWeight="bold" color="secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Security sx={{ fontSize: 20 }} />
                                Permissions
                            </Typography>
                            <Button
                                size="small"
                                variant="outlined"
                                onClick={handleSelectAll}
                                sx={{ textTransform: 'none' }}
                            >
                                {hasAllPermissions ? "Deselect All" : "Select All"}
                            </Button>
                        </Box>

                        <Paper
                            variant="outlined"
                            sx={{
                                p: 2,
                                borderRadius: 2,
                                bgcolor: 'grey.50',
                                maxHeight: 360,
                                overflow: 'auto'
                            }}
                        >
                            <Stack spacing={1} divider={<Divider />}>
                                {allPermissions.map((permission) => (
                                    <Box
                                        key={permission}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            py: 1,
                                            px: 1,
                                            borderRadius: 1,
                                            transition: 'background-color 0.2s',
                                            '&:hover': { bgcolor: 'primary.lighter' },
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => handlePermissionToggle(permission)}
                                    >
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={formData.permissions.includes(permission)}
                                                    onChange={() => handlePermissionToggle(permission)}
                                                    color="primary"
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            }
                                            label=""
                                            sx={{ mr: 0 }}
                                        />
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="body2" fontWeight="600">
                                                {PERMISSION_LABELS[permission]}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {PERMISSION_DESCRIPTIONS[permission]}
                                            </Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Stack>
                        </Paper>

                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                            {formData.permissions.length} of {allPermissions.length} permissions selected
                        </Typography>
                    </Box>
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 3, bgcolor: 'background.default', borderTop: 1, borderColor: 'divider' }}>
                <Button onClick={onClose} sx={{ color: 'text.secondary' }}>Cancel</Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={saving}
                    sx={{
                        px: 4,
                        py: 1,
                        borderRadius: 2,
                        background: 'linear-gradient(45deg, #00a195, #00796b)',
                        boxShadow: '0 4px 14px 0 rgba(0, 161, 149, 0.4)'
                    }}
                >
                    {saving ? <CircularProgress size={24} color="inherit" /> : (initialData ? "Save Changes" : "Create Staff")}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
