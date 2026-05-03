"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { AdminPageHeader } from "@/components/layouts/admin/shared";
import { permissionService } from "@/services/admin/permissionService";
import { Permission } from "@/types/permission";
import FormPermissionEdit from "./FormPermissionEdit";

export default function EditPermissionPage() {
    const [isFetching, setIsFetching] = useState(true);
    const [permission, setPermission] = useState<Permission | null>(null);
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const fetchPermission = useCallback(async () => {
        try {
            const res = await permissionService.getPermissions();
            if (res.code === "success") {
                const found = res.permissions.find((p: Permission) => p._id === id);
                if (found) {
                    setPermission(found);
                } else {
                    alert("Không tìm thấy dữ liệu quyền!");
                    router.push("/admin/permissions");
                }
            }
        } catch {
            console.error("Fetch data error");
        } finally {
            setIsFetching(false);
        }
    }, [id, router]);

    useEffect(() => {
        if (id) fetchPermission();
    }, [id, fetchPermission]);

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
                title="Chỉnh sửa mã quyền"
                subTitle={`Đang cập nhật mã: ${permission?.value}`}
                backHref="/admin/permissions"
            />

            <FormPermissionEdit permission={permission} id={id} />
        </div>
    );
}
