"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarProps, Skeleton } from "@mui/material";
import api, { API_BASE_URL } from "@/lib/api";

interface SecureAvatarProps extends AvatarProps {
    imagePath?: string;
    fallbackLabel?: string;
}

export default function SecureAvatar({ imagePath, fallbackLabel, sx, ...props }: SecureAvatarProps) {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(!!imagePath);

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

            try {
                // Fetch using the axios instance which includes the JWT token
                const response = await api.get(`/uploads/${imagePath}`, { responseType: "blob" });
                objectUrl = URL.createObjectURL(response.data);
                setImageUrl(objectUrl);
            } catch (error) {
                console.error("Failed to load secure image:", error);
                // Fallback to trying directly if fetch failed (though unlikely to work if secured)
                // or just leave it null to show fallback
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
        return <Skeleton variant="circular" width={40} height={40} sx={sx} />;
    }

    return (
        <Avatar src={imageUrl || undefined} sx={sx} {...props}>
            {(!imageUrl && fallbackLabel) ? fallbackLabel.charAt(0) : null}
        </Avatar>
    );
}
