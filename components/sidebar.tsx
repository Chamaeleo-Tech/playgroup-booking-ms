"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Trophy, LogOut } from "lucide-react";

import { cn } from "@/lib/utils";

const routes = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
        color: "text-indigo-500",
    },
    {
        label: "Playground Managers",
        icon: Users,
        href: "/dashboard/managers",
        color: "text-emerald-500",
    },
    {
        label: "Categories",
        icon: Trophy,
        href: "/dashboard/categories",
        color: "text-pink-500",
    },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-white border-r border-slate-200 text-slate-800 shadow-sm">
            <div className="px-3 py-2 flex-1">
                <Link href="/dashboard" className="flex items-center pl-3 mb-14">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        Admin<span className="text-primary">Zone</span>
                    </h1>
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:bg-slate-50 rounded-lg transition duration-200 ease-in-out",
                                pathname === route.href ? "bg-indigo-50 text-indigo-700" : "text-slate-600"
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
