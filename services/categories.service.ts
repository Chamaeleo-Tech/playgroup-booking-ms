import api from "@/lib/api";

export interface Category {
    id: number;
    name: string;
}

export interface CreateCategoryData {
    name: string;
}

class CategoryService {
    /**
     * Fetch all playground categories
     */
    async getCategories(): Promise<Category[]> {
        const { data } = await api.get("/playground-categories");
        return data;
    }

    /**
     * Create a new category
     */
    async createCategory(categoryData: CreateCategoryData): Promise<Category> {
        const { data } = await api.post("/playground-categories", categoryData);
        return data;
    }

    /**
     * Update an existing category
     */
    async updateCategory(id: number, categoryData: CreateCategoryData): Promise<Category> {
        const { data } = await api.put(`/playground-categories/${id}`, categoryData);
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
    async getCategoryById(id: number): Promise<Category> {
        const { data } = await api.get(`/playground-categories/${id}`);
        return data;
    }
}

export default new CategoryService();
