"use client";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PackageCheck, Edit2, Trash2, Plus, Eye, CheckCircle, XCircle } from "lucide-react";
import Button from "@/components/button/Button";
import { AdminPageHeader, AdminCard } from "@/components/layouts/admin/shared";
import { stockImportService } from "@/services/admin/stockImportService";
import { StockImport } from "@/types/stock-import";
import { toast } from "sonner";
import Search from "@/components/search/Search";
import Pagination from "@/components/pagination/Pagination";

function StockImportsContent() {
    const searchParams = useSearchParams();
    const [imports, setImports] = useState<StockImport[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPage: 1
    });

    useEffect(() => {
        const params = Object.fromEntries(searchParams.entries());
        fetchImports(params);
    }, [searchParams]);

    const fetchImports = async (params: Record<string, string | number | boolean> = {}) => {
        setIsLoading(true);
        try {
            const res = await stockImportService.getStockImports(params);
            console.log("📦 Stock imports response:", res);
            if (res.code === 200) {
                const importsList = res.data || res.imports || [];
                console.log("✅ Setting imports:", importsList);
                setImports(importsList);
                if (res.pagination) {
                    setPagination({
                        currentPage: res.pagination.currentPage,
                        totalPage: res.pagination.totalPage
                    });
                }
            }
        } catch (error) {
            console.error("💥 Fetch stock imports error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirm = async (id: string) => {
        if (confirm("Xác nhận phiếu nhập kho sẽ cập nhật số lượng tồn kho. Bạn chắc chắn chứ?")) {
            try {
                const res = await stockImportService.confirmStockImport(id);
                if (res.code === 200) {
                    toast.success("Xác nhận thành công!");
                    const params = Object.fromEntries(searchParams.entries());
                    fetchImports(params);
                } else {
                    toast.error(res.message);
                }
            } catch {
                toast.error("Lỗi khi xác nhận!");
            }
        }
    };

    const handleCancel = async (id: string) => {
        if (confirm("Hủy phiếu nhập kho sẽ hoàn lại số lượng tồn kho (nếu đã xác nhận). Bạn chắc chắn chứ?")) {
            try {
                const res = await stockImportService.cancelStockImport(id);
                if (res.code === 200) {
                    toast.success("Hủy phiếu thành công!");
                    const params = Object.fromEntries(searchParams.entries());
                    fetchImports(params);
                } else {
                    toast.error(res.message);
                }
            } catch {
                toast.error("Lỗi khi hủy!");
            }
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Xóa phiếu nhập kho này? Chỉ có thể xóa phiếu ở trạng thái nháp.")) {
            try {
                const res = await stockImportService.deleteStockImport(id);
                if (res.code === 200) {
                    toast.success("Xóa thành công!");
                    const params = Object.fromEntries(searchParams.entries());
                    fetchImports(params);
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
                title="Quản lý phiếu nhập kho"
                subTitle="Danh sách tất cả phiếu nhập kho trong hệ thống"
                actions={
                    <div className="flex items-center gap-3">
                        <Link href="/admin/stock-imports/create">
                            <Button size="sm" icon={<Plus className="w-4 h-4" />}>
                                Tạo phiếu nhập
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
                </div>
                <Search />
            </div>

            <AdminCard noPadding title="Tất cả phiếu nhập" subTitle={`${imports.length} phiếu nhập hiện có`}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mã phiếu</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nhà cung cấp</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ngày nhập</th>
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
                            ) : imports.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-8 py-20 text-center text-slate-400 italic font-medium">
                                        Chưa có phiếu nhập kho nào được tạo.
                                    </td>
                                </tr>
                            ) : (
                                imports.map((item) => (
                                    <tr key={item._id} className="group hover:bg-indigo-50/30 transition-all duration-300">
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                                                    <PackageCheck className="w-5 h-5 text-indigo-600" />
                                                </div>
                                                <span className="text-sm font-black text-indigo-600">
                                                    {item.import_code}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <span className="text-sm font-bold text-slate-800">
                                                {typeof item.supplier_id === 'object' ? item.supplier_id.name : '—'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-4">
                                            <span className="text-xs text-slate-600">
                                                {formatDate(item.import_date)}
                                            </span>
                                        </td>
                                        <td className="px-8 py-4">
                                            <span className="text-sm font-black text-slate-700 tabular-nums">
                                                {item.total_quantity}
                                            </span>
                                        </td>
                                        <td className="px-8 py-4">
                                            <span className="text-sm font-black text-emerald-600">
                                                {formatPrice(item.total_amount)}
                                            </span>
                                        </td>
                                        <td className="px-8 py-4">
                                            {getStatusBadge(item.status)}
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex items-center justify-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                                                <Link href={`/admin/stock-imports/detail/${item._id}`}>
                                                    <button className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-white hover:text-blue-600 hover:shadow-md border border-transparent hover:border-slate-100 transition-all">
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                </Link>
                                                {item.status === 'draft' && (
                                                    <>
                                                        <Link href={`/admin/stock-imports/edit/${item._id}`}>
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
                                                {(item.status === 'confirmed' || item.status === 'draft') && (
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
                        Tổng cộng: {imports.length} phiếu nhập
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

export default function StockImportsPage() {
    return (
        <Suspense fallback={<div>Đang tải...</div>}>
            <StockImportsContent />
        </Suspense>
    );
}
