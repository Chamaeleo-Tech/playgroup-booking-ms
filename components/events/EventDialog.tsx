import { useEffect, useState, useMemo, useCallback } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    MenuItem,
    FormControlLabel,
    Switch,
    Box,
    Typography,
    Autocomplete,
    CircularProgress
} from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import { Event, CreateEventData } from "@/services/events.service";
import playgroundService, { Playground } from "@/services/playgrounds.service";
import SecureImage from "@/components/SecureImage";
import toast from "react-hot-toast";

interface EventDialogProps {
    open: boolean;
    onClose: () => void;
    onSave: (data: any) => Promise<void>;
    event: Event | null;
}

const initialData: CreateEventData = {
    title: "",
    description: "",
    image: "",
    groundId: 0,
    lastRegistrationDate: "",
    registrationFees: 0,
    maxRegistrations: 0,
    startTournamentDate: "",
    timeFrom: "",
    timeTo: "",
    isActive: true
};

export default function EventDialog({ open, onClose, onSave, event }: EventDialogProps) {
    const [formData, setFormData] = useState<CreateEventData>(initialData);

    // Autocomplete states
    const [openAutocomplete, setOpenAutocomplete] = useState(false);
    const [options, setOptions] = useState<Playground[]>([]);
    const [loadingPlaygrounds, setLoadingPlaygrounds] = useState(false);
    const [selectedGround, setSelectedGround] = useState<Playground | null>(null);
    const [inputValue, setInputValue] = useState("");

    const [loading, setLoading] = useState(false);

    // Image upload states
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // Initial fetch of grounds (top results or all if small list)
    useEffect(() => {
        let active = true;

        const fetchGrounds = async () => {
            setLoadingPlaygrounds(true);
            try {
                const data = await playgroundService.searchGrounds(inputValue);
                if (active) {
                    setOptions(data);
                }
            } catch (error) {
                console.error("Failed to fetch grounds", error);
            } finally {
                if (active) setLoadingPlaygrounds(false);
            }
        };

        const timer = setTimeout(() => {
            fetchGrounds();
        }, 300); // 300ms debounce

        return () => {
            active = false;
            clearTimeout(timer);
        };
    }, [inputValue]);


    useEffect(() => {
        if (event) {
            // Helper to convert backend datetime format to input format
            const parseDateTime = (dt: string | undefined) => {
                if (!dt) return "";
                // Backend format: "yyyy-MM-dd HH:mm:ss" -> Input format: "yyyy-MM-ddTHH:mm"
                // Remove seconds and replace space with T
                return dt.substring(0, 16).replace(" ", "T").substring(0, 19);
            };

            setFormData({
                title: event.title,
                description: event.description,
                image: event.image || "",
                groundId: event.ground?.id || 0,
                lastRegistrationDate: parseDateTime(event.lastRegistrationDate),
                registrationFees: event.registrationFees,
                maxRegistrations: event.maxRegistrations || 0,
                startTournamentDate: parseDateTime(event.startTournamentDate),
                timeFrom: event.timeFrom || "",
                timeTo: event.timeTo || "",
                isActive: event.isActive
            });
            // Set the selected ground object for Autocomplete
            if (event.ground) {
                setSelectedGround(event.ground);
            }
            // Handle existing image for preview
            if (event.image) {
                setPreviewUrl(event.image);
            } else {
                setPreviewUrl(null);
            }
            setImageFile(null);
        } else {
            setFormData(initialData);
            setPreviewUrl(null);
            setImageFile(null);
            setSelectedGround(null);
        }
    }, [event, open]);

    // Update groundId when selectedGround changes
    useEffect(() => {
        if (selectedGround) {
            setFormData(prev => ({ ...prev, groundId: selectedGround.id }));
        } else {
            setFormData(prev => ({ ...prev, groundId: 0 }));
        }
    }, [selectedGround]);

    // Cleanup preview URL
    useEffect(() => {
        if (imageFile) {
            const objectUrl = URL.createObjectURL(imageFile);
            setPreviewUrl(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        }
    }, [imageFile]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const formatDateTime = (val: string) => {
            if (!val) return "";
            return val.replace("T", " ") + ":00";
        };
        const formatTime = (val: string) => {
            if (!val) return "";
            if (val.length === 5) return val + ":00";
            return val;
        }

        const submissionData: any = {
            ...formData,
            lastRegistrationDate: formatDateTime(formData.lastRegistrationDate),
            startTournamentDate: formatDateTime(formData.startTournamentDate),
            timeFrom: formatTime(formData.timeFrom),
            timeTo: formatTime(formData.timeTo),
            registrationFees: Number(formData.registrationFees),
            maxRegistrations: Number(formData.maxRegistrations),
            groundId: Number(formData.groundId),
        };

        if (imageFile) {
            submissionData.imageFile = imageFile;
        }

        try {
            await onSave(submissionData);
            onClose();
        } catch (error) {
            // Error handled by parent
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>{event ? "Edit Event" : "Create Event"}</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Autocomplete
                                open={openAutocomplete}
                                onOpen={() => setOpenAutocomplete(true)}
                                onClose={() => setOpenAutocomplete(false)}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                getOptionLabel={(option) => option.name}
                                options={options}
                                loading={loadingPlaygrounds}
                                value={selectedGround}
                                onChange={(event, newValue) => {
                                    setSelectedGround(newValue);
                                }}
                                onInputChange={(event, newInputValue) => {
                                    setInputValue(newInputValue);
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Ground"
                                        required
                                        InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <>
                                                    {loadingPlaygrounds ? <CircularProgress color="inherit" size={20} /> : null}
                                                    {params.InputProps.endAdornment}
                                                </>
                                            ),
                                        }}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid size={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                multiline
                                rows={3}
                            />
                        </Grid>

                        <Grid size={12}>
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
                                    onChange={handleFileChange}
                                />
                                {previewUrl ? (
                                    <Box sx={{ mb: 1, height: 200, width: '100%', display: 'flex', justifyContent: 'center' }}>
                                        {imageFile ? (
                                            <img
                                                src={previewUrl}
                                                alt="Preview"
                                                style={{ maxHeight: '100%', maxWidth: '100%', borderRadius: 8, objectFit: 'contain' }}
                                            />
                                        ) : (
                                            <SecureImage
                                                imagePath={previewUrl}
                                                alt="Event preview"
                                            />
                                        )}
                                    </Box>
                                ) : (
                                    <CloudUpload sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                                )}
                                <Typography variant="body2" color="text.secondary">
                                    {imageFile ? imageFile.name : (event?.image ? "Click to replace image" : "Click to upload image")}
                                </Typography>
                            </Box>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Registration Fees"
                                name="registrationFees"
                                type="number"
                                value={formData.registrationFees}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Max Registrations"
                                name="maxRegistrations"
                                type="number"
                                value={formData.maxRegistrations}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Last Registration Date"
                                name="lastRegistrationDate"
                                type="datetime-local"
                                value={formData.lastRegistrationDate}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                required
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Tournament Start Date"
                                name="startTournamentDate"
                                type="datetime-local"
                                value={formData.startTournamentDate}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                required
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Start Time"
                                name="timeFrom"
                                type="time"
                                value={formData.timeFrom}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                required
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="End Time"
                                name="timeTo"
                                type="time"
                                value={formData.timeTo}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                required
                            />
                        </Grid>

                        <Grid size={12}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formData.isActive ?? true}
                                        onChange={handleChange}
                                        name="isActive"
                                    />
                                }
                                label="Active"
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="contained" disabled={loading}>
                        {loading ? "Saving..." : "Save"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
