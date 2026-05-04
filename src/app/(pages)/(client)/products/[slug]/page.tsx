"use client";
import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Heart, Minus, Plus, ShoppingBag, ShieldCheck, Truck, RotateCcw, Star } from "lucide-react";

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(0);

    const product = {
        title: "Nhẫn Kim Cương Đính Hôn Solitaire 18K",
        price: "25.000.000 đ",
        sku: "NJ-DIA-001",
        status: "Còn hàng",
        description: "Chiếc nhẫn đính hôn Solitaire cổ điển với viên kim cương giác cắt tròn hoàn hảo được cố định bằng 6 chấu chắc chắn trên đai nhẫn vàng trắng 18K. Sự lựa chọn hoàn hảo để bắt đầu một hành trình mới.",
        images: [
            "https://images.unsplash.com/photo-1605100804763-247f661c6e61?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1599643478524-fb66f7ca265b?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1515562141207-7a8efbc65f60?auto=format&fit=crop&q=80&w=1000",
        ],
        details: {
            "Thương hiệu": "Jewelry Eco",
            "Chất liệu": "Vàng trắng 18K",
            "Loại đá": "Kim cương tự nhiên",
            "Trọng lượng đá": "0.5 Carat",
            "Màu sắc": "D-E-F (Không màu)",
            "Độ tinh khiết": "VVS1"
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen pb-24">
            {/* Breadcrumb */}
            <div className="bg-white border-b border-slate-200 py-4">
                <div className="container mx-auto px-4 flex items-center gap-2 text-sm">
                    <Link href="/" className="text-slate-500 hover:text-amber-600 transition-colors">Trang chủ</Link>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                    <Link href="/products" className="text-slate-500 hover:text-amber-600 transition-colors">Trang sức</Link>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-900 font-bold truncate max-w-[200px] sm:max-w-none">{product.title}</span>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    
                    {/* Product Images */}
                    <div className="space-y-4">
                        <div className="aspect-square bg-slate-100 overflow-hidden relative">
                            <img src={product.images[activeImage]} alt={product.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            {product.images.map((img, idx) => (
                                <button 
                                    key={idx} 
                                    onClick={() => setActiveImage(idx)}
                                    className={`aspect-square bg-slate-100 overflow-hidden border-2 transition-all ${activeImage === idx ? "border-amber-500 opacity-100" : "border-transparent opacity-60 hover:opacity-100"}`}
                                >
                                    <img src={img} alt={`${product.title} ${idx}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col">
                        <div className="mb-6">
                            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-2 block">Thương hiệu: Jewelry Eco</span>
                            <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight mb-4">{product.title}</h1>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex items-center gap-1">
                                    {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                                </div>
                                <span className="text-sm text-slate-500">(12 đánh giá)</span>
                                <span className="text-slate-300">|</span>
                                <span className="text-sm font-medium text-emerald-600 flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 block"></span>
                                    {product.status}
                                </span>
                            </div>
                            <div className="text-3xl font-black text-amber-600">{product.price}</div>
                        </div>

                        <p className="text-slate-600 leading-relaxed mb-8">{product.description}</p>

                        <div className="space-y-6 border-y border-slate-200 py-8 mb-8">
                            <div className="flex items-center gap-4">
                                <span className="w-24 text-sm font-bold uppercase tracking-wider text-slate-900">Kích thước</span>
                                <select className="flex-1 bg-white border border-slate-200 px-4 py-3 text-slate-700 focus:outline-none focus:border-amber-500 cursor-pointer">
                                    <option>Size 6 (16.5mm)</option>
                                    <option>Size 7 (17.3mm)</option>
                                    <option>Size 8 (18.1mm)</option>
                                </select>
                            </div>
                            
                            <div className="flex items-center gap-4">
                                <span className="w-24 text-sm font-bold uppercase tracking-wider text-slate-900">Số lượng</span>
                                <div className="flex items-center border border-slate-200 bg-white">
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-12 flex items-center justify-center text-slate-500 hover:text-amber-600 hover:bg-slate-50 transition-colors">
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <input type="number" value={quantity} readOnly className="w-16 h-12 text-center font-bold text-slate-900 outline-none" />
                                    <button onClick={() => setQuantity(quantity + 1)} className="w-12 h-12 flex items-center justify-center text-slate-500 hover:text-amber-600 hover:bg-slate-50 transition-colors">
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 mb-10">
                            <button className="flex-1 bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold py-4 px-8 uppercase tracking-widest flex items-center justify-center gap-2 transition-colors">
                                <ShoppingBag className="w-5 h-5" />
                                Thêm Vào Giỏ
                            </button>
                            <button className="w-14 h-14 bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:border-rose-200 transition-colors">
                                <Heart className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div className="flex items-start gap-3">
                                <ShieldCheck className="w-8 h-8 text-amber-500 shrink-0" />
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900 mb-1">Bảo hành trọn đời</h4>
                                    <p className="text-xs text-slate-500 leading-relaxed">Đánh bóng & làm mới miễn phí mãi mãi.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Truck className="w-8 h-8 text-amber-500 shrink-0" />
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900 mb-1">Giao hàng an toàn</h4>
                                    <p className="text-xs text-slate-500 leading-relaxed">Miễn phí giao hàng & bảo hiểm 100%.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <RotateCcw className="w-8 h-8 text-amber-500 shrink-0" />
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900 mb-1">Đổi trả 14 ngày</h4>
                                    <p className="text-xs text-slate-500 leading-relaxed">An tâm mua sắm với chính sách đổi trả.</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Product Details Table */}
                <div className="mt-24 max-w-4xl mx-auto">
                    <div className="text-center mb-12 space-y-4">
                        <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight">Chi Tiết Sản Phẩm</h2>
                        <div className="w-16 h-1 bg-amber-500 mx-auto"></div>
                    </div>
                    
                    <div className="bg-white border border-slate-100">
                        {Object.entries(product.details).map(([key, value], idx) => (
                            <div key={idx} className={`flex border-b border-slate-50 last:border-0 ${idx % 2 === 0 ? "bg-slate-50/50" : "bg-white"}`}>
                                <div className="w-1/3 md:w-1/4 py-4 px-6 text-sm font-bold text-slate-500 uppercase tracking-wider border-r border-slate-50">{key}</div>
                                <div className="w-2/3 md:w-3/4 py-4 px-6 text-sm font-medium text-slate-900">{value}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
