"use client";

import { useEffect, useState } from "react";
import { Box, CircularProgress, SxProps, Theme } from "@mui/material";
import api from "@/lib/api";
import { ImageNotSupported } from "@mui/icons-material";

interface SecureImageProps {
    imagePath?: string;
    alt?: string;
    sx?: SxProps<Theme>;
    style?: React.CSSProperties;
}

export default function SecureImage({ imagePath, alt = "Image", sx, style }: SecureImageProps) {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(!!imagePath);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        let objectUrl: string | null = null;

        const fetchImage = async () => {
            if (!imagePath) {
                setLoading(false);
                return;
            }

            // If it's already a full URL (e.g. external), just use it
            if (imagePath.startsWith("http")) {
                setImageUrl(imagePath);
                setLoading(false);
                return;
            }

            // If it's a blob URL (local preview), just use it
            if (imagePath.startsWith("blob:")) {
                setImageUrl(imagePath);
                setLoading(false);
                return;
            }

            try {
                // Fetch using the axios instance which includes the JWT token
                const response = await api.get(`/uploads/${imagePath}`, { responseType: "blob" });
                objectUrl = URL.createObjectURL(response.data);
                setImageUrl(objectUrl);
                setError(false);
            } catch (err) {
                console.error("Failed to load secure image:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchImage();

        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [imagePath]);

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 200,
                    ...sx
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (error || !imageUrl) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 200,
                    color: 'text.disabled',
                    ...sx
                }}
            >
                <ImageNotSupported sx={{ fontSize: 60, mb: 1 }} />
                <Box sx={{ fontSize: '0.875rem' }}>Failed to load image</Box>
            </Box>
        );
    }

    return (
        <img
            src={imageUrl}
            alt={alt}
            style={{
                maxHeight: '100%',
                maxWidth: '100%',
                borderRadius: 8,
                objectFit: 'contain',
                ...style
            }}
        />
    );
}
