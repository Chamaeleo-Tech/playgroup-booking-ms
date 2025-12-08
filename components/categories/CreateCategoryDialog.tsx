import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    Box,
    DialogActions,
    Button,
    InputAdornment,
    Typography,
    Switch,
    FormControlLabel
} from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import { PlaygroundCategory, CreateCategoryData } from "@/services/categories.service";
import api from "@/lib/api";
import { useEffect, useState } from "react";

interface CreateCategoryDialogProps {
    open: boolean;
    onClose: () => void;
    onSave: (categoryData: CreateCategoryData | Partial<CreateCategoryData>) => Promise<void>;
    category?: PlaygroundCategory | null;
}

export default function CreateCategoryDialog({ open, onClose, onSave, category }: CreateCategoryDialogProps) {
    const [name, setName] = useState("");
    const [color, setColor] = useState("#000000");
    const [deleted, setDeleted] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (open) {
            if (category) {
                setName(category.name);
                setColor(category.color || "#000000");
                setDeleted(category.deleted || false);
                setImageFile(null);
                // Handle existing image URL (assumed to be a path we can fetch or display directly)
                // If it's a full URL, use it. If it's a relative path needing auth, use api to fetch blob? 
                // For now assuming it's a public URL or handled like in ManagerDialog
                if (category.image) {
                    // Check if it's a full URL or needs fetching
                    if (category.image.startsWith('http')) {
                        setPreviewUrl(category.image);
                    } else {
                        // Attempt to fetch securely if it's a backend path
                        fetchSecureImage(category.image);
                    }
                } else {
                    setPreviewUrl(null);
                }
            } else {
                setName("");
                setColor("#000000");
                setDeleted(false);
                setImageFile(null);
                setPreviewUrl(null);
            }
        }
    }, [category, open]);

    const fetchSecureImage = async (path: string) => {
        try {
            const response = await api.get(`/uploads/${path}`, { responseType: 'blob' });
            const objectUrl = URL.createObjectURL(response.data);
            setPreviewUrl(objectUrl);
        } catch (error) {
            console.error("Failed to load image", error);
            // Fallback: maybe it's just a direct path
            setPreviewUrl((api.defaults.baseURL || '').replace('/api', '') + path);
        }
    };

    useEffect(() => {
        if (imageFile) {
            const objectUrl = URL.createObjectURL(imageFile);
            setPreviewUrl(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        }
    }, [imageFile]);


    const handleSubmit = async () => {
        setSaving(true);
        try {
            const data: any = {
                name,
                color,
                deleted
            };
            if (imageFile) {
                data.image = imageFile;
            }
            await onSave(data);
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{category ? "Edit Category" : "New Category"}</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Category Name"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    sx={{ mb: 3, mt: 1 }}
                />

                <Box sx={{ mb: 3 }}>
                    <Box
                        sx={{
                            border: '2px dashed',
                            borderColor: imageFile ? 'success.main' : 'grey.300',
                            borderRadius: 2,
                            p: 3,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            bgcolor: imageFile ? 'rgba(46, 125, 50, 0.04)' : 'background.paper',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                borderColor: 'primary.main',
                                bgcolor: 'rgba(99, 102, 241, 0.04)',
                            },
                        }}
                        component="label"
                    >
                        <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    setImageFile(e.target.files[0]);
                                }
                            }}
                        />
                        {previewUrl ? (
                            <Box sx={{ mb: 1, height: 150, width: '100%', display: 'flex', justifyContent: 'center' }}>
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    style={{ maxHeight: '100%', maxWidth: '100%', borderRadius: 8, objectFit: 'contain' }}
                                />
                            </Box>
                        ) : (
                            <CloudUpload sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                        )}
                        <Typography variant="body2" color="text.secondary">
                            {imageFile ? imageFile.name : "Click to upload image"}
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <TextField
                        margin="dense"
                        label="Color Code"
                        fullWidth
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        helperText="e.g. #FF0000"
                    />
                    <input
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        style={{ width: 50, height: 50, padding: 0, border: 'none', cursor: 'pointer' }}
                    />
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" disabled={saving}>
                    {saving ? "Saving..." : "Save"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
