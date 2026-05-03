"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { AdminPageHeader } from "@/components/layouts/admin/shared";
import { userService } from "@/services/admin/userService";
import { AdminUser } from "@/types/user";
import FormUserEdit from "./FormUserEdit";
import { toast } from "sonner";

export default function EditUserPage() {
    const [isFetching, setIsFetching] = useState(true);
    const [user, setUser] = useState<AdminUser | null>(null);
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const fetchData = useCallback(async () => {
        try {
            const res = await userService.getUserDetail(id);
            if (res.code === "success") {
                setUser(res.user);
            } else {
                toast.error("Không tìm thấy người dùng!");
                router.push("/admin/users");
            }
        } catch {
            console.error("Fetch user error");
        } finally {
            setIsFetching(false);
        }
    }, [id, router]);

    useEffect(() => {
        if (id) fetchData();
    }, [id, fetchData]);

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
                title="Chỉnh sửa người dùng"
                subTitle={`Cập nhật thông tin cho ${user?.fullName || "người dùng"}`}
                backHref="/admin/users"
            />
            <FormUserEdit user={user} id={id} />
        </div>
    );
}
