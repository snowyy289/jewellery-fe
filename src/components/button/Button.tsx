import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "outline" | "ghost" | "danger";
    size?: "sm" | "md" | "lg";
    isLoading?: boolean;
    icon?: React.ReactNode;
}

export default function Button({
    children,
    variant = "primary",
    size = "md",
    isLoading = false,
    icon,
    className = "",
    ...props
}: ButtonProps) {
    const base =
        "relative inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] select-none overflow-hidden";

    const sizes = {
        sm: "px-4 py-2 text-xs",
        md: "px-5 py-2.5 text-sm",
        lg: "px-6 py-3.5 text-sm",
    };

    const variantClasses: Record<string, string> = {
        primary:
            "text-white shadow-md hover:shadow-lg hover:-translate-y-px",
        outline:
            "border-2 text-slate-700 hover:bg-slate-50 border-slate-200 bg-white",
        ghost:
            "text-slate-600 hover:bg-slate-100 bg-transparent",
        danger:
            "text-white shadow-md hover:shadow-lg hover:-translate-y-px",
    };

    const variantStyles: Record<string, React.CSSProperties> = {
        primary: {
            background: "linear-gradient(135deg, #6366f1, #818cf8)",
            boxShadow: "0 4px 14px rgba(99,102,241,0.35)",
        },
        danger: {
            background: "linear-gradient(135deg, #ef4444, #f87171)",
            boxShadow: "0 4px 14px rgba(239,68,68,0.3)",
        },
        outline: {},
        ghost: {},
    };

    return (
        <button
            className={`${base} ${sizes[size]} ${variantClasses[variant]} ${className}`}
            style={variantStyles[variant]}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {/* Shimmer overlay for primary */}
            {(variant === "primary" || variant === "danger") && (
                <span
                    className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)",
                    }}
                />
            )}

            {isLoading ? (
                <span
                    className="w-4 h-4 border-2 rounded-full animate-spin"
                    style={{ borderColor: "rgba(255,255,255,0.3)", borderTopColor: "white" }}
                />
            ) : (
                <>
                    {icon && <span className="shrink-0">{icon}</span>}
                    {children}
                </>
            )}
        </button>
    );
}