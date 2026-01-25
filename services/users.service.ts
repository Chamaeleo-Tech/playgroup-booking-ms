import api from "@/lib/api";

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    profilePicture?: string;
    role: string;
    enabled?: boolean; // This field needs to be added to backend
}

export interface UserFilters {
    name?: string;
    email?: string;
    phoneNumber?: string;
    page?: number;
    size?: number;
}

export interface ChangePasswordRequest {
    oldPassword: string;
    newPassword: string;
}

export interface Page<T> {
    content: T[];
    page: {
        totalElements: number;
        totalPages: number;
        size: number;
        number: number;
    };
}

class UserService {
    /**
     * Fetch all users with pagination and filters
     */
    async getUsers(filters?: UserFilters): Promise<Page<User>> {
        const params: any = {
            role: "ROLE_USER",
            page: filters?.page || 0,
            size: filters?.size || 10,
        };

        if (filters?.email) params.email = filters.email;
        if (filters?.name) params.name = filters.name;
        if (filters?.phoneNumber) params.phoneNumber = filters.phoneNumber;

        const { data } = await api.get("/users", { params });
        return data;
    }

    /**
     * Get user statistics
     */
    async getUserStats(): Promise<{ totalUsers: number }> {
        // Alternatively, use a dedicated stats endpoint if available
        // return api.get("/users/stats");
        // For now, we can infer total from getUsers(size=1) or similar if not available
        // But better to request a dedicated endpoint in the prompt.
        const { data } = await api.get("/users/stats");
        return data;
    }

    /**
     * Enable a user
     */
    async enableUser(id: number): Promise<void> {
        await api.put(`/users/${id}/enable`);
    }

    /**
     * Disable a user
     */
    async disableUser(id: number): Promise<void> {
        await api.put(`/users/${id}/disable`);
    }

    /**
     * Change user password
     */
    async changePassword(request: ChangePasswordRequest): Promise<void> {
        await api.post("/users/change-password", request);
    }
}

export default new UserService();
