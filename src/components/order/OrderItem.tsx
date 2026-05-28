import React from "react";
import Image from "next/image";
import Link from "next/link";
import { OrderItem as OrderItemType } from "@/types/order";
import { Product } from "@/types/product";

interface OrderItemProps {
  item: OrderItemType;
  orderId?: string;
  orderStatus?: string;
}

import ReviewModal from "./ReviewModal";

export default function OrderItem({ item, orderId, orderStatus }: OrderItemProps) {
  const [isReviewModalOpen, setIsReviewModalOpen] = React.useState(false);
  const product = typeof item.product_id === 'string' ? null : item.product_id as Product;
  const productId = typeof item.product_id === 'string' ? item.product_id : product?._id;
  const slug = product?.slug || productId;
  const thumbnail = item.product_thumbnail || product?.thumbnail || "/placeholder-product.png";
  const finalPrice = item.price * (1 - item.discount_percentage / 100);

  return (
    <div className="flex gap-4 py-4 border-b last:border-b-0">
      {/* Product Image */}
      {slug ? (
        <Link href={`/products/${slug}`} className="hover:opacity-80 transition-opacity shrink-0">
          <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={thumbnail}
              alt={item.product_title}
              fill
              className="object-cover"
            />
          </div>
        </Link>
      ) : (
        <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-gray-100">
          <Image
            src={thumbnail}
            alt={item.product_title}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        {slug ? (
          <Link href={`/products/${slug}`} className="font-medium text-gray-900 hover:text-blue-600 transition-colors truncate block">
            {item.product_title}
          </Link>
        ) : (
          <h4 className="font-medium text-gray-900 truncate">{item.product_title}</h4>
        )}
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
      {/* Price and Actions */}
      <div className="text-right shrink-0 flex flex-col justify-between items-end">
        <div>
            <p className="font-semibold text-gray-900">
            {finalPrice.toLocaleString('vi-VN')}₫
            </p>
            <p className="text-sm text-gray-500 mt-1">
            Tổng: {item.subtotal.toLocaleString('vi-VN')}₫
            </p>
        </div>
        
        {orderStatus === 'delivered' && orderId && productId && (
            <button 
                onClick={() => setIsReviewModalOpen(true)}
                className="mt-4 px-4 py-2 border border-gold text-gold hover:bg-gold hover:text-stone-900 font-bold uppercase tracking-widest text-[10px] transition-colors"
            >
                Đánh giá
            </button>
        )}
      </div>

      {orderId && productId && (
          <ReviewModal 
              isOpen={isReviewModalOpen}
              onClose={() => setIsReviewModalOpen(false)}
              productId={productId}
              orderId={orderId}
              productTitle={item.product_title}
              productImage={thumbnail}
              onSuccess={() => setIsReviewModalOpen(false)}
          />
      )}
    </div>
  );
}
