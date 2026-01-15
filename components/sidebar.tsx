"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Trophy, LogOut, Ticket, Star, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { StaffPermission } from "@/services/staff.service";

// Define all possible routes
const allRoutes = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
        color: "text-[#00a195]",
        permission: StaffPermission.VIEW_DASHBOARD,
    },
    {
        label: "Events",
        icon: Ticket,
        href: "/dashboard/events",
        color: "text-purple-500",
        permission: StaffPermission.MANAGE_EVENTS,
    },
    {
        label: "Popular Grounds",
        icon: Star,
        href: "/dashboard/popular",
        color: "text-yellow-500",
        permission: StaffPermission.MANAGE_POPULAR_GROUND,
    },
    {
        label: "Playground Managers",
        icon: Users,
        href: "/dashboard/managers",
        color: "text-emerald-500",
        permission: StaffPermission.MANAGE_MANAGERS,
    },
    {
        label: "Categories",
        icon: Trophy,
        href: "/dashboard/categories",
        color: "text-pink-500",
        permission: StaffPermission.MANAGE_PLAYGROUND_CATEGORY,
    },
    {
        label: "Staff",
        icon: ShieldCheck,
        href: "/dashboard/staff",
        color: "text-orange-500",
        adminOnly: true, // Special flag for admin-only routes
    },
    {
        label: "Users",
        icon: Users,
        href: "/dashboard/users",
        color: "text-blue-500",
        permission: StaffPermission.MANAGE_USERS,
    }
];

export function Sidebar() {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    const [routes, setRoutes] = useState<typeof allRoutes>([]);

    useEffect(() => {
        setMounted(true);
        const userStr = localStorage.getItem("user");
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                const permissions = user.permissions || [];
                const role = user.role || "";
                const isSystemAdmin = role.includes("ROLE_SYSTEM_ADMIN");

                const filteredRoutes = allRoutes.filter(route => {
                    // System Admin sees everything
                    if (isSystemAdmin) return true;

                    // Admin only routes (like Staff) are hidden from regular staff
                    if (route.adminOnly) return false;

                    // Check for specific permission if required
                    if (route.permission) {
                        return permissions.includes(route.permission);
                    }

                    return true;
                });

                setRoutes(filteredRoutes);
            } catch (e) {
                console.error("Failed to parse user from local storage", e);
                // Fallback to minimal routes or redirect
            }
        }
    }, []);

    if (!mounted) {
        return null; // Avoid hydration mismatch
    }

    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-white border-r border-slate-200 text-slate-800 shadow-sm">
            <div className="px-3 py-2 flex-1">
                <Link href="/dashboard" className="flex items-center pl-3 mb-14 gap-2">
                    <Image
                        src="/logo.png"
                        alt="KickZone Logo"
                        width={32}
                        height={32}
                        style={{ objectFit: 'contain' }}
                    />
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        Kick<span className="text-[#00a195]">Zone</span>
                    </h1>
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:bg-slate-50 rounded-lg transition duration-200 ease-in-out",
                                pathname === route.href ? "bg-teal-50 text-[#00a195]" : "text-slate-600"
                            )}
                        >
                            <div className="flex items-center flex-1">
                                <route.icon className={cn("h-5 w-5 mr-3 transition-colors", route.color)} />
                                {route.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <div className="px-3 py-2">
                <div
                    className="text-sm group flex p-3 w-full justify-start font-medium cursor-pointer text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition duration-200"
                    onClick={() => {
                        localStorage.clear();
                        window.location.href = "/login";
                    }}
                >
                    <div className="flex items-center flex-1">
                        <LogOut className="h-5 w-5 mr-3 group-hover:text-red-600 transition-colors" />
                        Logout
                    </div>
                </div>
            </div>
        </div>
    );
}
