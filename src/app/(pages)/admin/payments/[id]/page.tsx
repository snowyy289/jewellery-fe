/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CreditCard, CheckCircle, Package, User } from "lucide-react";
import Button from "@/components/button/Button";
import { AdminPageHeader, AdminCard } from "@/components/layouts/admin/shared";
import { paymentService } from "@/services/admin/paymentService";
import { toast } from "sonner";

interface Payment {
  _id: string;
  order_code: string;
  transaction_id: string;
  gateway_transaction_id?: string;
  payment_method: string;
  payment_status: string;
  amount: number;
  currency: string;
  paid_at?: string;
  createdAt: string;
  payment_url?: string;
  gateway_response?: any;
  error_message?: string;
  order_id?: {
    _id: string;
    order_code: string;
    status: string;
    total: number;
    shipping_address: {
      full_name: string;
      phone: string;
      address: string;
      city: string;
      district: string;
      ward: string;
    };
    items: Array<{
      product_id: {
        title: string;
        thumbnail: string;
      };
      quantity: number;
      price: number;
    }>;
  };
}

export default function PaymentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchPayment(params.id as string);
    }
  }, [params.id]);

  const fetchPayment = async (id: string) => {
    setIsLoading(true);
    try {
      const res = await paymentService.getPaymentById(id);
      if (res.code === 200) {
        setPayment(res.data);
      } else {
        toast.error("Không tìm thấy giao dịch");
        router.push('/admin/payments');
      }
    } catch {
      toast.error("Lỗi khi tải thông tin giao dịch");
      router.push('/admin/payments');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmCOD = async () => {
    if (!payment) return;
    
    if (confirm("Xác nhận đã nhận tiền COD cho đơn hàng này?")) {
      try {
        const res = await paymentService.confirmCODPayment(payment._id);
        if (res.code === 200) {
          toast.success("Xác nhận thanh toán COD thành công!");
          fetchPayment(payment._id);
        } else {
          toast.error(res.message || "Lỗi khi xác nhận thanh toán");
        }
      } catch {
        toast.error("Lỗi khi xác nhận thanh toán");
      }
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const getPaymentMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      cod: 'Thanh toán khi nhận hàng (COD)',
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
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-wider ${badge.bg} ${badge.text} border-${badge.text.replace('text-', '')}/20`}>
        <span className={`w-2 h-2 rounded-full ${badge.dot}`} />
        {badge.label}
      </div>
    );
  };

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

  if (!payment) {
    return null;
  }

  return (
    <div className="w-full space-y-6 pb-10">
      <AdminPageHeader
        title="Chi tiết giao dịch"
        subTitle={`Mã giao dịch: ${payment.transaction_id}`}
        actions={
          <div className="flex gap-3">
            <Button variant="outline" size="sm" icon={<ArrowLeft className="w-4 h-4" />} onClick={() => router.back()}>
              Quay lại
            </Button>
            {payment.payment_method === 'cod' && payment.payment_status === 'pending' && (
              <Button size="sm" icon={<CheckCircle className="w-4 h-4" />} onClick={handleConfirmCOD}>
                Xác nhận COD
              </Button>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Info */}
        <div className="lg:col-span-2 space-y-6">
          <AdminCard title="Thông tin thanh toán">
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center">
                    <CreditCard className="w-8 h-8 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Mã đơn hàng</p>
                    <p className="text-xl font-black text-slate-800">{payment.order_code}</p>
                  </div>
                </div>
                {getPaymentStatusBadge(payment.payment_status)}
              </div>

              <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-100">
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Phương thức thanh toán</p>
                  <p className="text-sm font-bold text-slate-800">{getPaymentMethodLabel(payment.payment_method)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Số tiền</p>
                  <p className="text-lg font-black text-indigo-600">{formatPrice(payment.amount)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Mã giao dịch</p>
                  <p className="text-sm font-mono text-slate-600">{payment.transaction_id}</p>
                </div>
                {payment.gateway_transaction_id && (
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Mã GD cổng thanh toán</p>
                    <p className="text-sm font-mono text-slate-600">{payment.gateway_transaction_id}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Ngày tạo</p>
                  <p className="text-sm font-bold text-slate-700">
                    {new Date(payment.createdAt).toLocaleString('vi-VN')}
                  </p>
                </div>
                {payment.paid_at && (
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Ngày thanh toán</p>
                    <p className="text-sm font-bold text-emerald-600">
                      {new Date(payment.paid_at).toLocaleString('vi-VN')}
                    </p>
                  </div>
                )}
              </div>

              {payment.error_message && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-100">
                  <p className="text-xs font-bold text-rose-600 uppercase tracking-wider mb-1">Lỗi</p>
                  <p className="text-sm text-rose-700">{payment.error_message}</p>
                </div>
              )}
            </div>
          </AdminCard>

          {/* Gateway Response */}
          {payment.gateway_response && (
            <AdminCard title="Phản hồi từ cổng thanh toán">
              <div className="bg-slate-50 rounded-xl p-4 font-mono text-xs text-slate-600 overflow-x-auto">
                <pre>{JSON.stringify(payment.gateway_response, null, 2)}</pre>
              </div>
            </AdminCard>
          )}
        </div>

        {/* Order Info */}
        <div className="space-y-6">
          {payment.order_id && (
            <>
              <AdminCard title="Thông tin đơn hàng">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                      <Package className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium">Mã đơn hàng</p>
                      <p className="text-sm font-bold text-slate-800">{payment.order_id.order_code}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Trạng thái đơn hàng</p>
                    <p className="text-sm font-bold text-slate-700 capitalize">{payment.order_id.status}</p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Tổng tiền</p>
                    <p className="text-lg font-black text-slate-800">{formatPrice(payment.order_id.total)}</p>
                  </div>

                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => router.push(`/admin/orders/${payment.order_id?._id}`)}
                  >
                    Xem chi tiết đơn hàng
                  </Button>
                </div>
              </AdminCard>

              <AdminCard title="Thông tin khách hàng">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                      <User className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{payment.order_id.shipping_address.full_name}</p>
                      <p className="text-xs text-slate-500">{payment.order_id.shipping_address.phone}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Địa chỉ giao hàng</p>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {payment.order_id.shipping_address.address}, {payment.order_id.shipping_address.ward}, {payment.order_id.shipping_address.district}, {payment.order_id.shipping_address.city}
                    </p>
                  </div>
                </div>
              </AdminCard>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
