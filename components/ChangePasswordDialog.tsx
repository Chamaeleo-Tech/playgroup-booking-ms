import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Button,
    Box
} from "@mui/material";
import { useState } from "react";
import userService, { ChangePasswordRequest } from "@/services/users.service";
import toast from "react-hot-toast";

interface ChangePasswordDialogProps {
    open: boolean;
    onClose: () => void;
}

export default function ChangePasswordDialog({ open, onClose }: ChangePasswordDialogProps) {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    // Reset state when dialog opens/closes
    const handleClose = () => {
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setLoading(false);
        onClose();
    };

    const handleSubmit = async () => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            toast.error("Please fill in all fields");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            const request: ChangePasswordRequest = {
                oldPassword,
                newPassword
            };
            await userService.changePassword(request);
            toast.success("Password changed successfully");
            handleClose();
        } catch (error) {
            console.error("Failed to change password", error);
            toast.error("Failed to change password. Please check your current password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>Change Password</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                    <TextField
                        autoFocus
                        label="Old Password"
                        type="password"
                        fullWidth
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                    />

                    <TextField
                        label="New Password"
                        type="password"
                        fullWidth
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />

                    <TextField
                        label="Confirm New Password"
                        type="password"
                        fullWidth
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" disabled={loading}>
                    {loading ? "Changing..." : "Change Password"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
