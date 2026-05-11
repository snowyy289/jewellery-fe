/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AdminPageHeader } from "@/components/layouts/admin/shared";
import { stockImportService } from "@/services/admin/stockImportService";
import { supplierService } from "@/services/admin/supplierService";
import { productService } from "@/services/admin/productService";
import { StockImport } from "@/types/stock-import";
import { Supplier } from "@/types/supplier";
import { Product } from "@/types/product";
import FormStockImportEdit from "./FormStockImportEdit";

export default function EditStockImportPage() {
    const params = useParams();
    const id = params.id as string;
    const [isFetching, setIsFetching] = useState(true);
    const [stockImport, setStockImport] = useState<StockImport | null>(null);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            const [stockImportRes, suppliersRes, productsRes] = await Promise.all([
                stockImportService.getStockImportDetail(id),
                supplierService.getSuppliers({ status: "active" }),
                productService.getProducts({ status: "active", limit: 1000 })
            ]);

            console.log("📦 Stock import response:", stockImportRes);
            console.log("🏢 Suppliers response:", suppliersRes);
            console.log("📦 Products response:", productsRes);

            if (stockImportRes.code === 200 || stockImportRes.code === "success") {
                const importData = stockImportRes.stockImport || stockImportRes.data;
                console.log("✅ Setting stock import:", importData);
                setStockImport(importData || null);
            }
            if (suppliersRes.code === 200 || suppliersRes.code === "success") {
                const suppliersList = suppliersRes.suppliers || suppliersRes.data || [];
                console.log("✅ Setting suppliers:", suppliersList);
                setSuppliers(suppliersList);
            }
            if (productsRes.code === 200 || productsRes.code === "success") {
                const productsList = productsRes.products || productsRes.data || [];
                console.log("✅ Setting products:", productsList);
                setProducts(productsList);
            }
        } catch (error) {
            console.error("💥 Fetch data error:", error);
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
                title="Chỉnh sửa phiếu nhập kho"
                subTitle={stockImport ? `Mã phiếu: ${stockImport.import_code}` : "Đang tải..."}
                backHref="/admin/stock-imports"
            />

            <FormStockImportEdit 
                stockImport={stockImport} 
                id={id}
                suppliers={suppliers} 
                products={products} 
            />
        </div>
    );
}
