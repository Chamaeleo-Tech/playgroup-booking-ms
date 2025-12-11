"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    InputAdornment,
    IconButton,
    CircularProgress,
    Grid,
    Stack
} from "@mui/material";
import { Visibility, VisibilityOff, Email, Lock, Login as LoginIcon } from "@mui/icons-material";
import toast from "react-hot-toast";
import api from "@/lib/api";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            router.push("/dashboard");
        }
    }, [router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post("/auth/login", {
                email: formData.email,
                password: formData.password,
            });

            const { token, role } = response.data;

            if (!role.includes("ROLE_SYSTEM_ADMIN")) {
                toast.error("Access denied. You must be a System Admin.");
                setLoading(false);
                return;
            }

            localStorage.setItem("token", token);
            if (response.data.refreshToken) {
                localStorage.setItem("refreshToken", response.data.refreshToken);
            }
            localStorage.setItem("user", JSON.stringify(response.data));

            toast.success("Welcome back, Admin!");
            router.push("/dashboard");
        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.message || "Invalid credentials.";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Grid container component="main" sx={{ height: '100vh' }}>
            {/* Left Side - Gradient Hero */}
            <Grid
                size={{ sm: 4, md: 7 }}
                sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: { xs: 'none', sm: 'flex' },
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    p: 4,
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: '-50%',
                        right: '-50%',
                        width: '100%',
                        height: '100%',
                        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                        animation: 'pulse 8s ease-in-out infinite',
                    },
                    '@keyframes pulse': {
                        '0%, 100%': {
                            transform: 'scale(1)',
                            opacity: 0.5,
                        },
                        '50%': {
                            transform: 'scale(1.2)',
                            opacity: 0.8,
                        },
                    }
                }}
            >
                <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                    <Typography
                        variant="h2"
                        component="h1"
                        gutterBottom
                        sx={{
                            fontWeight: 800,
                            mb: 2,
                            textShadow: '0 4px 20px rgba(0,0,0,0.2)'
                        }}
                    >
                        Admin Portal
                    </Typography>
                    <Typography
                        variant="h5"
                        sx={{
                            opacity: 0.95,
                            fontWeight: 300,
                            mb: 4
                        }}
                    >
                        Playground Booking System
                    </Typography>
                    <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
                        <Box
                            sx={{
                                width: 60,
                                height: 60,
                                borderRadius: '50%',
                                bgcolor: 'rgba(255,255,255,0.2)',
                                backdropFilter: 'blur(10px)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                            }}
                        >
                            <Lock sx={{ fontSize: 30 }} />
                        </Box>
                        <Box
                            sx={{
                                width: 60,
                                height: 60,
                                borderRadius: '50%',
                                bgcolor: 'rgba(255,255,255,0.15)',
                                backdropFilter: 'blur(10px)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                            }}
                        >
                            <Box sx={{ width: 12, height: 12, bgcolor: '#4ade80', borderRadius: '50%' }} />
                        </Box>
                    </Stack>
                </Box>
            </Grid>

            {/* Right Side - Login Form */}
            <Grid
                size={{ xs: 12, sm: 8, md: 5 }}
                component={Paper}
                elevation={0}
                square
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: '#fafafa'
                }}
            >
                <Box
                    sx={{
                        my: 8,
                        mx: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        maxWidth: 450,
                        width: '100%',
                        p: { xs: 2, sm: 4 },
                    }}
                >
                    <Paper
                        elevation={3}
                        sx={{
                            p: 4,
                            width: '100%',
                            borderRadius: 3,
                            bgcolor: 'white'
                        }}
                    >
                        <Typography
                            component="h1"
                            variant="h4"
                            sx={{
                                mb: 1,
                                fontWeight: 'bold',
                                textAlign: 'center',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            Welcome Back
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 4, textAlign: 'center' }}
                        >
                            Sign in to access your admin dashboard
                        </Typography>

                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ width: '100%' }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                value={formData.email}
                                onChange={handleChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Email color="primary" />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                    }
                                }}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                autoComplete="current-password"
                                value={formData.password}
                                onChange={handleChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Lock color="primary" />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                    }
                                }}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                endIcon={loading ? null : <LoginIcon />}
                                sx={{
                                    mt: 3,
                                    mb: 2,
                                    py: 1.5,
                                    borderRadius: 2,
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                                    '&:hover': {
                                        boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                                        transform: 'translateY(-2px)',
                                        transition: 'all 0.3s ease'
                                    },
                                    '&:active': {
                                        transform: 'translateY(0)',
                                    }
                                }}
                                disabled={loading}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
                            </Button>
                        </Box>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: 'block', textAlign: 'center', mt: 3 }}
                        >
                            &copy; 2025 Playground Booking System
                        </Typography>
                    </Paper>
                </Box>
            </Grid>
        </Grid>
    );
}
