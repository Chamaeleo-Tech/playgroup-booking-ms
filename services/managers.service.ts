import api from "@/lib/api";

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
    role: string;
    ground?: Ground;
}

export interface CreateManagerData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    groundName: string;
    groundAddress: string;
    groundDescription?: string;
    popularFeatures?: string[];
    groundPicture?: File;
}

export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}

export interface ManagerFilters {
    email?: string;
    name?: string;
    page?: number;
    size?: number;
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
}

export default new ManagerService();
