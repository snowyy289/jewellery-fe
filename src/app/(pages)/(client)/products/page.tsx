"use client";
import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, ChevronDown, ShoppingBag, Star, Loader2 } from "lucide-react";
import { productService } from "@/services/client/productService";
import { categoryService } from "@/services/client/categoryService";
import { Product } from "@/types/product";
import { Category } from "@/types/category";
import AddToCartButton from "@/components/cart/AddToCartButton";
import BuyNowButton from "@/components/cart/BuyNowButton";
import WishlistButton from "@/components/wishlist/WishlistButton";

function ProductsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const initialKeyword = searchParams.get("keyword") || "";

    const [keyword, setKeyword] = useState(initialKeyword);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [pagination, setPagination] = useState({ currentPage: 1, totalPage: 1 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const currentKeyword = searchParams.get("keyword") || "";
                const currentCategory = searchParams.get("category") || "";
                const currentPage = parseInt(searchParams.get("page") || "1");
                setKeyword(currentKeyword);
                
                const [res, catRes] = await Promise.all([
                    productService.getProducts({ 
                        keyword: currentKeyword,
                        category: currentCategory,
                        page: currentPage
                    }),
                    categoryService.getCategories()
                ]);

                if (res.products) {
                    setProducts(res.products);
                } else if (res.data) {
                    setProducts(res.data);
                }
                
                if (res.pagination) {
                    setPagination(res.pagination);
                }
                
                if (catRes.code === "success" || catRes.code === 200) {
                    setCategories(catRes.data || []);
                }
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [searchParams]);

    const materials = ["Vàng 18K", "Vàng trắng", "Bạc 925", "Bạch kim"];

    const generatePagination = () => {
        const { currentPage, totalPage } = pagination;
        if (totalPage <= 5) {
            return Array.from({ length: totalPage }, (_, i) => i + 1);
        }
        
        if (currentPage <= 3) {
            return [1, 2, 3, 4, '...', totalPage];
        }
        
        if (currentPage >= totalPage - 2) {
            return [1, '...', totalPage - 3, totalPage - 2, totalPage - 1, totalPage];
        }
        
        return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPage];
    };

    return (
        <div className="bg-slate-50 min-h-screen">
            {/* Header Banner */}
            <div className="bg-stone-900 py-16 text-center border-t border-white/10">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4">Bộ Sưu Tập</h1>
                    <p className="text-slate-400 max-w-2xl mx-auto">Khám phá hàng ngàn mẫu thiết kế trang sức tinh xảo, tôn vinh vẻ đẹp vĩnh cửu.</p>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-8 py-12">
                <div className="flex flex-col lg:flex-row gap-10">
                    
                    {/* Mobile Filter Toggle */}
                    <div className="lg:hidden flex justify-between items-center bg-white p-4 shadow-sm">
                        <span className="font-bold uppercase tracking-wider text-sm">Lọc Sản Phẩm</span>
                        <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="bg-slate-100 p-2 text-slate-700">
                            <SlidersHorizontal className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Sidebar Filters */}
                    <div className={`lg:w-1/4 space-y-10 ${isFilterOpen ? "block" : "hidden lg:block"}`}>
                        {/* Search */}
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            router.push(`/products?keyword=${encodeURIComponent(keyword)}`);
                        }} className="relative">
                            <input 
                                type="text" 
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                placeholder="Tìm kiếm trang sức..." 
                                className="w-full bg-white border border-slate-200 px-4 py-3 pl-10 focus:outline-none focus:border-amber-500 transition-colors"
                            />
                            <button type="submit" className="absolute left-4 top-1/2 -translate-y-1/2">
                                <Search className="w-4 h-4 text-slate-400 hover:text-amber-600 transition-colors" />
                            </button>
                        </form>

                        {/* Category Filter */}
                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-4 border-b border-slate-200 pb-2">Danh mục</h3>
                            <ul className="space-y-3">
                                <li>
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input type="radio" name="category" className="w-4 h-4 accent-amber-500" checked={!searchParams.get("category")} onChange={() => router.push('/products')} />
                                        <span className="text-slate-600 group-hover:text-amber-600 transition-colors">Tất cả</span>
                                    </label>
                                </li>
                                {categories.map((cat) => (
                                    <li key={cat._id}>
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <input type="radio" name="category" className="w-4 h-4 accent-amber-500" checked={searchParams.get("category") === cat.title} onChange={() => router.push(`/products?category=${encodeURIComponent(cat.title)}`)} />
                                            <span className="text-slate-600 group-hover:text-amber-600 transition-colors">{cat.title}</span>
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Material Filter */}
                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-4 border-b border-slate-200 pb-2">Chất liệu</h3>
                            <ul className="space-y-3">
                                {materials.map((mat, idx) => (
                                    <li key={idx}>
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <input type="checkbox" className="w-4 h-4 accent-amber-500 rounded-none" />
                                            <span className="text-slate-600 group-hover:text-amber-600 transition-colors">{mat}</span>
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Price Filter */}
                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-4 border-b border-slate-200 pb-2">Khoảng giá</h3>
                            <input type="range" min="0" max="100000000" className="w-full accent-amber-500 mb-4" />
                            <div className="flex items-center justify-between text-sm font-medium text-slate-500">
                                <span>0 đ</span>
                                <span>100M+ đ</span>
                            </div>
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="lg:w-3/4">
                        <div className="flex justify-between items-center mb-8 bg-white p-4 shadow-sm">
                            <p className="text-sm text-slate-500 font-medium">
                                Hiển thị <span className="font-bold text-slate-900">{products.length}</span> trên tổng số <span className="font-bold text-slate-900">{products.length}</span> sản phẩm
                                {searchParams.get("keyword") && (
                                    <span> cho từ khóa &ldquo;<strong className="text-amber-600">{searchParams.get("keyword")}</strong>&rdquo;</span>
                                )}
                            </p>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-500 font-medium">Sắp xếp:</span>
                                <div className="relative">
                                    <select className="appearance-none bg-slate-50 border border-slate-200 text-sm font-bold px-4 py-2 pr-10 focus:outline-none focus:border-amber-500 cursor-pointer">
                                        <option>Mới nhất</option>
                                        <option>Giá tăng dần</option>
                                        <option>Giá giảm dần</option>
                                        <option>Bán chạy nhất</option>
                                    </select>
                                    <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex justify-center items-center py-20">
                                <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-20 text-slate-500">
                                Không tìm thấy sản phẩm nào.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {products.map((product) => (
                                    <div key={product._id} className="group bg-white rounded-none shadow-sm hover:shadow-xl transition-all duration-300">
                                        <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
                                            <Link href={`/products/${product.slug || product._id}`}>
                                                <img src={product.thumbnail || "https://images.unsplash.com/photo-1605100804763-247f661c6e61?auto=format&fit=crop&q=80&w=800"} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer" />
                                            </Link>
                                            
                                            {/* Badges */}
                                            <div className="absolute top-4 left-4 flex flex-col gap-2">
                                                {(product.tags || []).map((tag, idx) => (
                                                    <span key={idx} className="bg-stone-900 text-white text-[10px] font-bold px-3 py-1 uppercase tracking-wider">
                                                        {tag}
                                                    </span>
                                                ))}
                                                {product.discountPercentage ? (
                                                    <span className="bg-rose-500 text-white text-[10px] font-bold px-3 py-1 uppercase tracking-wider">
                                                        -{product.discountPercentage}%
                                                    </span>
                                                ) : null}
                                            </div>

                                            {/* Actions Hover */}
                                            <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                                                <WishlistButton 
                                                    productId={product._id} 
                                                    className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full text-stone-700 hover:text-gold shadow-md transition-colors"
                                                />
                                            </div>
                                            
                                            {/* Add to cart & Buy now bottom */}
                                            <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex">
                                                <AddToCartButton 
                                                    productId={product._id}
                                                    className="flex-1 bg-stone-900 text-white font-bold py-3 text-[10px] md:text-sm uppercase tracking-widest flex items-center justify-center gap-1 hover:bg-gold hover:text-stone-900 transition-colors rounded-none border-r border-stone-700"
                                                >
                                                    <ShoppingBag className="w-4 h-4" />
                                                    Giỏ Hàng
                                                </AddToCartButton>
                                                <BuyNowButton
                                                    productId={product._id}
                                                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold py-3 text-xs md:text-sm uppercase tracking-wider flex items-center justify-center transition-colors rounded-none border-t border-amber-500"
                                                >
                                                    Mua Ngay
                                                </BuyNowButton>
                                            </div>
                                        </div>
                                        <div className="p-6 text-center">
                                            <Link href={`/products/${product.slug || product._id}`}>
                                                <h3 className="text-sm font-bold text-slate-900 mb-2 hover:text-amber-600 transition-colors line-clamp-2">{product.title}</h3>
                                            </Link>
                                            <div className="flex items-center justify-center gap-1 mb-3">
                                                {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
                                            </div>
                                            <p className="text-amber-600 font-black tracking-wide">
                                                {product.price.toLocaleString('vi-VN')} đ
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {pagination.totalPage > 1 && (
                            <div className="mt-12 flex justify-center gap-2">
                                {generatePagination().map((item, index) => {
                                    if (item === '...') {
                                        return (
                                            <span key={`ellipsis-${index}`} className="w-10 h-10 flex items-center justify-center text-slate-400 font-bold">
                                                ...
                                            </span>
                                        );
                                    }
                                    
                                    const page = item as number;
                                    const isActive = page === pagination.currentPage;
                                    
                                    return (
                                        <button 
                                            key={page}
                                            onClick={() => {
                                                const currentParams = new URLSearchParams(searchParams.toString());
                                                currentParams.set("page", page.toString());
                                                router.push(`/products?${currentParams.toString()}`);
                                            }}
                                            className={`w-10 h-10 flex items-center justify-center font-bold transition-colors ${
                                                isActive 
                                                    ? "bg-stone-900 text-white" 
                                                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ProductsPage() {
    return (
        <Suspense fallback={
            <div className="flex justify-center items-center py-20 min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
            </div>
        }>
            <ProductsContent />
        </Suspense>
    );
}
