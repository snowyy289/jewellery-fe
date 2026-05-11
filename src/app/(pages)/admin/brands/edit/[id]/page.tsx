/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AdminPageHeader } from "@/components/layouts/admin/shared";
import { brandService } from "@/services/admin/brandService";
import { Brand } from "@/types/brand";
import FormBrandEdit from "./FormBrandEdit";
import { toast } from "sonner";

export default function EditBrandPage() {
    const params = useParams();
    const id = params.id as string;
    const [isFetching, setIsFetching] = useState(true);
    const [brand, setBrand] = useState<Brand | null>(null);

    useEffect(() => {
        fetchBrand();
    }, [id]);

    const fetchBrand = async () => {
        try {
            // Note: Currently backend doesn't have a specific detail API for brand, 
            // but we can fetch all and filter, or we should add a detail API.
            // Let's assume the getBrands API returns it if we search, 
            // or we just fetch the list and find it.
            // Wait, I should add a detail API in backend brand controller.
            // For now, I will fetch all and find the one. This is a temporary workaround.
            const res = await brandService.getBrands();
            if (res.code === 200 || res.code === "success") {
                // Backend trả về 'data' chứ không phải 'brands'
                const brandsList = res.data || res.brands || [];
                const found = brandsList.find((b: Brand) => b._id === id);
                if (found) {
                    setBrand(found);
                } else {
                    toast.error("Không tìm thấy thương hiệu!");
                }
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

    if (!brand) return (
        <div className="flex items-center justify-center h-[60vh]">
            <div className="text-center">
                <p className="text-lg font-bold text-slate-700">Không tìm thấy thương hiệu</p>
                <p className="text-sm text-slate-500 mt-2">Thương hiệu không tồn tại hoặc đã bị xóa</p>
            </div>
        </div>
    );

    return (
        <div className="w-full space-y-6 pb-10">
            <AdminPageHeader
                title="Chỉnh sửa thương hiệu"
                subTitle={`Cập nhật thông tin cho: ${brand.title}`}
                backHref="/admin/brands"
            />

            <FormBrandEdit brand={brand} id={id} />
        </div>
    );
}
