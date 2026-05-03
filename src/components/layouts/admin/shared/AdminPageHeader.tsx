"use client";
import { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface AdminPageHeaderProps {
    title: string;
    subTitle?: string;
    actions?: ReactNode;
    backHref?: string;
    backLabel?: string;
}

export default function AdminPageHeader({
    title,
    subTitle,
    actions,
    backHref,
    backLabel = "Quay lại danh sách",
}: AdminPageHeaderProps) {
    return (
        <div className="mb-8 space-y-4">
            {/* Back link for sub-pages */}
            {backHref && (
                <Link
                    href={backHref}
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold text-[10px] uppercase tracking-[0.2em] transition-all group"
                >
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                    {backLabel}
                </Link>
            )}

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                        {title}
                    </h1>
                    {subTitle && (
                        <p className="text-slate-400 text-sm font-medium">
                            {subTitle}
                        </p>
                    )}
                </div>

                {actions && (
                    <div className="flex items-center gap-3">
                        {actions}
                    </div>
                )}
            </div>
        </div>
    );
}
