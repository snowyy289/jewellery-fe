"use client";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Ticket, Edit2, Trash2, Plus, Percent, DollarSign } from "lucide-react";
import Button from "@/components/button/Button";
import { AdminPageHeader, AdminCard } from "@/components/layouts/admin/shared";
import { voucherService } from "@/services/admin/voucherService";
import { Voucher } from "@/types/voucher";
import { toast } from "sonner";
import Search from "@/components/search/Search";
import Pagination from "@/components/pagination/Pagination";

function VouchersContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [vouchers, setVouchers] = useState<Voucher[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPage: 1
    });

    useEffect(() => {
        const params = Object.fromEntries(searchParams.entries());
        fetchVouchers(params);
    }, [searchParams]);

    const fetchVouchers = async (params: Record<string, string | number | boolean> = {}) => {
        setIsLoading(true);
        try {
            const res = await voucherService.getVouchers(params);
            if (res.code === 200 || res.code === 201 || res.code === "success") {
                setVouchers(res.data || []);
                if (res.pagination) {
                    setPagination({
                        currentPage: res.pagination.currentPage,
                        totalPage: res.pagination.totalPages
                    });
                }
            }
        } catch {
            console.error("Fetch vouchers error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Bạn có chắc chắn muốn xóa mã giảm giá này?")) {
            try {
                const res = await voucherService.deleteVoucher(id);
                if (res.code === 200 || res.code === 201 || res.code === "success") {
                    toast.success("Xóa thành công!");
                    const params = Object.fromEntries(searchParams.entries());
                    fetchVouchers(params);
                } else {
                    toast.error(res.message);
                }
            } catch {
                toast.error("Lỗi khi xóa!");
            }
        }
    };

    const getStatusBadge = (status: string) => {
        const badges: Record<string, { bg: string; text: string; label: string }> = {
            'active': { bg: 'bg-emerald-50', text: 'text-emerald-600', label: 'Hoạt động' },
            'inactive': { bg: 'bg-rose-50', text: 'text-rose-600', label: 'Ngừng HĐ' }
        };
        const badge = badges[status] || badges.inactive;
        return (
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${badge.bg} ${badge.text} border-${badge.text.replace('text-', '')}/20`}>
                <span className={`w-1.5 h-1.5 rounded-full bg-current`} />
                {badge.label}
            </div>
        );
    };

    return (
        <div className="w-full space-y-6 pb-10">
            <AdminPageHeader
                title="Quản lý mã giảm giá"
                subTitle="Voucher & Coupon"
                actions={
                    <div className="flex items-center gap-3">
                        <Link href="/admin/vouchers/create">
                            <Button size="sm" icon={<Plus className="w-4 h-4" />}>
                                Thêm mới
                            </Button>
                        </Link>
                    </div>
                }
            />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <select className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 bg-white hover:border-indigo-300 transition-colors">
                        <option value="">Tất cả trạng thái</option>
                        <option value="active">Hoạt động</option>
                        <option value="inactive">Ngừng HĐ</option>
                    </select>
                    <select className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 bg-white hover:border-indigo-300 transition-colors">
                        <option value="">Tất cả loại giảm</option>
                        <option value="percent">Phần trăm (%)</option>
                        <option value="fixed">Tiền mặt</option>
                    </select>
                </div>
                <Search />
            </div>

            <AdminCard noPadding title="Tất cả mã giảm giá" subTitle={`${vouchers.length} mã hiện có`}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mã giảm giá</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Loại & Mức giảm</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Đơn tối thiểu</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sử dụng</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Thời gian</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trạng thái</th>
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
                            ) : vouchers.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-8 py-20 text-center text-slate-400 italic font-medium">
                                        Chưa có mã giảm giá nào.
                                    </td>
                                </tr>
                            ) : (
                                vouchers.map((item) => (
                                    <tr 
                                        key={item._id} 
                                        className="group hover:bg-indigo-50/30 transition-all duration-300 cursor-pointer"
                                        onClick={() => router.push(`/admin/vouchers/${item._id}`)}
                                    >
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-500">
                                                    <Ticket className="w-6 h-6" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-black text-slate-800 tracking-wider">
                                                        {item.code}
                                                    </p>
                                                    {item.description && (
                                                        <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1 max-w-[150px]">
                                                            {item.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-sm font-bold text-slate-800 flex items-center gap-1">
                                                    {item.discount_type === 'percent' ? (
                                                        <><Percent className="w-3.5 h-3.5 text-emerald-500"/> {item.discount_value}%</>
                                                    ) : (
                                                        <><DollarSign className="w-3.5 h-3.5 text-amber-500"/> {item.discount_value.toLocaleString('vi-VN')}đ</>
                                                    )}
                                                </span>
                                                {item.discount_type === 'percent' && item.max_discount && (
                                                    <span className="text-[10px] text-slate-400">
                                                        Tối đa {item.max_discount.toLocaleString('vi-VN')}đ
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <span className="text-xs font-bold text-slate-700">
                                                {item.min_order_value > 0 ? `${item.min_order_value.toLocaleString('vi-VN')}đ` : 'Mọi đơn hàng'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-slate-700">
                                                    {item.used_count} / {item.usage_limit === 0 ? '∞' : item.usage_limit}
                                                </span>
                                                {item.usage_limit > 0 && (
                                                    <div className="w-24 h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                                                        <div 
                                                            className="h-full bg-indigo-500 rounded-full" 
                                                            style={{ width: `${Math.min(100, (item.used_count / item.usage_limit) * 100)}%` }}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex flex-col text-[11px] text-slate-500 gap-0.5">
                                                <span><strong className="font-bold">Từ:</strong> {new Date(item.start_date).toLocaleDateString('vi-VN')}</span>
                                                <span><strong className="font-bold">Đến:</strong> {new Date(item.end_date).toLocaleDateString('vi-VN')}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            {getStatusBadge(item.status)}
                                        </td>
                                        <td className="px-8 py-4" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex items-center justify-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                                                <Link href={`/admin/vouchers/edit/${item._id}`}>
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
                        Tổng cộng: {vouchers.length} mã
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

export default function VouchersPage() {
    return (
        <Suspense fallback={<div>Đang tải...</div>}>
            <VouchersContent />
        </Suspense>
    );
}
