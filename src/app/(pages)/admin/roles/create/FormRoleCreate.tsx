"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Save, X, Info } from "lucide-react";
import Button from "@/components/button/Button";
import Input from "@/components/input/Input";
import Textarea from "@/components/input/Textarea";
import { AdminCard } from "@/components/layouts/admin/shared";
import { roleService } from "@/services/admin/roleService";
import { toast } from "sonner";

export default function FormRoleCreate() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const formData = new FormData(e.target as HTMLFormElement);
            // Convert formData to object since shared service might expect object for JSON API
            const data = Object.fromEntries(formData.entries());
            const res = await roleService.createRole(data);
            if (res.code === "success") {
                toast.success("Tạo nhóm quyền thành công!");
                router.push("/admin/roles");
            } else {
                toast.error(res.message);
            }
        } catch {
            toast.error("Lỗi khi tạo nhóm quyền!");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Col: Summary & Info */}
            <div className="lg:col-span-1 space-y-6">
                <AdminCard title="Vai trò mới" subTitle="Thông tin định danh của nhóm quyền">
                    <div className="flex flex-col items-center text-center p-4">
                        <div className="w-20 h-20 rounded-4xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-6 shadow-sm shadow-indigo-100">
                             <Shield className="w-10 h-10 text-indigo-500" />
                        </div>
                        <h4 className="text-sm font-bold text-slate-800 uppercase tracking-tight mb-2">Đang tạo vai trò</h4>
                        <p className="text-xs text-slate-500 leading-relaxed px-4">
                            Tên nhóm quyền nên ngắn gọn và mang tính mô tả rõ ràng như &quot;Quản trị viên&quot;, &quot;Biên tập viên&quot;, v.v.
                        </p>
                    </div>
                </AdminCard>

                <div className="p-6 rounded-3xl bg-indigo-900 text-white relative overflow-hidden shadow-xl shadow-indigo-200">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full pointer-events-none" />
                    <div className="relative z-10 space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                             <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center border border-white/10">
                                <Info className="w-4 h-4 text-indigo-200" />
                             </div>
                             <span className="text-xs font-black uppercase tracking-widest text-indigo-100">Lưu ý bảo mật</span>
                        </div>
                        <p className="text-xs text-indigo-200 leading-relaxed">
                            Mỗi nhóm quyền sẽ có quyền truy cập khác nhau vào hệ thống. Sau khi tạo xong, bạn cần vào menu **&quot;Phân Quyền&quot;** để thiết lập chi tiết.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Col: Fields */}
            <div className="lg:col-span-2 space-y-6">
                <AdminCard title="Chi tiết vai trò">
                    <div className="space-y-6">
                        <Input 
                            label="Tên nhóm quyền"
                            name="name"
                            placeholder="Ví dụ: Quản lý cửa hàng, Content Creator..."
                            icon={<Shield className="w-4 h-4" />}
                            required
                        />

                        <Textarea 
                            label="Mô tả chi tiết"
                            name="description"
                            placeholder="Mô tả trách nhiệm hoặc giới hạn của nhóm quyền này..."
                            hint="Tối đa 255 ký tự"
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
                        Tạo vai trò
                    </Button>
                </div>
            </div>
        </form>
    );
}
