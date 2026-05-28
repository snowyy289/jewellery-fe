"use client";
import React, { useEffect, useState, useRef } from "react";
import { Camera, Save, Loader2, Mail, Phone, User as UserIcon } from "lucide-react";
import { clientAuthService } from "@/services/client/authService";
import { toast } from "sonner";
import Image from "next/image";

export default function ProfilePage() {
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [profile, setProfile] = useState<any>(null);
    const [formData, setFormData] = useState({
        fullName: "",
        phone: ""
    });
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await clientAuthService.getMe();
                if (res.user) {
                    setProfile(res.user);
                    setFormData({
                        fullName: res.user.fullName || "",
                        phone: res.user.phone || ""
                    });
                    if (res.user.avatar) {
                        setAvatarPreview(res.user.avatar);
                    }
                }
            } catch (error) {
                toast.error("Không thể tải thông tin hồ sơ.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            const objectUrl = URL.createObjectURL(file);
            setAvatarPreview(objectUrl);
        }
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append("fullName", formData.fullName);
            formDataToSend.append("phone", formData.phone);
            
            if (avatarFile) {
                formDataToSend.append("avatar", avatarFile);
            }

            const res = await clientAuthService.updateProfile(formDataToSend);
            
            if (res.code === 200 || res.code === "success") {
                toast.success("Cập nhật hồ sơ thành công!");
                setProfile(res.user);
                
                // Update local storage so header re-renders if it uses it directly (or header can refetch)
                if (typeof window !== "undefined") {
                    localStorage.setItem("client_user", JSON.stringify(res.user));
                    window.dispatchEvent(new Event("storage")); // Trigger storage event for other components
                }
            } else {
                toast.error(res.message || "Có lỗi xảy ra khi cập nhật hồ sơ.");
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Lỗi kết nối đến máy chủ.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-32 pb-16 flex justify-center bg-stone-50">
                <Loader2 className="w-8 h-8 animate-spin text-gold" />
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen pt-32 pb-16 flex justify-center bg-stone-50">
                <div className="text-center">
                    <p className="text-stone-500 mb-4">Vui lòng đăng nhập để xem hồ sơ.</p>
                    <a href="/login" className="text-gold font-bold hover:underline">Đăng nhập ngay</a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-16 bg-stone-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12 space-y-4">
                    <h1 className="text-3xl md:text-4xl font-black text-stone-900 uppercase tracking-tight">Hồ Sơ Của Tôi</h1>
                    <div className="w-16 h-1 bg-gold mx-auto"></div>
                    <p className="text-stone-500">Quản lý thông tin cá nhân và bảo mật tài khoản</p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-stone-100">
                    <div className="flex flex-col md:flex-row">
                        {/* Avatar Section */}
                        <div className="md:w-1/3 bg-stone-900 text-white p-8 md:p-12 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-stone-800">
                            <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                                <div className="w-32 h-32 rounded-full overflow-hidden bg-stone-800 border-4 border-stone-800 group-hover:border-gold transition-colors relative">
                                    {avatarPreview ? (
                                        <Image 
                                            src={avatarPreview} 
                                            alt={profile.fullName}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-stone-400">
                                            <UserIcon className="w-12 h-12" />
                                        </div>
                                    )}
                                </div>
                                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera className="w-8 h-8 text-white" />
                                </div>
                            </div>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleFileChange} 
                                className="hidden" 
                                accept="image/jpeg,image/png,image/webp"
                            />
                            <h3 className="mt-6 text-xl font-bold tracking-wide">{profile.fullName}</h3>
                            <span className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-stone-800 text-gold">
                                Khách Hàng
                            </span>
                        </div>

                        {/* Form Section */}
                        <div className="md:w-2/3 p-8 md:p-12">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-2 block">Họ và Tên</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <UserIcon className="h-5 w-5 text-stone-400" />
                                        </div>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            className="pl-11 w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold transition-all"
                                            placeholder="Nhập họ và tên của bạn"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-2 block">Số điện thoại</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Phone className="h-5 w-5 text-stone-400" />
                                        </div>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="pl-11 w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold transition-all"
                                            placeholder="Nhập số điện thoại"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-2 block">Email</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-stone-400" />
                                        </div>
                                        <input
                                            type="email"
                                            value={profile.email}
                                            className="pl-11 w-full bg-stone-100 border border-stone-200 rounded-xl px-4 py-3.5 text-stone-500 cursor-not-allowed"
                                            disabled
                                            readOnly
                                        />
                                    </div>
                                    <p className="mt-2 text-xs text-stone-400 italic">Email không thể thay đổi sau khi đăng ký.</p>
                                </div>

                                <div className="pt-6">
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full bg-stone-900 text-white font-bold rounded-xl px-4 py-4 flex justify-center items-center gap-2 hover:bg-gold hover:text-stone-900 transition-colors uppercase tracking-widest text-sm disabled:opacity-70 disabled:hover:bg-stone-900 disabled:hover:text-white"
                                    >
                                        {submitting ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Đang Lưu...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-5 h-5" />
                                                Lưu Thay Đổi
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
