import api from "@/lib/api";

export interface BroadcastNotificationRequest {
    title: string;
    description: string;
}

const notificationService = {
    sendBroadcastNotification: async (request: BroadcastNotificationRequest) => {
        const response = await api.post("/notifications/broadcast", request);
        return response.data;
    }
};

export default notificationService;
