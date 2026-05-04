"use client";
import Link from "next/link";
import { ArrowRight, Star, Heart, ShoppingBag, Diamond } from "lucide-react";
import Image from "next/image";

export default function HomePage() {
    // Mock Data for UI presentation
    const featuredProducts = [
        { id: 1, title: "Nhẫn Kim Cương Đính Hôn", price: "25.000.000 đ", image: "https://images.unsplash.com/photo-1605100804763-247f661c6e61?auto=format&fit=crop&q=80&w=800", tags: ["Bán chạy"] },
        { id: 2, title: "Dây Chuyền Vàng Trắng 18K", price: "12.500.000 đ", image: "https://images.unsplash.com/photo-1599643478524-fb66f7ca265b?auto=format&fit=crop&q=80&w=800", tags: ["Mới"] },
        { id: 3, title: "Bông Tai Sapphire Xanh", price: "8.900.000 đ", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800", tags: [] },
        { id: 4, title: "Vòng Tay Ngọc Trai Tự Nhiên", price: "5.200.000 đ", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800", tags: ["Khuyến mãi"] },
    ];

    const categories = [
        { title: "Nhẫn", count: 120, image: "https://images.unsplash.com/photo-1605100804763-247f661c6e61?auto=format&fit=crop&q=80&w=400" },
        { title: "Dây chuyền", count: 85, image: "https://images.unsplash.com/photo-1599643478524-fb66f7ca265b?auto=format&fit=crop&q=80&w=400" },
        { title: "Bông tai", count: 200, image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=400" },
    ];

    return (
        <div className="flex flex-col w-full overflow-hidden bg-slate-50">
            {/* Hero Section */}
            <section className="relative h-[80vh] min-h-[600px] flex items-center bg-stone-900">
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://images.unsplash.com/photo-1515562141207-7a8efbc65f60?auto=format&fit=crop&q=80&w=2000" 
                        alt="Hero Jewelry" 
                        className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-stone-900 via-stone-900/70 to-transparent"></div>
                </div>
                
                <div className="container mx-auto px-4 md:px-8 relative z-10">
                    <div className="max-w-2xl space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-bold tracking-widest uppercase mb-4">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            Bộ sưu tập mùa thu 2026
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white leading-tight tracking-tighter">
                            Vẻ Đẹp <span className="text-amber-500">Vĩnh Cửu</span> Của Sự Tinh Tế
                        </h1>
                        <p className="text-lg text-slate-300 md:text-xl leading-relaxed max-w-lg">
                            Khám phá những tuyệt tác trang sức được chế tác thủ công với độ tinh xảo hoàn hảo, tôn vinh nét quyến rũ riêng biệt của bạn.
                        </p>
                        <div className="pt-8 flex flex-wrap gap-4">
                            <Link href="/products" className="bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold px-8 py-4 rounded-none transition-all flex items-center gap-2">
                                Khám Phá Ngay
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link href="/collections" className="bg-transparent hover:bg-white/10 text-white border border-white/30 font-bold px-8 py-4 rounded-none transition-all">
                                Xem Video
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Categories */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Danh Mục Nổi Bật</h2>
                        <div className="w-24 h-1 bg-amber-500 mx-auto"></div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {categories.map((cat, idx) => (
                            <Link href={`/products?category=${cat.title}`} key={idx} className="group relative h-96 overflow-hidden">
                                <img src={cat.image} alt={cat.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent flex flex-col justify-end p-8">
                                    <h3 className="text-2xl font-bold text-white mb-2">{cat.title}</h3>
                                    <p className="text-amber-400 font-medium">{cat.count} Sản phẩm</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-24 bg-slate-50">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                        <div className="space-y-4">
                            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Tuyệt Tác Mới Nhất</h2>
                            <div className="w-24 h-1 bg-amber-500"></div>
                        </div>
                        <Link href="/products" className="text-amber-600 font-bold hover:text-amber-700 flex items-center gap-2 group uppercase tracking-wider text-sm">
                            Xem tất cả 
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {featuredProducts.map((product) => (
                            <div key={product.id} className="group bg-white rounded-none shadow-sm hover:shadow-xl transition-all duration-300">
                                <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
                                    <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    
                                    {/* Badges */}
                                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                                        {product.tags.map((tag, idx) => (
                                            <span key={idx} className="bg-stone-900 text-white text-[10px] font-bold px-3 py-1 uppercase tracking-wider">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Actions Hover */}
                                    <div className="absolute top-4 right-4 translate-x-8 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all flex flex-col gap-2">
                                        <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-700 hover:text-rose-500 shadow-lg transition-colors">
                                            <Heart className="w-5 h-5" />
                                        </button>
                                    </div>
                                    
                                    {/* Add to cart bottom */}
                                    <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                        <button className="w-full bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold py-4 flex items-center justify-center gap-2 transition-colors">
                                            <ShoppingBag className="w-5 h-5" />
                                            Thêm Vào Giỏ
                                        </button>
                                    </div>
                                </div>
                                <div className="p-6 text-center">
                                    <Link href={`/products/${product.id}`}>
                                        <h3 className="text-sm font-bold text-slate-900 mb-2 hover:text-amber-600 transition-colors line-clamp-2">{product.title}</h3>
                                    </Link>
                                    <div className="flex items-center justify-center gap-1 mb-3">
                                        {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
                                    </div>
                                    <p className="text-amber-600 font-black tracking-wide">{product.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter */}
            <section className="py-24 bg-stone-900 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-2xl mx-auto text-center space-y-8">
                        <Diamond className="w-12 h-12 text-amber-500 mx-auto" />
                        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">Gia Nhập Cộng Đồng Jewelry Eco</h2>
                        <p className="text-slate-400 text-lg">Đăng ký nhận bản tin để là người đầu tiên biết về các bộ sưu tập mới và ưu đãi độc quyền dành riêng cho bạn.</p>
                        
                        <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                            <input 
                                type="email" 
                                placeholder="Nhập địa chỉ email của bạn..." 
                                className="flex-1 px-6 py-4 bg-white/10 border border-white/20 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                            />
                            <button className="bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold px-8 py-4 transition-colors uppercase tracking-wider text-sm whitespace-nowrap">
                                Đăng Ký
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
}
