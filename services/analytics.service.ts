
import api from "@/lib/api";

export interface RecentBooking {
    id: number;
    customerName: string;
    playgroundName: string;
    startTime: string;
    status: string;
    totalPrice: number;
}

export interface DashboardAnalytics {
    totalBookings: number;
    totalRevenue: number;
    activePlaygrounds: number;
    inactivePlaygrounds: number;
    dailyBookings: Record<string, number>;
    bookingsBySportType: Record<string, number>;
    topBookedPlaygrounds: Record<string, number>;
    peakBookingHours: Record<string, number>;
    mostBookedDaysOfWeek: Record<string, number>;
    latestBookings: RecentBooking[];
}

class AnalyticsService {
    /**
     * Fetch all dashboard analytics data
     */
    async getDashboardData(startDate?: string, endDate?: string): Promise<DashboardAnalytics> {
        const params: any = {};
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;

        const { data } = await api.get<DashboardAnalytics>("/analytics/dashboard", { params });
        return data;
    }
}

export default new AnalyticsService();
