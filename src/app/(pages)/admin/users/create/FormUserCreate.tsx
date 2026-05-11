"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Save, User, X, Mail, Phone, Lock, Shield, Eye, EyeOff, Image as ImageIcon } from "lucide-react";
import Button from "@/components/button/Button";
import Input from "@/components/input/Input";
import Select from "@/components/input/Select";
import { AdminCard } from "@/components/layouts/admin/shared";
import { userService } from "@/services/admin/userService";
import { roleService } from "@/services/admin/roleService";
import { Role } from "@/types/role";
import { toast } from "sonner";
import Image from "next/image";

export default function FormUserCreate() {
    const [isLoading, setIsLoading] = useState(false);
    const [roles, setRoles] = useState<Role[]>([]);
    const [showPassword, setShowPassword] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const res = await roleService.getRoles();
                console.log("🔐 Roles response:", res);
                if (res.code === 200 || res.code === "success") {
                    const rolesList = res.roles || res.data || [];
                    console.log("✅ Setting roles:", rolesList);
                    setRoles(rolesList);
                }
            } catch (error) {
                console.error("💥 Fetch roles error:", error);
            }
        };
        fetchRoles();
    }, []);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setAvatarPreview(url);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const formElement = e.target as HTMLFormElement;
            const formData = new FormData(formElement);
            const res = await userService.createUser(formData);
            if (res.code === 200 || res.code === 201 || res.code === "success") {
                toast.success("Tạo người dùng thành công!");
                router.push("/admin/users");
            } else {
                toast.error(res.message);
            }
        } catch {
            toast.error("Lỗi khi tạo người dùng!");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Avatar card */}
            <div className="lg:col-span-1 space-y-6">
                <AdminCard title="Ảnh đại diện" subTitle="Hình ảnh hiển thị của tài khoản">
                    <div className="flex flex-col items-center gap-4 py-2">
                        <div className="relative group cursor-pointer">
                            <label htmlFor="avatar-upload" className="cursor-pointer">
                                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg group-hover:shadow-indigo-100 transition-all">
                                    {avatarPreview ? (
                                        <Image
                                            src={avatarPreview}
                                            alt="Avatar preview"
                                            width={112}
                                            height={112}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-linear-to-br from-indigo-100 to-purple-100 flex flex-col items-center justify-center">
                                            <ImageIcon className="w-8 h-8 text-indigo-300 mb-1" />
                                            <span className="text-[9px] text-indigo-400 font-bold uppercase tracking-wider">Upload</span>
                                        </div>
                                    )}
                                </div>
                                <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-indigo-600 border-4 border-white flex items-center justify-center shadow-md">
                                    <ImageIcon className="w-3.5 h-3.5 text-white" />
                                </div>
                            </label>
                            <input
                                id="avatar-upload"
                                name="avatar"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleAvatarChange}
                            />
                        </div>
                        <p className="text-[11px] text-slate-400 text-center">
                            Nhấn vào ảnh để tải lên.<br />
                            <span className="font-semibold">JPG, PNG, WEBP</span> — tối đa 5MB
                        </p>
                    </div>
                </AdminCard>

                {/* Info tip card */}
                <div className="p-6 rounded-[2.5rem] bg-slate-900 text-white relative overflow-hidden shadow-xl shadow-slate-200">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="relative z-10 space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                                <Shield className="w-5 h-5 text-indigo-400" />
                            </div>
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest text-white">Lưu ý bảo mật</p>
                                <p className="text-[10px] text-slate-500 font-bold mt-0.5 uppercase tracking-widest">Mật khẩu mặc định</p>
                            </div>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                            Mật khẩu phải có ít nhất 6 ký tự. Hãy thông báo cho người dùng sau khi tạo tài khoản.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right: form fields */}
            <div className="lg:col-span-2 space-y-6">
                <AdminCard title="Thông tin cơ bản">
                    <div className="space-y-5">
                        <Input
                            label="Họ và tên"
                            name="fullName"
                            placeholder="Nguyễn Văn A..."
                            icon={<User className="w-4 h-4" />}
                            required
                        />
                        <Input
                            label="Email"
                            name="email"
                            type="email"
                            placeholder="example@email.com"
                            icon={<Mail className="w-4 h-4" />}
                            required
                        />
                        <Input
                            label="Số điện thoại"
                            name="phone"
                            placeholder="0901 234 567"
                            icon={<Phone className="w-4 h-4" />}
                        />
                        <div className="relative">
                            <Input
                                label="Mật khẩu"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Tối thiểu 6 ký tự..."
                                icon={<Lock className="w-4 h-4" />}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-9 text-slate-400 hover:text-indigo-500 transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                </AdminCard>

                <AdminCard title="Phân quyền & Trạng thái">
                    <div className="space-y-5">
                        <Select
                            label="Vai trò"
                            name="role_id"
                            icon={<Shield className="w-4 h-4" />}
                        >
                            <option value="">-- Chọn vai trò --</option>
                            {roles.map((role) => (
                                <option key={role._id} value={role._id}>{role.name}</option>
                            ))}
                        </Select>

                        <Select
                            label="Trạng thái"
                            name="status"
                        >
                            <option value="active">Hoạt động</option>
                            <option value="inactive">Ngừng hoạt động</option>
                        </Select>
                    </div>
                </AdminCard>

                <div className="flex items-center justify-end gap-4 p-2">
                    <Button
                        variant="outline"
                        icon={<X className="w-4 h-4" />}
                        onClick={() => router.push("/admin/users")}
                    >
                        Hủy bỏ
                    </Button>
                    <Button
                        type="submit"
                        isLoading={isLoading}
                        icon={<Save className="w-4 h-4" />}
                        className="px-10"
                    >
                        Tạo người dùng
                    </Button>
                </div>
            </div>
        </form>
    );
}
