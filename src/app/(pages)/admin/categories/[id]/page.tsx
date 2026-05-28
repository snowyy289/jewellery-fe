"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { AdminPageHeader } from "@/components/layouts/admin/shared";
import { categoryService } from "@/services/admin/categoryService";
import { Category } from "@/types/category";
import FormCategoryEdit from "@/app/(pages)/admin/categories/edit/[id]/FormCategoryEdit";
import { toast } from "sonner";

export default function CategoryDetailPage() {
    const [isFetching, setIsFetching] = useState(true);
    const [categories, setCategories] = useState<Category[]>([]);
    const [category, setCategory] = useState<Category | null>(null);
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const fetchData = useCallback(async () => {
        try {
            const res = await categoryService.getCategories();
            
            if (res.code === 200) {
                const categoriesList = res.data || res.categories || [];
                
                setCategories(categoriesList.filter((cat: Category) => cat._id !== id));
                const found = categoriesList.find((cat: Category) => cat._id === id);
                if (found) {
                    setCategory(found);
                } else {
                    toast.error("Không tìm thấy danh mục!");
                    router.push("/admin/categories");
                }
            }
        } catch (error) {
            console.error("Fetch data error:", error);
        } finally {
            setIsFetching(false);
        }
    }, [id, router]);

    useEffect(() => {
        if (id) fetchData();
    }, [id, fetchData]);

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
                title="Chi tiết danh mục"
                subTitle={`Thông tin chi tiết cho ${category?.title || "danh mục"}`}
                backHref="/admin/categories"
            />

            <div className="pointer-events-none opacity-90 select-none [&_button[type=submit]]:hidden">
                <FormCategoryEdit category={category} id={id} categories={categories} />
            </div>
        </div>
    );
}
