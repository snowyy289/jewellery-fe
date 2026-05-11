"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderCode = searchParams.get('order');

  useEffect(() => {
    // If no order code, redirect to orders page
    if (!orderCode) {
      router.push('/orders');
    }
  }, [orderCode, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
            <CheckCircleIcon className="h-12 w-12 text-green-600" />
          </div>

          {/* Success Message */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Thanh toán thành công!
          </h1>
          <p className="text-gray-600 mb-6">
            Đơn hàng của bạn đã được thanh toán thành công. Chúng tôi sẽ xử lý và giao hàng trong thời gian sớm nhất.
          </p>

          {/* Order Code */}
          {orderCode && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-500 mb-1">Mã đơn hàng</p>
              <p className="text-lg font-semibold text-gray-900">{orderCode}</p>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            {orderCode && (
              <Link
                href={`/orders/${orderCode}`}
                className="block w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Xem chi tiết đơn hàng
              </Link>
            )}
            
            <Link
              href="/orders"
              className="block w-full bg-white text-gray-700 py-3 px-4 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Xem tất cả đơn hàng
            </Link>

            <Link
              href="/products"
              className="block w-full text-blue-600 py-3 px-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Tiếp tục mua sắm
            </Link>
          </div>

          {/* Additional Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-start gap-3 text-left">
              <ShoppingBagIcon className="h-5 w-5 text-gray-400 shrink-0 mt-0.5" />
              <div className="text-sm text-gray-600">
                <p className="font-medium text-gray-900 mb-1">Thông tin giao hàng</p>
                <p>Bạn sẽ nhận được email xác nhận và thông tin theo dõi đơn hàng trong vòng 24 giờ.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
