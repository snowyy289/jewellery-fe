import React from "react";
import { StatusHistory, OrderStatus } from "@/types/order";
import { CheckCircleIcon, XCircleIcon, ClockIcon } from "@heroicons/react/24/solid";

interface OrderTimelineProps {
  statusHistory: StatusHistory[];
}

const statusConfig: Record<OrderStatus, { label: string; icon: React.ElementType }> = {
  pending: { label: "Chờ xác nhận", icon: ClockIcon },
  confirmed: { label: "Đã xác nhận", icon: CheckCircleIcon },
  processing: { label: "Đang xử lý", icon: CheckCircleIcon },
  shipping: { label: "Đang giao hàng", icon: CheckCircleIcon },
  delivered: { label: "Đã giao hàng", icon: CheckCircleIcon },
  cancelled: { label: "Đã hủy", icon: XCircleIcon },
  refunded: { label: "Đã hoàn tiền", icon: CheckCircleIcon }
};

export default function OrderTimeline({ statusHistory }: OrderTimelineProps) {


  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {statusHistory.map((history, index) => {
          const config = statusConfig[history.status];
          const Icon = config.icon;
          const isLast = index === statusHistory.length - 1;
          const isCancelledStatus = history.status === 'cancelled';

          return (
            <li key={index}>
              <div className="relative pb-8">
                {!isLast && (
                  <span
                    className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                )}
                <div className="relative flex space-x-3">
                  <div>
                    <span
                      className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                        isCancelledStatus
                          ? 'bg-red-500'
                          : 'bg-green-500'
                      }`}
                    >
                      <Icon className="h-5 w-5 text-white" aria-hidden="true" />
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {config.label}
                      </p>
                      {history.note && (
                        <p className="mt-0.5 text-sm text-gray-500">{history.note}</p>
                      )}
                    </div>
                    <div className="whitespace-nowrap text-right text-sm text-gray-500">
                      <time dateTime={history.changed_at}>
                        {new Date(history.changed_at).toLocaleString('vi-VN', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </time>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
