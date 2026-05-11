"use client";
import { useEffect, useState } from "react";
import { AdminPageHeader } from "@/components/layouts/admin/shared";
import { categoryService } from "@/services/admin/categoryService";
import { brandService } from "@/services/admin/brandService";
import { Category } from "@/types/category";
import { Brand } from "@/types/brand";
import FormProductCreate from "./FormProductCreate";

export default function CreateProductPage() {
    const [isFetching, setIsFetching] = useState(true);
    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [catRes, brandRes] = await Promise.all([
                categoryService.getCategories({ status: "active" }),
                brandService.getBrands({ status: "active" })
            ]);
            
            // Backend trả về 'data' chứ không phải 'categories' hay 'brands'
            if (catRes.code === 200) setCategories(catRes.data || catRes.categories || []);
            if (brandRes.code === 200) setBrands(brandRes.data || brandRes.brands || []);
        } catch (error) {
            console.error(error);
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

    return (
        <div className="w-full space-y-6 pb-10">
            <AdminPageHeader
                title="Thêm sản phẩm mới"
                subTitle="Tạo sản phẩm mới cho cửa hàng của bạn"
                backHref="/admin/products"
            />

            <FormProductCreate categories={categories} brands={brands} />
        </div>
    );
}
