"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

export default function PaymentFailedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderCode = searchParams.get('order');
  const message = searchParams.get('message');

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
          {/* Error Icon */}
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100 mb-6">
            <XCircleIcon className="h-12 w-12 text-red-600" />
          </div>

          {/* Error Message */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Thanh toán thất bại
          </h1>
          <p className="text-gray-600 mb-6">
            {message || 'Đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại hoặc chọn phương thức thanh toán khác.'}
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
                className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                <ArrowPathIcon className="h-5 w-5" />
                Thử thanh toán lại
              </Link>
            )}
            
            <Link
              href="/orders"
              className="block w-full bg-white text-gray-700 py-3 px-4 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Xem tất cả đơn hàng
            </Link>

            <Link
              href="/contact"
              className="block w-full text-blue-600 py-3 px-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Liên hệ hỗ trợ
            </Link>
          </div>

          {/* Common Reasons */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-900 mb-3 text-left">
              Nguyên nhân thường gặp:
            </p>
            <ul className="text-sm text-gray-600 space-y-2 text-left">
              <li className="flex items-start gap-2">
                <span className="text-gray-400">•</span>
                <span>Số dư tài khoản không đủ</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-400">•</span>
                <span>Thông tin thẻ không chính xác</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-400">•</span>
                <span>Vượt quá hạn mức giao dịch</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-400">•</span>
                <span>Hết thời gian thanh toán (15 phút)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-400">•</span>
                <span>Người dùng hủy giao dịch</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
