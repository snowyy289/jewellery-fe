"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Key, Save, X, ShieldCheck } from "lucide-react";
import Button from "@/components/button/Button";
import Input from "@/components/input/Input";
import Textarea from "@/components/input/Textarea";
import { AdminCard } from "@/components/layouts/admin/shared";
import { permissionService } from "@/services/admin/permissionService";
import { Permission } from "@/types/permission";
import { toast } from "sonner";

interface FormPermissionEditProps {
    permission: Permission | null;
    id: string;
}

export default function FormPermissionEdit({ permission, id }: FormPermissionEditProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const formData = new FormData(e.target as HTMLFormElement);
            const data = Object.fromEntries(formData.entries());
            const res = await permissionService.updatePermission(id, data);
            if (res.code === "success") {
                toast.success("Cập nhật quyền thành công!");
                router.push("/admin/permissions");
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
            {/* Left Col */}
            <div className="lg:col-span-1 space-y-6">
                <AdminCard title="Định danh quyền" subTitle="Thông tin hiện tại">
                    <div className="flex flex-col items-center text-center p-4">
                        <div className="w-24 h-24 rounded-4xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-6 shadow-sm shadow-indigo-100 relative group">
                             <Key className="w-12 h-12 text-indigo-500 transition-transform duration-500 group-hover:rotate-12" />
                             <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-indigo-600 border-4 border-white flex items-center justify-center">
                                <ShieldCheck className="w-3.5 h-3.5 text-white" />
                             </div>
                        </div>
                        <h4 className="text-base font-black text-slate-800 uppercase tracking-tight mb-2">
                            {permission?.value || "Value"}
                        </h4>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-wider">Hệ thống ghi nhận</span>
                        </div>
                    </div>
                </AdminCard>
                
                <div className="p-6 rounded-4xl bg-amber-50 border border-amber-100 text-amber-800">
                    <p className="text-xs font-bold leading-relaxed">
                        ⚠️ Cảnh báo: Thay đổi mã quyền (Value) có thể làm các phần code đang sử dụng mã này không hoạt động chính xác. Hãy chắc chắn bạn đã cập nhật cả mã nguồn nếu thay đổi nó.
                    </p>
                </div>
            </div>

            {/* Right Col */}
            <div className="lg:col-span-2 space-y-6">
                <AdminCard title="Cập nhật chi tiết">
                    <div className="space-y-6">
                        <Input 
                            label="Tên quyền (Hiển thị)"
                            name="title"
                            defaultValue={permission?.title}
                            placeholder="Ví dụ: Thêm sản phẩm mới..."
                            icon={<ShieldCheck className="w-4 h-4" />}
                            required
                        />

                        <Input 
                            label="Mã quyền (Value)"
                            name="value"
                            defaultValue={permission?.value}
                            placeholder="Ví dụ: product-create..."
                            icon={<Key className="w-4 h-4" />}
                            required
                            hint="Cẩn thận khi thay đổi mã này."
                        />

                        <Textarea 
                            label="Mô tả kỹ thuật"
                            name="description"
                            defaultValue={permission?.description}
                            placeholder="Mô tả chi tiết quyền hạn..."
                        />
                    </div>
                </AdminCard>

                <div className="flex items-center justify-end gap-4 p-2">
                    <Button 
                        variant="outline" 
                        icon={<X className="w-4 h-4" />}
                        onClick={() => router.push("/admin/permissions")}
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
