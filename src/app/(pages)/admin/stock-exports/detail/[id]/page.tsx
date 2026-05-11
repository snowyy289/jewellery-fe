/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AdminPageHeader, AdminCard } from "@/components/layouts/admin/shared";
import { stockExportService } from "@/services/admin/stockExportService";
import { StockExport } from "@/types/stock-export";
import { toast } from "sonner";
import { CheckCircle, XCircle, Calendar, FileText, Tag } from "lucide-react";
import Button from "@/components/button/Button";
import Image from "next/image";

export default function StockExportDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const [isFetching, setIsFetching] = useState(true);
    const [stockExport, setStockExport] = useState<StockExport | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        fetchStockExport();
    }, [id]);

    const fetchStockExport = async () => {
        try {
            const res = await stockExportService.getStockExportDetail(id);
            console.log("📦 Stock export detail response:", res);
            if (res.code === 200 || res.code === "success") {
                const exportData = res.stockExport || res.data;
                console.log("✅ Setting stock export:", exportData);
                setStockExport(exportData || null);
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            console.error("💥 Fetch stock export error:", error);
            toast.error("Lỗi khi tải dữ liệu!");
        } finally {
            setIsFetching(false);
        }
    };

    const handleConfirm = async () => {
        if (!confirm("Xác nhận phiếu xuất kho sẽ trừ số lượng tồn kho. Bạn chắc chắn chứ?")) return;
        
        setIsProcessing(true);
        try {
            const res = await stockExportService.confirmStockExport(id);
            if (res.code === 200 || res.code === "success") {
                toast.success("Xác nhận thành công!");
                fetchStockExport();
            } else {
                toast.error(res.message);
            }
        } catch {
            toast.error("Lỗi khi xác nhận!");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCancel = async () => {
        if (!confirm("Hủy phiếu xuất kho sẽ hoàn lại số lượng tồn kho (nếu đã xác nhận). Bạn chắc chắn chứ?")) return;
        
        setIsProcessing(true);
        try {
            const res = await stockExportService.cancelStockExport(id);
            if (res.code === 200 || res.code === "success") {
                toast.success("Hủy phiếu thành công!");
                fetchStockExport();
            } else {
                toast.error(res.message);
            }
        } catch {
            toast.error("Lỗi khi hủy!");
        } finally {
            setIsProcessing(false);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'draft':
                return <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">Nháp</span>;
            case 'confirmed':
                return <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">Đã xác nhận</span>;
            case 'cancelled':
                return <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold">Đã hủy</span>;
            default:
                return null;
        }
    };

    const getExportTypeBadge = (type: string) => {
        switch (type) {
            case 'order':
                return <span className="px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold">Đơn hàng</span>;
            case 'return':
                return <span className="px-3 py-1 rounded-lg bg-purple-50 text-purple-700 text-xs font-bold">Trả hàng</span>;
            case 'damaged':
                return <span className="px-3 py-1 rounded-lg bg-rose-50 text-rose-700 text-xs font-bold">Hỏng hóc</span>;
            case 'other':
                return <span className="px-3 py-1 rounded-lg bg-slate-50 text-slate-700 text-xs font-bold">Khác</span>;
            default:
                return null;
        }
    };

    if (isFetching) return (
        <div className="flex items-center justify-center h-[60vh]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "rgba(99,102,241,0.2)", borderTopColor: "#6366f1" }} />
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Đang tải dữ liệu...</p>
            </div>
        </div>
    );

    if (!stockExport) return (
        <div className="flex items-center justify-center h-[60vh]">
            <div className="text-center">
                <p className="text-lg font-bold text-slate-700">Không tìm thấy phiếu xuất kho</p>
                <p className="text-sm text-slate-500 mt-2">Phiếu không tồn tại hoặc đã bị xóa</p>
            </div>
        </div>
    );

    return (
        <div className="w-full space-y-6 pb-10">
            <AdminPageHeader
                title={`Phiếu xuất kho: ${stockExport.export_code}`}
                subTitle="Chi tiết phiếu xuất hàng"
                backHref="/admin/stock-exports"
                actions={
                    <div className="flex gap-2">
                        {stockExport.status === 'draft' && (
                            <Button 
                                size="sm"
                                icon={<CheckCircle className="w-4 h-4" />}
                                onClick={handleConfirm}
                                isLoading={isProcessing}
                            >
                                Xác nhận
                            </Button>
                        )}
                        {stockExport.status === 'confirmed' && (
                            <Button 
                                size="sm"
                                variant="outline"
                                icon={<XCircle className="w-4 h-4" />}
                                onClick={handleCancel}
                                isLoading={isProcessing}
                            >
                                Hủy phiếu
                            </Button>
                        )}
                    </div>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Info */}
                <div className="lg:col-span-1 space-y-6">
                    <AdminCard title="Thông tin chung">
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs text-slate-500 mb-1">Trạng thái</p>
                                {getStatusBadge(stockExport.status)}
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 mb-1 flex items-center gap-2">
                                    <Tag className="w-3 h-3" />
                                    Loại xuất
                                </p>
                                {getExportTypeBadge(stockExport.export_type)}
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 mb-1 flex items-center gap-2">
                                    <Calendar className="w-3 h-3" />
                                    Ngày xuất
                                </p>
                                <p className="text-sm font-bold text-slate-800">
                                    {formatDate(stockExport.export_date)}
                                </p>
                            </div>
                            {stockExport.order_id && (
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">Mã đơn hàng</p>
                                    <p className="text-sm font-bold text-blue-600">{stockExport.order_id}</p>
                                </div>
                            )}
                            {stockExport.notes && (
                                <div>
                                    <p className="text-xs text-slate-500 mb-1 flex items-center gap-2">
                                        <FileText className="w-3 h-3" />
                                        Ghi chú
                                    </p>
                                    <p className="text-sm text-slate-700">{stockExport.notes}</p>
                                </div>
                            )}
                        </div>
                    </AdminCard>

                    <AdminCard title="Lịch sử">
                        <div className="space-y-3 text-xs">
                            <div>
                                <p className="text-slate-500">Tạo bởi</p>
                                <p className="font-semibold text-slate-700">{stockExport.createBy?.fullName || '—'}</p>
                                <p className="text-slate-400">{stockExport.createdAt && formatDate(stockExport.createdAt)}</p>
                            </div>
                            {stockExport.updateBy && (
                                <div>
                                    <p className="text-slate-500">Cập nhật bởi</p>
                                    <p className="font-semibold text-slate-700">{stockExport.updateBy.fullName}</p>
                                    <p className="text-slate-400">{stockExport.updatedAt && formatDate(stockExport.updatedAt)}</p>
                                </div>
                            )}
                        </div>
                    </AdminCard>
                </div>

                {/* Right: Items */}
                <div className="lg:col-span-2 space-y-6">
                    <AdminCard title="Danh sách sản phẩm" subTitle={`${stockExport.items.length} sản phẩm`}>
                        <div className="space-y-3">
                            {stockExport.items.map((item, index) => {
                                const product = typeof item.product_id === 'object' ? item.product_id : null;
                                return (
                                    <div key={index} className="p-4 border border-slate-200 rounded-xl bg-slate-50/50">
                                        <div className="flex items-center gap-4">
                                            {product?.thumbnail && (
                                                <Image 
                                                    src={product.thumbnail} 
                                                    alt={product.title} 
                                                    width={60} 
                                                    height={60} 
                                                    className="rounded-lg object-cover"
                                                />
                                            )}
                                            <div className="flex-1">
                                                <p className="font-bold text-slate-800">{product?.title || '—'}</p>
                                                <p className="text-xs text-slate-500">SKU: {product?.sku || '—'}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-slate-600">SL: <span className="font-bold">{item.quantity}</span></p>
                                                <p className="text-xs text-slate-500">{formatPrice(item.export_price)}/sp</p>
                                                <p className="text-sm font-bold text-rose-600">{formatPrice(item.total)}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-6 p-4 bg-rose-50 border border-rose-200 rounded-xl">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs font-semibold text-rose-600 mb-1">Tổng số lượng</p>
                                    <p className="text-2xl font-black text-rose-700">{stockExport.total_quantity}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-semibold text-rose-600 mb-1">Tổng tiền</p>
                                    <p className="text-2xl font-black text-rose-700">{formatPrice(stockExport.total_amount)}</p>
                                </div>
                            </div>
                        </div>
                    </AdminCard>
                </div>
            </div>
        </div>
    );
}
