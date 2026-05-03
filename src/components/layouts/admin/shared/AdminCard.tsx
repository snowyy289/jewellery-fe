"use client";
import { ReactNode } from "react";

interface AdminCardProps {
    title?: string;
    subTitle?: string;
    headerAction?: ReactNode;
    children: ReactNode;
    footer?: ReactNode;
    noPadding?: boolean;
    className?: string;
}

export default function AdminCard({
    title,
    subTitle,
    headerAction,
    children,
    footer,
    noPadding = false,
    className = "",
}: AdminCardProps) {
    return (
        <div
            className={`rounded-4xl border transition-all duration-300 relative overflow-hidden ${className}`}
            style={{
                background: "rgba(255,255,255,0.9)",
                backdropFilter: "blur(20px)",
                borderColor: "rgba(226,232,240,0.8)",
                boxShadow: "0 4px 24px rgba(0,0,0,0.02), 0 0 0 1px rgba(255,255,255,0.8)",
            }}
        >
            {/* Gradient background hint */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/30 rounded-bl-full pointer-events-none opacity-50" />

            {(title || headerAction) && (
                <div
                    className="px-8 py-6 border-b flex items-center justify-between relative z-10"
                    style={{ borderColor: "rgba(226,232,240,0.6)" }}
                >
                    <div className="space-y-1">
                        {title && <h3 className="text-lg font-black text-slate-800 tracking-tight">{title}</h3>}
                        {subTitle && <p className="text-xs font-medium text-slate-400">{subTitle}</p>}
                    </div>
                    {headerAction && <div>{headerAction}</div>}
                </div>
            )}

            <div className={`relative z-10 ${noPadding ? "" : "p-8"}`}>
                {children}
            </div>

            {footer && (
                <div
                    className="px-8 py-5 border-t bg-slate-50/50 relative z-10 rounded-b-4xl"
                    style={{ borderColor: "rgba(226,232,240,0.6)" }}
                >
                    {footer}
                </div>
            )}
        </div>
    );
}
