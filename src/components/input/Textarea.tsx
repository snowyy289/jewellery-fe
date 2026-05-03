import React from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    hint?: string;
    icon?: React.ReactNode;
}

export default function Textarea({
    label,
    error,
    hint,
    icon,
    className = "",
    id,
    ...props
}: TextareaProps) {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
        <div className="flex flex-col gap-1.5 w-full text-left">
            {label && (
                <label
                    htmlFor={textareaId}
                    className="text-sm font-semibold text-slate-700 ml-0.5 flex items-center gap-1"
                >
                    {label}
                    {props.required && (
                        <span className="text-red-400 text-xs">*</span>
                    )}
                </label>
            )}

            <div className="relative group">
                {/* Left icon - usually positioned at top left for textarea */}
                {icon && (
                    <div className="absolute left-2.5 top-3 pointer-events-none transition-colors duration-200 text-slate-400 group-focus-within:text-indigo-500 flex items-center justify-center">
                        {icon}
                    </div>
                )}

                <textarea
                    id={textareaId}
                    className={`
                        w-full border rounded-xl py-2.5 text-sm text-slate-800
                        placeholder:text-slate-400 outline-none transition-all duration-200
                        bg-slate-50/60 backdrop-blur-sm
                        focus:bg-white focus:ring-2
                        shadow-sm min-h-[120px] resize-y tracking-tighter
                        ${icon ? "pl-8" : "px-4"}
                        ${
                            error
                                ? "border-red-400 focus:border-red-400 focus:ring-red-400/15"
                                : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/15"
                        }
                        ${className}
                    `}
                    {...props}
                ></textarea>
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
