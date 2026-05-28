"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Filter, ArrowDownUp, ShoppingBag, Star } from "lucide-react";
import { collectionService } from "@/services/client/collectionService";
import { Collection } from "@/types/collection";
import { Product } from "@/types/product";
import AddToCartButton from "@/components/cart/AddToCartButton";
import BuyNowButton from "@/components/cart/BuyNowButton";
import WishlistButton from "@/components/wishlist/WishlistButton";

export default function CollectionDetailPage() {
    const params = useParams();
    const slug = params.slug as string;
    
    const [collection, setCollection] = useState<Collection | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [sort, setSort] = useState("newest");
    
    // Filters could be expanded here
    const [filterMenuOpen, setFilterMenuOpen] = useState(false);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                setLoading(true);
                // Pass sort options to API
                let query = "";
                if (sort === "price-asc") query = "?sortKey=price&sortValue=asc";
                else if (sort === "price-desc") query = "?sortKey=price&sortValue=desc";
                else if (sort === "featured") query = "?sortKey=featured";

                const res = await collectionService.getCollectionDetail(slug, query);
                if (res.code === "success") {
                    setCollection(res.collection);
                    setProducts(res.products || []);
                }
            } catch (error) {
                console.error("Error fetching collection detail:", error);
            } finally {
                setLoading(false);
            }
        };

        if (slug) fetchDetail();
    }, [slug, sort]);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-40 min-h-screen bg-slate-50">
                <Loader2 className="w-8 h-8 animate-spin text-gold" />
            </div>
        );
    }

    if (!collection) {
        return (
            <div className="flex flex-col justify-center items-center py-40 min-h-screen bg-slate-50">
                <h1 className="text-3xl font-serif text-stone-900 mb-4">Bộ sưu tập không tồn tại</h1>
                <Link href="/collections" className="text-gold hover:text-amber-600 transition-colors flex items-center gap-2 font-bold uppercase tracking-widest text-sm">
                    <ArrowLeft className="w-4 h-4" /> Khám phá bộ sưu tập khác
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen pb-24">
            {/* Hero Section */}
            <div className="relative h-[70vh] md:h-[85vh] w-full flex items-center justify-center overflow-hidden bg-stone-900">
                <img 
                    src={collection.cover_image || "https://images.unsplash.com/photo-1599643478514-4a820c56a8e0?auto=format&fit=crop&q=80&w=2000"} 
                    alt={collection.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent"></div>
                
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-20 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                    <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] text-gold mb-6 block">
                        Exclusive Collection
                    </span>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-6 leading-tight">
                        {collection.title}
                    </h1>
                </div>
            </div>

            {/* Storytelling Section */}
            <div className="py-20 md:py-32 px-4 bg-stone-50">
                <div className="max-w-3xl mx-auto text-center space-y-8">
                    <div className="w-px h-16 bg-gold mx-auto"></div>
                    <h2 className="text-2xl md:text-3xl font-serif text-stone-900 italic">Câu Chuyện Cảm Hứng</h2>
                    <div className="prose prose-stone prose-lg md:prose-xl mx-auto text-stone-500 font-light leading-relaxed">
                        <p>{collection.description || "Một tuyệt tác được chế tác tinh xảo, mang trong mình vẻ đẹp vượt thời gian và đẳng cấp thượng lưu."}</p>
                    </div>
                    <div className="w-px h-16 bg-gold mx-auto"></div>
                </div>
            </div>

            {/* Products Grid Section */}
            <div className="container mx-auto px-4 md:px-8 py-20">
                <div className="flex flex-col md:flex-row items-center justify-between mb-12 pb-6 border-b border-stone-100 gap-4">
                    <h3 className="text-2xl font-serif text-stone-900">Khám Phá Tuyệt Tác ({products.length})</h3>
                    
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setFilterMenuOpen(!filterMenuOpen)}
                            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-stone-500 hover:text-stone-900 transition-colors px-4 py-2 border border-stone-200 rounded-full"
                        >
                            <Filter className="w-4 h-4" />
                            Bộ Lọc
                        </button>

                        <div className="relative">
                            <select 
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                                className="appearance-none flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-stone-500 hover:text-stone-900 transition-colors px-4 py-2 pr-10 border border-stone-200 rounded-full bg-transparent focus:outline-none focus:border-gold cursor-pointer"
                            >
                                <option value="newest">Mới nhất</option>
                                <option value="featured">Nổi bật</option>
                                <option value="price-asc">Giá tăng dần</option>
                                <option value="price-desc">Giá giảm dần</option>
                            </select>
                            <ArrowDownUp className="w-3 h-3 absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Filter Panel (Expandable) */}
                {filterMenuOpen && (
                    <div className="mb-12 p-6 bg-stone-50 border border-stone-100 rounded-2xl flex flex-wrap gap-8 animate-in fade-in slide-in-from-top-4">
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-stone-900">Khoảng Giá</h4>
                            <div className="flex items-center gap-2">
                                <input type="number" placeholder="Từ..." className="w-24 px-3 py-2 text-xs border border-stone-200 focus:outline-none focus:border-gold" />
                                <span>-</span>
                                <input type="number" placeholder="Đến..." className="w-24 px-3 py-2 text-xs border border-stone-200 focus:outline-none focus:border-gold" />
                                <button className="px-3 py-2 bg-stone-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-gold transition-colors">Lọc</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Grid */}
                {products.length === 0 ? (
                    <div className="text-center py-20 text-stone-400 italic">
                        Hiện chưa có sản phẩm nào trong bộ sưu tập này.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
                        {products.map((product) => (
                            <div key={product._id} className="premium-card group">
                                <div className="relative aspect-[3/4] overflow-hidden bg-stone-50 mb-6">
                                    <Link href={`/products/${product.slug}`}>
                                        <img 
                                            src={product.thumbnail || "https://images.unsplash.com/photo-1605100804763-247f661c6e61?auto=format&fit=crop&q=80&w=800"} 
                                            alt={product.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 cursor-pointer" 
                                        />
                                    </Link>
                                    
                                    {(product.discountPercentage || 0) > 0 && (
                                        <div className="absolute top-4 left-4 bg-rose-500 text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest">
                                            -{product.discountPercentage}%
                                        </div>
                                    )}

                                    <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                                        <WishlistButton 
                                            productId={product._id} 
                                            className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full text-stone-700 hover:text-gold shadow-md transition-colors"
                                        />
                                    </div>

                                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                                        <button className="w-full bg-stone-900 text-white font-bold py-4 flex items-center justify-center gap-2 uppercase tracking-widest text-xs hover:bg-gold transition-colors">
                                            <ShoppingBag className="w-4 h-4" />
                                            Thêm Vào Giỏ
                                        </button>
                                    </div>
                                </div>
                                <div className="text-center space-y-3">
                                    <Link href={`/products/${product.slug}`} className="block">
                                        <h3 className="text-base font-serif text-stone-800 hover:text-gold transition-colors line-clamp-1">{product.title}</h3>
                                    </Link>
                                    <div className="flex items-center justify-center gap-1">
                                        {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-gold text-gold" />)}
                                    </div>
                                    <div className="flex items-center justify-center gap-3">
                                        {(product.discountPercentage || 0) > 0 ? (
                                            <>
                                                <span className="text-gold font-bold text-lg">
                                                    {(product.price * (1 - (product.discountPercentage || 0) / 100)).toLocaleString()} đ
                                                </span>
                                                <span className="text-stone-400 line-through text-sm">
                                                    {product.price.toLocaleString()} đ
                                                </span>
                                            </>
                                        ) : (
                                            <span className="text-gold font-bold text-lg">{product.price.toLocaleString()} đ</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
