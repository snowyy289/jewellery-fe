"use client";
import { useEffect, useState } from "react";
import { AdminPageHeader } from "@/components/layouts/admin/shared";
import { productService } from "@/services/admin/productService";
import { Product } from "@/types/product";
import FormStockExportCreate from "./FormStockExportCreate";

export default function CreateStockExportPage() {
    const [isFetching, setIsFetching] = useState(true);
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const productsRes = await productService.getProducts({ status: "active", limit: 1000 });

            if (productsRes.code === "success") {
                setProducts(productsRes.products);
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
                title="Tạo phiếu xuất kho"
                subTitle="Tạo phiếu xuất hàng mới"
                backHref="/admin/stock-exports"
            />

            <FormStockExportCreate products={products} />
        </div>
    );
}
