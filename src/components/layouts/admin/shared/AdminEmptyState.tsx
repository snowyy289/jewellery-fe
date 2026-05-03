"use client";
import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface AdminEmptyStateProps {
    title: string;
    description: string;
    icon: LucideIcon;
    action?: ReactNode;
}

export default function AdminEmptyState({
    title,
    description,
    icon: Icon,
    action,
}: AdminEmptyStateProps) {
    return (
        <div className="bg-white border border-dashed border-slate-200 rounded-4xl p-20 flex flex-col items-center justify-center text-center relative overflow-hidden">
            {/* Soft decorative glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-60 pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center">
                <div
                    className="w-24 h-24 rounded-4xl flex items-center justify-center mb-8"
                    style={{
                        background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(129,140,248,0.05))",
                        border: "1px solid rgba(129,140,248,0.2)",
                        boxShadow: "0 20px 40px rgba(99,102,241,0.08)",
                    }}
                >
                    <Icon size={48} style={{ color: "#6366f1" }} />
                </div>

                <h2 className="text-3xl font-black text-slate-800 mb-3 tracking-tight">
                    {title}
                </h2>
                <p className="text-slate-400 max-w-sm mb-10 font-medium leading-relaxed">
                    {description}
                </p>

                {action && <div>{action}</div>}
            </div>
        </div>
    );
}
