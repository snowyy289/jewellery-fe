/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useEffect, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Bell, User, LogOut, ChevronDown, Settings, Search, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { authService } from "@/services/admin/authService";
import { User as UserType } from "@/types/auth";
import { useConfirm } from "@/hooks/useConfirm";

const PAGE_TITLES: Record<string, string> = {
  dashboard: "Bảng Điều Khiển",
  categories: "Danh Mục",
  products: "Sản Phẩm",
  roles: "Nhóm Quyền",
  profile: "Trang Cá Nhân",
  suppliers: "Nhà Cung Cấp",
  "stock-imports": "Phiếu Nhập Kho",
  "stock-exports": "Phiếu Xuất Kho",
  inventory: "Tồn Kho",
  banners: "Banner",
  "article-categories": "Danh Mục Bài Viết",
  articles: "Bài Viết",
  users: "Người Dùng",
  permissions: "Danh Sách Quyền",
  create: "Tạo Mới",
  edit: "Chỉnh Sửa",
};

interface AdminHeaderProps {
    isSidebarCollapsed: boolean;
    onToggleSidebar: () => void;
}

export default function AdminHeader({ isSidebarCollapsed, onToggleSidebar }: AdminHeaderProps) {
    const pathname = usePathname();
    const router = useRouter();
    const confirm = useConfirm();
    const [user, setUser] = useState<UserType | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [hasNotif] = useState(true);
    const menuRef = useRef<HTMLDivElement>(null);
    
    // Load user from localStorage after mount to avoid hydration mismatch
    useEffect(() => {
        if (typeof window !== "undefined") {
            const userData = localStorage.getItem("user");
            if (userData) {
                setUser(JSON.parse(userData)); // eslint-disable-line react-hooks/set-state-in-effect
            }
        }
    }, []);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        confirm(
            "Bạn có chắc chắn muốn đăng xuất?",
            async () => {
                try {
                    await authService.logout();
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    // Remove cookie
                    document.cookie = "token=; path=/; max-age=0";
                    window.location.href = "/admin/login";
                } catch {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    // Remove cookie
                    document.cookie = "token=; path=/; max-age=0";
                    window.location.href = "/admin/login";
                }
            },
            {
                title: "Đăng xuất",
                confirmText: "Đăng xuất",
                variant: "warning"
            }
        );
    };

    const segments = pathname.split("/").filter(Boolean);
    
    // Get the meaningful segment (skip 'admin', 'edit', 'create', and IDs)
    let displaySegment = segments[segments.length - 1] || "dashboard";
    
    // If last segment looks like an ID (24 hex chars), go back to find the main resource
    if (displaySegment.match(/^[a-f0-9]{24}$/i)) {
        // Go back to find the main resource (skip 'edit', 'create')
        for (let i = segments.length - 2; i >= 0; i--) {
            if (!['edit', 'create', 'admin'].includes(segments[i])) {
                displaySegment = segments[i];
                break;
            }
        }
    }
    // If it's 'edit' or 'create', use the previous segment
    else if (['edit', 'create'].includes(displaySegment) && segments.length > 2) {
        displaySegment = segments[segments.length - 2];
    }
    
    const title = PAGE_TITLES[displaySegment] || (displaySegment.charAt(0).toUpperCase() + displaySegment.slice(1));

    return (
        <header className="h-16 flex items-center justify-between px-6 sticky top-0 z-30 border-b" style={{
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(20px)",
            borderColor: "rgba(226,232,240,0.6)",
            boxShadow: "0 1px 0 rgba(0,0,0,0.04), 0 4px 20px rgba(0,0,0,0.02)",
        }}>
            {/* Left: Toggle & Breadcrumb */}
            <div className="flex items-center gap-4">
                <button 
                    onClick={onToggleSidebar}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-indigo-600 transition-all duration-200 border border-slate-200/60 shadow-sm"
                    title={isSidebarCollapsed ? "Mở rộng menu" : "Thu gọn menu"}
                >
                    {isSidebarCollapsed ? (
                        <PanelLeftOpen className="w-5 h-5 transition-transform duration-300" />
                    ) : (
                        <PanelLeftClose className="w-5 h-5 transition-transform duration-300" />
                    )}
                </button>

                <div className="hidden sm:block">
                    <h1 className="text-base font-bold text-slate-800 leading-none">{title}</h1>
                    <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-[10px] font-medium text-slate-400">Admin</span>
                        <span className="text-[10px] text-slate-300">›</span>
                        <span className="text-[10px] font-medium" style={{ color: "#6366f1" }}>{title}</span>
                    </div>
                </div>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2">
                {/* Search */}
                <button className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-slate-400 transition-all duration-200 hover:bg-slate-50 border border-slate-200/60">
                    <Search className="w-3.5 h-3.5" />
                    <span className="text-xs">Tìm kiếm...</span>
                    <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-400 border border-slate-200">⌘K</kbd>
                </button>

                {/* Notification */}
                <div className="relative">
                    <button className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all duration-200 border border-slate-200/60">
                        <Bell className="w-4 h-4" />
                    </button>
                    {hasNotif && (
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border-2 border-white" style={{ background: "#6366f1" }} />
                    )}
                </div>

                {/* Settings */}
                <button className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all duration-200 border border-slate-200/60">
                    <Settings className="w-4 h-4" />
                </button>

                {/* Divider */}
                <div className="w-px h-6 mx-1 bg-slate-200/80" />

                {/* User menu */}
                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-2xl transition-all duration-200 border hover:shadow-sm"
                        style={{
                            background: isMenuOpen ? "rgba(99,102,241,0.05)" : "rgba(248,250,252,0.8)",
                            borderColor: isMenuOpen ? "rgba(99,102,241,0.3)" : "rgba(226,232,240,0.8)",
                        }}
                    >
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center overflow-hidden border border-slate-200 shadow-sm"
                            style={{ background: "linear-gradient(135deg, #e0e7ff, #c7d2fe)" }}>
                            {user?.avatar ? (
                                <Image src={user.avatar} alt="avatar" width={32} height={32} className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-4 h-4" style={{ color: "#6366f1" }} />
                            )}
                        </div>
                        <div className="hidden md:block text-left">
                            <p className="text-xs font-bold text-slate-800 leading-none">{user?.fullName || "Admin User"}</p>
                            <p className="text-[10px] font-medium mt-0.5" style={{ color: "#6366f1" }}>{user?.role || "Administrator"}</p>
                        </div>
                        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isMenuOpen ? "rotate-180" : ""}`} />
                    </button>

                    {isMenuOpen && (
                        <div className="absolute top-full right-0 mt-2 w-52 rounded-2xl border overflow-hidden"
                            style={{
                                background: "rgba(255,255,255,0.98)",
                                backdropFilter: "blur(20px)",
                                borderColor: "rgba(226,232,240,0.8)",
                                boxShadow: "0 20px 40px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.03)",
                            }}>
                            {/* User info header */}
                            <div className="px-4 py-3 border-b border-slate-100" style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.04), rgba(129,140,248,0.02))" }}>
                                <p className="text-xs font-bold text-slate-800">{user?.fullName || "Admin User"}</p>
                                <p className="text-[10px] text-slate-400 mt-0.5">{user?.email || "admin@jewelry.eco"}</p>
                            </div>

                            <div className="py-1.5">
                                <Link
                                    href="/admin/profile"
                                    className="flex items-center gap-2.5 px-4 py-2.5 text-slate-700 hover:bg-slate-50 transition-colors group"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-slate-100 group-hover:bg-indigo-100 transition-colors">
                                        <User className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-600 transition-colors" />
                                    </div>
                                    <span className="text-sm font-medium">Trang cá nhân</span>
                                </Link>
                            </div>

                            <div className="border-t border-slate-100 py-1.5">
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2.5 px-4 py-2.5 w-full text-left group hover:bg-red-50 transition-colors"
                                >
                                    <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-red-50 group-hover:bg-red-100 transition-colors">
                                        <LogOut className="w-3.5 h-3.5 text-red-500" />
                                    </div>
                                    <span className="text-sm font-semibold text-red-600">Đăng xuất</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
