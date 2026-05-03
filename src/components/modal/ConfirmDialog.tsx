"use client";
import { AlertTriangle, Info, X } from "lucide-react";
import useConfirmStore from "@/hooks/useConfirm";
import Button from "../button/Button";

export default function ConfirmDialog() {
    const { isOpen, title, message, confirmText, cancelText, variant, confirm, cancel } = useConfirmStore();

    if (!isOpen) return null;

    const variantStyles = {
        danger: {
            icon: AlertTriangle,
            iconBg: "bg-red-100",
            iconColor: "text-red-600",
            confirmBg: "bg-red-600 hover:bg-red-700",
        },
        warning: {
            icon: AlertTriangle,
            iconBg: "bg-amber-100",
            iconColor: "text-amber-600",
            confirmBg: "bg-amber-600 hover:bg-amber-700",
        },
        info: {
            icon: Info,
            iconBg: "bg-indigo-100",
            iconColor: "text-indigo-600",
            confirmBg: "bg-indigo-600 hover:bg-indigo-700",
        }
    };

    const style = variantStyles[variant];
    const Icon = style.icon;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-start justify-between p-6 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${style.iconBg}`}>
                            <Icon className={`w-5 h-5 ${style.iconColor}`} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">{title}</h3>
                    </div>
                    <button
                        onClick={cancel}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <p className="text-slate-600 leading-relaxed">{message}</p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-100 bg-slate-50/50">
                    <Button
                        variant="outline"
                        onClick={cancel}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        onClick={confirm}
                        className={style.confirmBg}
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </div>
    );
}
