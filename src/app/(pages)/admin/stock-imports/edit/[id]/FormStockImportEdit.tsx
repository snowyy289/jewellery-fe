"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PackageCheck, Save, X, Plus, Trash2, Calendar, AlertCircle } from "lucide-react";
import Button from "@/components/button/Button";
import Input from "@/components/input/Input";
import Select from "@/components/input/Select";
import Textarea from "@/components/input/Textarea";
import { AdminCard } from "@/components/layouts/admin/shared";
import { stockImportService } from "@/services/admin/stockImportService";
import { Supplier } from "@/types/supplier";
import { Product } from "@/types/product";
import { StockImport } from "@/types/stock-import";
import { toast } from "sonner";

interface FormStockImportEditProps {
    stockImport: StockImport | null;
    id: string;
    suppliers: Supplier[];
    products: Product[];
}

interface ImportItem {
    product_id: string;
    quantity: number;
    import_price: number;
    total: number;
}

export default function FormStockImportEdit({ stockImport, id, suppliers, products }: FormStockImportEditProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [items, setItems] = useState<ImportItem[]>([]);
    const [notes, setNotes] = useState("");
    const router = useRouter();

    useEffect(() => {
        if (stockImport) {
            // Convert existing items to editable format
            const editableItems = stockImport.items.map(item => ({
                product_id: typeof item.product_id === 'object' ? item.product_id._id : item.product_id,
                quantity: item.quantity,
                import_price: item.import_price,
                total: item.total
            }));
            setItems(editableItems);
            setNotes(stockImport.notes || "");
        }
    }, [stockImport]);

    // Check if can edit (only draft status)
    const canEdit = stockImport?.status === 'draft';

    const addItem = () => {
        setItems([...items, {
            product_id: "",
            quantity: 1,
            import_price: 0,
            total: 0
        }]);
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const updateItem = (index: number, field: keyof ImportItem, value: any) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        
        // Auto calculate total
        if (field === 'quantity' || field === 'import_price') {
            newItems[index].total = newItems[index].quantity * newItems[index].import_price;
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
            toast.error("Chỉ có thể chỉnh sửa phiếu nhập ở trạng thái Nháp!");
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
            if (item.import_price < 0) {
                toast.error("Giá nhập không hợp lệ!");
                return;
            }
        }

        setIsLoading(true);
        try {
            const formData = new FormData(e.target as HTMLFormElement);
            const totals = calculateTotals();
            
            const data = {
                supplier_id: formData.get('supplier_id'),
                import_date: formData.get('import_date'),
                items: items,
                total_quantity: totals.total_quantity,
                total_amount: totals.total_amount,
                notes: notes
            };

            const res = await stockImportService.updateStockImport(id, data);
            if (res.code === "success") {
                toast.success("Cập nhật phiếu nhập kho thành công!");
                router.push("/admin/stock-imports");
            } else {
                toast.error(res.message);
            }
        } catch {
            toast.error("Lỗi khi cập nhật phiếu nhập kho!");
        } finally {
            setIsLoading(false);
        }
    };

    if (!stockImport) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="text-center">
                    <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
                    <p className="text-sm font-bold text-slate-600">Không tìm thấy phiếu nhập kho!</p>
                </div>
            </div>
        );
    }

    if (!canEdit) {
        return (
            <div className="space-y-6">
                <div className="p-6 bg-amber-50 border-2 border-amber-200 rounded-2xl">
                    <div className="flex items-start gap-4">
                        <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="text-sm font-bold text-amber-900 mb-1">
                                Không thể chỉnh sửa phiếu nhập này
                            </h3>
                            <p className="text-xs text-amber-700">
                                Chỉ có thể chỉnh sửa phiếu nhập ở trạng thái <strong>Nháp</strong>. 
                                Phiếu nhập này đang ở trạng thái <strong className="uppercase">{stockImport.status}</strong>.
                            </p>
                            <div className="mt-4">
                                <Button 
                                    variant="outline"
                                    size="sm"
                                    onClick={() => router.push("/admin/stock-imports")}
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

    const supplierId = typeof stockImport.supplier_id === 'object' ? stockImport.supplier_id._id : stockImport.supplier_id;
    const importDate = stockImport.import_date ? new Date(stockImport.import_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

    const totals = calculateTotals();

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Header Info */}
            <AdminCard title="Thông tin phiếu nhập" subTitle={`Mã phiếu: ${stockImport.import_code}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Select 
                        label="Nhà cung cấp"
                        name="supplier_id"
                        defaultValue={supplierId}
                        icon={<PackageCheck className="w-4 h-4" />}
                        required
                    >
                        <option value="">-- Chọn nhà cung cấp --</option>
                        {suppliers.map(supplier => (
                            <option key={supplier._id} value={supplier._id}>
                                {supplier.name} ({supplier.code})
                            </option>
                        ))}
                    </Select>

                    <Input 
                        label="Ngày nhập"
                        name="import_date"
                        type="date"
                        defaultValue={importDate}
                        icon={<Calendar className="w-4 h-4" />}
                        required
                    />
                </div>
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
                        <PackageCheck className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p className="text-sm font-medium">Chưa có sản phẩm nào</p>
                        <p className="text-xs mt-1">Nhấn "Thêm sản phẩm" để bắt đầu</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {items.map((item, index) => {
                            const selectedProduct = products.find(p => p._id === item.product_id);
                            
                            return (
                                <div key={index} className="p-4 border border-slate-200 rounded-xl bg-slate-50/50">
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                        {/* Product Image Preview */}
                                        {selectedProduct && (
                                            <div className="md:col-span-1">
                                                <label className="text-xs font-semibold text-slate-600 mb-2 block">Ảnh</label>
                                                <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-200 bg-white">
                                                    {selectedProduct.thumbnail ? (
                                                        <img 
                                                            src={selectedProduct.thumbnail} 
                                                            alt={selectedProduct.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-slate-100">
                                                            <PackageCheck className="w-6 h-6 text-slate-300" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        <div className={selectedProduct ? "md:col-span-4" : "md:col-span-5"}>
                                            <label className="text-xs font-semibold text-slate-600 mb-2 block">Sản phẩm</label>
                                            <select
                                                value={item.product_id}
                                                onChange={(e) => updateItem(index, 'product_id', e.target.value)}
                                                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                                                required
                                            >
                                                <option value="">-- Chọn sản phẩm --</option>
                                                {products.map(product => (
                                                    <option key={product._id} value={product._id}>
                                                        {product.title} ({product.sku})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="text-xs font-semibold text-slate-600 mb-2 block">Số lượng</label>
                                            <input
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                                                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                                                min="1"
                                                required
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="text-xs font-semibold text-slate-600 mb-2 block">Giá nhập (VNĐ)</label>
                                            <input
                                                type="number"
                                                value={item.import_price}
                                                onChange={(e) => updateItem(index, 'import_price', parseFloat(e.target.value) || 0)}
                                                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                                                min="0"
                                                step="1000"
                                                required
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="text-xs font-semibold text-slate-600 mb-2 block">Tổng</label>
                                            <div className="px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-200 text-sm font-bold text-emerald-700">
                                                {formatPrice(item.total)}
                                            </div>
                                        </div>

                                        <div className="md:col-span-1 flex items-end">
                                            <button
                                                type="button"
                                                onClick={() => removeItem(index)}
                                                className="w-full px-3 py-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4 mx-auto" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Totals */}
                        <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs font-semibold text-indigo-600 mb-1">Tổng số lượng</p>
                                    <p className="text-2xl font-black text-indigo-700">{totals.total_quantity}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-semibold text-indigo-600 mb-1">Tổng tiền</p>
                                    <p className="text-2xl font-black text-indigo-700">{formatPrice(totals.total_amount)}</p>
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
                    placeholder="Ghi chú về phiếu nhập..."
                    rows={4}
                />
            </AdminCard>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4 p-2">
                <Button 
                    variant="outline" 
                    icon={<X className="w-4 h-4" />}
                    onClick={() => router.push("/admin/stock-imports")}
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
