import api from "@/lib/api";

export interface Playground {
    id: number;
    name: string;
    address?: string;
    manager?: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
    };
}

class PlaygroundService {
    /**
     * Fetch playgrounds with optional name search
     */
    async searchGrounds(name: string = ""): Promise<Playground[]> {
        const params: any = {};
        if (name) {
            params.name = name;
        }

        const { data } = await api.get("/grounds", { params });

        // Handle potential PageResponse wrapping if backend changes, but current spec says List<Ground>
        if (data.content && Array.isArray(data.content)) {
            return data.content;
        }
        return Array.isArray(data) ? data : [];
    }

    /**
     * Add a playground to popular list
     */
    async addPopularGround(id: number): Promise<void> {
        await api.post(`/grounds/${id}/popular`);
    }

    /**
     * Remove a playground from popular list
     */
    async removePopularGround(id: number): Promise<void> {
        await api.delete(`/grounds/${id}/popular`);
    }

    /**
     * Get all popular playgrounds
     */
    async getPopularGrounds(): Promise<Playground[]> {
        const { data } = await api.get("/grounds/popular");
        return data;
    }


    /**
     * @deprecated Use searchGrounds instead
     */
    async getAllPlaygrounds(): Promise<Playground[]> {
        return this.searchGrounds();
    }
}

export default new PlaygroundService();
