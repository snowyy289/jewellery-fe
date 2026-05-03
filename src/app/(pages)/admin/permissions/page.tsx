"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Key, Edit2, Trash2, Plus, Search, ShieldCheck, RefreshCw } from "lucide-react";
import Button from "@/components/button/Button";
import Input from "@/components/input/Input";
import { AdminPageHeader, AdminCard } from "@/components/layouts/admin/shared";
import { permissionService } from "@/services/admin/permissionService";
import { Permission } from "@/types/permission";

export default function PermissionsPage() {
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);

    useEffect(() => {
        fetchPermissions();
    }, []);

    const fetchPermissions = async () => {
        setIsLoading(true);
        try {
            const res = await permissionService.getPermissions();
            if (res.code === "success") {
                setPermissions(res.permissions);
            }
        } catch {
            console.error("Fetch permissions error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Bạn có chắc chắn muốn xóa quyền này? Việc này có thể ảnh hưởng đến các nhóm quyền đang sử dụng nó.")) {
            try {
                const res = await permissionService.deletePermission(id);
                if (res.code === "success") {
                    alert("Xóa thành công!");
                    fetchPermissions();
                } else {
                    alert(res.message);
                }
            } catch {
                alert("Lỗi khi xóa!");
            }
        }
    };
    
    const handleSync = async () => {
        setIsSyncing(true);
        try {
            const res = await permissionService.syncPermissions();
            if (res.code === "success") {
                alert("Đồng bộ mã quyền hệ thống thành công!");
                fetchPermissions();
            } else {
                alert(res.message || "Lỗi khi đồng bộ!");
            }
        } catch {
            alert("Lỗi kết nối máy chủ!");
        } finally {
            setIsSyncing(false);
        }
    };

    return (
        <div className="w-full space-y-6 pb-10">
            <AdminPageHeader
                title="Quản lý danh sách Quyền"
                subTitle="Định nghĩa các mã quyền hệ thống để gán cho các nhóm vai trò."
                actions={
                    <div className="flex gap-3">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            isLoading={isSyncing}
                            icon={<RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />}
                            onClick={handleSync}
                        >
                            Đồng bộ mã quyền
                        </Button>
                        <Link href="/admin/permissions/create">
                            <Button size="sm" icon={<Plus className="w-4 h-4" />}>
                                Thêm Quyền Mới
                            </Button>
                        </Link>
                    </div>
                }
            />

            <AdminCard className="p-4! bg-indigo-50/20">
                <div className="max-w-md flex items-center gap-4">
                    <Input
                        placeholder="Tìm kiếm quyền theo tên hoặc mã..."
                        icon={<Search className="w-4 h-4" />}
                        className="py-2! bg-white border-slate-100 flex-1"
                    />
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group hover:text-indigo-500 hover:border-indigo-100 transition-all cursor-help" title="Mã khóa hệ thống">
                        <Key className="w-4 h-4" />
                    </div>
                </div>
            </AdminCard>

            <AdminCard noPadding title="Tất cả mã quyền" subTitle={`${permissions.length} quyền hệ thống`}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-16">STT</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tên Quyền</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mã (Value)</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mô tả</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin border-indigo-500/20" style={{ borderTopColor: "#6366f1" }} />
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Đang tải...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : permissions.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center text-slate-400 italic font-medium">
                                        Chưa có mã quyền nào được định nghĩa.
                                    </td>
                                </tr>
                            ) : (
                                permissions.map((item, index) => (
                                    <tr key={item._id} className="group hover:bg-indigo-50/30 transition-all duration-300">
                                        <td className="px-8 py-4 text-xs font-black text-slate-300 tabular-nums">
                                            {(index + 1).toString().padStart(2, '0')}
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center border border-indigo-100">
                                                    <ShieldCheck className="w-4 h-4 text-indigo-500" />
                                                </div>
                                                <span className="text-sm font-bold text-slate-800 transition-colors group-hover:text-indigo-600">
                                                    {item.title}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <code className="px-2 py-1 bg-slate-100 rounded text-[10px] font-bold text-slate-600 border border-slate-200">
                                                {item.value}
                                            </code>
                                        </td>
                                        <td className="px-8 py-4">
                                            <p className="text-xs text-slate-500 font-medium line-clamp-1 max-w-xs">{item.description || "---"}</p>
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex items-center justify-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                                                <Link href={`/admin/permissions/edit/${item._id}`}>
                                                    <button className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-white hover:text-indigo-600 hover:shadow-md border border-transparent hover:border-slate-100 transition-all">
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                </Link>
                                                <button 
                                                    onClick={() => handleDelete(item._id)}
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
            </AdminCard>
        </div>
    );
}
