"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { useWishlist } from "@/contexts/WishlistContext";
import { wishlistService } from "@/services/client/wishlistService";
import AddToCartButton from "@/components/cart/AddToCartButton";

export default function WishlistPage() {
    const { wishlistIds, toggleWishlist, isLoading: contextLoading } = useWishlist();
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchWishlistProducts = async () => {
            try {
                setIsLoading(true);
                const res = await wishlistService.getWishlist();
                if (res.code === 200 && res.data) {
                    // res.data is an array of { product_id: Product, added_at: string }
                    const formattedProducts = res.data.map((item: any) => ({
                        ...item.product_id,
                        added_at: item.added_at
                    }));
                    setProducts(formattedProducts);
                }
            } catch (error) {
                console.error("Failed to load wishlist products", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (!contextLoading) {
            fetchWishlistProducts();
        }
    }, [contextLoading, wishlistIds.length]); // refetch if count changes

    const handleRemove = async (productId: string) => {
        await toggleWishlist(productId);
        setProducts(prev => prev.filter(p => p._id !== productId));
    };

    return (
        <div className="bg-stone-50 min-h-screen py-16">
            <div className="container mx-auto px-4 md:px-8 max-w-6xl">
                <div className="flex flex-col items-center text-center mb-16 space-y-4">
                    <Heart className="w-12 h-12 text-gold fill-gold opacity-80 mb-2" />
                    <h1 className="text-4xl md:text-5xl font-serif text-stone-900 italic">Sản Phẩm Yêu Thích</h1>
                    <p className="text-stone-500 max-w-md">Những tuyệt tác trang sức mà bạn đã dành sự quan tâm đặc biệt.</p>
                </div>

                {isLoading || contextLoading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : products.length === 0 ? (
                    <div className="bg-white p-16 rounded-xl shadow-sm text-center border border-stone-100 flex flex-col items-center">
                        <Heart className="w-16 h-16 text-stone-200 mb-6" />
                        <h2 className="text-2xl font-serif text-stone-800 mb-4">Chưa có sản phẩm nào</h2>
                        <p className="text-stone-500 mb-8 max-w-md">Danh sách yêu thích của bạn đang trống. Hãy quay lại cửa hàng để khám phá và thêm những món trang sức bạn yêu thích nhé.</p>
                        <Link href="/products" className="bg-stone-900 hover:bg-gold text-white font-bold px-8 py-4 text-xs uppercase tracking-widest transition-colors flex items-center gap-2">
                            Khám Phá Ngay
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {products.map((product) => (
                            <div key={product._id} className="bg-white group relative border border-stone-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                                <Link href={`/products/${product.slug}`} className="block relative aspect-square overflow-hidden bg-stone-50">
                                    <Image 
                                        src={product.thumbnail || "https://images.unsplash.com/photo-1605100804763-247f661c6e61?auto=format&fit=crop&q=80&w=400"} 
                                        alt={product.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                </Link>
                                
                                <button 
                                    onClick={() => handleRemove(product._id)}
                                    className="absolute top-4 right-4 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors z-10 opacity-0 group-hover:opacity-100"
                                    title="Xóa khỏi yêu thích"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>

                                <div className="p-5 flex flex-col h-[180px]">
                                    <Link href={`/products/${product.slug}`}>
                                        <h3 className="text-sm font-bold text-stone-800 line-clamp-2 hover:text-gold transition-colors mb-2 uppercase tracking-wide">
                                            {product.title}
                                        </h3>
                                    </Link>
                                    <p className="text-gold font-bold text-lg mb-4">{product.price?.toLocaleString()} đ</p>
                                    
                                    <div className="mt-auto">
                                        <AddToCartButton 
                                            productId={product._id}
                                            className="w-full bg-stone-900 hover:bg-gold text-white font-bold py-3 text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-colors"
                                        >
                                            <ShoppingBag className="w-4 h-4" />
                                            Thêm Vào Giỏ
                                        </AddToCartButton>
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
