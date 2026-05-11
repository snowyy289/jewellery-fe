"use client";
import { useEffect, useState } from "react";
import { AdminPageHeader } from "@/components/layouts/admin/shared";
import { categoryService } from "@/services/admin/categoryService";
import { Category } from "@/types/category";
import FormCategoryCreate from "./FormCategoryCreate";

export default function CreateCategoryPage() {
    const [isFetching, setIsFetching] = useState(true);
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        fetchParentCategories();
    }, []);

    const fetchParentCategories = async () => {
        try {
            const res = await categoryService.getCategories();
            if (res.code === 200) {
                // Backend trả về 'data' chứ không phải 'categories'
                const categoriesList = res.data || res.categories || [];
                setCategories(categoriesList);
            }
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
                title="Thêm danh mục mới"
                subTitle="Tạo cấu trúc nhóm sản phẩm mới cho cửa hàng của bạn"
                backHref="/admin/categories"
            />

            <FormCategoryCreate categories={categories} />
        </div>
    );
}
