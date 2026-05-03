"use client";
import { LucideIcon } from "lucide-react";
import AdminCard from "./AdminCard";

interface AdminStatsCardProps {
    label: string;
    value: string | number;
    icon: LucideIcon;
    color?: "indigo" | "emerald" | "amber" | "rose" | "slate";
    trend?: {
        value: string;
        isUp: boolean;
    };
}

const COLOR_MAP = {
    indigo: {
        bg: "rgba(99,102,241,0.1)",
        icon: "#6366f1",
        label: "rgba(99,102,241,0.2)",
    },
    emerald: {
        bg: "rgba(16,185,129,0.1)",
        icon: "#10b981",
        label: "rgba(16,185,129,0.2)",
    },
    amber: {
        bg: "rgba(245,158,11,0.1)",
        icon: "#f59e0b",
        label: "rgba(245,158,11,0.2)",
    },
    rose: {
        bg: "rgba(244,63,94,0.1)",
        icon: "#f43f5e",
        label: "rgba(244,63,94,0.2)",
    },
    slate: {
        bg: "rgba(100,116,139,0.1)",
        icon: "#64748b",
        label: "rgba(100,116,139,0.2)",
    },
};

export default function AdminStatsCard({
    label,
    value,
    icon: Icon,
    color = "indigo",
    trend,
}: AdminStatsCardProps) {
    const theme = COLOR_MAP[color];

    return (
        <AdminCard className="group hover:-translate-y-1 transition-all duration-300">
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                        style={{
                            background: theme.bg,
                            border: `1px solid ${theme.label}`,
                        }}
                    >
                        <Icon className="w-6 h-6" style={{ color: theme.icon }} />
                    </div>
                    {trend && (
                        <div
                            className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                trend.isUp ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                            }`}
                        >
                            {trend.isUp ? "↑" : "↓"} {trend.value}
                        </div>
                    )}
                </div>

                <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">
                        {label}
                    </h4>
                    <div className="text-2xl font-black text-slate-800 tracking-tight">
                        {value}
                    </div>
                </div>
            </div>
        </AdminCard>
    );
}
