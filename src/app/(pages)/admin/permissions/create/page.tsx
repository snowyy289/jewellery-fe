"use client";
import React from "react";
import { AdminPageHeader } from "@/components/layouts/admin/shared";
import FormPermissionCreate from "./FormPermissionCreate";

export default function CreatePermissionPage() {
    return (
        <div className="w-full space-y-6 pb-10">
            <AdminPageHeader
                title="Định nghĩa Quyền mới"
                subTitle="Tạo mã quyền hệ thống mới để sử dụng trong phân quyền."
                backHref="/admin/permissions"
            />

            <FormPermissionCreate />
        </div>
    );
}
