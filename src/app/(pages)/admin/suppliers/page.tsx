"use client";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Truck, Edit2, Trash2, Plus, Phone, Mail } from "lucide-react";
import Button from "@/components/button/Button";
import { AdminPageHeader, AdminCard } from "@/components/layouts/admin/shared";
import { supplierService } from "@/services/admin/supplierService";
import { Supplier } from "@/types/supplier";
import { toast } from "sonner";
import Search from "@/components/search/Search";
import FilterStatus from "@/components/filter/FilterStatus";
import Pagination from "@/components/pagination/Pagination";

function SuppliersContent() {
    const searchParams = useSearchParams();
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPage: 1
    });

    useEffect(() => {
        const params = Object.fromEntries(searchParams.entries());
        fetchSuppliers(params);
    }, [searchParams]);

    const fetchSuppliers = async (params: Record<string, string | number | boolean> = {}) => {
        setIsLoading(true);
        try {
            const res = await supplierService.getSuppliers(params);
            if (res.code === "success") {
                setSuppliers(res.suppliers);
                if (res.pagination) {
                    setPagination({
                        currentPage: res.pagination.currentPage,
                        totalPage: res.pagination.totalPage
                    });
                }
            }
        } catch {
            console.error("Fetch suppliers error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Xóa nhà cung cấp này sẽ ẩn nó khỏi hệ thống. Bạn chắc chắn chứ?")) {
            try {
                const res = await supplierService.deleteSupplier(id);
                if (res.code === "success") {
                    toast.success("Xóa thành công!");
                    const params = Object.fromEntries(searchParams.entries());
                    fetchSuppliers(params);
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
                title="Quản lý nhà cung cấp"
                subTitle="Danh sách tất cả nhà cung cấp trong hệ thống"
                actions={
                    <div className="flex items-center gap-3">
                        <Link href="/admin/suppliers/create">
                            <Button size="sm" icon={<Plus className="w-4 h-4" />}>
                                Thêm nhà cung cấp
                            </Button>
                        </Link>
                    </div>
                }
            />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <FilterStatus />
                <Search />
            </div>

            <AdminCard noPadding title="Tất cả nhà cung cấp" subTitle={`${suppliers.length} nhà cung cấp hiện có`}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mã NCC</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tên nhà cung cấp</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Liên hệ</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Địa chỉ</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trạng thái</th>
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
                            ) : suppliers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-8 py-20 text-center text-slate-400 italic font-medium">
                                        Chưa có nhà cung cấp nào được tạo.
                                    </td>
                                </tr>
                            ) : (
                                suppliers.map((item) => (
                                    <tr key={item._id} className="group hover:bg-indigo-50/30 transition-all duration-300">
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                                                    <Truck className="w-5 h-5 text-indigo-600" />
                                                </div>
                                                <span className="text-sm font-black text-indigo-600">
                                                    {item.code}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex flex-col">
                                                <p className="text-sm font-bold text-slate-800 transition-colors group-hover:text-indigo-600">
                                                    {item.name}
                                                </p>
                                                {item.contact_person && (
                                                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                                                        Liên hệ: {item.contact_person}
                                                    </p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex flex-col gap-1">
                                                {item.phone && (
                                                    <div className="flex items-center gap-2 text-xs text-slate-600">
                                                        <Phone className="w-3 h-3 text-slate-400" />
                                                        {item.phone}
                                                    </div>
                                                )}
                                                {item.email && (
                                                    <div className="flex items-center gap-2 text-xs text-slate-600">
                                                        <Mail className="w-3 h-3 text-slate-400" />
                                                        {item.email}
                                                    </div>
                                                )}
                                                {!item.phone && !item.email && (
                                                    <span className="text-xs text-slate-300">—</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <span className="text-xs text-slate-500">
                                                {item.address || <span className="text-slate-300">—</span>}
                                            </span>
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${
                                                item.status === 'active' 
                                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                                    : 'bg-slate-50 text-slate-500 border-slate-100'
                                            }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'active' ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]' : 'bg-slate-400'}`} />
                                                {item.status === 'active' ? 'Hoạt động' : 'Dừng'}
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex items-center justify-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                                                <Link href={`/admin/suppliers/edit/${item._id}`}>
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

                <div className="px-8 py-4 bg-slate-50/30 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Tổng cộng: {suppliers.length} nhà cung cấp
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

export default function SuppliersPage() {
    return (
        <Suspense fallback={<div>Đang tải...</div>}>
            <SuppliersContent />
        </Suspense>
    );
}
