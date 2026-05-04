import Link from "next/link";
import { Diamond, Facebook, Instagram, Twitter, MapPin, Phone, Mail } from "lucide-react";

export default function ClientFooter() {
    return (
        <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t-4 border-amber-500">
            <div className="container mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
                    
                    {/* Brand Info */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-2">
                            <Diamond className="w-8 h-8 text-amber-500" />
                            <span className="text-2xl font-black tracking-tighter uppercase text-white">
                                Jewelry <span className="text-amber-500">Eco</span>
                            </span>
                        </Link>
                        <p className="text-sm leading-relaxed text-slate-400">
                            Hệ thống trang sức cao cấp mang đến vẻ đẹp tinh tế và sang trọng cho mỗi khách hàng. Tự hào đồng hành cùng những khoảnh khắc quý giá.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-amber-500 hover:text-white transition-all text-slate-400">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-amber-500 hover:text-white transition-all text-slate-400">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-amber-500 hover:text-white transition-all text-slate-400">
                                <Twitter className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-bold uppercase tracking-wider mb-6">Liên Kết Nhanh</h4>
                        <ul className="space-y-3">
                            <li><Link href="/about" className="text-sm hover:text-amber-500 transition-colors">Về chúng tôi</Link></li>
                            <li><Link href="/products" className="text-sm hover:text-amber-500 transition-colors">Cửa hàng</Link></li>
                            <li><Link href="/blog" className="text-sm hover:text-amber-500 transition-colors">Cẩm nang trang sức</Link></li>
                            <li><Link href="/contact" className="text-sm hover:text-amber-500 transition-colors">Liên hệ</Link></li>
                        </ul>
                    </div>

                    {/* Customer Support */}
                    <div>
                        <h4 className="text-white font-bold uppercase tracking-wider mb-6">Hỗ Trợ Khách Hàng</h4>
                        <ul className="space-y-3">
                            <li><Link href="/faq" className="text-sm hover:text-amber-500 transition-colors">Câu hỏi thường gặp (FAQ)</Link></li>
                            <li><Link href="/policy/shipping" className="text-sm hover:text-amber-500 transition-colors">Chính sách giao hàng</Link></li>
                            <li><Link href="/policy/return" className="text-sm hover:text-amber-500 transition-colors">Chính sách đổi trả</Link></li>
                            <li><Link href="/policy/warranty" className="text-sm hover:text-amber-500 transition-colors">Chính sách bảo hành</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-white font-bold uppercase tracking-wider mb-6">Liên Hệ</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-sm">
                                <MapPin className="w-5 h-5 text-amber-500 shrink-0" />
                                <span>123 Tôn Đức Thắng, Quận 1, TP. Hồ Chí Minh</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm">
                                <Phone className="w-5 h-5 text-amber-500 shrink-0" />
                                <span>1900 6868</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm">
                                <Mail className="w-5 h-5 text-amber-500 shrink-0" />
                                <span>support@jewelry.eco</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-800 text-center flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">
                        © 2026 Jewelry Eco Luxury. All rights reserved.
                    </p>
                    <div className="flex gap-4">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png" alt="Visa" className="h-6 opacity-50 grayscale hover:grayscale-0 transition-all" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/200px-Mastercard-logo.svg.png" alt="Mastercard" className="h-6 opacity-50 grayscale hover:grayscale-0 transition-all" />
                    </div>
                </div>
            </div>
        </footer>
    );
}
