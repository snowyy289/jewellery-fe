"use client";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Users, Edit2, Trash2, Plus, UserCheck, UserX, Shield } from "lucide-react";
import Button from "@/components/button/Button";
import { AdminPageHeader, AdminCard } from "@/components/layouts/admin/shared";
import { userService } from "@/services/admin/userService";
import { AdminUser } from "@/types/user";
import { toast } from "sonner";
import Search from "@/components/search/Search";
import FilterStatus from "@/components/filter/FilterStatus";
import Pagination from "@/components/pagination/Pagination";

function UsersContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPage: 1
    });

    useEffect(() => {
        const params = Object.fromEntries(searchParams.entries());
        fetchUsers(params);
    }, [searchParams]);

    const fetchUsers = async (params: Record<string, string | number | boolean> = {}) => {
        setIsLoading(true);
        try {
            const res = await userService.getUsers(params);
            if (res.code === 200) {
                setUsers(res.data || res.users || []);
                if (res.pagination) {
                    setPagination({
                        currentPage: res.pagination.currentPage,
                        totalPage: res.pagination.totalPage
                    });
                }
            }
        } catch {
            console.error("Fetch users error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (confirm(`Bạn chắc chắn muốn xóa người dùng "${name}"?`)) {
            try {
                const res = await userService.deleteUser(id);
                if (res.code === 200) {
                    toast.success("Xóa người dùng thành công!");
                    const params = Object.fromEntries(searchParams.entries());
                    fetchUsers(params);
                } else {
                    toast.error(res.message);
                }
            } catch {
                toast.error("Lỗi khi xóa người dùng!");
            }
        }
    };

    const activeCount = users.filter((u) => u.status === "active").length;
    const inactiveCount = users.filter((u) => u.status === "inactive").length;

    return (
        <div className="w-full space-y-6 pb-10">
            <AdminPageHeader
                title="Quản lý người dùng"
                subTitle="Quản lý danh sách tài khoản trong hệ thống"
                actions={
                    <div className="flex items-center gap-3">
                        <Link href="/admin/users/create">
                            <Button size="sm" icon={<Plus className="w-4 h-4" />}>
                                Thêm mới
                            </Button>
                        </Link>
                    </div>
                }
            />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <FilterStatus />
                <Search />
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center">
                        <Users className="w-6 h-6 text-indigo-500" />
                    </div>
                    <div>
                        <p className="text-2xl font-black text-slate-800">{users.length}</p>
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">Tổng người dùng</p>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                        <UserCheck className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                        <p className="text-2xl font-black text-slate-800">{activeCount}</p>
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">Đang hoạt động</p>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center">
                        <UserX className="w-6 h-6 text-rose-400" />
                    </div>
                    <div>
                        <p className="text-2xl font-black text-slate-800">{inactiveCount}</p>
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">Ngừng hoạt động</p>
                    </div>
                </div>
            </div>

            <AdminCard noPadding title="Danh sách người dùng" subTitle={`${users.length} tài khoản hiện có`}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Người dùng</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Liên hệ</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Vai trò</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trạng thái</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ngày tạo</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin border-indigo-500/20" style={{ borderTopColor: "#6366f1" }} />
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Đang tải...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center">
                                                <Users className="w-8 h-8 text-slate-300" />
                                            </div>
                                            <p className="text-slate-400 italic font-medium">Chưa có người dùng nào.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                users.map((item) => (
                                    <tr 
                                        key={item._id} 
                                        className="group hover:bg-indigo-50/30 transition-all duration-300 cursor-pointer"
                                        onClick={() => router.push(`/admin/users/${item._id}`)}
                                    >
                                        {/* Avatar + Name */}
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full overflow-hidden shadow-sm border-2 border-white group-hover:border-indigo-100 transition-all shrink-0">
                                                    {item.avatar ? (
                                                        <Image
                                                            src={item.avatar}
                                                            alt={item.fullName}
                                                            width={48}
                                                            height={48}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-indigo-100 to-purple-100">
                                                            <span className="text-sm font-black text-indigo-500">
                                                                {item.fullName?.charAt(0)?.toUpperCase() || "U"}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                                                        {item.fullName}
                                                    </p>
                                                    <p className="text-[11px] text-slate-400">{item.email}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Phone */}
                                        <td className="px-8 py-4">
                                            <span className="text-xs text-slate-500 font-medium">
                                                {item.phone || <span className="text-slate-300">—</span>}
                                            </span>
                                        </td>

                                        {/* Role */}
                                        <td className="px-8 py-4">
                                            {item.role_id && typeof item.role_id === "object" ? (
                                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100">
                                                    <Shield className="w-3 h-3 text-indigo-400" />
                                                    <span className="text-[11px] font-bold text-indigo-600">{item.role_id.name}</span>
                                                </div>
                                            ) : (
                                                <span className="text-slate-300 text-xs">—</span>
                                            )}
                                        </td>

                                        {/* Status */}
                                        <td className="px-8 py-4">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${
                                                item.status === "active"
                                                    ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                                    : "bg-slate-50 text-slate-500 border-slate-100"
                                            }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${
                                                    item.status === "active" ? "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]" : "bg-slate-400"
                                                }`} />
                                                {item.status === "active" ? "Hoạt động" : "Dừng"}
                                            </div>
                                        </td>

                                        {/* CreatedAt */}
                                        <td className="px-8 py-4">
                                            <span className="text-[11px] text-slate-400">
                                                {item.createdAt ? new Date(item.createdAt).toLocaleDateString("vi-VN", {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric",
                                                }) : "—"}
                                            </span>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-8 py-4" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex items-center justify-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                                                <Link href={`/admin/users/edit/${item._id}`}>
                                                    <button className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-white hover:text-indigo-600 hover:shadow-md border border-transparent hover:border-slate-100 transition-all">
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                </Link>
                                                <button
                                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDelete(item._id, item.fullName); }}
                                                    className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-white hover:text-rose-600 hover:shadow-md border border-transparent hover:border-slate-100 transition-all"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="px-8 py-4 bg-slate-50/30 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Tổng cộng: {users.length} người dùng
                    </p>
                </div>

                <Pagination 
                    totalPage={pagination.totalPage} 
                    currentPage={pagination.currentPage} 
                />
            </AdminCard>
        </div>
    );
}

export default function UsersPage() {
    return (
        <Suspense fallback={<div>Đang tải...</div>}>
            <UsersContent />
        </Suspense>
    );
}
