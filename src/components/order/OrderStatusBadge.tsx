import React from "react";
import { OrderStatus } from "@/types/order";

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

const statusConfig: Record<OrderStatus, { label: string; color: string }> = {
  pending: { label: "Chờ xác nhận", color: "bg-yellow-100 text-yellow-800" },
  confirmed: { label: "Đã xác nhận", color: "bg-blue-100 text-blue-800" },
  processing: { label: "Đang xử lý", color: "bg-purple-100 text-purple-800" },
  shipping: { label: "Đang giao hàng", color: "bg-indigo-100 text-indigo-800" },
  delivered: { label: "Đã giao hàng", color: "bg-green-100 text-green-800" },
  cancelled: { label: "Đã hủy", color: "bg-red-100 text-red-800" },
  refunded: { label: "Đã hoàn tiền", color: "bg-gray-100 text-gray-800" }
};

export default function OrderStatusBadge({ status, className = "" }: OrderStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color} ${className}`}>
      {config.label}
    </span>
  );
}
