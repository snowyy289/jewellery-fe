"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { User as UserIcon, Camera, Mail, Phone, Save } from "lucide-react";
import Button from "@/components/button/Button";
import Input from "@/components/input/Input";
import { profileService } from "@/services/admin/profileService";
import { User } from "@/types/auth";
import { toast } from "sonner";

interface FormProfileProps {
    user: User | null;
    onUpdate: () => void;
}

export default function FormProfile({ user, onUpdate }: FormProfileProps) {
    const [isUpdating, setIsUpdating] = useState(false);
    const [previewAvatar, setPreviewAvatar] = useState<string | null>(user?.avatar || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (user?.avatar) setPreviewAvatar(user.avatar);
    }, [user]);

    const handleAvatarClick = () => fileInputRef.current?.click();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPreviewAvatar(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdating(true);
        try {
            const formData = new FormData(e.target as HTMLFormElement);
            const res = await profileService.updateProfile(formData);
            if (res.code === 200 || res.code === 201 || res.code === "success") {
                toast.success("Cập nhật thông tin thành công!");
                onUpdate();
                const userData = localStorage.getItem("user");
                if (userData) {
                    const current = JSON.parse(userData);
                    localStorage.setItem("user", JSON.stringify({ ...current, ...res }));
                }
            } else {
                toast.error(res.message);
            }
        } catch {
            toast.error("Lỗi cập nhật!");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div
            className="rounded-2xl border overflow-hidden"
            style={{
                background: "rgba(255,255,255,0.9)",
                backdropFilter: "blur(10px)",
                borderColor: "rgba(226,232,240,0.8)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
            }}
        >
            {/* Card header */}
            <div
                className="px-8 py-5 border-b flex items-center justify-between"
                style={{ borderColor: "rgba(226,232,240,0.8)" }}
            >
                <div>
                    <h3 className="text-base font-bold text-slate-800">Thông tin cá nhân</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Cập nhật thông tin tài khoản và tùy chọn cá nhân</p>
                </div>
                {/* Status dot */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border" style={{ background: "rgba(16,185,129,0.06)", borderColor: "rgba(16,185,129,0.2)" }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" />
                    <span className="text-[10px] font-bold text-emerald-600">Đã xác thực</span>
                </div>
            </div>

            <div className="p-8">
                {/* ── Avatar picker ── */}
                <div
                    className="flex items-center gap-5 p-5 rounded-2xl mb-8 border"
                    style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.04), rgba(129,140,248,0.02))", borderColor: "rgba(99,102,241,0.1)" }}
                >
                    <div
                        className="group relative w-20 h-20 rounded-2xl cursor-pointer shrink-0 transition-transform active:scale-95"
                        onClick={handleAvatarClick}
                        style={{
                            background: "white",
                            padding: "3px",
                            boxShadow: "0 4px 12px rgba(99,102,241,0.15), 0 0 0 2px rgba(99,102,241,0.12)",
                        }}
                    >
                        <div className="w-full h-full rounded-xl overflow-hidden flex items-center justify-center"
                            style={{ background: "linear-gradient(135deg, #e0e7ff, #c7d2fe)" }}>
                            {previewAvatar ? (
                                <Image src={previewAvatar} alt="avatar" width={80} height={80} className="w-full h-full object-cover" />
                            ) : (
                                <UserIcon className="w-7 h-7" style={{ color: "#6366f1" }} />
                            )}
                        </div>
                        {/* Hover overlay */}
                        <div className="absolute inset-0 rounded-xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Camera className="w-5 h-5 text-white" />
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-800">Ảnh đại diện</p>
                        <p className="text-xs text-slate-400 mt-0.5">Hỗ trợ JPG, PNG. Tối đa 2MB.</p>
                        <button
                            type="button"
                            onClick={handleAvatarClick}
                            className="mt-2 text-xs font-bold transition-colors"
                            style={{ color: "#6366f1" }}
                            onMouseOver={e => (e.currentTarget.style.color = "#4f46e5")}
                            onMouseOut={e => (e.currentTarget.style.color = "#6366f1")}
                        >
                            Tải ảnh mới →
                        </button>
                    </div>
                </div>

                {/* ── Form fields ── */}
                <form onSubmit={handleUpdateProfile} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <Input
                            label="Họ và tên"
                            name="fullName"
                            defaultValue={user?.fullName}
                            icon={<UserIcon className="w-4 h-4" />}
                            placeholder="Nhập họ và tên"
                        />
                        <Input
                            label="Địa chỉ Email"
                            name="email"
                            type="email"
                            defaultValue={user?.email}
                            icon={<Mail className="w-4 h-4" />}
                            placeholder="email@example.com"
                        />
                        <Input
                            label="Số điện thoại"
                            name="phone"
                            defaultValue={user?.phone || ""}
                            icon={<Phone className="w-4 h-4" />}
                            placeholder="Nhập số điện thoại"
                        />
                    </div>

                    <input type="file" name="avatar" hidden ref={fileInputRef} onChange={handleFileChange} accept="image/*" />

                    {/* Actions */}
                    <div
                        className="pt-5 flex items-center justify-between border-t"
                        style={{ borderColor: "rgba(226,232,240,0.8)" }}
                    >
                        <p className="text-xs text-slate-400">
                            Thông tin cập nhật sẽ có hiệu lực ngay lập tức
                        </p>
                        <Button
                            type="submit"
                            isLoading={isUpdating}
                            icon={!isUpdating ? <Save className="w-4 h-4" /> : undefined}
                            size="md"
                        >
                            Lưu thông tin
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
