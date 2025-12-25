
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
    bookingsToday: number;
    bookingsThisMonth: number;
    activePlaygrounds: number;
    inactivePlaygrounds: number;
    bookingsLast30Days: Record<string, number>;
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
    async getDashboardData(): Promise<DashboardAnalytics> {
        const { data } = await api.get<DashboardAnalytics>("/analytics/dashboard");
        return data;
    }
}

export default new AnalyticsService();
