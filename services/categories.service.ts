import api from "@/lib/api";

export interface PlaygroundCategory {
    id: number;
    name: string;
    image: string;
    color: string;
    deleted: boolean;
}

export interface CreateCategoryData {
    name: string;
    image?: File;
    color?: string;
    deleted?: boolean;
}

class CategoryService {
    /**
     * Fetch all playground categories
     */
    async getCategories(): Promise<PlaygroundCategory[]> {
        const { data } = await api.get("/playground-categories");
        return data;
    }

    /**
     * Create a new category
     */
    async createCategory(categoryData: CreateCategoryData): Promise<PlaygroundCategory> {
        const formData = new FormData();
        formData.append("name", categoryData.name);
        if (categoryData.color) {
            formData.append("color", categoryData.color);
        }
        if (categoryData.image) {
            formData.append("image", categoryData.image);
        }

        const { data } = await api.post("/playground-categories", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return data;
    }

    /**
     * Update an existing category
     */
    async updateCategory(id: number, categoryData: Partial<CreateCategoryData>): Promise<PlaygroundCategory> {
        const formData = new FormData();
        if (categoryData.name) formData.append("name", categoryData.name);
        if (categoryData.color) formData.append("color", categoryData.color);
        if (categoryData.image) formData.append("image", categoryData.image);
        if (categoryData.deleted !== undefined) formData.append("deleted", String(categoryData.deleted));

        const { data } = await api.put(`/playground-categories/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return data;
    }

    /**
     * Delete a category by ID
     */
    async deleteCategory(id: number): Promise<void> {
        await api.delete(`/playground-categories/${id}`);
    }

    /**
     * Get a single category by ID
     */
    async getCategoryById(id: number): Promise<PlaygroundCategory> {
        const { data } = await api.get(`/playground-categories/${id}`);
        return data;
    }
}

export default new CategoryService();
