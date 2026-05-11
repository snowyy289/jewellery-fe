"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { orderService } from "@/services/client/orderService";
import OrderStatusBadge from "@/components/order/OrderStatusBadge";
import { Order } from "@/types/order";
import { ShoppingBagIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  useEffect(() => {
    fetchOrders();
  }, [page]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await orderService.getUserOrders(page, limit);
      setOrders(response.data);
      if (response.pagination) {
        setTotalPages(response.pagination.totalPage);
      }
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      setError(err.response?.data?.message || 'Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  if (loading && page === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải đơn hàng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Đơn hàng của tôi</h1>
          <p className="mt-2 text-gray-600">Quản lý và theo dõi đơn hàng của bạn</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <ShoppingBagIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Chưa có đơn hàng nào</h2>
            <p className="text-gray-600 mb-6">Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm!</p>
            <Link
              href="/products"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Khám phá sản phẩm
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {orders.map((order) => (
                <Link
                  key={order._id}
                  href={`/orders/${order.order_code}`}
                  className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    {/* Order Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Đơn hàng #{order.order_code}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Đặt ngày {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <OrderStatusBadge status={order.status} />
                        <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                          {order.items.length} sản phẩm
                        </span>
                        <span className="font-semibold text-gray-900">
                          Tổng: {order.total.toLocaleString('vi-VN')}₫
                        </span>
                      </div>

                      {/* First 3 items */}
                      <div className="mt-3 flex gap-2">
                        {order.items.slice(0, 3).map((item, index) => (
                          <div key={index} className="text-sm text-gray-600">
                            {item.product_title}
                            {index < Math.min(order.items.length - 1, 2) && ', '}
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <span className="text-sm text-gray-500">
                            và {order.items.length - 3} sản phẩm khác
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="border-t border-gray-200 mt-4 pt-4">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Giao đến:</span>{' '}
                        {order.shipping_address.full_name} - {order.shipping_address.phone}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {order.shipping_address.address_line}, {order.shipping_address.ward && `${order.shipping_address.ward}, `}
                        {order.shipping_address.district && `${order.shipping_address.district}, `}
                        {order.shipping_address.province}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1 || loading}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Trang trước
                </button>
                <span className="px-4 py-2 text-gray-700">
                  Trang {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages || loading}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Trang sau
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
