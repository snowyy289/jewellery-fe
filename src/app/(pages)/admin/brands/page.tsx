"use client";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Tags, Edit2, Trash2, Plus } from "lucide-react";
import Image from "next/image";
import Button from "@/components/button/Button";
import { AdminPageHeader, AdminCard } from "@/components/layouts/admin/shared";
import { brandService } from "@/services/admin/brandService";
import { Brand } from "@/types/brand";
import { toast } from "sonner";
import Search from "@/components/search/Search";
import FilterStatus from "@/components/filter/FilterStatus";
import Pagination from "@/components/pagination/Pagination";

function BrandsContent() {
    const searchParams = useSearchParams();
    const [brands, setBrands] = useState<Brand[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPage: 1
    });

    useEffect(() => {
        const params = Object.fromEntries(searchParams.entries());
        fetchBrands(params);
    }, [searchParams]);

    const fetchBrands = async (params: Record<string, string | number | boolean> = {}) => {
        setIsLoading(true);
        try {
            const res = await brandService.getBrands(params);
            if (res.code === "success") {
                setBrands(res.brands);
                if (res.pagination) {
                    setPagination({
                        currentPage: res.pagination.currentPage,
                        totalPage: res.pagination.totalPage
                    });
                }
            }
        } catch {
            console.error("Fetch brands error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Xóa thương hiệu này có thể ảnh hưởng đến các sản phẩm liên quan. Bạn chắc chắn chứ?")) {
            try {
                const res = await brandService.deleteBrand(id);
                if (res.code === "success") {
                    toast.success("Xóa thành công!");
                    const params = Object.fromEntries(searchParams.entries());
                    fetchBrands(params);
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
                title="Thương hiệu sản phẩm"
                subTitle="Quản lý các hãng trang sức của hệ thống"
                actions={
                    <div className="flex items-center gap-3">
                        <Link href="/admin/brands/create">
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

            <AdminCard noPadding title="Tất cả thương hiệu" subTitle={`${brands.length} thương hiệu hiện có`}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Thương hiệu</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sản phẩm</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Vị trí</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trạng thái</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tạo bởi</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cập nhật</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={7} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin border-indigo-500/20" style={{ borderTopColor: "#6366f1" }} />
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Đang tải...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : brands.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-8 py-20 text-center text-slate-400 italic font-medium">
                                        Chưa có thương hiệu nào được tạo.
                                    </td>
                                </tr>
                            ) : (
                                brands.map((item) => (
                                    <tr key={item._id} className="group hover:bg-indigo-50/30 transition-all duration-300">
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm group-hover:shadow-indigo-100 transition-all">
                                                    {item.thumbnail ? (
                                                        <Image 
                                                            src={item.thumbnail} 
                                                            alt={item.title} 
                                                            width={48} 
                                                            height={48} 
                                                            className="w-full h-full object-cover" 
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-slate-50 border border-slate-100">
                                                            <Tags className="w-5 h-5 text-slate-300" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-800 transition-colors group-hover:text-indigo-600">
                                                        {item.title}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <span className="text-xs font-bold text-slate-500">
                                                {item.productCount || 0} SP
                                            </span>
                                        </td>
                                        <td className="px-8 py-4">
                                            <span className="text-xs font-black text-slate-500 tabular-nums">
                                                {(item.position ?? 0).toString().padStart(2, '0')}
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
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-slate-700">{item.createBy?.fullName || '—'}</span>
                                                <span className="text-[10px] text-slate-400 italic">
                                                    {item.createdAt ? new Date(item.createdAt).toLocaleString('vi-VN', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    }) : '—'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-slate-700">{item.updateBy?.fullName || '—'}</span>
                                                <span className="text-[10px] text-slate-400 italic">
                                                    {item.updatedAt ? new Date(item.updatedAt).toLocaleString('vi-VN', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    }) : '—'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex items-center justify-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                                                <Link href={`/admin/brands/edit/${item._id}`}>
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
                        Tổng cộng: {brands.length} thương hiệu
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

export default function BrandsPage() {
    return (
        <Suspense fallback={<div>Đang tải...</div>}>
            <BrandsContent />
        </Suspense>
    );
}
