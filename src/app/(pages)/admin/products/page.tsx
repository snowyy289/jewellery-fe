/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Package, Edit2, Trash2, Plus } from "lucide-react";
import Image from "next/image";
import Button from "@/components/button/Button";
import { AdminPageHeader, AdminCard } from "@/components/layouts/admin/shared";
import { productService } from "@/services/admin/productService";
import { categoryService } from "@/services/admin/categoryService";
import { userService } from "@/services/admin/userService";
import { Product } from "@/types/product";
import { Category } from "@/types/category";
import { toast } from "sonner";
import Search from "@/components/search/Search";
import FilterStatus from "@/components/filter/FilterStatus";
import ProductFilter from "@/components/filter/ProductFilter";
import Pagination from "@/components/pagination/Pagination";

function ProductsContent() {
    const searchParams = useSearchParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPage: 1
    });

    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        const params = Object.fromEntries(searchParams.entries());
        fetchProducts(params);
    }, [searchParams]);

    const fetchInitialData = async () => {
        try {
            // Fetch categories, brands and users for filters
            const brandService = await import('@/services/admin/brandService').then(m => m.brandService);
            
            const [catRes, brandRes, userRes] = await Promise.all([
                categoryService.getCategories({ status: 'active' }),
                brandService.getBrands({ status: 'active' }),
                userService.getUsers({ status: 'active' })
            ]);
            
            console.log("📦 Categories response:", catRes);
            console.log("🏷️ Brands response:", brandRes);
            console.log("👥 Users response:", userRes);
            
            if (catRes.code === 200 || catRes.code === "success") {
                const cats = catRes.data || catRes.categories || [];
                console.log("✅ Setting categories:", cats);
                setCategories(cats);
            }
            if (brandRes.code === 200 || brandRes.code === "success") {
                const brands = brandRes.data || brandRes.brands || [];
                console.log("✅ Setting brands:", brands);
                setBrands(brands);
            }
            if (userRes.code === 200 || userRes.code === "success") {
                const usrs = userRes.data || userRes.users || [];
                console.log("✅ Setting users:", usrs);
                setUsers(usrs);
            }
        } catch (error) {
            console.error("Fetch initial data error:", error);
        }
    };

    const fetchProducts = async (params: Record<string, string | number | boolean> = {}) => {
        setIsLoading(true);
        try {
            const res = await productService.getProducts(params);
            if (res.code === 200 || res.code === "success") {
                setProducts(res.data || res.products || []);
                if (res.pagination) {
                    setPagination({
                        currentPage: res.pagination.currentPage,
                        totalPage: res.pagination.totalPage
                    });
                }
            }
        } catch (error) {
            console.error("💥 Fetch products error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Xóa sản phẩm này sẽ ẩn nó khỏi hệ thống. Bạn chắc chắn chứ?")) {
            try {
                const res = await productService.deleteProduct(id);
                if (res.code === 200 || res.code === "success") {
                    toast.success("Xóa thành công!");
                    const params = Object.fromEntries(searchParams.entries());
                    fetchProducts(params);
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

    return (
        <div className="w-full space-y-6 pb-10">
            <AdminPageHeader
                title="Quản lý sản phẩm"
                subTitle="Danh sách tất cả sản phẩm trang sức trong hệ thống"
                actions={
                    <div className="flex items-center gap-3">
                        <Link href="/admin/products/create">
                            <Button size="sm" icon={<Plus className="w-4 h-4" />}>
                                Thêm sản phẩm
                            </Button>
                        </Link>
                    </div>
                }
            />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <FilterStatus />
                    <ProductFilter categories={categories} brands={brands} users={users} />
                </div>
                <Search />
            </div>

            <AdminCard noPadding title="Tất cả sản phẩm" subTitle={`${products.length} sản phẩm hiện có`}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sản phẩm</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Giá</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Danh mục</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kho</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trạng thái</th>
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
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-8 py-20 text-center text-slate-400 italic font-medium">
                                        Chưa có sản phẩm nào được tạo.
                                    </td>
                                </tr>
                            ) : (
                                products.map((item) => (
                                    <tr key={item._id} className="group hover:bg-indigo-50/30 transition-all duration-300">
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-6">
                                                <div className="w-20 h-20 rounded-xl overflow-hidden shadow-sm group-hover:shadow-indigo-100 transition-all shrink-0">
                                                    {item.thumbnail ? (
                                                        <Image 
                                                            src={item.thumbnail} 
                                                            alt={item.title} 
                                                            width={80} 
                                                            height={80} 
                                                            className="w-full h-full object-cover" 
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-slate-50 border border-slate-100">
                                                            <Package className="w-8 h-8 text-slate-300" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-bold text-slate-800 transition-colors group-hover:text-indigo-600 line-clamp-2">
                                                        {item.title}
                                                    </p>
                                                    <p className="text-[10px] text-slate-400 font-medium mt-1">
                                                        SKU: {item.sku}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex flex-col gap-1">
                                                {item.discountPercentage && item.discountPercentage > 0 ? (
                                                    <>
                                                        <span className="text-sm font-black text-emerald-600">
                                                            {formatPrice(item.discountPrice || item.price)}
                                                        </span>
                                                        <span className="text-[10px] text-slate-400 line-through">
                                                            {formatPrice(item.price)}
                                                        </span>
                                                        <span className="text-[9px] font-bold text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded w-fit">
                                                            -{item.discountPercentage}%
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="text-sm font-black text-slate-700">
                                                        {formatPrice(item.price)}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <span className="text-xs font-bold text-slate-500">
                                                {item.category_id && typeof item.category_id === 'object' ? item.category_id.title : (
                                                    <span className="text-slate-300">—</span>
                                                )}
                                            </span>
                                        </td>
                                        <td className="px-8 py-4">
                                            {item.outOfStock || item.stock === 0 ? (
                                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-600 border-rose-100">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                                    Hết hàng
                                                </div>
                                            ) : (
                                                <span className="text-xs font-black text-slate-700 tabular-nums">
                                                    {item.stock} sản phẩm
                                                </span>
                                            )}
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
                                        <td className="px-8 py-4">
                                            <div className="flex items-center justify-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                                                <Link href={`/admin/products/edit/${item._id}`}>
                                                    <button className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-white hover:text-indigo-600 hover:shadow-md border border-transparent hover:border-slate-100 transition-all">
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                </Link>
                                                <button 
                                                    onClick={() => handleDelete(item._id)}
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

export default function ProductsPage() {
    return (
        <Suspense fallback={<div>Đang tải...</div>}>
            <ProductsContent />
        </Suspense>
    );
}
