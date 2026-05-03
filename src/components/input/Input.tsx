import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
    icon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export default function Input({
    label,
    error,
    hint,
    icon,
    rightIcon,
    className = "",
    id,
    ...props
}: InputProps) {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
        <div className="flex flex-col gap-1 w-full">
            {label && (
                <label
                    htmlFor={inputId}
                    className="text-sm font-semibold text-slate-700 ml-0.5 flex items-center gap-1"
                >
                    {label}
                    {props.required && (
                        <span className="text-red-400 text-xs">*</span>
                    )}
                </label>
            )}

            <div className="relative group">
                {/* Left icon */}
                {icon && (
                    <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200 text-slate-400 group-focus-within:text-indigo-500 flex items-center justify-center">
                        {icon}
                    </div>
                )}

                <input
                    id={inputId}
                    className={`
                        w-full border rounded-xl py-2.5 text-sm text-slate-800
                        placeholder:text-slate-400 placeholder:tracking-tighter outline-none transition-all duration-200
                        bg-slate-50/60 backdrop-blur-sm
                        focus:bg-white focus:ring-2
                        shadow-sm tracking-tighter
                        ${icon ? "pl-5" : "px-4"}
                        ${rightIcon ? "pr-10" : "pr-4"}
                        ${
                            error
                                ? "border-red-400 focus:border-red-400 focus:ring-red-400/15"
                                : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/15"
                        }
                        ${className}
                    `}
                    {...props}
                />

                {/* Right icon */}
                {rightIcon && (
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                        {rightIcon}
                    </div>
                )}
            </div>

            {/* Hint / Error */}
            {error ? (
                <p className="text-xs text-red-500 ml-0.5 flex items-center gap-1">
                    <span>⚠</span> {error}
                </p>
            ) : hint ? (
                <p className="text-xs text-slate-400 ml-0.5">{hint}</p>
            ) : null}
        </div>
    );
}