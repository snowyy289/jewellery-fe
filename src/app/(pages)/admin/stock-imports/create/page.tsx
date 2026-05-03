"use client";
import { useEffect, useState } from "react";
import { AdminPageHeader } from "@/components/layouts/admin/shared";
import { supplierService } from "@/services/admin/supplierService";
import { productService } from "@/services/admin/productService";
import { Supplier } from "@/types/supplier";
import { Product } from "@/types/product";
import FormStockImportCreate from "./FormStockImportCreate";

export default function CreateStockImportPage() {
    const [isFetching, setIsFetching] = useState(true);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [suppliersRes, productsRes] = await Promise.all([
                supplierService.getSuppliers({ status: "active" }),
                productService.getProducts({ status: "active", limit: 1000 })
            ]);

            if (suppliersRes.code === "success") {
                setSuppliers(suppliersRes.suppliers);
            }
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
                title="Tạo phiếu nhập kho"
                subTitle="Tạo phiếu nhập hàng mới từ nhà cung cấp"
                backHref="/admin/stock-imports"
            />

            <FormStockImportCreate suppliers={suppliers} products={products} />
        </div>
    );
}
