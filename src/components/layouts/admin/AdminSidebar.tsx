/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Package,
  Layers,
  Shield,
  ChevronRight,
  Sparkles,
  Key,
  Users,
  Warehouse,
  PackageCheck,
  PackageMinus,
  ChevronDown,
  BarChart3,
  Image,
  FileText,
  Settings,
  Tags
} from "lucide-react";

interface AdminSidebarProps {
  isCollapsed: boolean;
}

interface NavItem {
  href?: string;
  label: string;
  icon: React.ElementType;
  desc: string;
  children?: NavItem[];
}

export default function AdminSidebar({ isCollapsed }: AdminSidebarProps) {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const toggleMenu = (label: string) => {
    setOpenMenus(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  const navItems: NavItem[] = [
    // Dashboard
    { 
      href: "/admin/dashboard", 
      label: "Bảng Điều Khiển", 
      icon: LayoutDashboard, 
      desc: "Tổng quan hệ thống" 
    },

    // Quản lý sản phẩm
    { 
      href: "/admin/categories", 
      label: "Danh Mục SP", 
      icon: Layers, 
      desc: "Phân loại sản phẩm" 
    },
    { 
      href: "/admin/brands", 
      label: "Thương Hiệu", 
      icon: Tags, 
      desc: "Quản lý hãng/brand" 
    },
    { 
      href: "/admin/products", 
      label: "Sản Phẩm", 
      icon: Package, 
      desc: "Quản lý sản phẩm" 
    },
    
    // Quản lý kho
    { 
      label: "Quản Lý Kho", 
      icon: Warehouse, 
      desc: "Nhập xuất & tồn kho",
      children: [
        { href: "/admin/suppliers", label: "Nhà Cung Cấp", icon: Users, desc: "Quản lý NCC" },
        { href: "/admin/stock-imports", label: "Phiếu Nhập", icon: PackageCheck, desc: "Nhập hàng" },
        { href: "/admin/stock-exports", label: "Phiếu Xuất", icon: PackageMinus, desc: "Xuất hàng" },
        { href: "/admin/inventory", label: "Tồn Kho", icon: BarChart3, desc: "Báo cáo tồn" },
      ]
    },

    // Nội dung website
    { 
      label: "Nội Dung Web", 
      icon: FileText, 
      desc: "Banner & Bài viết",
      children: [
        { href: "/admin/banners", label: "Banner", icon: Image, desc: "Quản lý banner" },
        { href: "/admin/articles", label: "Bài Viết", icon: FileText, desc: "Blog & Tin tức" },
      ]
    },

    // Hệ thống
    { 
      label: "Hệ Thống", 
      icon: Settings, 
      desc: "Cấu hình & Phân quyền",
      children: [
        { href: "/admin/users", label: "Người Dùng", icon: Users, desc: "Quản lý tài khoản" },
        { href: "/admin/roles", label: "Nhóm Quyền", icon: Shield, desc: "Vai trò hệ thống" },
        { href: "/admin/permissions", label: "Danh Sách Quyền", icon: Key, desc: "Quản lý mã quyền" },
      ]
    },
  ];

  // Auto-open parent menu when child route is active
  useEffect(() => {
    const menusToOpen: string[] = [];
    
    navItems.forEach(item => {
      if (item.children) {
        const hasActiveChild = item.children.some(child => 
          child.href && pathname.startsWith(child.href)
        );
        if (hasActiveChild) {
          menusToOpen.push(item.label);
        }
      }
    });
    
    if (menusToOpen.length > 0) {
      setOpenMenus(menusToOpen);
    }
  }, [pathname]);

  return (
    <aside 
      className={`flex flex-col h-screen sticky top-0 overflow-hidden transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-20" : "w-72"
      }`} 
      style={{
        background: "linear-gradient(160deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
      }}
    >
      {/* Decorative glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-30%] left-[-20%] w-[300px] h-[300px] rounded-full opacity-20" style={{ background: "radial-gradient(circle, #818cf8, transparent)" }} />
        <div className="absolute bottom-[-20%] right-[-20%] w-[250px] h-[250px] rounded-full opacity-10" style={{ background: "radial-gradient(circle, #c084fc, transparent)" }} />
      </div>

      {/* Logo */}
      <div className={`relative z-10 pt-8 pb-6 transition-all duration-300 ${isCollapsed ? "px-5" : "px-6"}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg shrink-0" style={{ background: "linear-gradient(135deg, #818cf8, #6366f1)" }}>
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <div className="whitespace-nowrap overflow-hidden transition-all duration-300">
              <div className="text-xl font-black tracking-tight text-white leading-none">
                Jewelry<span style={{ color: "#818cf8" }}>.</span>Eco
              </div>
              <div className="text-[10px] font-medium mt-0.5" style={{ color: "rgba(129,140,248,0.7)" }}>
                ADMIN PANEL
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="mx-6 h-px mb-6 relative z-10" style={{ background: "linear-gradient(90deg, transparent, rgba(129,140,248,0.3), transparent)" }} />

      {/* Nav */}
      <nav className={`relative z-10 flex-1 flex flex-col gap-1 overflow-y-auto transition-all duration-300 ${isCollapsed ? "px-3" : "px-4"}`}>
        {!isCollapsed && (
          <p className="px-3 text-[9px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: "rgba(129,140,248,0.5)" }}>
            Điều Hướng
          </p>
        )}
        {navItems.map((item) => {
          const Icon = item.icon;
          const hasChildren = item.children && item.children.length > 0;
          const isOpen = openMenus.includes(item.label);
          const isActive = item.href ? pathname.startsWith(item.href) : false;
          const hasActiveChild = hasChildren && item.children?.some(child => child.href && pathname.startsWith(child.href));

          // Parent menu item (with or without children)
          if (hasChildren) {
            return (
              <div key={item.label}>
                <button
                  onClick={() => !isCollapsed && toggleMenu(item.label)}
                  className={`group w-full flex items-center gap-3 rounded-2xl transition-all duration-300 relative overflow-hidden ${
                    isCollapsed ? "px-2 py-3 justify-center" : "px-3 py-3"
                  }`}
                  style={{
                    background: hasActiveChild
                      ? "linear-gradient(135deg, rgba(99,102,241,0.25), rgba(129,140,248,0.15))"
                      : "transparent",
                    border: hasActiveChild
                      ? "1px solid rgba(129,140,248,0.3)"
                      : "1px solid transparent",
                  }}
                >
                  {hasActiveChild && (
                    <div className="absolute inset-0 rounded-2xl" style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.05), transparent)", backdropFilter: "blur(4px)" }} />
                  )}

                  <div
                    className="relative z-10 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 shrink-0"
                    style={{
                      background: hasActiveChild
                        ? "linear-gradient(135deg, #6366f1, #818cf8)"
                        : "rgba(255,255,255,0.05)",
                      boxShadow: hasActiveChild ? "0 4px 12px rgba(99,102,241,0.4)" : "none",
                    }}
                  >
                    <Icon className="w-4 h-4 transition-colors duration-300" style={{ color: hasActiveChild ? "white" : "rgba(148,163,184,0.8)" }} />
                  </div>

                  {!isCollapsed && (
                    <>
                      <div className="relative z-10 flex-1 whitespace-nowrap overflow-hidden text-left">
                        <div
                          className="text-sm font-semibold transition-colors duration-300 leading-none mb-0.5"
                          style={{ color: hasActiveChild ? "white" : "rgba(148,163,184,0.9)" }}
                        >
                          {item.label}
                        </div>
                        <div className="text-[10px] transition-colors duration-300" style={{ color: hasActiveChild ? "rgba(129,140,248,0.8)" : "rgba(100,116,139,0.6)" }}>
                          {item.desc}
                        </div>
                      </div>

                      <ChevronDown
                        className={`relative z-10 w-3.5 h-3.5 transition-all duration-300 ${isOpen ? 'rotate-180' : ''}`}
                        style={{ color: hasActiveChild ? "rgba(129,140,248,0.8)" : "rgba(100,116,139,0.3)" }}
                      />
                    </>
                  )}
                </button>

                {/* Submenu */}
                {!isCollapsed && isOpen && (
                  <div className="ml-3 mt-1 space-y-1 border-l-2 border-slate-700/50 pl-3">
                    {item.children?.map((child) => {
                      const ChildIcon = child.icon;
                      const isChildActive = child.href ? pathname.startsWith(child.href) : false;
                      return (
                        <Link
                          key={child.href}
                          href={child.href || "#"}
                          className={`group flex items-center gap-2 rounded-xl transition-all duration-300 px-2 py-2 ${
                            isChildActive ? 'bg-indigo-500/10' : 'hover:bg-white/5'
                          }`}
                        >
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300 shrink-0"
                            style={{
                              background: isChildActive ? "rgba(99,102,241,0.2)" : "transparent",
                            }}
                          >
                            <ChildIcon className="w-3.5 h-3.5" style={{ color: isChildActive ? "#818cf8" : "rgba(148,163,184,0.6)" }} />
                          </div>
                          <div className="flex-1">
                            <div
                              className="text-xs font-semibold transition-colors duration-300"
                              style={{ color: isChildActive ? "#818cf8" : "rgba(148,163,184,0.8)" }}
                            >
                              {child.label}
                            </div>
                            <div className="text-[9px]" style={{ color: "rgba(100,116,139,0.5)" }}>
                              {child.desc}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          // Regular menu item (no children)
          return (
            <Link
              key={item.href}
              href={item.href || "#"}
              className={`group flex items-center gap-3 rounded-2xl transition-all duration-300 relative overflow-hidden ${
                isCollapsed ? "px-2 py-3 justify-center" : "px-3 py-3"
              }`}
              style={{
                background: isActive
                  ? "linear-gradient(135deg, rgba(99,102,241,0.25), rgba(129,140,248,0.15))"
                  : "transparent",
                border: isActive
                  ? "1px solid rgba(129,140,248,0.3)"
                  : "1px solid transparent",
              }}
            >
              {isActive && (
                <div className="absolute inset-0 rounded-2xl" style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.05), transparent)", backdropFilter: "blur(4px)" }} />
              )}

              <div
                className="relative z-10 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 shrink-0"
                style={{
                  background: isActive
                    ? "linear-gradient(135deg, #6366f1, #818cf8)"
                    : "rgba(255,255,255,0.05)",
                  boxShadow: isActive ? "0 4px 12px rgba(99,102,241,0.4)" : "none",
                }}
              >
                <Icon className="w-4 h-4 transition-colors duration-300" style={{ color: isActive ? "white" : "rgba(148,163,184,0.8)" }} />
              </div>

              {!isCollapsed && (
                <>
                  <div className="relative z-10 flex-1 whitespace-nowrap overflow-hidden">
                    <div
                      className="text-sm font-semibold transition-colors duration-300 leading-none mb-0.5"
                      style={{ color: isActive ? "white" : "rgba(148,163,184,0.9)" }}
                    >
                      {item.label}
                    </div>
                    <div className="text-[10px] transition-colors duration-300" style={{ color: isActive ? "rgba(129,140,248,0.8)" : "rgba(100,116,139,0.6)" }}>
                      {item.desc}
                    </div>
                  </div>

                  <ChevronRight
                    className="relative z-10 w-3.5 h-3.5 transition-all duration-300 group-hover:translate-x-0.5"
                    style={{ color: isActive ? "rgba(129,140,248,0.8)" : "rgba(100,116,139,0.3)" }}
                  />
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom version tag */}
      <div className={`relative z-10 py-5 transition-all duration-300 ${isCollapsed ? "px-4" : "px-6"}`}>
        <div className="h-px mb-4" style={{ background: "linear-gradient(90deg, transparent, rgba(129,140,248,0.2), transparent)" }} />
        <div className={`flex items-center gap-2 ${isCollapsed ? "justify-center" : ""}`}>
          <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#6366f1", boxShadow: "0 0 6px #6366f1" }} />
          {!isCollapsed && (
            <p className="text-[10px] font-medium whitespace-nowrap overflow-hidden" style={{ color: "rgba(100,116,139,0.7)" }}>
              Jewelry Eco © 2026 · v1.0
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}
