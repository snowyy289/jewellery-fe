/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PackageMinus, Save, X, Plus, Trash2, Calendar, Tag } from "lucide-react";
import Button from "@/components/button/Button";
import Input from "@/components/input/Input";
import Select from "@/components/input/Select";
import Textarea from "@/components/input/Textarea";
import { AdminCard } from "@/components/layouts/admin/shared";
import { stockExportService } from "@/services/admin/stockExportService";
import { Product } from "@/types/product";
import { toast } from "sonner";

interface FormStockExportCreateProps {
    products: Product[];
}

interface ExportItem {
    product_id: string;
    quantity: number;
    export_price: number;
    total: number;
}

export default function FormStockExportCreate({ products }: FormStockExportCreateProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [items, setItems] = useState<ExportItem[]>([]);
    const [notes, setNotes] = useState("");
    const router = useRouter();

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

            const res = await stockExportService.createStockExport(data);
            if (res.code === 200 || res.code === 201 || res.code === "success") {
                toast.success("Tạo phiếu xuất kho thành công!");
                router.push("/admin/stock-exports");
            } else {
                toast.error(res.message);
            }
        } catch {
            toast.error("Lỗi khi tạo phiếu xuất kho!");
        } finally {
            setIsLoading(false);
        }
    };

    const totals = calculateTotals();

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Header Info */}
            <AdminCard title="Thông tin phiếu xuất" subTitle="Thông tin cơ bản">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Select 
                        label="Loại xuất kho"
                        name="export_type"
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
                        defaultValue={new Date().toISOString().split('T')[0]}
                        icon={<Calendar className="w-4 h-4" />}
                        required
                    />
                </div>

                <Input 
                    label="Mã đơn hàng (nếu có)"
                    name="order_id"
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
                    Lưu phiếu xuất
                </Button>
            </div>
        </form>
    );
}
