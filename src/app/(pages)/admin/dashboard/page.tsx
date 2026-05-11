"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { TrendingUp, ShoppingBag, DollarSign, Sparkles, CreditCard, Package, Eye } from "lucide-react";
import { AdminPageHeader, AdminStatsCard, AdminCard } from "@/components/layouts/admin/shared";
import Button from "@/components/button/Button";
import { paymentService } from "@/services/admin/paymentService";
import { orderService } from "@/services/admin/orderService";

interface PaymentStats {
    total_payments: number;
    total_amount: number;
    success_count: number;
    success_amount: number;
    pending_count: number;
    pending_amount: number;
}

interface OrderStats {
    total_orders: number;
    total_revenue: number;
    pending_count: number;
    confirmed_count: number;
    processing_count: number;
    shipping_count: number;
    delivered_count: number;
    cancelled_count: number;
}

interface RecentPayment {
    _id: string;
    order_code: string;
    payment_method: string;
    payment_status: string;
    amount: number;
    createdAt: string;
}

interface RecentOrder {
    _id: string;
    order_code: string;
    status: string;
    payment_status: string;
    total: number;
    createdAt: string;
    shipping_address: {
        full_name: string;
    };
}

export default function DashboardPage() {
    const [paymentStats, setPaymentStats] = useState<PaymentStats | null>(null);
    const [orderStats, setOrderStats] = useState<OrderStats | null>(null);
    const [recentPayments, setRecentPayments] = useState<RecentPayment[]>([]);
    const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setIsLoading(true);
        try {
            // Fetch payment statistics
            const paymentStatsRes = await paymentService.getPaymentStatistics();
            if (paymentStatsRes.code === 200) {
                setPaymentStats(paymentStatsRes.data);
            }

            // Fetch order statistics
            const orderStatsRes = await orderService.getOrderStatistics();
            if (orderStatsRes.code === 200) {
                setOrderStats(orderStatsRes.data);
            }

            // Fetch recent payments
            const paymentsRes = await paymentService.getAllPayments({ page: 1, limit: 5 });
            if (paymentsRes.code === 200) {
                setRecentPayments(paymentsRes.data);
            }

            // Fetch recent orders
            const ordersRes = await orderService.getAllOrders({ page: 1, limit: 5 });
            if (ordersRes.code === 200) {
                setRecentOrders(ordersRes.data);
            }
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const stats = [
        {
            label: "Tổng Doanh Thu",
            value: orderStats ? formatPrice(orderStats.total_revenue) : "0đ",
            icon: DollarSign,
            color: "indigo" as const,
            trend: { value: `${orderStats?.delivered_count || 0} đơn`, isUp: true }
        },
        {
            label: "Đơn Hàng",
            value: orderStats?.total_orders.toString() || "0",
            icon: ShoppingBag,
            color: "amber" as const,
            trend: { value: `${orderStats?.pending_count || 0} chờ xử lý`, isUp: true }
        },
        {
            label: "Thanh Toán",
            value: (paymentStats?.total_payments || 0).toString(),
            icon: CreditCard,
            color: "emerald" as const,
            trend: { value: `${paymentStats?.success_count || 0} thành công`, isUp: true }
        },
        {
            label: "Đang Giao",
            value: (orderStats?.shipping_count || 0).toString(),
            icon: TrendingUp,
            color: "slate" as const,
            trend: { value: `${orderStats?.processing_count || 0} đang xử lý`, isUp: true }
        },
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin border-indigo-500/20" style={{ borderTopColor: "#6366f1" }} />
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Đang tải...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-10">
            <AdminPageHeader
                title="Bảng điều khiển"
                subTitle="Chào mừng bạn quay trở lại! Dưới đây là tóm tắt hoạt động kinh doanh."
                actions={
                    <Button variant="outline" size="sm" icon={<TrendingUp className="w-4 h-4" />} onClick={fetchDashboardData}>
                        Làm mới
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

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Payments */}
                <AdminCard title="Giao dịch gần đây" subTitle={`${recentPayments.length} giao dịch mới nhất`}>
                    <div className="space-y-3">
                        {recentPayments.length === 0 ? (
                            <p className="text-sm text-slate-400 italic text-center py-8">Chưa có giao dịch nào</p>
                        ) : (
                            recentPayments.map((payment) => (
                                <Link key={payment._id} href={`/admin/payments/${payment._id}`}>
                                    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                                                <CreditCard className="w-5 h-5 text-indigo-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800">{payment.order_code}</p>
                                                <p className="text-xs text-slate-400 uppercase">{payment.payment_method}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-black text-slate-800">{formatPrice(payment.amount)}</p>
                                            <p className={`text-xs font-bold ${payment.payment_status === 'success' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                                {payment.payment_status === 'success' ? 'Thành công' : 'Chờ xử lý'}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                        <Link href="/admin/payments">
                            <Button variant="outline" size="sm" className="w-full mt-4" icon={<Eye className="w-4 h-4" />}>
                                Xem tất cả giao dịch
                            </Button>
                        </Link>
                    </div>
                </AdminCard>

                {/* Recent Orders */}
                <AdminCard title="Đơn hàng gần đây" subTitle={`${recentOrders.length} đơn hàng mới nhất`}>
                    <div className="space-y-3">
                        {recentOrders.length === 0 ? (
                            <p className="text-sm text-slate-400 italic text-center py-8">Chưa có đơn hàng nào</p>
                        ) : (
                            recentOrders.map((order) => (
                                <Link key={order._id} href={`/admin/orders/${order._id}`}>
                                    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                                                <Package className="w-5 h-5 text-amber-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800">{order.order_code}</p>
                                                <p className="text-xs text-slate-400">{order.shipping_address.full_name}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-black text-slate-800">{formatPrice(order.total)}</p>
                                            <p className={`text-xs font-bold capitalize ${
                                                order.status === 'delivered' ? 'text-emerald-600' : 
                                                order.status === 'cancelled' ? 'text-rose-600' : 
                                                'text-blue-600'
                                            }`}>
                                                {order.status === 'pending' ? 'Chờ xác nhận' :
                                                 order.status === 'confirmed' ? 'Đã xác nhận' :
                                                 order.status === 'processing' ? 'Đang xử lý' :
                                                 order.status === 'shipping' ? 'Đang giao' :
                                                 order.status === 'delivered' ? 'Đã giao' :
                                                 'Đã hủy'}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                        <Link href="/admin/orders">
                            <Button variant="outline" size="sm" className="w-full mt-4" icon={<Eye className="w-4 h-4" />}>
                                Xem tất cả đơn hàng
                            </Button>
                        </Link>
                    </div>
                </AdminCard>
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
                            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Hệ thống quản lý</span>
                        </div>
                        <h2 className="text-3xl font-black text-slate-800 leading-tight">
                            Quản lý đơn hàng và thanh toán hiệu quả
                        </h2>
                        <p className="text-slate-500 font-medium leading-relaxed">
                            Theo dõi đơn hàng, xác nhận thanh toán COD, cập nhật trạng thái vận chuyển và quản lý toàn bộ quy trình bán hàng một cách dễ dàng.
                        </p>
                        <div className="pt-2 flex gap-3">
                            <Link href="/admin/orders">
                                <Button size="lg" icon={<Package className="w-4 h-4" />}>
                                    Quản lý đơn hàng
                                </Button>
                            </Link>
                            <Link href="/admin/payments">
                                <Button size="lg" variant="outline" icon={<CreditCard className="w-4 h-4" />}>
                                    Quản lý thanh toán
                                </Button>
                            </Link>
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
