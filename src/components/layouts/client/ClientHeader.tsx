"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingBag, User, Menu, X, Diamond, Phone, MapPin } from "lucide-react";
import { usePathname } from "next/navigation";

export default function ClientHeader() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Trang Chủ", href: "/" },
        { name: "Sản Phẩm", href: "/products" },
        { name: "Bộ Sưu Tập", href: "/collections" },
        { name: "Cẩm Nang", href: "/blog" },
        { name: "Liên Hệ", href: "/contact" },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-50">
            {/* Top Bar - Refined */}
            <div className={`bg-stone-900 text-white py-2 transition-all duration-300 ${isScrolled ? "h-0 overflow-hidden opacity-0" : "h-auto opacity-100"}`}>
                <div className="container mx-auto px-4 md:px-8 flex justify-between items-center text-[10px] font-bold tracking-[0.2em] uppercase">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <Phone className="w-3 h-3 text-gold" />
                            <span>Hotline: 070 8877 999</span>
                        </div>
                        <div className="hidden md:flex items-center gap-2 border-l border-white/20 pl-6">
                            <MapPin className="w-3 h-3 text-gold" />
                            <span>121 Bàu Cát 4, Tân Bình, HCM</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/policy" className="hover:text-gold transition-colors">Chính sách</Link>
                        <Link href="/faq" className="hover:text-gold transition-colors">Hỗ trợ</Link>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <div className={`transition-all duration-500 bg-white border-b ${isScrolled ? "py-3 shadow-md border-transparent" : "py-6 border-stone-100"}`}>
                <div className="container mx-auto px-4 md:px-8">
                    <div className="flex items-center justify-between">
                        {/* Mobile Menu Button */}
                        <button 
                            className="md:hidden text-stone-900"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>

                        {/* Logo - Professional Branding */}
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="relative">
                                <Diamond className="w-8 h-8 text-stone-900 group-hover:text-gold transition-colors duration-500" />
                                <div className="absolute inset-0 bg-gold blur-lg opacity-0 group-hover:opacity-20 transition-opacity"></div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-2xl md:text-3xl font-serif tracking-[0.1em] uppercase text-stone-900 leading-none">
                                    Jewelry <span className="text-gold italic font-light">Eco</span>
                                </span>
                                <span className="text-[7px] font-bold tracking-[0.4em] uppercase text-stone-400 mt-1">Luxury Boutique</span>
                            </div>
                        </Link>

                        {/* Desktop Navigation - Minimalist */}
                        <nav className="hidden lg:flex items-center gap-10">
                            {navLinks.map((link) => (
                                <Link 
                                    key={link.href} 
                                    href={link.href}
                                    className={`text-[11px] font-bold tracking-[0.2em] uppercase transition-all duration-300 relative group ${
                                        pathname === link.href ? "text-gold" : "text-stone-500 hover:text-stone-900"
                                    }`}
                                >
                                    {link.name}
                                    <span className={`absolute -bottom-2 left-0 h-[2px] bg-gold transition-all duration-300 ${pathname === link.href ? "w-full" : "w-0 group-hover:w-full"}`}></span>
                                </Link>
                            ))}
                        </nav>

                        {/* Actions - Clean Icons */}
                        <div className="flex items-center gap-4 md:gap-7">
                            <div className="hidden md:flex items-center bg-stone-50 rounded-full px-4 py-2 border border-stone-100 group focus-within:border-gold transition-all">
                                <Search className="w-4 h-4 text-stone-400 group-hover:text-gold transition-colors" />
                                <input 
                                    type="text" 
                                    placeholder="Tìm kiếm..." 
                                    className="bg-transparent border-none focus:outline-none text-xs ml-2 w-32 placeholder:text-stone-300"
                                />
                            </div>
                            
                            <div className="flex items-center gap-4">
                                <Link href="/login" className="text-stone-600 hover:text-gold transition-colors">
                                    <User className="w-5 h-5" />
                                </Link>
                                <Link href="/cart" className="relative text-stone-600 hover:text-gold transition-colors p-2 bg-stone-50 rounded-full border border-stone-100">
                                    <ShoppingBag className="w-5 h-5" />
                                    <span className="absolute top-0 right-0 bg-stone-900 text-white text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full shadow-sm border border-white">
                                        0
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-stone-100 shadow-2xl py-8 px-6 flex flex-col gap-6 animate-in fade-in slide-in-from-top-4 duration-300 h-screen">
                            {navLinks.map((link) => (
                                <Link 
                                    key={link.href} 
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`text-sm font-bold uppercase tracking-widest py-4 border-b border-stone-50 ${pathname === link.href ? "text-gold font-black" : "text-stone-600"}`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="mt-8 space-y-4">
                                <p className="text-[10px] text-stone-400 uppercase tracking-widest">Liên hệ nhanh</p>
                                <div className="flex items-center gap-3 text-stone-700">
                                    <Phone className="w-4 h-4 text-gold" />
                                    <span className="text-sm font-bold">070 8877 999</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
