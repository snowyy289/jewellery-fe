"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { AdminPageHeader } from "@/components/layouts/admin/shared";
import { roleService } from "@/services/admin/roleService";
import { Role } from "@/types/role";
import FormRoleEdit from "./FormRoleEdit";

export default function EditRolePage() {
    const [isFetching, setIsFetching] = useState(true);
    const [role, setRole] = useState<Role | null>(null);
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const fetchRole = useCallback(async () => {
        try {
            const res = await roleService.getRoles();
            console.log("🔐 Roles response:", res);
            if (res.code === 200 || res.code === "success") {
                const rolesList = res.roles || res.data || [];
                const found = rolesList.find((r: Role) => r._id === id);
                if (found) {
                    setRole(found);
                } else {
                    alert("Không tìm thấy dữ liệu vai trò!");
                    router.push("/admin/roles");
                }
            }
        } catch (error) {
            console.error("💥 Fetch data error:", error);
        } finally {
            setIsFetching(false);
        }
    }, [id, router]);

    useEffect(() => {
        if (id) fetchRole();
    }, [id, fetchRole]);

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
                title="Chỉnh sửa vai trò"
                subTitle={`Chỉnh sửa cấu hình cho nhóm quyền: ${role?.name}`}
                backHref="/admin/roles"
            />

            <FormRoleEdit role={role} id={id} />
        </div>
    );
}
