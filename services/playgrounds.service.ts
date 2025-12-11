import api from "@/lib/api";

export interface Playground {
    id: number;
    name: string;
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
