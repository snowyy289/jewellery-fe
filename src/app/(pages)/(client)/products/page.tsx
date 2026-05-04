"use client";
import Link from "next/link";
import { Search, SlidersHorizontal, ChevronDown, Heart, ShoppingBag, Star } from "lucide-react";
import { useState } from "react";

export default function ProductsPage() {
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Mock Data
    const products = [
        { id: 1, title: "Nhẫn Kim Cương Đính Hôn", price: "25.000.000 đ", image: "https://images.unsplash.com/photo-1605100804763-247f661c6e61?auto=format&fit=crop&q=80&w=800", tags: ["Bán chạy"] },
        { id: 2, title: "Dây Chuyền Vàng Trắng 18K", price: "12.500.000 đ", image: "https://images.unsplash.com/photo-1599643478524-fb66f7ca265b?auto=format&fit=crop&q=80&w=800", tags: ["Mới"] },
        { id: 3, title: "Bông Tai Sapphire Xanh", price: "8.900.000 đ", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800", tags: [] },
        { id: 4, title: "Vòng Tay Ngọc Trai Tự Nhiên", price: "5.200.000 đ", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800", tags: ["Khuyến mãi"] },
        { id: 5, title: "Nhẫn Cưới Vàng Hồng", price: "18.000.000 đ", image: "https://images.unsplash.com/photo-1515562141207-7a8efbc65f60?auto=format&fit=crop&q=80&w=800", tags: [] },
        { id: 6, title: "Mặt Dây Chuyền Ruby", price: "9.500.000 đ", image: "https://images.unsplash.com/photo-1599643477877-530e11894d3c?auto=format&fit=crop&q=80&w=800", tags: ["Premium"] },
        { id: 7, title: "Bông Tai Kim Cương Nữ Hoàng", price: "45.000.000 đ", image: "https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&q=80&w=800", tags: [] },
        { id: 8, title: "Lắc Tay Bạc Đính Đá CZ", price: "2.100.000 đ", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800", tags: ["Bán chạy"] },
    ];

    const categories = ["Tất cả", "Nhẫn", "Dây chuyền", "Bông tai", "Lắc tay", "Đồng hồ"];
    const materials = ["Vàng 18K", "Vàng trắng", "Bạc 925", "Bạch kim"];

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
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="Tìm kiếm trang sức..." 
                                className="w-full bg-white border border-slate-200 px-4 py-3 pl-10 focus:outline-none focus:border-amber-500 transition-colors"
                            />
                            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                        </div>

                        {/* Category Filter */}
                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-4 border-b border-slate-200 pb-2">Danh mục</h3>
                            <ul className="space-y-3">
                                {categories.map((cat, idx) => (
                                    <li key={idx}>
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <input type="radio" name="category" className="w-4 h-4 accent-amber-500" defaultChecked={idx === 0} />
                                            <span className="text-slate-600 group-hover:text-amber-600 transition-colors">{cat}</span>
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
                            <p className="text-sm text-slate-500 font-medium">Hiển thị <span className="font-bold text-slate-900">8</span> trên tổng số <span className="font-bold text-slate-900">120</span> sản phẩm</p>
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

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product) => (
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

                        {/* Pagination */}
                        <div className="mt-12 flex justify-center gap-2">
                            <button className="w-10 h-10 flex items-center justify-center bg-stone-900 text-white font-bold">1</button>
                            <button className="w-10 h-10 flex items-center justify-center bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 font-bold transition-colors">2</button>
                            <button className="w-10 h-10 flex items-center justify-center bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 font-bold transition-colors">3</button>
                            <span className="w-10 h-10 flex items-center justify-center text-slate-400">...</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
