import api from "@/lib/api";
import { Playground } from "./playgrounds.service";

export interface Event {
    id: number;
    title: string;
    description: string;
    image: string;
    ground: Playground;
    lastRegistrationDate: string;
    registrationFees: number;
    maxRegistrations?: number;
    isActive: boolean;
    startTournamentDate: string;
    timeFrom: string;
    timeTo: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateEventData {
    title: string;
    description: string;
    image: string;
    groundId: number;
    lastRegistrationDate: string; // yyyy-MM-dd HH:mm:ss
    registrationFees: number;
    maxRegistrations?: number;
    startTournamentDate: string; // yyyy-MM-dd HH:mm:ss
    timeFrom: string; // HH:mm:ss
    timeTo: string; // HH:mm:ss
    isActive?: boolean;
    imageFile?: File; // For frontend use
}

export interface UpdateEventData extends Partial<CreateEventData> {
    isActive?: boolean;
}

export interface PageResponse<T> {
    content: T[];
    page: Page;
}

export interface Page {
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

class EventService {
    async getAllEvents(page = 0, size = 10): Promise<PageResponse<Event>> {
        const { data } = await api.get("/events", {
            params: { page, size }
        });
        return data;
    }

    async getActiveEvents(): Promise<Event[]> {
        const { data } = await api.get("/events/active");
        return data;
    }

    async getEventById(id: number): Promise<Event> {
        const { data } = await api.get(`/events/${id}`);
        return data;
    }

    async createEvent(eventData: CreateEventData): Promise<Event> {
        const formData = new FormData();

        // Prepare the event data object (excluding imageFile)
        const eventDTO = {
            title: eventData.title,
            description: eventData.description,
            groundId: eventData.groundId,
            lastRegistrationDate: eventData.lastRegistrationDate,
            registrationFees: eventData.registrationFees,
            maxRegistrations: eventData.maxRegistrations,
            isActive: eventData.isActive,
            startTournamentDate: eventData.startTournamentDate,
            timeFrom: eventData.timeFrom,
            timeTo: eventData.timeTo,
        };

        // Append as JSON blob for @RequestPart("data")
        formData.append(
            "data",
            new Blob([JSON.stringify(eventDTO)], { type: "application/json" })
        );

        // Append image file for @RequestPart("image")
        if (eventData.imageFile) {
            formData.append("image", eventData.imageFile);
        }

        const { data } = await api.post("/events", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return data;
    }

    async updateEvent(id: number, eventData: UpdateEventData): Promise<Event> {
        const formData = new FormData();

        // Helper to format datetime to yyyy-MM-dd HH:mm:ss
        const formatDateTime = (val: string | undefined) => {
            if (!val) return undefined;

            // If it contains 'T', it's from datetime-local input (YYYY-MM-DDTHH:mm)
            if (val.includes('T')) {
                // Remove the 'T' and add seconds if not present
                const formatted = val.replace('T', ' ');
                // Check if seconds are already present (length would be 19 for YYYY-MM-DD HH:mm:ss)
                if (formatted.length === 16) {
                    return formatted + ':00';
                }
                return formatted;
            }

            // If already in correct format (yyyy-MM-dd HH:mm:ss), return as-is
            if (val.includes(' ') && val.length >= 19) {
                return val;
            }

            // Fallback: return as-is
            return val;
        };

        // Helper to format time to HH:mm:ss
        const formatTime = (val: string | undefined) => {
            if (!val) return undefined;
            // If it's HH:mm format, add :00
            if (val.length === 5 && val.includes(':')) {
                return val + ':00';
            }
            // If already in HH:mm:ss format, return as-is
            return val;
        };

        // Prepare the event data object (excluding imageFile)
        const eventDTO: any = {};

        if (eventData.title !== undefined) eventDTO.title = eventData.title;
        if (eventData.description !== undefined) eventDTO.description = eventData.description;
        if (eventData.groundId !== undefined) eventDTO.groundId = eventData.groundId;
        if (eventData.lastRegistrationDate !== undefined) {
            eventDTO.lastRegistrationDate = formatDateTime(eventData.lastRegistrationDate);
        }
        if (eventData.registrationFees !== undefined) eventDTO.registrationFees = eventData.registrationFees;
        if (eventData.maxRegistrations !== undefined) eventDTO.maxRegistrations = eventData.maxRegistrations;
        if (eventData.startTournamentDate !== undefined) {
            eventDTO.startTournamentDate = formatDateTime(eventData.startTournamentDate);
        }
        if (eventData.timeFrom !== undefined) {
            eventDTO.timeFrom = formatTime(eventData.timeFrom);
        }
        if (eventData.timeTo !== undefined) {
            eventDTO.timeTo = formatTime(eventData.timeTo);
        }
        if (eventData.isActive !== undefined) eventDTO.isActive = eventData.isActive;

        console.log(eventDTO);
        // Append as JSON blob for @RequestPart("data")
        formData.append(
            "data",
            new Blob([JSON.stringify(eventDTO)], { type: "application/json" })
        );

        // Append image file for @RequestPart("image")
        if (eventData.imageFile) {
            formData.append("image", eventData.imageFile);
        }

        const { data } = await api.put(`/events/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return data;
    }

    async disableEvent(id: number): Promise<void> {
        await api.patch(`/events/${id}/disable`);
    }
}

export default new EventService();
