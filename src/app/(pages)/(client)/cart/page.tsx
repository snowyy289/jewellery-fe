"use client";
import Link from "next/link";
import { Minus, Plus, Trash2, ArrowRight, ShieldCheck } from "lucide-react";
import { useState } from "react";

export default function CartPage() {
    const [cartItems, setCartItems] = useState([
        { id: 1, title: "Nhẫn Kim Cương Đính Hôn Solitaire 18K", price: "25.000.000 đ", rawPrice: 25000000, quantity: 1, image: "https://images.unsplash.com/photo-1605100804763-247f661c6e61?auto=format&fit=crop&q=80&w=200", size: "Size 7" },
        { id: 2, title: "Dây Chuyền Vàng Trắng 18K", price: "12.500.000 đ", rawPrice: 12500000, quantity: 2, image: "https://images.unsplash.com/photo-1599643478524-fb66f7ca265b?auto=format&fit=crop&q=80&w=200", size: "Mặc định" },
    ]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const updateQuantity = (id: number, delta: number) => {
        setCartItems(items => items.map(item => {
            if (item.id === id) {
                const newQuantity = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQuantity };
            }
            return item;
        }));
    };

    const removeItem = (id: number) => {
        setCartItems(items => items.filter(item => item.id !== id));
    };

    const subtotal = cartItems.reduce((sum, item) => sum + (item.rawPrice * item.quantity), 0);

    return (
        <div className="bg-slate-50 min-h-screen py-12">
            <div className="container mx-auto px-4 md:px-8">
                
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter mb-8 text-center md:text-left">
                    Giỏ Hàng Của Bạn
                </h1>

                {cartItems.length === 0 ? (
                    <div className="bg-white p-16 text-center shadow-sm max-w-2xl mx-auto">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-4xl">🛍️</span>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Giỏ hàng trống</h2>
                        <p className="text-slate-500 mb-8">Bạn chưa chọn món trang sức nào. Hãy khám phá các bộ sưu tập của chúng tôi nhé!</p>
                        <Link href="/products" className="inline-flex bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold py-4 px-8 uppercase tracking-widest items-center justify-center gap-2 transition-colors">
                            Tiếp tục mua sắm
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-10">
                        {/* Cart Items List */}
                        <div className="lg:w-2/3">
                            <div className="bg-white shadow-sm">
                                {/* Header */}
                                <div className="hidden md:flex border-b border-slate-100 py-4 px-6 bg-slate-50/50">
                                    <div className="w-1/2 text-xs font-bold uppercase tracking-widest text-slate-500">Sản phẩm</div>
                                    <div className="w-1/6 text-xs font-bold uppercase tracking-widest text-slate-500 text-center">Số lượng</div>
                                    <div className="w-1/6 text-xs font-bold uppercase tracking-widest text-slate-500 text-right">Đơn giá</div>
                                    <div className="w-1/6 text-xs font-bold uppercase tracking-widest text-slate-500 text-right">Tổng</div>
                                </div>

                                {/* Items */}
                                <div className="divide-y divide-slate-100">
                                    {cartItems.map(item => (
                                        <div key={item.id} className="flex flex-col md:flex-row items-start md:items-center p-6 gap-6 relative">
                                            
                                            {/* Mobile Delete */}
                                            <button onClick={() => removeItem(item.id)} className="md:hidden absolute top-6 right-6 text-slate-400 hover:text-rose-500 transition-colors">
                                                <Trash2 className="w-5 h-5" />
                                            </button>

                                            <div className="w-full md:w-1/2 flex items-center gap-4">
                                                <div className="w-24 h-24 bg-slate-100 shrink-0">
                                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="pr-8 md:pr-0">
                                                    <Link href={`/products/${item.id}`} className="text-sm font-bold text-slate-900 hover:text-amber-600 transition-colors line-clamp-2 mb-1">{item.title}</Link>
                                                    <p className="text-xs text-slate-500 mb-2">Biến thể: {item.size}</p>
                                                    {/* Mobile Price */}
                                                    <div className="md:hidden text-sm font-black text-amber-600">{formatPrice(item.rawPrice)}</div>
                                                </div>
                                            </div>

                                            <div className="w-full md:w-1/6 flex justify-between md:justify-center items-center">
                                                <span className="md:hidden text-sm font-bold text-slate-500">Số lượng:</span>
                                                <div className="flex items-center border border-slate-200">
                                                    <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors"><Minus className="w-3 h-3" /></button>
                                                    <span className="w-8 text-center text-sm font-bold text-slate-900">{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors"><Plus className="w-3 h-3" /></button>
                                                </div>
                                            </div>

                                            <div className="hidden md:block w-1/6 text-right text-sm font-bold text-slate-600">
                                                {formatPrice(item.rawPrice)}
                                            </div>

                                            <div className="hidden md:flex w-1/6 justify-end items-center gap-4">
                                                <span className="text-sm font-black text-amber-600">{formatPrice(item.rawPrice * item.quantity)}</span>
                                                <button onClick={() => removeItem(item.id)} className="text-slate-300 hover:text-rose-500 transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                            
                                            {/* Mobile Total */}
                                            <div className="md:hidden w-full flex justify-between items-center pt-4 border-t border-slate-100 mt-2">
                                                <span className="text-sm font-bold text-slate-500 uppercase">Thành tiền:</span>
                                                <span className="text-lg font-black text-amber-600">{formatPrice(item.rawPrice * item.quantity)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="mt-6 flex items-center gap-2 text-sm text-slate-500 bg-emerald-50/50 p-4 border border-emerald-100/50 text-emerald-700">
                                <ShieldCheck className="w-5 h-5" />
                                Sản phẩm đã được thêm bảo hiểm vận chuyển miễn phí.
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:w-1/3">
                            <div className="bg-white shadow-sm p-8 sticky top-28">
                                <h2 className="text-lg font-black text-slate-900 uppercase tracking-widest mb-6 border-b border-slate-100 pb-4">Đơn Hàng</h2>
                                
                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-slate-600 text-sm">
                                        <span>Tạm tính</span>
                                        <span className="font-bold">{formatPrice(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-600 text-sm">
                                        <span>Phí vận chuyển</span>
                                        <span className="font-bold text-emerald-600">Miễn phí</span>
                                    </div>
                                    <div className="flex justify-between text-slate-600 text-sm">
                                        <span>Mã giảm giá</span>
                                        <span className="text-slate-400 italic">Chưa áp dụng</span>
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 pt-6 mb-8">
                                    <div className="flex justify-between items-end">
                                        <span className="text-sm font-bold uppercase tracking-widest text-slate-900">Tổng cộng</span>
                                        <div className="text-right">
                                            <span className="text-3xl font-black text-amber-600 block leading-none">{formatPrice(subtotal)}</span>
                                            <span className="text-[10px] text-slate-400">(Đã bao gồm VAT)</span>
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => alert("Tính năng Checkout đang được phát triển ở Phase 2!")}
                                    className="w-full bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold py-4 flex items-center justify-center gap-2 transition-colors uppercase tracking-widest text-sm mb-4"
                                >
                                    Tiến Hành Thanh Toán
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                                
                                <Link href="/products" className="block text-center text-sm text-slate-500 font-bold hover:text-amber-600 transition-colors uppercase tracking-widest">
                                    Tiếp tục mua sắm
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
