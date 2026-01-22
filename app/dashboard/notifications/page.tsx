"use client";

import { useState } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    TextField,
    Typography,
    Stack,
    CircularProgress
} from "@mui/material";
import { Send, Campaign } from "@mui/icons-material";
import toast from "react-hot-toast";
import notificationService from "@/services/notifications.service";

export default function BroadcastPage() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    const handleBroadcast = async () => {
        if (!title.trim() || !description.trim()) {
            toast.error("Please fill in all fields");
            return;
        }

        setLoading(true);
        try {
            await notificationService.sendBroadcastNotification({
                title,
                description
            });
            toast.success("Broadcast sent successfully!");
            setTitle("");
            setDescription("");
        } catch (error) {
            console.error(error);
            toast.error("Failed to send broadcast");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box maxWidth={800} mx="auto">
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                    sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        bgcolor: 'primary.lighter',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'primary.main'
                    }}
                >
                    <Campaign sx={{ fontSize: 28 }} />
                </Box>
                <Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Broadcast Notifications
                    </Typography>
                    <Typography color="text.secondary">
                        Send a push notification to all users of the application
                    </Typography>
                </Box>
            </Box>

            <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                <CardContent sx={{ p: 4 }}>
                    <Stack spacing={3}>
                        <TextField
                            label="Notification Title"
                            fullWidth
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Special Holiday Offer"
                            disabled={loading}
                        />

                        <TextField
                            label="Notification Message"
                            fullWidth
                            multiline
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter the content of your notification..."
                            disabled={loading}
                        />

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
                            <Button
                                variant="contained"
                                size="large"
                                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Send />}
                                onClick={handleBroadcast}
                                disabled={loading}
                                sx={{
                                    px: 4,
                                    py: 1.5,
                                    borderRadius: 2,
                                    boxShadow: '0 4px 12px rgba(0, 161, 149, 0.4)',
                                }}
                            >
                                {loading ? "Sending..." : "Send Broadcast"}
                            </Button>
                        </Box>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
}
