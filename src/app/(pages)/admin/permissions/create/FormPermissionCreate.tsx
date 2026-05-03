"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Key, Save, X, ShieldCheck } from "lucide-react";
import Button from "@/components/button/Button";
import Input from "@/components/input/Input";
import Textarea from "@/components/input/Textarea";
import { AdminCard } from "@/components/layouts/admin/shared";
import { permissionService } from "@/services/admin/permissionService";
import { toast } from "sonner";

export default function FormPermissionCreate() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const formData = new FormData(e.target as HTMLFormElement);
            const data = Object.fromEntries(formData.entries());
            const res = await permissionService.createPermission(data);
            if (res.code === "success") {
                toast.success("Tạo quyền thành công!");
                router.push("/admin/permissions");
            } else {
                toast.error(res.message);
            }
        } catch {
            toast.error("Lỗi khi tạo quyền!");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Col */}
            <div className="lg:col-span-1 space-y-6">
                <AdminCard title="Mã Quyền Hệ Thống" subTitle="Định danh duy nhất">
                    <div className="flex flex-col items-center text-center p-4">
                        <div className="w-20 h-20 rounded-4xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-6 shadow-sm shadow-indigo-100">
                             <Key className="w-10 h-10 text-indigo-500" />
                        </div>
                        <h4 className="text-sm font-bold text-slate-800 uppercase tracking-tight mb-2">Định nghĩa mã nội bộ</h4>
                        <p className="text-xs text-slate-500 leading-relaxed px-4">
                            Mã quyền (Value) nên tuân theo định dạng `module-action` như `product-create` hoặc `order-edit`.
                        </p>
                    </div>
                </AdminCard>
            </div>

            {/* Right Col */}
            <div className="lg:col-span-2 space-y-6">
                <AdminCard title="Chi tiết quyền hạn">
                    <div className="space-y-6">
                        <Input 
                            label="Tên quyền (Hiển thị)"
                            name="title"
                            placeholder="Ví dụ: Thêm sản phẩm mới, Xem đơn hàng..."
                            icon={<ShieldCheck className="w-4 h-4" />}
                            required
                        />

                        <Input 
                            label="Mã quyền (Internal Value)"
                            name="value"
                            placeholder="Ví dụ: product-create, order-view..."
                            icon={<Key className="w-4 h-4" />}
                            required
                            hint="Mã này dùng để phân quyền trong code."
                        />

                        <Textarea 
                            label="Mô tả kỹ thuật"
                            name="description"
                            placeholder="Mô tả chi tiết quyền này cho phép làm gì..."
                            hint="Tối đa 255 ký tự"
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
                        Tạo mã quyền
                    </Button>
                </div>
            </div>
        </form>
    );
}
