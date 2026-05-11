/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AdminPageHeader } from "@/components/layouts/admin/shared";
import { bannerService } from "@/services/admin/bannerService";
import { Banner } from "@/types/banner";
import FormBannerEdit from "./FormBannerEdit";

export default function EditBannerPage() {
    const params = useParams();
    const [isFetching, setIsFetching] = useState(true);
    const [banner, setBanner] = useState<Banner | null>(null);

    useEffect(() => {
        fetchBanner();
    }, []);

    const fetchBanner = async () => {
        try {
            const res = await bannerService.getBannerDetail(params.id as string);
            const bannerData = res.banner || res.data;
            if ((res.code === "success" || res.code === 200 || res.code === "200") && bannerData) {
                setBanner(bannerData);
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

    if (!banner) return <div>Banner không tồn tại</div>;

    return (
        <div className="w-full space-y-6 pb-10">
            <AdminPageHeader
                title="Chỉnh sửa banner"
                subTitle={`Cập nhật thông tin: ${banner.title}`}
                backHref="/admin/banners"
            />
            <FormBannerEdit banner={banner} />
        </div>
    );
}
