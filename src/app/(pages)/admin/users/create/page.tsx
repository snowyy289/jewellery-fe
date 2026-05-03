"use client";
import { AdminPageHeader } from "@/components/layouts/admin/shared";
import FormUserCreate from "./FormUserCreate";

export default function CreateUserPage() {
    return (
        <div className="w-full space-y-6 pb-10">
            <AdminPageHeader
                title="Thêm người dùng mới"
                subTitle="Tạo tài khoản người dùng trong hệ thống"
                backHref="/admin/users"
            />
            <FormUserCreate />
        </div>
    );
}
