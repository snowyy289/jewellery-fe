"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AdminPageHeader } from "@/components/layouts/admin/shared";
import { stockExportService } from "@/services/admin/stockExportService";
import { productService } from "@/services/admin/productService";
import { StockExport } from "@/types/stock-export";
import { Product } from "@/types/product";
import FormStockExportEdit from "./FormStockExportEdit";

export default function EditStockExportPage() {
    const params = useParams();
    const id = params.id as string;
    const [isFetching, setIsFetching] = useState(true);
    const [stockExport, setStockExport] = useState<StockExport | null>(null);
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            const [stockExportRes, productsRes] = await Promise.all([
                stockExportService.getStockExportDetail(id),
                productService.getProducts({ status: "active", limit: 1000 })
            ]);

            if (stockExportRes.code === "success") {
                setStockExport(stockExportRes.stockExport);
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
                title="Chỉnh sửa phiếu xuất kho"
                subTitle={stockExport ? `Mã phiếu: ${stockExport.export_code}` : "Đang tải..."}
                backHref="/admin/stock-exports"
            />

            <FormStockExportEdit 
                stockExport={stockExport} 
                id={id}
                products={products} 
            />
        </div>
    );
}
