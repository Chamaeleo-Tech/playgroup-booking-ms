import api from "@/lib/api";
import { PageResponse } from "./events.service";

export interface Ground {
    id: number;
    name: string;
    address: string;
    picture?: string;
    description?: string;
    popularFeatures?: string[];
}

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    role: string;
    ground?: Ground;
}

export interface CreateManagerData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber?: string;
    groundName: string;
    groundAddress: string;
    groundDescription?: string;
    popularFeatures?: string[];
    groundPicture?: File;
}

export interface ManagerFilters {
    email?: string;
    name?: string;
    phoneNumber?: string;
    page?: number;
    size?: number;
}

export interface BookingResponse {
    id: number;
    customerName: string;
    playgroundName: string;
    startTime: string;
    status: string;
    totalPrice: number;
}

export interface ManagerStats {
    managerId: number;
    totalBookings: number;
    revenue: number;
    bookingStats: Record<string, number>;
    usageStats: {
        occupancyRate: number;
        totalHoursBooked: number;
    };
    recentActivity: BookingResponse[];
}

class ManagerService {
    /**
     * Fetch all playground managers with pagination and filters
     */
    async getManagers(filters?: ManagerFilters): Promise<PageResponse<User>> {
        const params: any = {
            role: "ROLE_PLAYGROUND_MANAGER",
            page: filters?.page || 0,
            size: filters?.size || 10,
        };

        if (filters?.email) {
            params.email = filters.email;
        }

        if (filters?.name) {
            params.name = filters.name;
        }

        if (filters?.phoneNumber) {
            params.phoneNumber = filters.phoneNumber;
        }

        const { data } = await api.get("/users", { params });
        return data;
    }

    /**
     * Create a new playground manager with ground information
     */
    async createManager(managerData: CreateManagerData): Promise<User> {
        const formData = new FormData();

        // User fields
        formData.append("firstName", managerData.firstName);
        formData.append("lastName", managerData.lastName);
        formData.append("email", managerData.email);
        formData.append("password", managerData.password);
        if (managerData.phoneNumber) {
            formData.append("phoneNumber", managerData.phoneNumber);
        }

        // Ground fields
        formData.append("groundName", managerData.groundName);
        formData.append("groundAddress", managerData.groundAddress);

        if (managerData.groundDescription) {
            formData.append("groundDescription", managerData.groundDescription);
        }

        if (managerData.popularFeatures && managerData.popularFeatures.length > 0) {
            formData.append("popularFeatures", managerData.popularFeatures.toString());
        }

        if (managerData.groundPicture) {
            formData.append("groundPicture", managerData.groundPicture);
        }

        const { data } = await api.post("/users/managers", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return data;
    }

    /**
     * Delete a manager by ID
     */
    async deleteManager(id: number): Promise<void> {
        await api.delete(`/users/${id}`);
    }

    /**
     * Get a single manager by ID
     */
    async getManagerById(id: number): Promise<User> {
        const { data } = await api.get(`/users/${id}`);
        return data;
    }

    /**
     * Update a manager
     */
    async updateManager(id: number, managerData: Partial<CreateManagerData>): Promise<User> {
        const formData = new FormData();

        // User fields
        if (managerData.firstName) formData.append("firstName", managerData.firstName);
        if (managerData.lastName) formData.append("lastName", managerData.lastName);
        if (managerData.email) formData.append("email", managerData.email);
        if (managerData.password) formData.append("password", managerData.password);

        // Ground fields
        if (managerData.groundName) formData.append("groundName", managerData.groundName);
        if (managerData.groundAddress) formData.append("groundAddress", managerData.groundAddress);
        if (managerData.groundDescription) formData.append("groundDescription", managerData.groundDescription);

        if (managerData.popularFeatures && managerData.popularFeatures.length > 0) {
            formData.append("popularFeatures", managerData.popularFeatures.toString());
        }

        if (managerData.groundPicture) {
            formData.append("groundPicture", managerData.groundPicture);
        }

        const { data } = await api.put(`/users/managers/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return data;
    }

    /**
     * Get statistics for a specific manager
     * TODO: Replace with actual API call when endpoint is ready
     */
    async getManagerStats(id: number, startDate?: string, endDate?: string): Promise<ManagerStats> {
        const params: any = {};
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;

        const { data } = await api.get<ManagerStats>(`/managers/${id}/stats`, { params });
        return data;
    }
}

export default new ManagerService();
