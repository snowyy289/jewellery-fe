"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Truck, Activity, Save, X, User, Phone, Mail, MapPin, FileText, Building, Edit3 } from "lucide-react";
import Button from "@/components/button/Button";
import Input from "@/components/input/Input";
import Textarea from "@/components/input/Textarea";
import { AdminCard } from "@/components/layouts/admin/shared";
import { supplierService } from "@/services/admin/supplierService";
import { Supplier } from "@/types/supplier";
import { toast } from "sonner";

interface FormSupplierEditProps {
    supplier: Supplier | null;
    id: string;
}

export default function FormSupplierEdit({ supplier, id }: FormSupplierEditProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const formData = new FormData(e.target as HTMLFormElement);
            const res = await supplierService.updateSupplier(id, formData);
            if (res.code === "success") {
                toast.success("Cập nhật nhà cung cấp thành công!");
                router.push("/admin/suppliers");
            } else {
                toast.error(res.message);
            }
        } catch {
            toast.error("Lỗi khi cập nhật nhà cung cấp!");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left col: Status */}
            <div className="lg:col-span-1 space-y-6">
                <AdminCard title="Trạng thái" subTitle="Cấu hình hoạt động">
                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-slate-700 ml-0.5 flex items-center gap-2">
                            <Activity className="w-4 h-4 text-slate-400" />
                            Trạng thái hoạt động
                        </label>
                        <div className="grid grid-cols-2 gap-3 p-1 bg-slate-100/50 rounded-2xl border border-slate-200/50">
                            <label className="cursor-pointer">
                                <input type="radio" name="status" value="active" defaultChecked={supplier?.status === 'active'} className="sr-only peer" />
                                <div className="py-2.5 text-center rounded-xl bg-transparent peer-checked:bg-white peer-checked:text-emerald-600 peer-checked:shadow-sm text-[10px] font-black uppercase tracking-widest text-slate-400 transition-all">
                                    Hoạt động
                                </div>
                            </label>
                            <label className="cursor-pointer">
                                <input type="radio" name="status" value="inactive" defaultChecked={supplier?.status === 'inactive'} className="sr-only peer" />
                                <div className="py-2.5 text-center rounded-xl bg-transparent peer-checked:bg-white peer-checked:text-rose-600 peer-checked:shadow-sm text-[10px] font-black uppercase tracking-widest text-slate-400 transition-all">
                                    Dừng
                                </div>
                            </label>
                        </div>
                    </div>
                </AdminCard>

                <AdminCard title="Ghi chú" subTitle="Thông tin bổ sung">
                    <Textarea 
                        label="Ghi chú"
                        name="notes"
                        defaultValue={supplier?.notes}
                        placeholder="Ghi chú về nhà cung cấp..."
                        rows={6}
                        hint="Tối đa 1000 ký tự"
                    />
                </AdminCard>
            </div>

            {/* Right col: Details */}
            <div className="lg:col-span-2 space-y-6">
                <AdminCard title="Thông tin chi tiết" subTitle={`Đang chỉnh sửa: ${supplier?.name}`}>
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input 
                                label="Tên nhà cung cấp"
                                name="name"
                                defaultValue={supplier?.name}
                                placeholder="Ví dụ: Công ty TNHH ABC..."
                                icon={<Edit3 className="w-4 h-4" />}
                                required
                            />

                            <Input 
                                label="Mã nhà cung cấp"
                                name="code"
                                defaultValue={supplier?.code}
                                placeholder="Ví dụ: NCC001"
                                icon={<FileText className="w-4 h-4" />}
                                required
                                hint="Mã định danh duy nhất"
                            />
                        </div>

                        <Input 
                            label="Người liên hệ"
                            name="contact_person"
                            defaultValue={supplier?.contact_person}
                            placeholder="Tên người liên hệ..."
                            icon={<User className="w-4 h-4" />}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input 
                                label="Số điện thoại"
                                name="phone"
                                type="tel"
                                defaultValue={supplier?.phone}
                                placeholder="0123456789"
                                icon={<Phone className="w-4 h-4" />}
                                hint="10-11 chữ số"
                            />

                            <Input 
                                label="Email"
                                name="email"
                                type="email"
                                defaultValue={supplier?.email}
                                placeholder="email@example.com"
                                icon={<Mail className="w-4 h-4" />}
                            />
                        </div>

                        <Input 
                            label="Địa chỉ"
                            name="address"
                            defaultValue={supplier?.address}
                            placeholder="Địa chỉ đầy đủ..."
                            icon={<MapPin className="w-4 h-4" />}
                        />

                        <Input 
                            label="Mã số thuế"
                            name="tax_code"
                            defaultValue={supplier?.tax_code}
                            placeholder="0123456789"
                            icon={<Building className="w-4 h-4" />}
                            hint="10-13 chữ số"
                        />
                    </div>
                </AdminCard>

                <div className="flex items-center justify-end gap-4 p-2">
                    <Button 
                        variant="outline" 
                        icon={<X className="w-4 h-4" />}
                        onClick={() => router.push("/admin/suppliers")}
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
