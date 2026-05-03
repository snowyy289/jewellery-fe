"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Shield, X, Info, Edit3 } from "lucide-react";
import Button from "@/components/button/Button";
import Input from "@/components/input/Input";
import Textarea from "@/components/input/Textarea";
import { AdminCard } from "@/components/layouts/admin/shared";
import { roleService } from "@/services/admin/roleService";
import { Role } from "@/types/role";
import { toast } from "sonner";

interface FormRoleEditProps {
    role: Role | null;
    id: string;
}

export default function FormRoleEdit({ role, id }: FormRoleEditProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const formData = new FormData(e.target as HTMLFormElement);
            const data = Object.fromEntries(formData.entries());
            const res = await roleService.updateRole(id, data);
            if (res.code === "success") {
                toast.success("Cập nhật nhóm quyền thành công!");
                router.push("/admin/roles");
            } else {
                toast.error(res.message);
            }
        } catch {
            toast.error("Lỗi khi cập nhật!");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Col: Identity */}
            <div className="lg:col-span-1 space-y-6">
                <AdminCard title="Thông tin vai trò" subTitle="Nhận diện nhóm quyền hiện tại">
                    <div className="flex flex-col items-center text-center p-4">
                        <div className="w-24 h-24 rounded-[2.5rem] bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-6 shadow-sm shadow-indigo-100 relative group">
                             <Shield className="w-12 h-12 text-indigo-500 transition-transform duration-500 group-hover:rotate-12" />
                             <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-indigo-600 border-4 border-white flex items-center justify-center">
                                <Edit3 className="w-3.5 h-3.5 text-white" />
                             </div>
                        </div>
                        <h4 className="text-base font-black text-slate-800 uppercase tracking-tight mb-2">
                            {role?.name || "Loading..."}
                        </h4>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider">Đang hoạt động</span>
                        </div>
                    </div>
                </AdminCard>

                <div className="p-6 rounded-[2.5rem] bg-slate-900 text-white relative overflow-hidden shadow-xl shadow-slate-200">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="relative z-10 space-y-4">
                        <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                                <Info className="w-5 h-5 text-indigo-400" />
                             </div>
                             <div>
                                <p className="text-xs font-black uppercase tracking-widest text-white">Chỉnh sửa</p>
                                <p className="text-[10px] text-slate-500 font-bold mt-0.5 uppercase tracking-widest">Cập nhật cẩn thận</p>
                             </div>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                            Việc thay đổi tên hoặc mô tả vai trò có thể làm nhân viên bị nhầm lẫn về phạm vi công việc của họ.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Col: Fields */}
            <div className="lg:col-span-2 space-y-6">
                <AdminCard title="Cập nhật chi tiết">
                    <div className="space-y-6">
                        <Input 
                            label="Tên nhóm quyền"
                            name="name"
                            defaultValue={role?.name || ""}
                            placeholder="Ví dụ: Quản lý bán hàng..."
                            icon={<Shield className="w-4 h-4" />}
                            required
                        />

                        <Textarea 
                            label="Mô tả chi tiết"
                            name="description"
                            defaultValue={role?.description || ""}
                            placeholder="Mô tả trách nhiệm chi tiết..."
                            hint="Cung cấp mô tả rõ ràng giúp quản trị viên dễ dàng phân biệt giữa các vai trò"
                        />
                    </div>
                </AdminCard>

                <div className="flex items-center justify-end gap-4 p-2">
                    <Button 
                        variant="outline" 
                        icon={<X className="w-4 h-4" />}
                        onClick={() => router.push("/admin/roles")}
                    >
                        Hủy bỏ
                    </Button>
                    <Button 
                        type="submit" 
                        isLoading={isLoading}
                        icon={<Save className="w-4 h-4" />}
                        className="px-10"
                    >
                        Lưu thay đổi
                    </Button>
                </div>
            </div>
        </form>
    );
}
