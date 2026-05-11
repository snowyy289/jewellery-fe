"use client";
import { useState } from "react";
import { Lock, ShieldCheck, X, Save, AlertCircle } from "lucide-react";
import Button from "@/components/button/Button";
import Input from "@/components/input/Input";
import { profileService } from "@/services/admin/profileService";
import { toast } from "sonner";

interface ModalChangePasswordProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ModalChangePassword({ isOpen, onClose }: ModalChangePasswordProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (formData.newPassword !== formData.confirmPassword) {
            setError("Mật khẩu mới không khớp!");
            return;
        }

        if (formData.newPassword.length < 6) {
            setError("Mật khẩu mới phải có ít nhất 6 ký tự!");
            return;
        }

        setIsLoading(true);
        try {
            const res = await profileService.changePassword({
                oldPassword: formData.oldPassword,
                newPassword: formData.newPassword
            });

            if (res.code === 200 || res.code === 201 || res.code === "success") {
                toast.success("Đổi mật khẩu thành công!");
                onClose();
                setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
            } else {
                toast.error(res.message);
                setError(res.message);
            }
        } catch {
            toast.error("Lỗi hệ thống, vui lòng thử lại sau!");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div 
                className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300"
                style={{
                    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)"
                }}
            >
                {/* Header */}
                <div className="relative px-8 pt-8 pb-6 text-center">
                    <button 
                        onClick={onClose}
                        className="absolute right-6 top-6 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <ShieldCheck className="w-8 h-8 text-indigo-500" />
                    </div>
                    
                    <h3 className="text-xl font-black text-slate-800 tracking-tight">Đổi mật khẩu</h3>
                    <p className="text-xs text-slate-400 mt-1">Cập nhật mật khẩu để bảo mật tài khoản của bạn</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-4">
                    {error && (
                        <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-[11px] font-bold animate-in slide-in-from-top-2">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            {error}
                        </div>
                    )}

                    <Input
                        label="Mật khẩu hiện tại"
                        name="oldPassword"
                        type="password"
                        required
                        value={formData.oldPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        icon={<Lock className="w-4 h-4" />}
                    />

                    <Input
                        label="Mật khẩu mới"
                        name="newPassword"
                        type="password"
                        required
                        value={formData.newPassword}
                        onChange={handleChange}
                        placeholder="Ít nhất 6 ký tự"
                        icon={<Lock className="w-4 h-4" />}
                    />

                    <Input
                        label="Xác nhận mật khẩu mới"
                        name="confirmPassword"
                        type="password"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        icon={<Lock className="w-4 h-4" />}
                    />

                    <div className="pt-4 flex gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="flex-1 font-bold text-xs"
                        >
                            Hủy bỏ
                        </Button>
                        <Button
                            type="submit"
                            isLoading={isLoading}
                            icon={!isLoading ? <Save className="w-4 h-4" /> : undefined}
                            className="flex-1 font-bold text-xs"
                        >
                            Cập nhật
                        </Button>
                    </div>
                </form>

                {/* Footer Info */}
                <div className="bg-slate-50/50 p-4 border-t border-slate-100 text-center">
                    <p className="text-[10px] text-slate-400 font-medium">
                        Nếu bạn quên mật khẩu, hãy liên hệ quản trị viên hoặc sử dụng chức năng Quên mật khẩu.
                    </p>
                </div>
            </div>
        </div>
    );
}
