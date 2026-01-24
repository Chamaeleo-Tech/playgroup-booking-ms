"use client";

import { useEffect, useState } from "react";
import { User } from "lucide-react";

export function Navbar() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("user");
            if (stored) setUser(JSON.parse(stored));
        }
    }, []);

    return (
        <div className="flex items-center p-4">
            {/* Mobile Sidebar toggle could go here */}
            <div className="flex w-full justify-end">
                <div className="flex items-center gap-x-2 text-sm text-muted-foreground bg-secondary px-3 py-1.5 rounded-full">
                    <User className="h-4 w-4" />
                    <span>
                        {user
                            ? (user.firstName && user.lastName
                                ? `${user.firstName} ${user.lastName}`
                                : user.email)
                            : "Admin"}
                    </span>
                </div>
            </div>
        </div>
    );
}
