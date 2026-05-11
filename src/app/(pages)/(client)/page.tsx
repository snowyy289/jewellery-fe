"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Star, Heart, ShoppingBag, Diamond, Sparkles, ShieldCheck, Truck, RefreshCcw } from "lucide-react";
import { productService } from "@/services/client/productService";
import { bannerService } from "@/services/client/bannerService";
import { Product } from "@/types/product";
import { Banner } from "@/types/banner";
import Image from "next/image";

export default function HomePage() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const [newProducts, setNewProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [bannerRes, featuredRes, newRes] = await Promise.all([
                    bannerService.getAll("home-slider"),
                    productService.getFeatured(),
                    productService.getNewest()
                ]);

                if (bannerRes.code === "success") setBanners(bannerRes.banners);
                if (featuredRes.code === "success") setFeaturedProducts(featuredRes.products);
                if (newRes.code === "success") setNewProducts(newRes.products);
            } catch (error) {
                console.error("Error fetching homepage data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const quickCategories = [
        { name: "Nhẫn", icon: "💍", image: "https://images.unsplash.com/photo-1605100804763-247f661c6e61?auto=format&fit=crop&q=80&w=400" },
        { name: "Dây Chuyền", icon: "📿", image: "https://images.unsplash.com/photo-1599643478524-fb66f7ca265b?auto=format&fit=crop&q=80&w=400" },
        { name: "Bông Tai", icon: "✨", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=400" },
        { name: "Vòng Tay", icon: "💫", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=400" },
        { name: "Đá Quý", icon: "💎", image: "https://images.unsplash.com/photo-1588444839799-eb00f4904618?auto=format&fit=crop&q=80&w=400" },
        { name: "Phong Thủy", icon: "☯️", image: "https://images.unsplash.com/photo-1602773130111-3051496998b3?auto=format&fit=crop&q=80&w=400" },
    ];

    const currentBanner = banners[0] || {
        title: "Tuyệt Tác Trang Sức",
        description: "Nơi tôn vinh vẻ đẹp thuần khiết và quý phái của bạn qua những món trang sức được chế tác thủ công tinh xảo.",
        image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=2000",
        link: "/products"
    };

    return (
        <div className="flex flex-col w-full bg-white">
            {/* Hero Section - Dynamic */}
            <section className="relative h-[600px] md:h-[750px] flex items-center overflow-hidden bg-stone-100">
                <div className="absolute inset-0 z-0">
                    <Image 
                        src={currentBanner.image} 
                        alt={currentBanner.title}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-stone-900/20"></div>
                </div>
                
                <div className="container mx-auto px-4 md:px-8 relative z-10">
                    <div className="max-w-3xl space-y-10 animate-in fade-in slide-in-from-left-10 duration-1000">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-px bg-gold"></div>
                            <span className="text-white font-bold tracking-[0.4em] uppercase text-xs">Collection 2026</span>
                        </div>
                        
                        <div className="space-y-4">
                            <h1 className="text-5xl md:text-8xl font-serif text-white leading-[1.1]">
                                {currentBanner.title.split(' ').slice(0, 2).join(' ')} <br />
                                <span className="italic text-gold font-light">{currentBanner.title.split(' ').slice(2).join(' ')}</span>
                            </h1>
                            <p className="text-lg text-white/90 max-w-lg leading-relaxed font-light">
                                {currentBanner.description}
                            </p>
                        </div>
                        
                        <div className="pt-4 flex flex-wrap gap-8">
                            <Link href={currentBanner.link || "/products"} className="bg-stone-900 hover:bg-gold text-white hover:text-stone-900 font-bold px-12 py-5 transition-all duration-500 flex items-center gap-3 uppercase tracking-widest text-[10px]">
                                Khám Phá Ngay
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Vertical Text Decoration */}
                <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block">
                    <span className="text-white/10 text-[120px] font-serif font-bold rotate-90 inline-block tracking-tighter select-none pointer-events-none">
                        BOUTIQUE
                    </span>
                </div>
            </section>

            {/* Quick Categories Grid */}
            <section className="py-20 bg-cream">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
                        {quickCategories.map((cat, idx) => (
                            <Link href={`/products?category=${cat.name}`} key={idx} className="group flex flex-col items-center gap-4">
                                <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-transparent group-hover:border-gold transition-all duration-500 p-1">
                                    <div className="w-full h-full rounded-full overflow-hidden bg-white shadow-lg">
                                        <Image 
                                            src={cat.image} 
                                            alt={cat.name} 
                                            width={128}
                                            height={128}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                        />
                                    </div>
                                    <div className="absolute inset-0 bg-gold/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"></div>
                                </div>
                                <div className="text-center">
                                    <span className="text-xs text-stone-400 font-bold tracking-widest uppercase mb-1 block">Khám phá</span>
                                    <h3 className="text-sm font-bold text-stone-800 tracking-wide group-hover:text-gold transition-colors">{cat.name}</h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-24 bg-white overflow-hidden">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="flex flex-col items-center mb-16 text-center space-y-4">
                        <div className="divider-gold"></div>
                        <h2 className="text-4xl md:text-5xl font-serif text-stone-900 italic">Tuyệt Tác Nổi Bật</h2>
                        <p className="text-stone-500 max-w-lg mx-auto">Những thiết kế biểu tượng, khẳng định vị thế và gu thẩm mỹ đỉnh cao của chủ nhân.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                        {featuredProducts.map((product) => (
                            <div key={product._id} className="premium-card group">
                                <div className="relative aspect-3/4 overflow-hidden bg-stone-50 mb-6">
                                    <Image 
                                        src={product.thumbnail || "https://images.unsplash.com/photo-1605100804763-247f661c6e61?auto=format&fit=crop&q=80&w=800"} 
                                        alt={product.title}
                                        width={800}
                                        height={1067}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                                    />
                                    
                                    <div className="absolute top-4 left-4 bg-stone-900 text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest">
                                        Nổi bật
                                    </div>

                                    <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                                        <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-stone-700 hover:text-gold shadow-md transition-colors">
                                            <Heart className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                                        <button className="w-full bg-stone-900 text-white font-bold py-4 flex items-center justify-center gap-2 uppercase tracking-widest text-xs hover:bg-gold transition-colors">
                                            <ShoppingBag className="w-4 h-4" />
                                            Thêm Vào Giỏ
                                        </button>
                                    </div>
                                </div>
                                <div className="text-center space-y-2">
                                    <Link href={`/products/slug/${product.slug}`} className="block">
                                        <h3 className="text-sm font-medium text-stone-800 hover:text-gold transition-colors line-clamp-1 uppercase tracking-wider">{product.title}</h3>
                                    </Link>
                                    <div className="flex items-center justify-center gap-1">
                                        {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-gold text-gold" />)}
                                    </div>
                                    <p className="text-gold font-bold text-lg">{product.price.toLocaleString()} đ</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 text-center">
                        <Link href="/products" className="inline-flex items-center gap-2 text-stone-400 hover:text-gold font-bold uppercase tracking-[0.2em] text-xs transition-colors group">
                            Xem tất cả sản phẩm
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* New Arrivals */}
            <section className="py-24 bg-stone-50 overflow-hidden">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="flex flex-col items-center mb-16 text-center space-y-4">
                        <div className="divider-gold"></div>
                        <h2 className="text-4xl md:text-5xl font-serif text-stone-900 italic">Sản Phẩm Mới Nhất</h2>
                        <p className="text-stone-500 max-w-lg mx-auto">Vừa ra mắt, mang trong mình hơi thở của xu hướng trang sức đương đại.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                        {newProducts.map((product) => (
                            <div key={product._id} className="premium-card group">
                                <div className="relative aspect-3/4 overflow-hidden bg-white mb-6">
                                    <Image 
                                        src={product.thumbnail || "https://images.unsplash.com/photo-1599643478524-fb66f7ca265b?auto=format&fit=crop&q=80&w=800"} 
                                        alt={product.title}
                                        width={800}
                                        height={1067}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                                    />
                                    <div className="absolute top-4 left-4 bg-gold text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest">
                                        Mới
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                                        <button className="w-full bg-stone-900 text-white font-bold py-4 flex items-center justify-center gap-2 uppercase tracking-widest text-xs hover:bg-gold transition-colors">
                                            <ShoppingBag className="w-4 h-4" />
                                            Thêm Vào Giỏ
                                        </button>
                                    </div>
                                </div>
                                <div className="text-center space-y-2">
                                    <Link href={`/products/slug/${product.slug}`} className="block">
                                        <h3 className="text-sm font-medium text-stone-800 hover:text-gold transition-colors line-clamp-1 uppercase tracking-wider">{product.title}</h3>
                                    </Link>
                                    <p className="text-gold font-bold text-lg">{product.price.toLocaleString()} đ</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us & Newsletter */}
            <section className="py-24 bg-cream">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                        {[
                            { icon: <ShieldCheck className="w-10 h-10 text-gold" />, title: "Cam Kết Chất Lượng", desc: "100% đá quý thiên nhiên có chứng kiểm định quốc tế." },
                            { icon: <Truck className="w-10 h-10 text-gold" />, title: "Giao Hàng Miễn Phí", desc: "Vận chuyển nhanh chóng và bảo hiểm 100% giá trị sản phẩm." },
                            { icon: <RefreshCcw className="w-10 h-10 text-gold" />, title: "Đổi Trả Dễ Dàng", desc: "Chính sách đổi trả linh hoạt trong vòng 7 ngày nếu không hài lòng." },
                            { icon: <Diamond className="w-10 h-10 text-gold" />, title: "Nghệ Nhân Tay Nghề", desc: "Chế tác bởi đội ngũ thợ lành nghề với hơn 15 năm kinh nghiệm." },
                        ].map((item, idx) => (
                            <div key={idx} className="flex flex-col items-center text-center space-y-4">
                                <div className="mb-2 p-4 bg-white rounded-full shadow-sm">{item.icon}</div>
                                <h3 className="text-lg font-bold text-stone-800">{item.title}</h3>
                                <p className="text-stone-500 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-24 bg-white border-t border-stone-100">
                <div className="container mx-auto px-4 text-center space-y-10">
                    <div className="space-y-4">
                        <h2 className="text-3xl md:text-5xl font-serif text-stone-900 italic">Đăng Ký Nhận Bản Tin</h2>
                        <p className="text-stone-500 max-w-lg mx-auto">Nhận ngay ưu đãi 10% và cập nhật những bộ sưu tập trang sức mới nhất từ Jewelry Eco.</p>
                    </div>
                    <form className="flex flex-col sm:flex-row gap-0 max-w-2xl mx-auto border border-stone-200 p-1">
                        <input type="email" placeholder="Địa chỉ email của bạn..." className="flex-1 px-8 py-5 bg-transparent text-stone-800 focus:outline-none" />
                        <button className="bg-stone-900 hover:bg-gold text-white font-bold px-12 py-5 transition-all uppercase tracking-widest text-[10px]">Đăng Ký</button>
                    </form>
                </div>
            </section>
        </div>
    );
}
