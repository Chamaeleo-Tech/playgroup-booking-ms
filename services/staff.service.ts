import api from "@/lib/api";
import { PageResponse } from "./events.service";

export enum StaffPermission {
    MANAGE_USERS = "MANAGE_USERS",
    MANAGE_PLAYGROUND_CATEGORY = "MANAGE_PLAYGROUND_CATEGORY",
    MANAGE_MANAGERS = "MANAGE_MANAGERS",
    MANAGE_POPULAR_GROUND = "MANAGE_POPULAR_GROUND",
    MANAGE_EVENTS = "MANAGE_EVENTS",
    VIEW_DASHBOARD = "VIEW_DASHBOARD"
}

export const PERMISSION_LABELS: Record<StaffPermission, string> = {
    [StaffPermission.MANAGE_USERS]: "Manage Users",
    [StaffPermission.MANAGE_PLAYGROUND_CATEGORY]: "Manage Playground Categories",
    [StaffPermission.MANAGE_MANAGERS]: "Manage Managers",
    [StaffPermission.MANAGE_POPULAR_GROUND]: "Manage Popular Grounds",
    [StaffPermission.MANAGE_EVENTS]: "Manage Events",
    [StaffPermission.VIEW_DASHBOARD]: "View Dashboard"
};

export const PERMISSION_DESCRIPTIONS: Record<StaffPermission, string> = {
    [StaffPermission.MANAGE_USERS]: "Can view and manage end-users",
    [StaffPermission.MANAGE_PLAYGROUND_CATEGORY]: "Can create, edit, and delete playground categories",
    [StaffPermission.MANAGE_MANAGERS]: "Can create, edit, and delete playground managers",
    [StaffPermission.MANAGE_POPULAR_GROUND]: "Can manage popular/featured grounds",
    [StaffPermission.MANAGE_EVENTS]: "Can create, edit, and delete events",
    [StaffPermission.VIEW_DASHBOARD]: "Can view dashboard analytics"
};

export interface Staff {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    enabled: boolean;
    permissions: StaffPermission[];
    createdAt?: string;
}

export interface CreateStaffData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber?: string;
    permissions: StaffPermission[];
}

export interface UpdateStaffData {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    phoneNumber?: string;
    permissions?: StaffPermission[];
}

export interface StaffFilters {
    email?: string;
    name?: string;
    phoneNumber?: string;
    page?: number;
    size?: number;
}

class StaffService {
    /**
     * Fetch all staff members with pagination and filters
     */
    async getStaff(filters?: StaffFilters): Promise<PageResponse<Staff>> {
        const params: Record<string, unknown> = {
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

        const { data } = await api.get("/staff", { params });
        return data;
    }

    /**
     * Get a staff member by ID
     */
    async getStaffById(id: number): Promise<Staff> {
        const { data } = await api.get(`/staff/${id}`);
        return data;
    }

    /**
     * Create a new staff member
     */
    async createStaff(staffData: CreateStaffData): Promise<Staff> {
        const { data } = await api.post("/staff", staffData);
        return data;
    }

    /**
     * Update an existing staff member
     */
    async updateStaff(id: number, staffData: UpdateStaffData): Promise<Staff> {
        const { data } = await api.put(`/staff/${id}`, staffData);
        return data;
    }

    /**
     * Delete a staff member
     */
    async deleteStaff(id: number): Promise<void> {
        await api.delete(`/staff/${id}`);
    }

    /**
     * Enable a staff member
     */
    async enableStaff(id: number): Promise<void> {
        await api.patch(`/staff/${id}/enable`);
    }

    /**
     * Disable a staff member
     */
    async disableStaff(id: number): Promise<void> {
        await api.patch(`/staff/${id}/disable`);
    }
}

export default new StaffService();
