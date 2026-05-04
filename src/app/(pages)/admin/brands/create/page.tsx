"use client";
import { AdminPageHeader } from "@/components/layouts/admin/shared";
import FormBrandCreate from "./FormBrandCreate";

export default function CreateBrandPage() {
    return (
        <div className="w-full space-y-6 pb-10">
            <AdminPageHeader
                title="Thêm thương hiệu mới"
                subTitle="Tạo thương hiệu trang sức mới cho cửa hàng của bạn"
                backHref="/admin/brands"
            />

            <FormBrandCreate />
        </div>
    );
}
