"use client";
import { useEffect, useState } from "react";
import { Lock, ShieldCheck, Calendar, Mail } from "lucide-react";
import Button from "@/components/button/Button";
import { profileService } from "@/services/admin/profileService";
import { User } from "@/types/auth";
import FormProfile from "./FormProfile";
import ModalChangePassword from "./ModalChangePassword";

export default function ProfilePage() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalPasswordOpen, setIsModalPasswordOpen] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setIsLoading(true);
        try {
            const res = await profileService.getProfile();
            if (res.code === "success") {
                setUser(res.user);
            }
        } catch {
            console.error("Fetch profile error");
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return (
        <div className="flex items-center justify-center h-[60vh]">
            <div className="flex flex-col items-center gap-4">
                <div
                    className="w-12 h-12 rounded-full border-2 border-t-transparent animate-spin"
                    style={{ borderColor: "rgba(99,102,241,0.2)", borderTopColor: "#6366f1" }}
                />
                <p className="text-sm font-medium text-slate-400">Đang tải...</p>
            </div>
        </div>
    );

    return (
        <div className="w-full space-y-6 pb-8">
            {/* ── Content area ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* ── Left sidebar cards ── */}
                <div className="space-y-4">
                    {/* Status card */}
                    <div
                        className="rounded-2xl p-6 border"
                        style={{
                            background: "rgba(255,255,255,0.9)",
                            backdropFilter: "blur(10px)",
                            borderColor: "rgba(226,232,240,0.8)",
                            boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                        }}
                    >
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Thông tin tài khoản</p>
                        <div className="space-y-3">
                            {/* Status */}
                            <div className="flex items-center justify-between py-3 border-b border-slate-50">
                                <span className="text-xs font-semibold text-slate-500">Trạng thái</span>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" />
                                    <span className="text-xs font-bold text-emerald-600">Hoạt động</span>
                                </div>
                            </div>
                            {/* Role */}
                            <div className="flex items-center justify-between py-3 border-b border-slate-50">
                                <span className="text-xs font-semibold text-slate-500">Quyền hạn</span>
                                <div className="flex items-center gap-1.5">
                                    <ShieldCheck className="w-3.5 h-3.5" style={{ color: "#6366f1" }} />
                                    <span className="text-xs font-bold text-slate-700">{user?.role || "Admin"}</span>
                                </div>
                            </div>
                            {/* Email */}
                            <div className="flex items-center justify-between py-3 border-b border-slate-50 gap-3">
                                <span className="text-xs font-semibold text-slate-500 shrink-0">Email</span>
                                <div className="flex items-center gap-1.5 min-w-0">
                                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                    <span className="text-xs font-medium text-slate-600 truncate">{user?.email || "—"}</span>
                                </div>
                            </div>
                            {/* Member since */}
                            <div className="flex items-center justify-between py-3">
                                <span className="text-xs font-semibold text-slate-500">Tham gia</span>
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                    <span className="text-xs font-medium text-slate-600">2026</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Security quick-action */}
                    <div
                        className="rounded-2xl p-6 border relative overflow-hidden"
                        style={{
                            background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
                            borderColor: "rgba(99,102,241,0.2)",
                        }}
                    >
                        {/* Glow */}
                        <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full opacity-20"
                            style={{ background: "radial-gradient(circle, #818cf8, transparent)" }} />

                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "rgba(99,102,241,0.25)" }}>
                                    <Lock className="w-4 h-4" style={{ color: "#818cf8" }} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">Bảo mật</p>
                                    <p className="text-[10px]" style={{ color: "rgba(148,163,184,0.7)" }}>Quản lý mật khẩu</p>
                                </div>
                            </div>
                            <p className="text-xs leading-relaxed mb-4" style={{ color: "rgba(148,163,184,0.7)" }}>
                                Thay đổi mật khẩu định kỳ để bảo vệ tài khoản tốt hơn.
                            </p>
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full font-bold text-xs"
                                onClick={() => setIsModalPasswordOpen(true)}
                                style={{
                                    borderColor: "rgba(129,140,248,0.4)",
                                    color: "#a5b4fc",
                                    background: "rgba(99,102,241,0.1)",
                                }}
                            >
                                Đổi mật khẩu
                            </Button>
                        </div>
                    </div>
                </div>

                {/* ── Modal Password ── */}
                <ModalChangePassword 
                    isOpen={isModalPasswordOpen} 
                    onClose={() => setIsModalPasswordOpen(false)} 
                />

                {/* ── Right: Main Form ── */}
                <div className="md:col-span-2">
                    <FormProfile user={user} onUpdate={fetchProfile} />
                </div>
            </div>
        </div>
    );
}
