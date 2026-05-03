"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AdminPageHeader } from "@/components/layouts/admin/shared";
import { supplierService } from "@/services/admin/supplierService";
import { Supplier } from "@/types/supplier";
import FormSupplierEdit from "./FormSupplierEdit";
import { toast } from "sonner";

export default function EditSupplierPage() {
    const params = useParams();
    const id = params.id as string;
    const [isFetching, setIsFetching] = useState(true);
    const [supplier, setSupplier] = useState<Supplier | null>(null);

    useEffect(() => {
        fetchSupplier();
    }, [id]);

    const fetchSupplier = async () => {
        try {
            const res = await supplierService.getSupplierDetail(id);
            if (res.code === "success") {
                setSupplier(res.supplier);
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Lỗi khi tải dữ liệu!");
        } finally {
            setIsFetching(false);
        }
    };

    if (isFetching) return (
        <div className="flex items-center justify-center h-[60vh]">
            <div className="flex flex-col items-center gap-4">
                <div
                    className="w-12 h-12 rounded-full border-2 border-t-transparent animate-spin"
                    style={{ borderColor: "rgba(99,102,241,0.2)", borderTopColor: "#6366f1" }}
                />
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Đang tải dữ liệu...</p>
            </div>
        </div>
    );

    if (!supplier) return (
        <div className="flex items-center justify-center h-[60vh]">
            <div className="text-center">
                <p className="text-lg font-bold text-slate-700">Không tìm thấy nhà cung cấp</p>
                <p className="text-sm text-slate-500 mt-2">Nhà cung cấp không tồn tại hoặc đã bị xóa</p>
            </div>
        </div>
    );

    return (
        <div className="w-full space-y-6 pb-10">
            <AdminPageHeader
                title="Chỉnh sửa nhà cung cấp"
                subTitle={`Cập nhật thông tin cho: ${supplier.name}`}
                backHref="/admin/suppliers"
            />

            <FormSupplierEdit supplier={supplier} id={id} />
        </div>
    );
}
