"use client";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Package, Eye, Download } from "lucide-react";
import Button from "@/components/button/Button";
import { AdminPageHeader, AdminCard } from "@/components/layouts/admin/shared";
import { orderService } from "@/services/admin/orderService";
import { toast } from "sonner";
import Search from "@/components/search/Search";
import Pagination from "@/components/pagination/Pagination";

interface Order {
  _id: string;
  order_code: string;
  status: string;
  payment_status: string;
  payment_method: string;
  total: number;
  createdAt: string;
  shipping_address: {
    full_name: string;
    phone: string;
  };
  user_id?: {
    fullName: string;
    email: string;
  };
}

function OrdersContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0
  });

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    fetchOrders(params);
  }, [searchParams]);

  const fetchOrders = async (params: Record<string, string> = {}) => {
    setIsLoading(true);
    try {
      const res = await orderService.getAllOrders(params);
      if (res.code === 200) {
        setOrders(res.data);
        if (res.pagination) {
          setPagination({
            page: res.pagination.page,
            totalPages: res.pagination.totalPages,
            total: res.pagination.total
          });
        }
      }
    } catch (error) {
      console.error("Fetch orders error:", error);
      toast.error("Lỗi khi tải danh sách đơn hàng");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const params = Object.fromEntries(searchParams.entries());
      const blob = await orderService.exportOrders(params);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `orders-${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Xuất file thành công!");
    } catch {
      toast.error("Lỗi khi xuất file");
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const getOrderStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; label: string; dot: string }> = {
      pending: { bg: 'bg-amber-50', text: 'text-amber-600', label: 'Chờ xác nhận', dot: 'bg-amber-500' },
      confirmed: { bg: 'bg-blue-50', text: 'text-blue-600', label: 'Đã xác nhận', dot: 'bg-blue-500' },
      processing: { bg: 'bg-purple-50', text: 'text-purple-600', label: 'Đang xử lý', dot: 'bg-purple-500' },
      shipping: { bg: 'bg-indigo-50', text: 'text-indigo-600', label: 'Đang giao', dot: 'bg-indigo-500' },
      delivered: { bg: 'bg-emerald-50', text: 'text-emerald-600', label: 'Đã giao', dot: 'bg-emerald-500' },
      cancelled: { bg: 'bg-rose-50', text: 'text-rose-600', label: 'Đã hủy', dot: 'bg-rose-500' }
    };
    const badge = badges[status] || badges.pending;
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${badge.bg} ${badge.text} border-${badge.text.replace('text-', '')}/20`}>
        <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
        {badge.label}
      </div>
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      unpaid: { bg: 'bg-amber-50', text: 'text-amber-600', label: 'Chưa thanh toán' },
      paid: { bg: 'bg-emerald-50', text: 'text-emerald-600', label: 'Đã thanh toán' },
      refunded: { bg: 'bg-slate-50', text: 'text-slate-600', label: 'Đã hoàn tiền' }
    };
    const badge = badges[status] || badges.unpaid;
    return (
      <span className={`inline-flex px-2 py-1 rounded-lg text-[9px] font-bold uppercase ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  return (
    <div className="w-full space-y-6 pb-10">
      <AdminPageHeader
        title="Quản lý đơn hàng"
        subTitle="Danh sách tất cả đơn hàng trong hệ thống"
        actions={
          <Button size="sm" variant="outline" icon={<Download className="w-4 h-4" />} onClick={handleExport}>
            Xuất CSV
          </Button>
        }
      />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex gap-2">
          <select 
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onChange={(e) => {
              const params = new URLSearchParams(searchParams.toString());
              if (e.target.value) {
                params.set('status', e.target.value);
              } else {
                params.delete('status');
              }
              params.set('page', '1');
              window.history.pushState(null, '', `?${params.toString()}`);
              fetchOrders(Object.fromEntries(params.entries()));
            }}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="pending">Chờ xác nhận</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="processing">Đang xử lý</option>
            <option value="shipping">Đang giao</option>
            <option value="delivered">Đã giao</option>
            <option value="cancelled">Đã hủy</option>
          </select>

          <select 
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onChange={(e) => {
              const params = new URLSearchParams(searchParams.toString());
              if (e.target.value) {
                params.set('payment_status', e.target.value);
              } else {
                params.delete('payment_status');
              }
              params.set('page', '1');
              window.history.pushState(null, '', `?${params.toString()}`);
              fetchOrders(Object.fromEntries(params.entries()));
            }}
          >
            <option value="">Tất cả thanh toán</option>
            <option value="unpaid">Chưa thanh toán</option>
            <option value="paid">Đã thanh toán</option>
            <option value="refunded">Đã hoàn tiền</option>
          </select>

          <select 
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onChange={(e) => {
              const params = new URLSearchParams(searchParams.toString());
              if (e.target.value) {
                params.set('payment_method', e.target.value);
              } else {
                params.delete('payment_method');
              }
              params.set('page', '1');
              window.history.pushState(null, '', `?${params.toString()}`);
              fetchOrders(Object.fromEntries(params.entries()));
            }}
          >
            <option value="">Tất cả phương thức</option>
            <option value="cod">COD</option>
            <option value="vnpay">VNPay</option>
            <option value="momo">MoMo</option>
            <option value="zalopay">ZaloPay</option>
          </select>
        </div>
        <Search />
      </div>

      <AdminCard noPadding title="Tất cả đơn hàng" subTitle={`${pagination.total} đơn hàng`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mã đơn hàng</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Khách hàng</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tổng tiền</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Thanh toán</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trạng thái</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ngày tạo</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin border-indigo-500/20" style={{ borderTopColor: "#6366f1" }} />
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Đang tải...</p>
                    </div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-8 py-20 text-center text-slate-400 italic font-medium">
                    Chưa có đơn hàng nào.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr 
                    key={order._id} 
                    className="group hover:bg-indigo-50/30 transition-all duration-300 cursor-pointer"
                    onClick={() => router.push(`/admin/orders/${order._id}`)}
                  >
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                          <Package className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{order.order_code}</p>
                          <p className="text-[10px] text-slate-400 font-medium uppercase">{order.payment_method}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-700">
                          {order.shipping_address.full_name}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {order.shipping_address.phone}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <span className="text-sm font-black text-slate-800">
                        {formatPrice(order.total)}
                      </span>
                    </td>
                    <td className="px-8 py-4">
                      {getPaymentStatusBadge(order.payment_status)}
                    </td>
                    <td className="px-8 py-4">
                      {getOrderStatusBadge(order.status)}
                    </td>
                    <td className="px-8 py-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-700">
                          {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(order.createdAt).toLocaleTimeString('vi-VN')}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center opacity-40 group-hover:opacity-100 transition-opacity">
                        <Link href={`/admin/orders/${order._id}`}>
                          <button className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-white hover:text-indigo-600 hover:shadow-md border border-transparent hover:border-slate-100 transition-all">
                            <Eye className="w-4 h-4" />
                          </button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-8 py-4 bg-slate-50/30 border-t border-slate-100 flex items-center justify-between">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Tổng cộng: {pagination.total} đơn hàng
          </p>
        </div>

        <Pagination 
          totalPage={pagination.totalPages} 
          currentPage={pagination.page} 
        />
      </AdminCard>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<div>Đang tải...</div>}>
      <OrdersContent />
    </Suspense>
  );
}
