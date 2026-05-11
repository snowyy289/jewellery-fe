/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PackageMinus, Save, X, Plus, Trash2, Calendar, AlertCircle, Tag } from "lucide-react";
import Button from "@/components/button/Button";
import Input from "@/components/input/Input";
import Select from "@/components/input/Select";
import Textarea from "@/components/input/Textarea";
import { AdminCard } from "@/components/layouts/admin/shared";
import { stockExportService } from "@/services/admin/stockExportService";
import { Product } from "@/types/product";
import { StockExport } from "@/types/stock-export";
import { toast } from "sonner";

interface FormStockExportEditProps {
    stockExport: StockExport | null;
    id: string;
    products: Product[];
}

interface ExportItem {
    product_id: string;
    quantity: number;
    export_price: number;
    total: number;
}

export default function FormStockExportEdit({ stockExport, id, products }: FormStockExportEditProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [items, setItems] = useState<ExportItem[]>([]);
    const [notes, setNotes] = useState("");
    const router = useRouter();

    useEffect(() => {
        if (stockExport) {
            // Convert existing items to editable format
            const editableItems = stockExport.items.map(item => ({
                product_id: typeof item.product_id === 'object' ? item.product_id._id : item.product_id,
                quantity: item.quantity,
                export_price: item.export_price,
                total: item.total
            }));
            setItems(editableItems);
            setNotes(stockExport.notes || "");
        }
    }, [stockExport]);

    // Check if can edit (only draft status)
    const canEdit = stockExport?.status === 'draft';

    const addItem = () => {
        setItems([...items, {
            product_id: "",
            quantity: 1,
            export_price: 0,
            total: 0
        }]);
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const updateItem = (index: number, field: keyof ExportItem, value: any) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        
        // Auto calculate total
        if (field === 'quantity' || field === 'export_price') {
            newItems[index].total = newItems[index].quantity * newItems[index].export_price;
        }
        
        // Auto fill export_price from product price
        if (field === 'product_id' && value) {
            const product = products.find(p => p._id === value);
            if (product) {
                newItems[index].export_price = product.price;
                newItems[index].total = newItems[index].quantity * product.price;
            }
        }
        
        setItems(newItems);
    };

    const calculateTotals = () => {
        const total_quantity = items.reduce((sum, item) => sum + item.quantity, 0);
        const total_amount = items.reduce((sum, item) => sum + item.total, 0);
        return { total_quantity, total_amount };
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!canEdit) {
            toast.error("Chỉ có thể chỉnh sửa phiếu xuất ở trạng thái Nháp!");
            return;
        }

        if (items.length === 0) {
            toast.error("Vui lòng thêm ít nhất 1 sản phẩm!");
            return;
        }

        // Validate items
        for (const item of items) {
            if (!item.product_id) {
                toast.error("Vui lòng chọn sản phẩm!");
                return;
            }
            if (item.quantity <= 0) {
                toast.error("Số lượng phải lớn hơn 0!");
                return;
            }
            if (item.export_price < 0) {
                toast.error("Giá xuất không hợp lệ!");
                return;
            }
        }

        setIsLoading(true);
        try {
            const formData = new FormData(e.target as HTMLFormElement);
            const totals = calculateTotals();
            
            const data = {
                export_type: formData.get('export_type'),
                order_id: formData.get('order_id') || null,
                export_date: formData.get('export_date'),
                items: items,
                total_quantity: totals.total_quantity,
                total_amount: totals.total_amount,
                notes: notes
            };

            const res = await stockExportService.updateStockExport(id, data);
            if (res.code === 200 || res.code === 201 || res.code === "success") {
                toast.success("Cập nhật phiếu xuất kho thành công!");
                router.push("/admin/stock-exports");
            } else {
                toast.error(res.message);
            }
        } catch {
            toast.error("Lỗi khi cập nhật phiếu xuất kho!");
        } finally {
            setIsLoading(false);
        }
    };

    if (!stockExport) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="text-center">
                    <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
                    <p className="text-sm font-bold text-slate-600">Không tìm thấy phiếu xuất kho!</p>
                </div>
            </div>
        );
    }

    if (!canEdit) {
        return (
            <div className="space-y-6">
                <div className="p-6 bg-amber-50 border-2 border-amber-200 rounded-2xl">
                    <div className="flex items-start gap-4">
                        <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                            <h3 className="text-sm font-bold text-amber-900 mb-1">
                                Không thể chỉnh sửa phiếu xuất này
                            </h3>
                            <p className="text-xs text-amber-700">
                                Chỉ có thể chỉnh sửa phiếu xuất ở trạng thái <strong>Nháp</strong>. 
                                Phiếu xuất này đang ở trạng thái <strong className="uppercase">{stockExport.status}</strong>.
                            </p>
                            <div className="mt-4">
                                <Button 
                                    variant="outline"
                                    size="sm"
                                    onClick={() => router.push("/admin/stock-exports")}
                                >
                                    Quay lại danh sách
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const exportDate = stockExport.export_date ? new Date(stockExport.export_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

    const totals = calculateTotals();

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Header Info */}
            <AdminCard title="Thông tin phiếu xuất" subTitle={`Mã phiếu: ${stockExport.export_code}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Select 
                        label="Loại xuất kho"
                        name="export_type"
                        defaultValue={stockExport.export_type}
                        icon={<Tag className="w-4 h-4" />}
                        required
                    >
                        <option value="">-- Chọn loại xuất --</option>
                        <option value="order">Đơn hàng</option>
                        <option value="return">Trả hàng</option>
                        <option value="damaged">Hỏng hóc</option>
                        <option value="other">Khác</option>
                    </Select>

                    <Input 
                        label="Ngày xuất"
                        name="export_date"
                        type="date"
                        defaultValue={exportDate}
                        icon={<Calendar className="w-4 h-4" />}
                        required
                    />
                </div>

                <Input 
                    label="Mã đơn hàng (nếu có)"
                    name="order_id"
                    defaultValue={stockExport.order_id || ""}
                    placeholder="Để trống nếu không liên quan đến đơn hàng"
                    hint="Chỉ áp dụng khi loại xuất là 'Đơn hàng'"
                />
            </AdminCard>

            {/* Items */}
            <AdminCard 
                title="Danh sách sản phẩm" 
                subTitle={`${items.length} sản phẩm`}
                headerAction={
                    <Button 
                        type="button"
                        size="sm"
                        variant="outline"
                        icon={<Plus className="w-4 h-4" />}
                        onClick={addItem}
                    >
                        Thêm sản phẩm
                    </Button>
                }
            >
                {items.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                        <PackageMinus className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p className="text-sm font-medium">Chưa có sản phẩm nào</p>
                        <p className="text-xs mt-1">Nhấn Thêm sản phẩm để bắt đầu</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        {/* Table Header */}
                        <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-slate-100 border border-slate-200 rounded-t-xl font-semibold text-xs text-slate-700">
                            <div className="col-span-4">Sản phẩm</div>
                            <div className="col-span-2">Số lượng</div>
                            <div className="col-span-3">Giá xuất (VNĐ)</div>
                            <div className="col-span-2">Tổng</div>
                            <div className="col-span-1 text-center">Xóa</div>
                        </div>

                        {/* Table Body */}
                        <div className="space-y-0">
                            {items.map((item, index) => (
                                <div key={index} className="grid grid-cols-12 gap-4 p-4 border-x border-b border-slate-200 bg-white hover:bg-slate-50/50 transition-colors">
                                    {/* Product Select */}
                                    <div className="col-span-4 flex items-center">
                                        <select
                                            value={item.product_id}
                                            onChange={(e) => updateItem(index, 'product_id', e.target.value)}
                                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                                            required
                                        >
                                            <option value="">-- Chọn sản phẩm --</option>
                                            {products.map(product => (
                                                <option key={product._id} value={product._id}>
                                                    {product.title} ({product.sku}) - Tồn: {product.stock}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Quantity */}
                                    <div className="col-span-2 flex items-center">
                                        <input
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                                            min="1"
                                            required
                                        />
                                    </div>

                                    {/* Export Price */}
                                    <div className="col-span-3 flex items-center">
                                        <input
                                            type="number"
                                            value={item.export_price}
                                            onChange={(e) => updateItem(index, 'export_price', parseFloat(e.target.value) || 0)}
                                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                                            min="0"
                                            step="1000"
                                            required
                                        />
                                    </div>

                                    {/* Total */}
                                    <div className="col-span-2 flex items-center">
                                        <div className="w-full px-3 py-2 rounded-lg bg-rose-50 border border-rose-200 text-sm font-bold text-rose-700">
                                            {formatPrice(item.total)}
                                        </div>
                                    </div>

                                    {/* Delete Button */}
                                    <div className="col-span-1 flex items-center justify-center">
                                        <button
                                            type="button"
                                            onClick={() => removeItem(index)}
                                            className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                                            title="Xóa sản phẩm"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Totals */}
                        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs font-semibold text-rose-600 mb-1">Tổng số lượng</p>
                                    <p className="text-2xl font-black text-rose-700">{totals.total_quantity}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-semibold text-rose-600 mb-1">Tổng tiền</p>
                                    <p className="text-2xl font-black text-rose-700">{formatPrice(totals.total_amount)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </AdminCard>

            {/* Notes */}
            <AdminCard title="Ghi chú" subTitle="Thông tin bổ sung">
                <Textarea 
                    label="Ghi chú"
                    name="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ghi chú về phiếu xuất..."
                    rows={4}
                />
            </AdminCard>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4 p-2">
                <Button 
                    variant="outline" 
                    icon={<X className="w-4 h-4" />}
                    onClick={() => router.push("/admin/stock-exports")}
                >
                    Hủy bỏ
                </Button>
                <Button 
                    type="submit" 
                    isLoading={isLoading}
                    icon={<Save className="w-4 h-4" />}
                    className="px-10"
                >
                    Lưu thay đổi
                </Button>
            </div>
        </form>
    );
}
