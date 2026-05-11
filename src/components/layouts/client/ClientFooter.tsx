import Link from "next/link";
import { Diamond, Facebook, Instagram, Twitter, MapPin, Phone, Mail } from "lucide-react";
import Image from "next/image";

export default function ClientFooter() {
    return (
        <footer className="bg-stone-900 text-stone-300 pt-20 pb-10 border-t border-gold/20">
            <div className="container mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    
                    {/* Brand Info */}
                    <div className="space-y-8">
                        <Link href="/" className="flex items-center gap-2 group">
                            <Diamond className="w-8 h-8 text-gold" />
                            <span className="text-2xl font-serif tracking-widest uppercase text-white">
                                Jewelry <span className="text-gold italic font-light">Eco</span>
                            </span>
                        </Link>
                        <p className="text-sm leading-relaxed text-stone-400 font-light">
                            Hệ thống trang sức cao cấp mang đến vẻ đẹp tinh tế và sang trọng cho mỗi khách hàng. Tự hào đồng hành cùng những khoảnh khắc quý giá nhất trong cuộc đời bạn.
                        </p>
                        <div className="flex items-center gap-4">
                            {[Facebook, Instagram, Twitter].map((Icon, idx) => (
                                <a key={idx} href="#" className="w-10 h-10 rounded-full border border-stone-800 flex items-center justify-center hover:bg-gold hover:border-gold hover:text-stone-900 transition-all text-stone-500">
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="lg:pl-10">
                        <h4 className="text-white font-serif tracking-widest uppercase text-sm mb-8 italic">Về Chúng Tôi</h4>
                        <ul className="space-y-4">
                            {["Về Jewelry Eco", "Cửa hàng", "Cẩm nang trang sức", "Liên hệ"].map((item, idx) => (
                                <li key={idx}>
                                    <Link href="#" className="text-sm text-stone-400 hover:text-gold transition-colors font-light tracking-wide">{item}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Customer Support */}
                    <div>
                        <h4 className="text-white font-serif tracking-widest uppercase text-sm mb-8 italic">Dịch Vụ</h4>
                        <ul className="space-y-4">
                            {["Câu hỏi thường gặp", "Chính sách giao hàng", "Chính sách đổi trả", "Chính sách bảo hành"].map((item, idx) => (
                                <li key={idx}>
                                    <Link href="#" className="text-sm text-stone-400 hover:text-gold transition-colors font-light tracking-wide">{item}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-white font-serif tracking-widest uppercase text-sm mb-8 italic">Liên Hệ</h4>
                        <ul className="space-y-5">
                            <li className="flex items-start gap-4 text-sm font-light leading-relaxed">
                                <MapPin className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                                <span>121 Bàu Cát 4, Phường Tân Bình, TP. Hồ Chí Minh</span>
                            </li>
                            <li className="flex items-center gap-4 text-sm font-light">
                                <Phone className="w-5 h-5 text-gold shrink-0" />
                                <span>070 8877 999</span>
                            </li>
                            <li className="flex items-center gap-4 text-sm font-light">
                                <Mail className="w-5 h-5 text-gold shrink-0" />
                                <span>vnj@trangsucdaquy.vn</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-10 border-t border-stone-800 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] text-stone-600 uppercase tracking-[0.3em] font-bold">
                        © 2026 Jewelry Eco Luxury Boutique. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                        <Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png" alt="Visa" className="h-4" />
                        <Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/200px-Mastercard-logo.svg.png" alt="Mastercard" className="h-5" />
                    </div>
                </div>
            </div>
        </footer>
    );
}
