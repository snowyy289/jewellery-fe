"use client";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Shield, Edit2, Trash2, MoreVertical, Plus, Settings } from "lucide-react";
import Button from "@/components/button/Button";
import { AdminPageHeader, AdminCard } from "@/components/layouts/admin/shared";
import { roleService } from "@/services/admin/roleService";
import { permissionService } from "@/services/admin/permissionService";
import { Role } from "@/types/role";
import { Permission } from "@/types/permission";
import { toast } from "sonner";
import Search from "@/components/search/Search";
import Pagination from "@/components/pagination/Pagination";

function RolesContent() {
    const searchParams = useSearchParams();
    const [roles, setRoles] = useState<Role[]>([]);
    const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPage: 1
    });

    useEffect(() => {
        const params = Object.fromEntries(searchParams.entries());
        fetchRoles(params);
    }, [searchParams]);

    const fetchRoles = async (params: Record<string, string | number | boolean> = {}) => {
        setIsLoading(true);
        try {
            const [rolesRes, permsRes] = await Promise.all([
                roleService.getRoles(params),
                permissionService.getPermissions()
            ]);

            console.log("🔐 Roles response:", rolesRes);
            console.log("🔑 Permissions response:", permsRes);

            if (rolesRes.code === 200 || rolesRes.code === "success") {
                const rolesList = rolesRes.data || rolesRes.roles || [];
                console.log("✅ Setting roles:", rolesList);
                setRoles(rolesList);
                if(rolesRes.pagination) {
                    setPagination({
                        currentPage: rolesRes.pagination.currentPage,
                        totalPage: rolesRes.pagination.totalPage
                    });
                }
            }
            if (permsRes.code === 200 || permsRes.code === "success") {
                const permsList = permsRes.data || permsRes.permissionList || [];
                console.log("✅ Setting permissions:", permsList);
                setAllPermissions(permsList);
            }
        } catch (error) {
            console.error("💥 Fetch data error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Bạn có chắc chắn muốn xóa nhóm quyền này?")) {
            try {
                const res = await roleService.deleteRole(id);
                if (res.code === 200 || res.code === "success") {
                    toast.success("Xóa thành công!");
                    const params = Object.fromEntries(searchParams.entries());
                    fetchRoles(params);
                } else {
                    toast.error(res.message);
                }
            } catch {
                toast.error("Lỗi khi xóa!");
            }
        }
    };

    return (
        <div className="w-full space-y-6 pb-10">
            <AdminPageHeader
                title="Phân quyền hệ thống"
                subTitle="Quản lý vai trò và các quyền truy cập tài nguyên của thành viên."
                actions={
                    <div className="flex items-center gap-3">
                        <Link href="/admin/roles/permissions">
                            <Button variant="outline" size="sm" icon={<Settings className="w-4 h-4" />}>
                                Phân Quyền
                            </Button>
                        </Link>
                        <Link href="/admin/roles/create">
                            <Button size="sm" icon={<Plus className="w-4 h-4" />}>
                                Thêm Mới
                            </Button>
                        </Link>
                    </div>
                }
            />

            {/* Quick Search Tool */}
            <div className="flex justify-end">
                <Search />
            </div>

            {/* Table Section */}
            <AdminCard noPadding title="Tất cả nhóm quyền" subTitle={`${roles.length} vai trò đang hoạt động`}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-16">STT</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nhóm Quyền</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Danh sách quyền</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mô Tả</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin border-indigo-500/20" style={{ borderTopColor: "#6366f1" }} />
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Đang tải dữ liệu...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : roles.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center text-slate-400 italic font-medium">
                                        Chưa có nhóm quyền nào được tạo.
                                    </td>
                                </tr>
                            ) : (
                                roles.map((role, index) => (
                                    <tr key={role._id} className="group hover:bg-indigo-50/30 transition-all duration-300">
                                        <td className="px-8 py-4 text-xs font-black text-slate-300 tabular-nums">
                                            {(index + 1).toString().padStart(2, '0')}
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100 shadow-sm group-hover:scale-110 transition-all">
                                                    <Shield className="w-5 h-5 text-indigo-500 font-bold" />
                                                </div>
                                                <div>
                                                    <span className="text-sm font-bold text-slate-800 transition-colors group-hover:text-indigo-600 uppercase tracking-tight">
                                                        {role.name}
                                                    </span>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex flex-wrap gap-1.5 max-w-[300px]">
                                                {role.permissions && role.permissions.length > 0 ? (
                                                    <>
                                                        {role.permissions.slice(0, 3).map(pVal => {
                                                            const pInfo = allPermissions.find(p => p.value === pVal);
                                                            return (
                                                                <span key={pVal} className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md text-[10px] font-bold border border-indigo-100/50">
                                                                    {pInfo?.title || pVal}
                                                                </span>
                                                            );
                                                        })}
                                                        {role.permissions.length > 3 && (
                                                            <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md text-[10px] font-bold">
                                                                +{role.permissions.length - 3} khác
                                                            </span>
                                                        )}
                                                    </>
                                                ) : (
                                                    <span className="text-[10px] font-medium text-slate-400 italic">Chưa phân quyền</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <p className="text-xs text-slate-500 font-medium line-clamp-1 max-w-xs">{role.description || "Chưa có mô tả chi tiết cho vai trò này"}</p>
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex items-center justify-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                                                <Link href={`/admin/roles/edit/${role._id}`}>
                                                    <button className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-white hover:text-indigo-600 hover:shadow-md border border-transparent hover:border-slate-100 transition-all">
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                </Link>
                                                <button 
                                                    onClick={() => handleDelete(role._id)}
                                                    className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-white hover:text-rose-600 hover:shadow-md border border-transparent hover:border-slate-100 transition-all"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                                <button className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-white hover:text-slate-900 hover:shadow-md border border-transparent hover:border-slate-100 transition-all">
                                                    <MoreVertical className="w-4 h-4" />
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
                        Hiển thị {roles.length} nhóm quyền trên hệ thống
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

export default function RolesPage() {
    return (
        <Suspense fallback={<div>Đang tải...</div>}>
            <RolesContent />
        </Suspense>
    );
}
