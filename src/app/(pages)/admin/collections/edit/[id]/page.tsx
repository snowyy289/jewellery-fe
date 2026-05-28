/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AdminPageHeader } from "@/components/layouts/admin/shared";
import { collectionService } from "@/services/admin/collectionService";
import { Collection } from "@/types/collection";
import { Product } from "@/types/product";
import FormCollectionEdit from "./FormCollectionEdit";
import { productService } from "@/services/admin/productService";

export default function EditCollectionPage() {
    const params = useParams();
    const [isFetching, setIsFetching] = useState(true);
    const [collection, setCollection] = useState<Collection | null>(null);
    const [products, setProducts] = useState<Product[]>([]);

    const fetchCollection = async () => {
        try {
            const res = await collectionService.getCollection(params.id as string);
            const collectionData = res.collection || res.data;
            if ((res.code === "success" || res.code === 200 || res.code === "200") && collectionData) {
                setCollection(collectionData);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsFetching(false);
        }
    };

    const fetchProducts = async () => {
        try {
            const res = await productService.getProducts({ limit: 1000 });
            if (res.code === 200 || res.code === "success") {
                setProducts(res.data || []);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    useEffect(() => {
        const init = async () => {
            await Promise.all([fetchCollection(), fetchProducts()]);
        };
        init();
    }, []);

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

    if (!collection) return <div>Bộ sưu tập không tồn tại</div>;

    return (
        <div className="w-full space-y-6 pb-10">
            <AdminPageHeader
                title="Chỉnh sửa bộ sưu tập"
                subTitle={`Cập nhật thông tin: ${collection.title}`}
                backHref="/admin/collections"
            />
            <FormCollectionEdit collection={collection} products={products} />
        </div>
    );
}
