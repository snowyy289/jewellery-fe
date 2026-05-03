"use client";
import { AdminPageHeader } from "@/components/layouts/admin/shared";
import FormSupplierCreate from "./FormSupplierCreate";

export default function CreateSupplierPage() {
    return (
        <div className="w-full space-y-6 pb-10">
            <AdminPageHeader
                title="Thêm nhà cung cấp mới"
                subTitle="Tạo nhà cung cấp mới cho hệ thống"
                backHref="/admin/suppliers"
            />

            <FormSupplierCreate />
        </div>
    );
}
