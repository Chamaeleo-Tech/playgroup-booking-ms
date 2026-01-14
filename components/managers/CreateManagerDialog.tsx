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
    Chip
} from "@mui/material";
import { Person, Mail, Lock, Stadium, LocationOn, CloudUpload, BadgeOutlined, Star, Close, Phone } from "@mui/icons-material";
import managerService, { User } from "@/services/managers.service";
import api from "@/lib/api";

interface CreateManagerDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialData?: User | null;
}

export default function CreateManagerDialog({ open, onClose, onSuccess, initialData }: CreateManagerDialogProps) {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        password: "",
        groundName: "",
        groundAddress: "",
        groundDescription: "",
        popularFeatures: [] as string[],
    });
    const [groundPicture, setGroundPicture] = useState<File | null>(null);
    const [saving, setSaving] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [featureInput, setFeatureInput] = useState("");

    // Populate form data when initialData changes or dialog opens
    useEffect(() => {
        if (open) {
            if (initialData) {
                setFormData({
                    firstName: initialData.firstName || "",
                    lastName: initialData.lastName || "",
                    email: initialData.email || "",
                    phoneNumber: initialData.phoneNumber || "",
                    password: "", // Don't populate password for security, only if changing
                    groundName: initialData.ground?.name || "",
                    groundAddress: initialData.ground?.address || "",
                    groundDescription: initialData.ground?.description || "",
                    popularFeatures: initialData.ground?.popularFeatures || [],
                });
            } else {
                // Reset form for create mode
                setFormData({
                    firstName: "",
                    lastName: "",
                    email: "",
                    phoneNumber: "",
                    password: "",
                    groundName: "",
                    groundAddress: "",
                    groundDescription: "",
                    popularFeatures: [],
                });
            }
            setGroundPicture(null);
        }
    }, [open, initialData]);

    // Handle preview URL generation
    useEffect(() => {
        let objectUrl: string | null = null;

        const fetchSecureImage = async (path: string) => {
            try {
                // Using the api client which already has the interceptor for the token
                const response = await api.get(`/uploads/${path}`, { responseType: 'blob' });
                objectUrl = URL.createObjectURL(response.data);
                setPreviewUrl(objectUrl);
            } catch (error) {
                console.error("Failed to load image", error);
                setPreviewUrl(null);
            }
        };

        if (groundPicture) {
            objectUrl = URL.createObjectURL(groundPicture);
            setPreviewUrl(objectUrl);
        } else if (initialData?.ground?.picture) {
            fetchSecureImage(initialData.ground.picture);
        } else {
            setPreviewUrl(null);
        }

        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [groundPicture, initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddFeature = () => {
        if (featureInput.trim()) {
            setFormData(prev => ({
                ...prev,
                popularFeatures: [...prev.popularFeatures, featureInput.trim()]
            }));
            setFeatureInput("");
        }
    };

    const handleRemoveFeature = (index: number) => {
        setFormData(prev => ({
            ...prev,
            popularFeatures: prev.popularFeatures.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async () => {
        setSaving(true);
        try {
            if (initialData) {
                await managerService.updateManager(initialData.id, {
                    ...formData,
                    groundPicture: groundPicture || undefined,
                });
                toast.success("Manager updated successfully");
            } else {
                await managerService.createManager({
                    ...formData,
                    groundPicture: groundPicture || undefined,
                });
                toast.success("Manager created successfully");
            }

            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                phoneNumber: "",
                password: "",
                groundName: "",
                groundAddress: "",
                groundDescription: "",
                popularFeatures: [],
            });
            setGroundPicture(null);
            onSuccess();
            onClose();
        } catch (error: any) {
            const msg = error.response?.data?.message || "Failed to create manager";
            toast.error(msg);
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

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
                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                py: 2.5
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Person sx={{ fontSize: 28 }} />
                    <Typography variant="h6" fontWeight="bold">{initialData ? "Edit Manager" : "Add New Manager"}</Typography>
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
                                value={formData.password}
                                onChange={handleChange}
                                placeholder={initialData ? "Leave blank to keep current" : "Enter secure password"}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><Lock color="action" fontSize="small" /></InputAdornment>,
                                }}
                            />
                        </Stack>
                    </Box>

                    {/* Right Column - Playground Info */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="subtitle1" fontWeight="bold" color="secondary" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Stadium sx={{ fontSize: 20 }} />
                            Playground Info
                        </Typography>

                        <Stack spacing={2.5}>
                            <TextField
                                label="Ground Name"
                                name="groundName"
                                fullWidth
                                required
                                value={formData.groundName}
                                onChange={handleChange}
                                placeholder="e.g. Central Park Arena"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><Stadium color="action" fontSize="small" /></InputAdornment>,
                                }}
                            />
                            <TextField
                                label="Ground Address"
                                name="groundAddress"
                                fullWidth
                                required
                                value={formData.groundAddress}
                                onChange={handleChange}
                                placeholder="e.g. 123 Main St, New York"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><LocationOn color="action" fontSize="small" /></InputAdornment>,
                                }}
                            />
                            <TextField
                                label="Description"
                                name="groundDescription"
                                fullWidth
                                multiline
                                rows={3}
                                value={formData.groundDescription}
                                onChange={handleChange}
                                placeholder="Describe facilities..."
                            />
                        </Stack>
                    </Box>
                </Box>

                <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Star fontSize="small" color="warning" />
                        Popular Features
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                        <TextField
                            size="small"
                            fullWidth
                            placeholder="e.g. Free Parking"
                            value={featureInput}
                            onChange={(e) => setFeatureInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddFeature()}
                        />
                        <Button
                            variant="contained"
                            onClick={handleAddFeature}
                            sx={{ minWidth: 'auto', px: 2, bgcolor: 'secondary.main', '&:hover': { bgcolor: 'secondary.dark' } }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                {/* Using inline style for the icon since imports might be tricky with just name 'Add' sometimes colliding if we aren't careful, but here we imported it correctly */}
                                <svg style={{ width: 24, height: 24, fill: 'currentColor' }} viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /></svg>
                            </div>
                        </Button>
                    </Stack>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {formData.popularFeatures.map((feature, index) => (
                            <Chip
                                key={index}
                                label={feature}
                                onDelete={() => handleRemoveFeature(index)}
                                color="primary"
                                variant="outlined"
                                size="small"
                                sx={{ bgcolor: 'primary.lighter' }}
                            />
                        ))}
                    </Box>
                </Box>

                {/* Bottom Section - File Upload */}
                <Box sx={{ mt: 4 }}>
                    <Box
                        sx={{
                            border: '2px dashed',
                            borderColor: groundPicture ? 'success.main' : 'grey.300',
                            borderRadius: 4,
                            p: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            bgcolor: groundPicture ? 'rgba(46, 125, 50, 0.04)' : 'background.paper',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                borderColor: 'primary.main',
                                bgcolor: 'rgba(99, 102, 241, 0.04)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                            },
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                        component="label"
                    >
                        <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    setGroundPicture(e.target.files[0]);
                                }
                            }}
                        />

                        {previewUrl ? (
                            <Box sx={{ mb: 2, position: 'relative', width: '100%', maxWidth: 300, height: 200 }}>
                                <img
                                    src={previewUrl}
                                    alt="Ground Preview"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        borderRadius: 12
                                    }}
                                />
                                <Box sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    bgcolor: 'rgba(0,0,0,0.4)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    opacity: 0,
                                    transition: 'opacity 0.2s',
                                    borderRadius: 3,
                                    '&:hover': { opacity: 1 }
                                }}>
                                    <CloudUpload sx={{ color: 'white', fontSize: 40 }} />
                                    <Typography variant="body2" color="white" sx={{ ml: 1, fontWeight: 600 }}>Change Image</Typography>
                                </Box>
                            </Box>
                        ) : (
                            <CloudUpload
                                sx={{
                                    fontSize: 64,
                                    color: 'text.disabled',
                                    mb: 2,
                                    transition: 'color 0.3s'
                                }}
                            />
                        )}

                        <Typography variant="h6" fontWeight={600} color={groundPicture ? 'success.main' : 'text.primary'} gutterBottom>
                            {groundPicture ? "New Image Selected" : (initialData?.ground?.picture ? "Current Image" : "Upload Ground Picture")}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {groundPicture ? groundPicture.name : "Drag and drop or click to replace/upload (JPG, PNG)"}
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
                        background: 'linear-gradient(45deg, #6366f1, #a855f7)',
                        boxShadow: '0 4px 14px 0 rgba(168, 85, 247, 0.4)'
                    }}
                >
                    {saving ? <CircularProgress size={24} color="inherit" /> : (initialData ? "Save Changes" : "Create Manager")}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
