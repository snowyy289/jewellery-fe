import React from "react";
import Image from "next/image";
import { OrderItem as OrderItemType } from "@/types/order";
import { Product } from "@/types/product";

interface OrderItemProps {
  item: OrderItemType;
}

export default function OrderItem({ item }: OrderItemProps) {
  const product = typeof item.product_id === 'string' ? null : item.product_id as Product;
  const thumbnail = item.product_thumbnail || product?.thumbnail || "/placeholder-product.png";
  const finalPrice = item.price * (1 - item.discount_percentage / 100);

  return (
    <div className="flex gap-4 py-4 border-b last:border-b-0">
      {/* Product Image */}
      <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-gray-100">
        <Image
          src={thumbnail}
          alt={item.product_title}
          fill
          className="object-cover"
        />
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900 truncate">{item.product_title}</h4>
        <p className="text-sm text-gray-500 mt-1">SKU: {item.product_sku}</p>
        
        <div className="flex items-center gap-4 mt-2">
          <span className="text-sm text-gray-600">Số lượng: {item.quantity}</span>
          
          {item.discount_percentage > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400 line-through">
                {item.price.toLocaleString('vi-VN')}₫
              </span>
              <span className="text-sm text-red-600 font-medium">
                -{item.discount_percentage}%
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Price */}
      <div className="text-right shrink-0">
        <p className="font-semibold text-gray-900">
          {finalPrice.toLocaleString('vi-VN')}₫
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Tổng: {item.subtotal.toLocaleString('vi-VN')}₫
        </p>
      </div>
    </div>
  );
}
