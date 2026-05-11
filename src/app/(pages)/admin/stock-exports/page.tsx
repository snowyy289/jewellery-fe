"use client";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PackageMinus, Edit2, Trash2, Plus, Eye, CheckCircle, XCircle } from "lucide-react";
import Button from "@/components/button/Button";
import { AdminPageHeader, AdminCard } from "@/components/layouts/admin/shared";
import { stockExportService } from "@/services/admin/stockExportService";
import { StockExport } from "@/types/stock-export";
import { toast } from "sonner";
import Search from "@/components/search/Search";
import Pagination from "@/components/pagination/Pagination";

function StockExportsContent() {
    const searchParams = useSearchParams();
    const [exports, setExports] = useState<StockExport[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPage: 1
    });

    useEffect(() => {
        const params = Object.fromEntries(searchParams.entries());
        fetchExports(params);
    }, [searchParams]);

    const fetchExports = async (params: Record<string, string | number | boolean> = {}) => {
        setIsLoading(true);
        try {
            const res = await stockExportService.getStockExports(params);
            console.log("📦 Stock exports response:", res);
            if (res.code === 200 || res.code === "success") {
                const exportsList = res.data || res.stockExports || [];
                console.log("✅ Setting exports:", exportsList);
                setExports(exportsList);
                if (res.pagination) {
                    setPagination({
                        currentPage: res.pagination.page || res.pagination.currentPage || 1,
                        totalPage: res.pagination.totalPages || res.pagination.totalPage || 1
                    });
                }
            }
        } catch (error) {
            console.error("💥 Fetch stock exports error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirm = async (id: string) => {
        if (confirm("Xác nhận phiếu xuất kho sẽ trừ số lượng tồn kho. Bạn chắc chắn chứ?")) {
            try {
                const res = await stockExportService.confirmStockExport(id);
                if (res.code === 200) {
                    toast.success("Xác nhận thành công!");
                    const params = Object.fromEntries(searchParams.entries());
                    fetchExports(params);
                } else {
                    toast.error(res.message);
                }
            } catch {
                toast.error("Lỗi khi xác nhận!");
            }
        }
    };

    const handleCancel = async (id: string) => {
        if (confirm("Hủy phiếu xuất kho sẽ hoàn lại số lượng tồn kho (nếu đã xác nhận). Bạn chắc chắn chứ?")) {
            try {
                const res = await stockExportService.cancelStockExport(id);
                if (res.code === 200) {
                    toast.success("Hủy phiếu thành công!");
                    const params = Object.fromEntries(searchParams.entries());
                    fetchExports(params);
                } else {
                    toast.error(res.message);
                }
            } catch {
                toast.error("Lỗi khi hủy!");
            }
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Xóa phiếu xuất kho này? Chỉ có thể xóa phiếu ở trạng thái nháp.")) {
            try {
                const res = await stockExportService.deleteStockExport(id);
                if (res.code === 200) {
                    toast.success("Xóa thành công!");
                    const params = Object.fromEntries(searchParams.entries());
                    fetchExports(params);
                } else {
                    toast.error(res.message);
                }
            } catch {
                toast.error("Lỗi khi xóa!");
            }
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const getExportTypeBadge = (type: string) => {
        switch (type) {
            case 'order':
                return <span className="px-2 py-1 rounded-lg bg-blue-50 text-blue-700 text-[10px] font-bold">Đơn hàng</span>;
            case 'return':
                return <span className="px-2 py-1 rounded-lg bg-purple-50 text-purple-700 text-[10px] font-bold">Trả hàng</span>;
            case 'damaged':
                return <span className="px-2 py-1 rounded-lg bg-rose-50 text-rose-700 text-[10px] font-bold">Hỏng hóc</span>;
            case 'other':
                return <span className="px-2 py-1 rounded-lg bg-slate-50 text-slate-700 text-[10px] font-bold">Khác</span>;
            default:
                return null;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'draft':
                return (
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider bg-slate-50 text-slate-600 border-slate-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        Nháp
                    </div>
                );
            case 'confirmed':
                return (
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 border-emerald-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
                        Đã xác nhận
                    </div>
                );
            case 'cancelled':
                return (
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-600 border-rose-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        Đã hủy
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="w-full space-y-6 pb-10">
            <AdminPageHeader
                title="Quản lý phiếu xuất kho"
                subTitle="Danh sách tất cả phiếu xuất kho trong hệ thống"
                actions={
                    <div className="flex items-center gap-3">
                        <Link href="/admin/stock-exports/create">
                            <Button size="sm" icon={<Plus className="w-4 h-4" />}>
                                Tạo phiếu xuất
                            </Button>
                        </Link>
                    </div>
                }
            />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex gap-2">
                    <select className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium">
                        <option value="">Tất cả trạng thái</option>
                        <option value="draft">Nháp</option>
                        <option value="confirmed">Đã xác nhận</option>
                        <option value="cancelled">Đã hủy</option>
                    </select>
                    <select className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium">
                        <option value="">Tất cả loại xuất</option>
                        <option value="order">Đơn hàng</option>
                        <option value="return">Trả hàng</option>
                        <option value="damaged">Hỏng hóc</option>
                        <option value="other">Khác</option>
                    </select>
                </div>
                <Search />
            </div>

            <AdminCard noPadding title="Tất cả phiếu xuất" subTitle={`${exports.length} phiếu xuất hiện có`}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mã phiếu</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Loại xuất</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ngày xuất</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Số lượng</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tổng tiền</th>
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
                            ) : exports.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-8 py-20 text-center text-slate-400 italic font-medium">
                                        Chưa có phiếu xuất kho nào được tạo.
                                    </td>
                                </tr>
                            ) : (
                                exports.map((item) => (
                                    <tr key={item._id} className="group hover:bg-indigo-50/30 transition-all duration-300">
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center group-hover:bg-rose-100 transition-colors">
                                                    <PackageMinus className="w-5 h-5 text-rose-600" />
                                                </div>
                                                <span className="text-sm font-black text-rose-600">
                                                    {item.export_code}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            {getExportTypeBadge(item.export_type)}
                                        </td>
                                        <td className="px-8 py-4">
                                            <span className="text-xs text-slate-600">
                                                {formatDate(item.export_date)}
                                            </span>
                                        </td>
                                        <td className="px-8 py-4">
                                            <span className="text-sm font-black text-slate-700 tabular-nums">
                                                {item.total_quantity}
                                            </span>
                                        </td>
                                        <td className="px-8 py-4">
                                            <span className="text-sm font-black text-rose-600">
                                                {formatPrice(item.total_amount)}
                                            </span>
                                        </td>
                                        <td className="px-8 py-4">
                                            {getStatusBadge(item.status)}
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex items-center justify-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                                                <Link href={`/admin/stock-exports/detail/${item._id}`}>
                                                    <button className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-white hover:text-blue-600 hover:shadow-md border border-transparent hover:border-slate-100 transition-all">
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                </Link>
                                                {item.status === 'draft' && (
                                                    <>
                                                        <Link href={`/admin/stock-exports/edit/${item._id}`}>
                                                            <button className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-white hover:text-indigo-600 hover:shadow-md border border-transparent hover:border-slate-100 transition-all">
                                                                <Edit2 className="w-4 h-4" />
                                                            </button>
                                                        </Link>
                                                        <button 
                                                            onClick={() => handleConfirm(item._id)}
                                                            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-white hover:text-emerald-600 hover:shadow-md border border-transparent hover:border-slate-100 transition-all"
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDelete(item._id)}
                                                            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-white hover:text-rose-600 hover:shadow-md border border-transparent hover:border-slate-100 transition-all"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}
                                                {item.status === 'confirmed' && (
                                                    <button 
                                                        onClick={() => handleCancel(item._id)}
                                                        className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-white hover:text-orange-600 hover:shadow-md border border-transparent hover:border-slate-100 transition-all"
                                                    >
                                                        <XCircle className="w-4 h-4" />
                                                    </button>
                                                )}
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
                        Tổng cộng: {exports.length} phiếu xuất
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

export default function StockExportsPage() {
    return (
        <Suspense fallback={<div>Đang tải...</div>}>
            <StockExportsContent />
        </Suspense>
    );
}
