/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { orderService } from "@/services/client/orderService";
import { paymentService } from "@/services/client/paymentService";
import ShippingAddressForm from "@/components/order/ShippingAddressForm";
import CartItem from "@/components/cart/CartItem";
import { ShippingAddress, PaymentMethod } from "@/types/order";
import { ShoppingBagIcon, TruckIcon, CreditCardIcon } from "@heroicons/react/24/outline";

const paymentMethods: { value: PaymentMethod; label: string; description: string }[] = [
  { value: 'cod', label: 'Thanh toán khi nhận hàng (COD)', description: 'Thanh toán bằng tiền mặt khi nhận hàng' },
  { value: 'vnpay', label: 'VNPay', description: 'Thanh toán qua ví điện tử VNPay' },
  { value: 'momo', label: 'MoMo', description: 'Thanh toán qua ví điện tử MoMo' },
  { value: 'zalopay', label: 'ZaloPay', description: 'Thanh toán qua ví điện tử ZaloPay' }
];

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, loading: cartLoading } = useCart();
  
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    full_name: '',
    phone: '',
    email: '',
    address_line: '',
    ward: '',
    district: '',
    province: ''
  });
  
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [customerNote, setCustomerNote] = useState('');
  const [errors, setErrors] = useState<Partial<Record<keyof ShippingAddress, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Redirect if cart is empty
  useEffect(() => {
    if (!cartLoading && (!cart || cart.items.length === 0)) {
      router.push('/cart');
    }
  }, [cart, cartLoading, router]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ShippingAddress, string>> = {};

    if (!shippingAddress.full_name.trim()) {
      newErrors.full_name = 'Vui lòng nhập họ và tên';
    }

    if (!shippingAddress.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{10,11}$/.test(shippingAddress.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }

    if (!shippingAddress.address_line.trim()) {
      newErrors.address_line = 'Vui lòng nhập địa chỉ';
    }

    if (!shippingAddress.province) {
      newErrors.province = 'Vui lòng chọn tỉnh/thành phố';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError(null);

      // Step 1: Create order
      const orderResponse = await orderService.createOrder({
        shipping_address: shippingAddress,
        payment_method: paymentMethod,
        customer_note: customerNote || undefined
      });

      const order = orderResponse.data;

      // Step 2: Handle payment based on method
      if (paymentMethod === 'cod') {
        // COD: Just redirect to order detail
        router.push(`/orders/${order.order_code}?payment=cod`);
      } else {
        // Online payment: Create payment and redirect to gateway
        try {
          const paymentResponse = await paymentService.createPayment({
            order_id: order._id,
            payment_method: paymentMethod
          });

          const { paymentUrl } = paymentResponse.data;

          if (paymentUrl) {
            // Redirect to payment gateway
            window.location.href = paymentUrl;
          } else {
            throw new Error('Payment URL not received');
          }
        } catch (paymentError: any) {
          console.error('Payment creation error:', paymentError);
          // If payment creation fails, still show order but with error
          router.push(`/orders/${order.order_code}?payment=error`);
        }
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      setSubmitError(error.response?.data?.message || 'Đặt hàng thất bại. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  if (cartLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Thanh toán</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TruckIcon className="h-6 w-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Địa chỉ giao hàng</h2>
                </div>
                <ShippingAddressForm
                  address={shippingAddress}
                  onChange={setShippingAddress}
                  errors={errors}
                />
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCardIcon className="h-6 w-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Phương thức thanh toán</h2>
                </div>
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.value}
                      className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        paymentMethod === method.value
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment_method"
                        value={method.value}
                        checked={paymentMethod === method.value}
                        onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="ml-3">
                        <p className="font-medium text-gray-900">{method.label}</p>
                        <p className="text-sm text-gray-500">{method.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Customer Note */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Ghi chú đơn hàng</h2>
                <textarea
                  value={customerNote}
                  onChange={(e) => setCustomerNote(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ghi chú về đơn hàng (tùy chọn)"
                />
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                <div className="flex items-center gap-2 mb-4">
                  <ShoppingBagIcon className="h-6 w-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Đơn hàng</h2>
                </div>

                {/* Order Items */}
                <div className="border-t border-b border-gray-200 py-4 max-h-96 overflow-y-auto">
                  {cart.items.map((item) => (
                    <CartItem key={item.product_id.toString()} item={item} readOnly />
                  ))}
                </div>

                {/* Order Summary */}
                <div className="space-y-3 mt-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Tạm tính</span>
                    <span>{cart.subtotal.toLocaleString('vi-VN')}₫</span>
                  </div>

                  {cart.discount_amount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Giảm giá</span>
                      <span>-{cart.discount_amount.toLocaleString('vi-VN')}₫</span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-600">
                    <span>Phí vận chuyển</span>
                    <span className="text-sm text-gray-500">Tính khi đặt hàng</span>
                  </div>

                  <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-900">
                    <span>Tổng cộng</span>
                    <span className="text-blue-600">{cart.total.toLocaleString('vi-VN')}₫</span>
                  </div>
                </div>

                {/* Submit Error */}
                {submitError && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{submitError}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting ? 'Đang xử lý...' : 'Đặt hàng'}
                </button>

                <p className="mt-4 text-xs text-gray-500 text-center">
                  Bằng cách đặt hàng, bạn đồng ý với{' '}
                  <a href="/terms" className="text-blue-600 hover:underline">
                    Điều khoản dịch vụ
                  </a>{' '}
                  của chúng tôi
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
