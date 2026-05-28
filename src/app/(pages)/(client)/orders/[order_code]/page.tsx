"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { orderService } from "@/services/client/orderService";
import { paymentService } from "@/services/client/paymentService";
import OrderStatusBadge from "@/components/order/OrderStatusBadge";
import OrderItem from "@/components/order/OrderItem";
import OrderTimeline from "@/components/order/OrderTimeline";
import { Order } from "@/types/order";
import {
  ArrowLeftIcon,
  TruckIcon,
  CreditCardIcon,
  MapPinIcon,
  DocumentTextIcon,
  XCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderCode = params.order_code as string;
  const paymentResult = searchParams.get('payment');

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [payingNow, setPayingNow] = useState(false);
  const [showPaymentNotification, setShowPaymentNotification] = useState(false);

  const fetchOrder = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await orderService.getOrderByCode(orderCode);
      setOrder(response.data);
    } catch (err: unknown) {
      console.error('Error fetching order:', err);
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Không thể tải thông tin đơn hàng');
    } finally {
      setLoading(false);
    }
  }, [orderCode]);

  useEffect(() => {
    fetchOrder();

    // Show payment notification if redirected from payment
    if (paymentResult) {
      setShowPaymentNotification(true);
      // Auto hide after 5 seconds
      setTimeout(() => setShowPaymentNotification(false), 5000);
    }
  }, [orderCode, paymentResult, fetchOrder]);

  const handleCancelOrder = async () => {
    try {
      setCancelling(true);
      await orderService.cancelOrder(orderCode, { reason: cancelReason || 'Khách hàng yêu cầu hủy' });
      setShowCancelModal(false);
      setCancelReason('');
      alert('Hủy đơn hàng thành công!');
      // Refresh order data
      await fetchOrder();
    } catch (err: unknown) {
      console.error('Error cancelling order:', err);
      const error = err as { response?: { data?: { message?: string } } };
      alert(error.response?.data?.message || 'Không thể hủy đơn hàng');
    } finally {
      setCancelling(false);
    }
  };

  const handlePayNow = async () => {
    if (!order) return;

    try {
      setPayingNow(true);
      const response = await paymentService.createPayment({
        order_id: order._id,
        payment_method: order.payment_method
      });

      const { paymentUrl } = response.data;

      if (paymentUrl) {
        // Redirect to payment gateway
        window.location.href = paymentUrl;
      } else {
        alert('Không thể tạo link thanh toán. Vui lòng thử lại.');
      }
    } catch (err: unknown) {
      console.error('Error creating payment:', err);
      const error = err as { response?: { data?: { message?: string } } };
      alert(error.response?.data?.message || 'Không thể tạo thanh toán. Vui lòng thử lại.');
    } finally {
      setPayingNow(false);
    }
  };

  const canCancelOrder = order && ['pending', 'confirmed', 'processing'].includes(order.status);
  const canPayNow = order && order.payment_status === 'pending' && order.payment_method !== 'cod' && order.status !== 'cancelled';

  const paymentMethodLabels: Record<string, string> = {
    cod: 'Thanh toán khi nhận hàng (COD)',
    vnpay: 'VNPay',
    momo: 'MoMo',
    zalopay: 'ZaloPay'
  };

  const paymentStatusLabels: Record<string, string> = {
    pending: 'Chờ thanh toán',
    paid: 'Đã thanh toán',
    failed: 'Thanh toán thất bại',
    refunded: 'Đã hoàn tiền'
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <XCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Không tìm thấy đơn hàng</h2>
          <p className="text-gray-600 mb-6">{error || 'Đơn hàng không tồn tại hoặc bạn không có quyền truy cập'}</p>
          <button
            onClick={() => router.push('/orders')}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            Quay lại danh sách đơn hàng
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Payment Notification */}
        {showPaymentNotification && paymentResult && (
          <div className={`mb-6 p-4 rounded-lg border ${paymentResult === 'success' || paymentResult === 'cod'
              ? 'bg-green-50 border-green-200'
              : paymentResult === 'failed'
                ? 'bg-red-50 border-red-200'
                : 'bg-yellow-50 border-yellow-200'
            }`}>
            <div className="flex items-start gap-3">
              {paymentResult === 'success' || paymentResult === 'cod' ? (
                <CheckCircleIcon className="h-6 w-6 text-green-600 shrink-0" />
              ) : paymentResult === 'failed' ? (
                <XCircleIcon className="h-6 w-6 text-red-600 shrink-0" />
              ) : (
                <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600 shrink-0" />
              )}
              <div className="flex-1">
                <h3 className={`font-semibold ${paymentResult === 'success' || paymentResult === 'cod'
                    ? 'text-green-900'
                    : paymentResult === 'failed'
                      ? 'text-red-900'
                      : 'text-yellow-900'
                  }`}>
                  {paymentResult === 'success' && 'Thanh toán thành công!'}
                  {paymentResult === 'cod' && 'Đơn hàng đã được tạo!'}
                  {paymentResult === 'failed' && 'Thanh toán thất bại'}
                  {paymentResult === 'error' && 'Có lỗi xảy ra'}
                </h3>
                <p className={`text-sm mt-1 ${paymentResult === 'success' || paymentResult === 'cod'
                    ? 'text-green-700'
                    : paymentResult === 'failed'
                      ? 'text-red-700'
                      : 'text-yellow-700'
                  }`}>
                  {paymentResult === 'success' && 'Đơn hàng của bạn đã được thanh toán thành công.'}
                  {paymentResult === 'cod' && 'Bạn sẽ thanh toán khi nhận hàng.'}
                  {paymentResult === 'failed' && 'Giao dịch thanh toán không thành công. Vui lòng thử lại.'}
                  {paymentResult === 'error' && 'Không thể tạo thanh toán. Vui lòng thử lại sau.'}
                </p>
              </div>
              <button
                onClick={() => setShowPaymentNotification(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircleIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/orders')}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            Quay lại
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Đơn hàng #{order.order_code}</h1>
              <p className="mt-2 text-gray-600">
                Đặt ngày {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Sản phẩm</h2>
              <div className="divide-y">
                {order.items.map((item, index) => (
                  <OrderItem key={index} item={item} orderId={order._id} orderStatus={order.status} />
                ))}
              </div>
            </div>

            {/* Order Timeline */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Lịch sử đơn hàng</h2>
              <OrderTimeline statusHistory={order.status_history} />
            </div>

            {/* Customer Note */}
            {order.customer_note && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-2 mb-3">
                  <DocumentTextIcon className="h-5 w-5 text-gray-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Ghi chú</h2>
                </div>
                <p className="text-gray-600">{order.customer_note}</p>
              </div>
            )}

            {/* Cancellation Reason */}
            {order.cancellation_reason && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-3">
                  <XCircleIcon className="h-5 w-5 text-red-600" />
                  <h2 className="text-lg font-semibold text-red-900">Lý do hủy đơn</h2>
                </div>
                <p className="text-red-700">{order.cancellation_reason}</p>
              </div>
            )}
          </div>

          {/* Right Column - Summary & Actions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Tổng quan</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính</span>
                  <span>{order.subtotal.toLocaleString('vi-VN')}₫</span>
                </div>

                {order.discount_amount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Giảm giá</span>
                    <span>-{order.discount_amount.toLocaleString('vi-VN')}₫</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển</span>
                  <span>{order.shipping_fee.toLocaleString('vi-VN')}₫</span>
                </div>

                <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-900">
                  <span>Tổng cộng</span>
                  <span className="text-blue-600">{order.total.toLocaleString('vi-VN')}₫</span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPinIcon className="h-5 w-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">Địa chỉ giao hàng</h2>
              </div>
              <div className="text-gray-600 space-y-1">
                <p className="font-medium text-gray-900">{order.shipping_address.full_name}</p>
                <p>{order.shipping_address.phone}</p>
                {order.shipping_address.email && <p>{order.shipping_address.email}</p>}
                <p className="mt-2">
                  {order.shipping_address.address_line}
                  {order.shipping_address.ward && `, ${order.shipping_address.ward}`}
                  {order.shipping_address.district && `, ${order.shipping_address.district}`}
                  {`, ${order.shipping_address.province}`}
                </p>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCardIcon className="h-5 w-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">Thanh toán</h2>
              </div>
              <div className="space-y-2 text-gray-600">
                <div className="flex justify-between">
                  <span>Phương thức:</span>
                  <span className="font-medium text-gray-900">
                    {paymentMethodLabels[order.payment_method] || order.payment_method}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Trạng thái:</span>
                  <span className={`font-medium ${order.payment_status === 'paid' ? 'text-green-600' :
                      order.payment_status === 'failed' ? 'text-red-600' :
                        'text-yellow-600'
                    }`}>
                    {paymentStatusLabels[order.payment_status] || order.payment_status}
                  </span>
                </div>
              </div>
            </div>

            {/* Tracking Info */}
            {order.tracking_number && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TruckIcon className="h-5 w-5 text-gray-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Vận chuyển</h2>
                </div>
                <div className="space-y-2 text-gray-600">
                  <div className="flex justify-between">
                    <span>Mã vận đơn:</span>
                    <span className="font-medium text-gray-900">{order.tracking_number}</span>
                  </div>
                  {order.estimated_delivery && (
                    <div className="flex justify-between">
                      <span>Dự kiến giao:</span>
                      <span className="font-medium text-gray-900">
                        {new Date(order.estimated_delivery).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Pay Now Button */}
            {canPayNow && (
              <button
                onClick={handlePayNow}
                disabled={payingNow}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                <CreditCardIcon className="h-5 w-5" />
                {payingNow ? 'Đang xử lý...' : 'Thanh toán ngay'}
              </button>
            )}

            {/* Cancel Order Button */}
            {canCancelOrder && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Hủy đơn hàng
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Hủy đơn hàng</h3>
            <p className="text-gray-600 mb-4">
              Bạn có chắc chắn muốn hủy đơn hàng này? Vui lòng cho chúng tôi biết lý do.
            </p>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
              placeholder="Nhập lý do hủy đơn..."
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelReason('');
                }}
                disabled={cancelling}
                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-300 disabled:opacity-50 transition-colors"
              >
                Đóng
              </button>
              <button
                onClick={handleCancelOrder}
                disabled={cancelling}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {cancelling ? 'Đang xử lý...' : 'Xác nhận hủy'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
