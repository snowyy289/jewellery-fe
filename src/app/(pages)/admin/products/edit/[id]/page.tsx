/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AdminPageHeader } from "@/components/layouts/admin/shared";
import { productService } from "@/services/admin/productService";
import { categoryService } from "@/services/admin/categoryService";
import { brandService } from "@/services/admin/brandService";
import { Product } from "@/types/product";
import { Category } from "@/types/category";
import { Brand } from "@/types/brand";
import FormProductEdit from "./FormProductEdit";
import { toast } from "sonner";

export default function EditProductPage() {
    const params = useParams();
    const id = params.id as string;
    const [isFetching, setIsFetching] = useState(true);
    const [product, setProduct] = useState<Product | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            const [productRes, categoriesRes, brandsRes] = await Promise.all([
                productService.getProductDetail(id),
                categoryService.getCategories({ status: "active" }),
                brandService.getBrands({ status: "active" })
            ]);

            if (productRes.code === 200 || productRes.code === "success") {
                const prod = productRes.product || productRes.data || null;
                console.log("📦 Product data:", prod);
                setProduct(prod);
            } else {
                toast.error(productRes.message);
            }

            if (categoriesRes.code === 200 || categoriesRes.code === "success") {
                setCategories(categoriesRes.data || categoriesRes.categories || []);
            }

            if (brandsRes.code === 200 || brandsRes.code === "success") {
                setBrands(brandsRes.data || brandsRes.brands || []);
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

    if (!product) return (
        <div className="flex items-center justify-center h-[60vh]">
            <div className="text-center">
                <p className="text-lg font-bold text-slate-700">Không tìm thấy sản phẩm</p>
                <p className="text-sm text-slate-500 mt-2">Sản phẩm không tồn tại hoặc đã bị xóa</p>
            </div>
        </div>
    );

    return (
        <div className="w-full space-y-6 pb-10">
            <AdminPageHeader
                title="Chỉnh sửa sản phẩm"
                subTitle={`Cập nhật thông tin cho: ${product.title}`}
                backHref="/admin/products"
            />

            <FormProductEdit product={product} id={id} categories={categories} brands={brands} />
        </div>
    );
}
