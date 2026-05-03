"use client";
import { TrendingUp, Users, ShoppingBag, DollarSign, Sparkles, ArrowRight } from "lucide-react";
import { AdminPageHeader, AdminStatsCard, AdminCard } from "@/components/layouts/admin/shared";
import Button from "@/components/button/Button";

export default function DashboardPage() {
    const stats = [
        {
            label: "Doanh Thu Ngày",
            value: "8,500,000đ",
            icon: DollarSign,
            color: "indigo" as const,
            trend: { value: "12%", isUp: true }
        },
        {
            label: "Đơn Hàng",
            value: "42",
            icon: ShoppingBag,
            color: "amber" as const,
            trend: { value: "5%", isUp: true }
        },
        {
            label: "Khách Mới",
            value: "12",
            icon: Users,
            color: "emerald" as const,
            trend: { value: "2%", isUp: false }
        },
        {
            label: "Tỉ Lệ Chốt",
            value: "68%",
            icon: TrendingUp,
            color: "slate" as const,
            trend: { value: "3%", isUp: true }
        },
    ];

    return (
        <div className="space-y-6 pb-10">
            <AdminPageHeader
                title="Bảng điều khiển"
                subTitle="Chào mừng bạn quay trở lại! Dưới đây là tóm tắt hoạt động kinh doanh hôm nay."
                actions={
                    <Button variant="outline" size="sm" icon={<TrendingUp className="w-4 h-4" />}>
                        Báo cáo chi tiết
                    </Button>
                }
            />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <AdminStatsCard
                        key={index}
                        label={stat.label}
                        value={stat.value}
                        icon={stat.icon}
                        color={stat.color}
                        trend={stat.trend}
                    />
                ))}
            </div>

            {/* Promo / Action Card */}
            <AdminCard className="relative overflow-hidden group">
                {/* Decorative background effects */}
                <div className="absolute inset-0 bg-linear-to-r from-indigo-600/5 to-transparent pointer-events-none" />
                <div className="absolute -right-20 -top-20 w-80 h-80 bg-indigo-100 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity pointer-events-none" />

                <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                    <div className="space-y-4 max-w-xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Mới cập nhật</span>
                        </div>
                        <h2 className="text-3xl font-black text-slate-800 leading-tight">
                            Sẵn sàng để bứt phá doanh thu tháng này?
                        </h2>
                        <p className="text-slate-500 font-medium leading-relaxed">
                            Hệ thống đã tự động tối ưu hóa dữ liệu khách hàng. Mọi thông tin đã sẵn sàng để bạn đưa ra các quyết định chiến lược hiệu quả nhất.
                        </p>
                        <div className="pt-2">
                            <Button size="lg" icon={<ArrowRight className="w-4 h-4" />}>
                                Bắt đầu ngay
                            </Button>
                        </div>
                    </div>

                    <div className="hidden lg:block relative w-1/3">
                        {/* Placeholder for a nice visual or chart */}
                        <div className="aspect-square bg-indigo-50 rounded-[3rem] border border-indigo-100 flex items-center justify-center relative overflow-hidden">
                             <div className="absolute inset-0 opacity-10" style={{
                                backgroundImage: "radial-gradient(#6366f1 1px, transparent 1px)",
                                backgroundSize: "16px 16px"
                             }} />
                             <TrendingUp className="w-24 h-24 text-indigo-200" />
                        </div>
                    </div>
                </div>
            </AdminCard>
        </div>
    );
}
