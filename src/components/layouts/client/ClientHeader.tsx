"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingBag, User, Menu, X, Diamond } from "lucide-react";
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
    ];

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-5"}`}>
            <div className="container mx-auto px-4 md:px-8">
                <div className="flex items-center justify-between">
                    {/* Mobile Menu Button */}
                    <button 
                        className="md:hidden text-slate-800"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <Diamond className="w-6 h-6 text-amber-500 group-hover:rotate-12 transition-transform" />
                        <span className="text-xl md:text-2xl font-black tracking-tighter uppercase text-slate-900">
                            Jewelry <span className="text-amber-500">Eco</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link 
                                key={link.href} 
                                href={link.href}
                                className={`text-sm font-bold tracking-wide uppercase transition-colors ${pathname === link.href ? "text-amber-600" : "text-slate-600 hover:text-amber-500"}`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-4 md:gap-6">
                        <button className="text-slate-700 hover:text-amber-500 transition-colors">
                            <Search className="w-5 h-5" />
                        </button>
                        <Link href="/login" className="hidden md:block text-slate-700 hover:text-amber-500 transition-colors">
                            <User className="w-5 h-5" />
                        </Link>
                        <Link href="/cart" className="text-slate-700 hover:text-amber-500 transition-colors relative">
                            <ShoppingBag className="w-5 h-5" />
                            <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                0
                            </span>
                        </Link>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-slate-100 shadow-lg py-4 px-4 flex flex-col gap-4 animate-in slide-in-from-top-2">
                        {navLinks.map((link) => (
                            <Link 
                                key={link.href} 
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`text-sm font-bold uppercase py-2 border-b border-slate-50 ${pathname === link.href ? "text-amber-600" : "text-slate-600"}`}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link href="/login" className="text-sm font-bold uppercase py-2 text-slate-600">Đăng nhập / Đăng ký</Link>
                    </div>
                )}
            </div>
        </header>
    );
}
