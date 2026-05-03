"use client";
import { AdminPageHeader } from "@/components/layouts/admin/shared";
import FormBannerCreate from "./FormBannerCreate";

export default function CreateBannerPage() {
    return (
        <div className="w-full space-y-6 pb-10">
            <AdminPageHeader
                title="Thêm banner mới"
                subTitle="Tạo banner quảng cáo cho website"
                backHref="/admin/banners"
            />
            <FormBannerCreate />
        </div>
    );
}
