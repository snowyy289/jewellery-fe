"use client";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Image as ImageIcon, Edit2, Trash2, Plus, Star } from "lucide-react";
import Image from "next/image";
import Button from "@/components/button/Button";
import { AdminPageHeader, AdminCard } from "@/components/layouts/admin/shared";
import { collectionService } from "@/services/admin/collectionService";
import { Collection } from "@/types/collection";
import { toast } from "sonner";
import Search from "@/components/search/Search";
import FilterStatus from "@/components/filter/FilterStatus";
import Pagination from "@/components/pagination/Pagination";

function CollectionsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [collections, setCollections] = useState<Collection[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPage: 1
    });

    useEffect(() => {
        const params = Object.fromEntries(searchParams.entries());
        fetchCollections(params);
    }, [searchParams]);

    const fetchCollections = async (params: Record<string, string | number | boolean> = {}) => {
        setIsLoading(true);
        try {
            const res = await collectionService.getCollections(`?${new URLSearchParams(params as any).toString()}`);
            if (res.code === 200 || res.code === 201 || res.code === "success") {
                setCollections(res.data || []);
                if (res.pagination) {
                    setPagination({
                        currentPage: res.pagination.currentPage,
                        totalPage: res.pagination.totalPage
                    });
                }
            }
        } catch {
            console.error("Fetch collections error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Bạn có chắc chắn muốn xóa bộ sưu tập này?")) {
            try {
                const res = await collectionService.deleteCollection(id);
                if (res.code === 200 || res.code === 201 || res.code === "success") {
                    toast.success("Xóa thành công!");
                    const params = Object.fromEntries(searchParams.entries());
                    fetchCollections(params);
                } else {
                    toast.error(res.message);
                }
            } catch {
                toast.error("Lỗi khi xóa!");
            }
        }
    };

    const handleFeaturedChange = async (id: string, featured: boolean) => {
        // Assume there's a quick patch API for it, or just use edit API
        // For simplicity, we can ignore this or just show it if read-only
    };

    return (
        <div className="w-full space-y-6 pb-10">
            <AdminPageHeader
                title="Quản lý Bộ Sưu Tập"
                subTitle="Quản lý các bộ sưu tập đặc biệt trên hệ thống"
                actions={
                    <div className="flex items-center gap-3">
                        <Link href="/admin/collections/create">
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

            <AdminCard noPadding title="Tất cả Bộ sưu tập" subTitle={`${collections.length} bộ sưu tập hiện có`}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bộ Sưu Tập</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Số lượng SP</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nổi Bật</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trạng thái</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cập nhật</th>
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
                            ) : collections.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-8 py-20 text-center text-slate-400 italic font-medium">
                                        Chưa có bộ sưu tập nào được tạo.
                                    </td>
                                </tr>
                            ) : (
                                collections.map((item) => (
                                    <tr 
                                        key={item._id} 
                                        className="group hover:bg-indigo-50/30 transition-all duration-300 cursor-pointer"
                                        onClick={() => router.push(`/admin/collections/${item._id}`)}
                                    >
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 rounded-xl overflow-hidden shadow-sm group-hover:shadow-indigo-100 transition-all">
                                                    {item.thumbnail ? (
                                                        <Image 
                                                            src={item.thumbnail} 
                                                            alt={item.title} 
                                                            width={64} 
                                                            height={64} 
                                                            className="w-full h-full object-cover" 
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-slate-50 border border-slate-100">
                                                            <ImageIcon className="w-5 h-5 text-slate-300" />
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
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded w-fit">{item.products?.length || 0} sản phẩm</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            {item.featured ? (
                                                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                                            ) : (
                                                <Star className="w-5 h-5 text-slate-300" />
                                            )}
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
                                        <td className="px-8 py-4" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex items-center justify-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                                                <Link href={`/admin/collections/edit/${item._id}`}>
                                                    <button className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-white hover:text-indigo-600 hover:shadow-md border border-transparent hover:border-slate-100 transition-all">
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                </Link>
                                                <button 
                                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDelete(item._id); }}
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
                        Tổng cộng: {collections.length} bộ sưu tập
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

export default function CollectionsPage() {
    return (
        <Suspense fallback={<div>Đang tải...</div>}>
            <CollectionsContent />
        </Suspense>
    );
}
