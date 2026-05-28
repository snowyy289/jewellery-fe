"use client";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Image as ImageIcon, Edit2, Trash2, Plus, Eye, MousePointerClick } from "lucide-react";
import Image from "next/image";
import Button from "@/components/button/Button";
import { AdminPageHeader, AdminCard } from "@/components/layouts/admin/shared";
import { bannerService } from "@/services/admin/bannerService";
import { Banner } from "@/types/banner";
import { toast } from "sonner";
import Search from "@/components/search/Search";
import FilterStatus from "@/components/filter/FilterStatus";
import Pagination from "@/components/pagination/Pagination";

function BannersContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [banners, setBanners] = useState<Banner[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPage: 1
    });

    useEffect(() => {
        const params = Object.fromEntries(searchParams.entries());
        fetchBanners(params);
    }, [searchParams]);

    const fetchBanners = async (params: Record<string, string | number | boolean> = {}) => {
        setIsLoading(true);
        try {
            const res = await bannerService.getBanners(params);
            if (res.code === 200 || res.code === 201 || res.code === "success") {
                setBanners(res.banners || res.data || []);
                if (res.pagination) {
                    setPagination({
                        currentPage: res.pagination.currentPage,
                        totalPage: res.pagination.totalPage
                    });
                }
            }
        } catch {
            console.error("Fetch banners error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Bạn có chắc chắn muốn xóa banner này?")) {
            try {
                const res = await bannerService.deleteBanner(id);
                if (res.code === 200 || res.code === 201 || res.code === "success") {
                    toast.success("Xóa thành công!");
                    const params = Object.fromEntries(searchParams.entries());
                    fetchBanners(params);
                } else {
                    toast.error(res.message);
                }
            } catch {
                toast.error("Lỗi khi xóa!");
            }
        }
    };

    const getPositionBadge = (position: string) => {
        const styles: Record<string, string> = {
            'home-slider': 'bg-blue-50 text-blue-600 border-blue-100',
            'home-top': 'bg-indigo-50 text-indigo-600 border-indigo-100',
            'home-middle': 'bg-amber-50 text-amber-600 border-amber-100',
            'home-bottom': 'bg-purple-50 text-purple-600 border-purple-100',
            'sidebar': 'bg-slate-50 text-slate-600 border-slate-100'
        };
        const labels: Record<string, string> = {
            'home-slider': 'Slider Trang Chủ',
            'home-top': 'Đầu Trang Chủ',
            'home-middle': 'Giữa Trang Chủ',
            'home-bottom': 'Cuối Trang Chủ',
            'sidebar': 'Sidebar'
        };
        
        const style = styles[position] || 'bg-slate-50 text-slate-600 border-slate-100';
        const label = labels[position] || position;

        return (
            <div className={`inline-flex items-center px-2.5 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-wider ${style}`}>
                {label}
            </div>
        );
    };

    return (
        <div className="w-full space-y-6 pb-10">
            <AdminPageHeader
                title="Quản lý Banner"
                subTitle="Quản lý banner và slider hiển thị trên website"
                actions={
                    <div className="flex items-center gap-3">
                        <Link href="/admin/banners/create">
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

            <AdminCard noPadding title="Tất cả Banner" subTitle={`${banners.length} banner hiện có`}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Banner</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Vị trí</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Thứ tự</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trạng thái</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Analytics</th>
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
                            ) : banners.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-8 py-20 text-center text-slate-400 italic font-medium">
                                        Chưa có banner nào được tạo.
                                    </td>
                                </tr>
                            ) : (
                                banners.map((item) => (
                                    <tr 
                                        key={item._id} 
                                        className="group hover:bg-indigo-50/30 transition-all duration-300 cursor-pointer"
                                        onClick={() => router.push(`/admin/banners/${item._id}`)}
                                    >
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-32 h-16 rounded-xl overflow-hidden shadow-sm group-hover:shadow-indigo-100 transition-all">
                                                    {item.image ? (
                                                        <Image 
                                                            src={item.image} 
                                                            alt={item.title} 
                                                            width={128} 
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
                                                    {item.description && (
                                                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                                                            {item.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            {getPositionBadge(item.position)}
                                        </td>
                                        <td className="px-8 py-4">
                                            <span className="text-xs font-black text-slate-500 tabular-nums">
                                                {(item.order ?? 0).toString().padStart(2, '0')}
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
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                                    <Eye className="w-3.5 h-3.5" />
                                                    <span className="font-bold">{item.view_count}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                                    <MousePointerClick className="w-3.5 h-3.5" />
                                                    <span className="font-bold">{item.click_count}</span>
                                                </div>
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
                                                <Link href={`/admin/banners/edit/${item._id}`}>
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
                        Tổng cộng: {banners.length} banner
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

export default function BannersPage() {
    return (
        <Suspense fallback={<div>Đang tải...</div>}>
            <BannersContent />
        </Suspense>
    );
}
