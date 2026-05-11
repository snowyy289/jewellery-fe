"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { AdminPageHeader } from "@/components/layouts/admin/shared";
import { categoryService } from "@/services/admin/categoryService";
import { Category } from "@/types/category";
import FormCategoryEdit from "./FormCategoryEdit";
import { toast } from "sonner";

export default function EditCategoryPage() {
    const [isFetching, setIsFetching] = useState(true);
    const [categories, setCategories] = useState<Category[]>([]);
    const [category, setCategory] = useState<Category | null>(null);
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const fetchData = useCallback(async () => {
        try {
            console.log("🔍 [EDIT] Fetching categories...");
            const res = await categoryService.getCategories();
            console.log("📦 [EDIT] Response:", res);
            console.log("📊 [EDIT] Response code:", res.code, "Type:", typeof res.code);
            
            if (res.code === 200) {
                console.log("✅ [EDIT] Code is 200, setting data...");
                // Backend trả về 'data' chứ không phải 'categories'
                const categoriesList = res.data || res.categories || [];
                console.log("📋 [EDIT] Categories list:", categoriesList);
                
                setCategories(categoriesList.filter((cat: Category) => cat._id !== id));
                const found = categoriesList.find((cat: Category) => cat._id === id);
                if (found) {
                    console.log("✅ [EDIT] Found category:", found);
                    setCategory(found);
                } else {
                    console.log("❌ [EDIT] Category not found with id:", id);
                    toast.error("Không tìm thấy danh mục!");
                    router.push("/admin/categories");
                }
            } else {
                console.log("❌ [EDIT] Code is NOT 200, got:", res.code);
            }
        } catch (error) {
            console.error("💥 [EDIT] Fetch data error:", error);
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
                title="Chỉnh sửa danh mục"
                subTitle={`Chỉnh sửa thông tin cho ${category?.title || "danh mục"}`}
                backHref="/admin/categories"
            />

            <FormCategoryEdit category={category} id={id} categories={categories} />
        </div>
    );
}
