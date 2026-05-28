"use client";
import { useState, useEffect } from "react";
import { AdminPageHeader } from "@/components/layouts/admin/shared";
import FormCollectionCreate from "./FormCollectionCreate";
import { productService } from "@/services/admin/productService";
import { Product } from "@/types/product";
import { Loader2 } from "lucide-react";

export default function CreateCollectionPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Fetch up to 1000 products for selection to avoid pagination issues in admin
                const res = await productService.getProducts({ limit: 1000 });
                if (res.code === 200 || res.code === "success") {
                    setProducts(res.data || []);
                }
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    return (
        <div className="w-full space-y-6 pb-10">
            <AdminPageHeader
                title="Thêm Bộ Sưu Tập"
                subTitle="Tạo bộ sưu tập trang sức mới"
                backHref="/admin/collections"
            />
            <FormCollectionCreate products={products} />
        </div>
    );
}
