import { ReactNode } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";

interface AuthLeftPanelProps {
    /** Custom content displayed in the center of the panel */
    children: ReactNode;
}

/**
 * AuthLeftPanel
 * Dark gradient indigo panel with animated glow orbs, grid overlay, logo, and
 * a footer copyright. Pass page-specific visuals via `children`.
 */
export default function AuthLeftPanel({ children }: AuthLeftPanelProps) {
    return (
        <div
            className="w-full flex flex-col relative overflow-hidden"
            style={{
                background: "linear-gradient(160deg, #0f172a 0%, #1e1b4b 55%, #1a0533 100%)",
            }}
        >
            {/* Glow orbs */}
            <div className="absolute inset-0 pointer-events-none">
                <div
                    className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full opacity-25"
                    style={{ background: "radial-gradient(circle, #818cf8, transparent)" }}
                />
                <div
                    className="absolute bottom-[-15%] right-[-15%] w-[350px] h-[350px] rounded-full opacity-20"
                    style={{ background: "radial-gradient(circle, #c084fc, transparent)" }}
                />
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-5"
                    style={{ background: "radial-gradient(circle, #e0e7ff, transparent)" }}
                />
            </div>

            {/* Grid overlay */}
            <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(129,140,248,1) 1px, transparent 1px), linear-gradient(90deg, rgba(129,140,248,1) 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                }}
            />

            {/* Logo */}
            <div className="relative z-10 p-10">
                <Link href="/admin/login" className="inline-flex items-center gap-3">
                    <div
                        className="w-10 h-10 rounded-2xl flex items-center justify-center"
                        style={{
                            background: "linear-gradient(135deg, #818cf8, #6366f1)",
                            boxShadow: "0 8px 20px rgba(99,102,241,0.4)",
                        }}
                    >
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white text-xl font-black tracking-tight">
                        Cosmetic<span style={{ color: "#818cf8" }}>.</span>Eco
                    </span>
                </Link>
            </div>

            {/* Custom center content */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-10 text-center">
                {children}
            </div>

            {/* Footer */}
            <div className="relative z-10 px-10 py-6">
                <div
                    className="h-px mb-4"
                    style={{ background: "linear-gradient(90deg, transparent, rgba(129,140,248,0.2), transparent)" }}
                />
                <div className="flex items-center gap-2">
                    <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: "#6366f1", boxShadow: "0 0 6px #6366f1" }}
                    />
                    <p className="text-[10px] font-medium" style={{ color: "rgba(100,116,139,0.7)" }}>
                        Cosmetic Eco © 2026 · Secure Portal
                    </p>
                </div>
            </div>
        </div>
    );
}
