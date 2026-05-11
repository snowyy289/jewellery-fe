"use client";
import React from "react";
import { AdminPageHeader } from "@/components/layouts/admin/shared";
import FormRoleCreate from "./FormRoleCreate";

export default function CreateRolePage() {
    return (
        <div className="w-full space-y-6 pb-10">
            <AdminPageHeader
                title="Tạo nhóm quyền mới"
                subTitle="Thiết lập các vai trò mới để quản lý quyền hạn thành viên"
                backHref="/admin/roles"
            />

            <FormRoleCreate />
        </div>
    );
}
