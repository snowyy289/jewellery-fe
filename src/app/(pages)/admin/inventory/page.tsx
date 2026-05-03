"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Package, AlertTriangle, TrendingUp, TrendingDown, Search as SearchIcon, Download } from "lucide-react";
import { AdminPageHeader, AdminCard } from "@/components/layouts/admin/shared";
import { productService } from "@/services/admin/productService";
import { Product } from "@/types/product";
import Image from "next/image";
import Search from "@/components/search/Search";
import Pagination from "@/components/pagination/Pagination";

function InventoryContent() {
    const searchParams = useSearchParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPage: 1
    });
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalValue: 0,
        lowStock: 0,
        outOfStock: 0
    });

    useEffect(() => {
        const params = Object.fromEntries(searchParams.entries());
        fetchInventory(params);
    }, [searchParams]);

    const fetchInventory = async (params: Record<string, string | number | boolean> = {}) => {
        setIsLoading(true);
        try {
            const res = await productService.getProducts({ ...params, status: "active" });
            if (res.code === "success") {
                setProducts(res.products);
                if (res.pagination) {
                    setPagination({
                        currentPage: res.pagination.currentPage,
                        totalPage: res.pagination.totalPage
                    });
                }

                // Calculate stats
                const totalProducts = res.products.length;
                const totalValue = res.products.reduce((sum, p) => sum + (p.stock * p.price), 0);
                const lowStock = res.products.filter(p => p.stock > 0 && p.stock <= 10).length;
                const outOfStock = res.products.filter(p => p.stock === 0).length;

                setStats({ totalProducts, totalValue, lowStock, outOfStock });
            }
        } catch {
            console.error("Fetch inventory error");
        } finally {
            setIsLoading(false);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const getStockStatus = (stock: number) => {
        if (stock === 0) {
            return {
                label: "Hết hàng",
                color: "bg-rose-50 text-rose-700 border-rose-200",
                icon: <AlertTriangle className="w-3 h-3" />
            };
        } else if (stock <= 10) {
            return {
                label: "Sắp hết",
                color: "bg-amber-50 text-amber-700 border-amber-200",
                icon: <TrendingDown className="w-3 h-3" />
            };
        } else {
            return {
                label: "Còn hàng",
                color: "bg-emerald-50 text-emerald-700 border-emerald-200",
                icon: <TrendingUp className="w-3 h-3" />
            };
        }
    };

    const exportToCSV = () => {
        const headers = ["SKU", "Tên sản phẩm", "Tồn kho", "Giá bán", "Giá trị tồn", "Trạng thái"];
        const rows = products.map(p => [
            p.sku,
            p.title,
            p.stock,
            p.price,
            p.stock * p.price,
            getStockStatus(p.stock).label
        ]);

        const csv = [
            headers.join(","),
            ...rows.map(row => row.join(","))
        ].join("\n");

        const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `inventory_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    return (
        <div className="w-full space-y-6 pb-10">
            <AdminPageHeader
                title="Báo cáo tồn kho"
                subTitle="Tình trạng tồn kho của tất cả sản phẩm"
            />

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Tổng SP</p>
                        <Package className="w-5 h-5 text-blue-500" />
                    </div>
                    <p className="text-3xl font-black text-blue-700">{stats.totalProducts}</p>
                    <p className="text-xs text-blue-600 mt-1">Sản phẩm đang bán</p>
                </div>

                <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Giá trị tồn</p>
                        <TrendingUp className="w-5 h-5 text-emerald-500" />
                    </div>
                    <p className="text-2xl font-black text-emerald-700">{formatPrice(stats.totalValue)}</p>
                    <p className="text-xs text-emerald-600 mt-1">Tổng giá trị kho</p>
                </div>

                <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">Sắp hết</p>
                        <TrendingDown className="w-5 h-5 text-amber-500" />
                    </div>
                    <p className="text-3xl font-black text-amber-700">{stats.lowStock}</p>
                    <p className="text-xs text-amber-600 mt-1">Tồn kho ≤ 10</p>
                </div>

                <div className="p-6 rounded-2xl bg-gradient-to-br from-rose-50 to-red-50 border border-rose-100">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-bold text-rose-600 uppercase tracking-wider">Hết hàng</p>
                        <AlertTriangle className="w-5 h-5 text-rose-500" />
                    </div>
                    <p className="text-3xl font-black text-rose-700">{stats.outOfStock}</p>
                    <p className="text-xs text-rose-600 mt-1">Cần nhập thêm</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex gap-2">
                    <select className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium">
                        <option value="">Tất cả trạng thái</option>
                        <option value="in-stock">Còn hàng</option>
                        <option value="low-stock">Sắp hết</option>
                        <option value="out-of-stock">Hết hàng</option>
                    </select>
                    <button
                        onClick={exportToCSV}
                        className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2"
                    >
                        <Download className="w-4 h-4" />
                        Xuất Excel
                    </button>
                </div>
                <Search />
            </div>

            {/* Inventory Table */}
            <AdminCard noPadding title="Danh sách tồn kho" subTitle={`${products.length} sản phẩm`}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sản phẩm</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">SKU</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Tồn kho</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Giá bán</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Giá trị tồn</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trạng thái</th>
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
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-8 py-20 text-center text-slate-400 italic font-medium">
                                        Không có sản phẩm nào.
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => {
                                    const status = getStockStatus(product.stock);
                                    const stockValue = product.stock * product.price;
                                    return (
                                        <tr key={product._id} className="group hover:bg-indigo-50/30 transition-all duration-300">
                                            <td className="px-8 py-4">
                                                <div className="flex items-center gap-3">
                                                    {product.thumbnail && (
                                                        <Image 
                                                            src={product.thumbnail} 
                                                            alt={product.title} 
                                                            width={48} 
                                                            height={48} 
                                                            className="rounded-lg object-cover"
                                                        />
                                                    )}
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-800">{product.title}</p>
                                                        <p className="text-xs text-slate-500">
                                                            {typeof product.category_id === 'object' ? product.category_id.title : '—'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-4">
                                                <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded">
                                                    {product.sku}
                                                </span>
                                            </td>
                                            <td className="px-8 py-4 text-right">
                                                <span className="text-lg font-black text-slate-700 tabular-nums">
                                                    {product.stock}
                                                </span>
                                            </td>
                                            <td className="px-8 py-4 text-right">
                                                <span className="text-sm font-bold text-slate-600">
                                                    {formatPrice(product.price)}
                                                </span>
                                            </td>
                                            <td className="px-8 py-4 text-right">
                                                <span className="text-sm font-black text-indigo-600">
                                                    {formatPrice(stockValue)}
                                                </span>
                                            </td>
                                            <td className="px-8 py-4">
                                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${status.color}`}>
                                                    {status.icon}
                                                    {status.label}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="px-8 py-4 bg-slate-50/30 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Tổng cộng: {products.length} sản phẩm
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

export default function InventoryPage() {
    return (
        <Suspense fallback={<div>Đang tải...</div>}>
            <InventoryContent />
        </Suspense>
    );
}
