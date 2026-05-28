/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AdminPageHeader } from "@/components/layouts/admin/shared";
import { collectionService } from "@/services/admin/collectionService";
import { Collection } from "@/types/collection";
import FormCollectionEdit from "@/app/(pages)/admin/collections/edit/[id]/FormCollectionEdit";

export default function CollectionDetailPage() {
    const params = useParams();
    const [isFetching, setIsFetching] = useState(true);
    const [collection, setCollection] = useState<Collection | null>(null);

    useEffect(() => {
        fetchCollection();
    }, []);

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
                title="Chi tiết bộ sưu tập"
                subTitle={`Thông tin chi tiết: ${collection.title}`}
                backHref="/admin/collections"
            />
            <div className="pointer-events-none opacity-90 select-none [&_button[type=submit]]:hidden">
                <FormCollectionEdit collection={collection} products={collection.products || []} />
            </div>
        </div>
    );
}
