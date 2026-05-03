"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AdminPageHeader, AdminCard } from "@/components/layouts/admin/shared";
import { stockImportService } from "@/services/admin/stockImportService";
import { StockImport } from "@/types/stock-import";
import { toast } from "sonner";
import { CheckCircle, XCircle, Package, Calendar, User, FileText } from "lucide-react";
import Button from "@/components/button/Button";
import Image from "next/image";

export default function StockImportDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const [isFetching, setIsFetching] = useState(true);
    const [stockImport, setStockImport] = useState<StockImport | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        fetchStockImport();
    }, [id]);

    const fetchStockImport = async () => {
        try {
            const res = await stockImportService.getStockImportDetail(id);
            if (res.code === "success") {
                setStockImport(res.stockImport);
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Lỗi khi tải dữ liệu!");
        } finally {
            setIsFetching(false);
        }
    };

    const handleConfirm = async () => {
        if (!confirm("Xác nhận phiếu nhập kho sẽ cập nhật số lượng tồn kho. Bạn chắc chắn chứ?")) return;
        
        setIsProcessing(true);
        try {
            const res = await stockImportService.confirmStockImport(id);
            if (res.code === "success") {
                toast.success("Xác nhận thành công!");
                fetchStockImport();
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
        if (!confirm("Hủy phiếu nhập kho sẽ hoàn lại số lượng tồn kho (nếu đã xác nhận). Bạn chắc chắn chứ?")) return;
        
        setIsProcessing(true);
        try {
            const res = await stockImportService.cancelStockImport(id);
            if (res.code === "success") {
                toast.success("Hủy phiếu thành công!");
                fetchStockImport();
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

    if (isFetching) return (
        <div className="flex items-center justify-center h-[60vh]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "rgba(99,102,241,0.2)", borderTopColor: "#6366f1" }} />
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Đang tải dữ liệu...</p>
            </div>
        </div>
    );

    if (!stockImport) return (
        <div className="flex items-center justify-center h-[60vh]">
            <div className="text-center">
                <p className="text-lg font-bold text-slate-700">Không tìm thấy phiếu nhập kho</p>
                <p className="text-sm text-slate-500 mt-2">Phiếu không tồn tại hoặc đã bị xóa</p>
            </div>
        </div>
    );

    return (
        <div className="w-full space-y-6 pb-10">
            <AdminPageHeader
                title={`Phiếu nhập kho: ${stockImport.import_code}`}
                subTitle="Chi tiết phiếu nhập hàng"
                backHref="/admin/stock-imports"
                actions={
                    <div className="flex gap-2">
                        {stockImport.status === 'draft' && (
                            <Button 
                                size="sm"
                                icon={<CheckCircle className="w-4 h-4" />}
                                onClick={handleConfirm}
                                isLoading={isProcessing}
                            >
                                Xác nhận
                            </Button>
                        )}
                        {(stockImport.status === 'draft' || stockImport.status === 'confirmed') && (
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
                                {getStatusBadge(stockImport.status)}
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 mb-1 flex items-center gap-2">
                                    <Calendar className="w-3 h-3" />
                                    Ngày nhập
                                </p>
                                <p className="text-sm font-bold text-slate-800">
                                    {formatDate(stockImport.import_date)}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 mb-1">Nhà cung cấp</p>
                                <p className="text-sm font-bold text-slate-800">
                                    {typeof stockImport.supplier_id === 'object' ? stockImport.supplier_id.name : '—'}
                                </p>
                                {typeof stockImport.supplier_id === 'object' && stockImport.supplier_id.code && (
                                    <p className="text-xs text-slate-500">Mã: {stockImport.supplier_id.code}</p>
                                )}
                            </div>
                            {stockImport.notes && (
                                <div>
                                    <p className="text-xs text-slate-500 mb-1 flex items-center gap-2">
                                        <FileText className="w-3 h-3" />
                                        Ghi chú
                                    </p>
                                    <p className="text-sm text-slate-700">{stockImport.notes}</p>
                                </div>
                            )}
                        </div>
                    </AdminCard>

                    <AdminCard title="Lịch sử">
                        <div className="space-y-3 text-xs">
                            <div>
                                <p className="text-slate-500">Tạo bởi</p>
                                <p className="font-semibold text-slate-700">{stockImport.createBy?.fullName || '—'}</p>
                                <p className="text-slate-400">{stockImport.createdAt && formatDate(stockImport.createdAt)}</p>
                            </div>
                            {stockImport.confirmedBy && (
                                <div>
                                    <p className="text-slate-500">Xác nhận bởi</p>
                                    <p className="font-semibold text-emerald-700">{stockImport.confirmedBy.fullName}</p>
                                    <p className="text-slate-400">{stockImport.confirmedAt && formatDate(stockImport.confirmedAt)}</p>
                                </div>
                            )}
                            {stockImport.cancelledBy && (
                                <div>
                                    <p className="text-slate-500">Hủy bởi</p>
                                    <p className="font-semibold text-rose-700">{stockImport.cancelledBy.fullName}</p>
                                    <p className="text-slate-400">{stockImport.cancelledAt && formatDate(stockImport.cancelledAt)}</p>
                                </div>
                            )}
                        </div>
                    </AdminCard>
                </div>

                {/* Right: Items */}
                <div className="lg:col-span-2 space-y-6">
                    <AdminCard title="Danh sách sản phẩm" subTitle={`${stockImport.items.length} sản phẩm`}>
                        <div className="space-y-3">
                            {stockImport.items.map((item, index) => {
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
                                                <p className="text-xs text-slate-500">{formatPrice(item.import_price)}/sp</p>
                                                <p className="text-sm font-bold text-emerald-600">{formatPrice(item.total)}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-6 p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs font-semibold text-indigo-600 mb-1">Tổng số lượng</p>
                                    <p className="text-2xl font-black text-indigo-700">{stockImport.total_quantity}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-semibold text-indigo-600 mb-1">Tổng tiền</p>
                                    <p className="text-2xl font-black text-indigo-700">{formatPrice(stockImport.total_amount)}</p>
                                </div>
                            </div>
                        </div>
                    </AdminCard>
                </div>
            </div>
        </div>
    );
}
