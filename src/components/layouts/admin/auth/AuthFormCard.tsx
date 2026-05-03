"use client";
import { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface AuthFormCardProps {
    /** Icon component to render inside the gradient badge */
    icon: ReactNode;
    /** Page title */
    title: string;
    /** Subtitle / description text */
    subtitle: string;
    /** Form content */
    children: ReactNode;
    /** Optional back link href. If provided, a ← back link is shown above the card. */
    backHref?: string;
    /** Label for the back link */
    backLabel?: string;
}

/**
 * AuthFormCard
 * White glass card for the right side of auth pages.
 * Renders: optional back-link → icon badge → title/subtitle → glass card with children.
 */
export default function AuthFormCard({
    icon,
    title,
    subtitle,
    children,
    backHref,
    backLabel = "Quay lại",
}: AuthFormCardProps) {
    return (
        <div>
            {/* Back link */}
            {backHref && (
                <Link
                    href={backHref}
                    className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors mb-8 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    {backLabel}
                </Link>
            )}

            {/* Heading */}
            <div className="mb-8">
                <div
                    className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-6"
                    style={{
                        background: "linear-gradient(135deg, #6366f1, #818cf8)",
                        boxShadow: "0 8px 24px rgba(99,102,241,0.3)",
                    }}
                >
                    {icon}
                </div>
                <h1 className="text-3xl font-black text-slate-800 mb-2">{title}</h1>
                <p className="text-slate-500 font-medium">{subtitle}</p>
            </div>

            {/* Glass card */}
            <div
                className="rounded-3xl p-8 border"
                style={{
                    background: "rgba(255,255,255,0.9)",
                    backdropFilter: "blur(20px)",
                    borderColor: "rgba(226,232,240,0.8)",
                    boxShadow: "0 20px 50px rgba(0,0,0,0.06), 0 0 0 1px rgba(255,255,255,0.9)",
                }}
            >
                {children}
            </div>
        </div>
    );
}
