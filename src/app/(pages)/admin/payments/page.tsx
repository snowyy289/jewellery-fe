"use client";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CreditCard, Eye, CheckCircle, Download } from "lucide-react";
import Button from "@/components/button/Button";
import { AdminPageHeader, AdminCard } from "@/components/layouts/admin/shared";
import { paymentService } from "@/services/admin/paymentService";
import { toast } from "sonner";
import Search from "@/components/search/Search";
import Pagination from "@/components/pagination/Pagination";

interface Payment {
  _id: string;
  order_code: string;
  transaction_id: string;
  payment_method: string;
  payment_status: string;
  amount: number;
  paid_at?: string;
  createdAt: string;
  order_id?: {
    shipping_address?: {
      full_name: string;
      phone: string;
    };
  };
}

function PaymentsContent() {
  const searchParams = useSearchParams();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0
  });

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    fetchPayments(params);
  }, [searchParams]);

  const fetchPayments = async (params: Record<string, string> = {}) => {
    setIsLoading(true);
    try {
      const res = await paymentService.getAllPayments(params);
      if (res.code === 200) {
        setPayments(res.data);
        if (res.pagination) {
          setPagination({
            page: res.pagination.page,
            totalPages: res.pagination.totalPages,
            total: res.pagination.total
          });
        }
      }
    } catch (error) {
      console.error("Fetch payments error:", error);
      toast.error("Lỗi khi tải danh sách thanh toán");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmCOD = async (id: string) => {
    if (confirm("Xác nhận đã nhận tiền COD cho đơn hàng này?")) {
      try {
        const res = await paymentService.confirmCODPayment(id);
        if (res.code === 200) {
          toast.success("Xác nhận thanh toán COD thành công!");
          const params = Object.fromEntries(searchParams.entries());
          fetchPayments(params);
        } else {
          toast.error(res.message || "Lỗi khi xác nhận thanh toán");
        }
      } catch {
        toast.error("Lỗi khi xác nhận thanh toán");
      }
    }
  };

  const handleExport = async () => {
    try {
      const params = Object.fromEntries(searchParams.entries());
      const blob = await paymentService.exportPayments(params);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payments-${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Xuất file thành công!");
    } catch{
      toast.error("Lỗi khi xuất file");
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const getPaymentMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      cod: 'COD',
      vnpay: 'VNPay',
      momo: 'MoMo',
      zalopay: 'ZaloPay'
    };
    return labels[method] || method;
  };

  const getPaymentStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; label: string; dot: string }> = {
      pending: { bg: 'bg-amber-50', text: 'text-amber-600', label: 'Chờ thanh toán', dot: 'bg-amber-500' },
      processing: { bg: 'bg-blue-50', text: 'text-blue-600', label: 'Đang xử lý', dot: 'bg-blue-500' },
      success: { bg: 'bg-emerald-50', text: 'text-emerald-600', label: 'Thành công', dot: 'bg-emerald-500' },
      failed: { bg: 'bg-rose-50', text: 'text-rose-600', label: 'Thất bại', dot: 'bg-rose-500' }
    };
    const badge = badges[status] || badges.pending;
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${badge.bg} ${badge.text} border-${badge.text.replace('text-', '')}/20`}>
        <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
        {badge.label}
      </div>
    );
  };

  return (
    <div className="w-full space-y-6 pb-10">
      <AdminPageHeader
        title="Quản lý thanh toán"
        subTitle="Danh sách tất cả giao dịch thanh toán trong hệ thống"
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
                params.set('payment_method', e.target.value);
              } else {
                params.delete('payment_method');
              }
              params.set('page', '1');
              window.history.pushState(null, '', `?${params.toString()}`);
              fetchPayments(Object.fromEntries(params.entries()));
            }}
          >
            <option value="">Tất cả phương thức</option>
            <option value="cod">COD</option>
            <option value="vnpay">VNPay</option>
            <option value="momo">MoMo</option>
            <option value="zalopay">ZaloPay</option>
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
              fetchPayments(Object.fromEntries(params.entries()));
            }}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="pending">Chờ thanh toán</option>
            <option value="processing">Đang xử lý</option>
            <option value="success">Thành công</option>
            <option value="failed">Thất bại</option>
          </select>
        </div>
        <Search />
      </div>

      <AdminCard noPadding title="Tất cả giao dịch" subTitle={`${pagination.total} giao dịch`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mã đơn hàng</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Khách hàng</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Phương thức</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Số tiền</th>
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
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-8 py-20 text-center text-slate-400 italic font-medium">
                    Chưa có giao dịch nào.
                  </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment._id} className="group hover:bg-indigo-50/30 transition-all duration-300">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{payment.order_code}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{payment.transaction_id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-700">
                          {payment.order_id?.shipping_address?.full_name || '—'}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {payment.order_id?.shipping_address?.phone || '—'}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <span className="text-xs font-bold text-slate-600 uppercase">
                        {getPaymentMethodLabel(payment.payment_method)}
                      </span>
                    </td>
                    <td className="px-8 py-4">
                      <span className="text-sm font-black text-slate-800">
                        {formatPrice(payment.amount)}
                      </span>
                    </td>
                    <td className="px-8 py-4">
                      {getPaymentStatusBadge(payment.payment_status)}
                    </td>
                    <td className="px-8 py-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-700">
                          {new Date(payment.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(payment.createdAt).toLocaleTimeString('vi-VN')}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <div className="flex items-center justify-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                        <Link href={`/admin/payments/${payment._id}`}>
                          <button className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-white hover:text-indigo-600 hover:shadow-md border border-transparent hover:border-slate-100 transition-all">
                            <Eye className="w-4 h-4" />
                          </button>
                        </Link>
                        {payment.payment_method === 'cod' && payment.payment_status === 'pending' && (
                          <button 
                            onClick={() => handleConfirmCOD(payment._id)}
                            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-white hover:text-emerald-600 hover:shadow-md border border-transparent hover:border-slate-100 transition-all"
                            title="Xác nhận COD"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
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
            Tổng cộng: {pagination.total} giao dịch
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

export default function PaymentsPage() {
  return (
    <Suspense fallback={<div>Đang tải...</div>}>
      <PaymentsContent />
    </Suspense>
  );
}
