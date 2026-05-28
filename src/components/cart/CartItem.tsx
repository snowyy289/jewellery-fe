"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CartItem as CartItemType } from "@/types/cart";
import { Product } from "@/types/product";
import { useCart } from "@/contexts/CartContext";

interface CartItemProps {
  item: CartItemType;
  readOnly?: boolean;
}

export default function CartItem({ item, readOnly = false }: CartItemProps) {
  const { updateCart, removeFromCart, updateItemSelection, loading } = useCart();
  const [quantity, setQuantity] = useState(item.quantity);

  const product = item.product_id as Product;
  const productId = typeof item.product_id === 'string' ? item.product_id : product._id;

  // Calculate prices
  const itemPrice = item.price * (1 - item.discount_percentage / 100);
  const itemTotal = itemPrice * item.quantity;

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    
    try {
      setQuantity(newQuantity);
      await updateCart(productId, newQuantity);
    } catch (error) {
      // Revert on error
      console.log(error);
      setQuantity(item.quantity);
    }
  };

  const handleRemove = async () => {
    if (confirm("Remove this item from cart?")) {
      try {
        await removeFromCart(productId);
      } catch (error) {
        console.log(error);
        alert("Failed to remove item");
      }
    }
  };

  const handleToggleSelection = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      await updateItemSelection(productId, e.target.checked);
    } catch (error) {
      console.log(error);
      alert("Failed to update item selection");
    }
  };

  return (
    <div className={`flex gap-4 p-4 border rounded-lg bg-white ${readOnly ? 'border-none p-2' : ''}`}>
      {!readOnly && (
        <div className="flex items-center">
          <input 
            type="checkbox"
            checked={item.selected !== false} // Default to true
            onChange={handleToggleSelection}
            disabled={loading}
            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
          />
        </div>
      )}
      {/* Product Image */}
      <Link href={`/products/${product.slug || productId}`} className="shrink-0">
        <div className={`relative ${readOnly ? 'w-16 h-16' : 'w-24 h-24'} rounded-lg overflow-hidden`}>
          <Image
            src={product.thumbnail || '/placeholder.png'}
            alt={product.title}
            fill
            className="object-cover"
          />
        </div>
      </Link>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <Link 
          href={`/products/${product.slug || productId}`}
          className="font-medium text-gray-900 hover:text-blue-600 line-clamp-2 text-sm"
        >
          {product.title}
        </Link>

        {/* Price */}
        <div className="mt-1 flex items-center gap-2">
          {item.discount_percentage > 0 ? (
            <>
              <span className={`font-bold text-red-600 ${readOnly ? 'text-sm' : 'text-lg'}`}>
                {itemPrice.toLocaleString('vi-VN')}₫
              </span>
              {!readOnly && (
                <>
                  <span className="text-sm text-gray-500 line-through">
                    {item.price.toLocaleString('vi-VN')}₫
                  </span>
                  <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">
                    -{item.discount_percentage}%
                  </span>
                </>
              )}
            </>
          ) : (
            <span className={`font-bold text-gray-900 ${readOnly ? 'text-sm' : 'text-lg'}`}>
              {item.price.toLocaleString('vi-VN')}₫
            </span>
          )}
        </div>

        {readOnly && (
          <p className="text-xs text-gray-500 mt-1">Số lượng: {item.quantity}</p>
        )}

        {/* Stock Status */}
        {!readOnly && product.stock < item.quantity && (
          <p className="mt-1 text-sm text-red-600">
            Only {product.stock} items available
          </p>
        )}
      </div>

      {/* Quantity Controls & Actions */}
      {!readOnly && (
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center border rounded-lg">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={loading || quantity <= 1}
              className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              -
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 1;
                handleQuantityChange(val);
              }}
              className="w-16 text-center border-x py-1 focus:outline-none"
              min="1"
              max={product.stock}
            />
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={loading || quantity >= product.stock}
              className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              +
            </button>
          </div>

          {/* Item Total */}
          <div className="text-right">
            <p className="text-lg font-bold text-gray-900">
              {itemTotal.toLocaleString('vi-VN')}₫
            </p>
          </div>

          {/* Remove Button */}
          <button
            onClick={handleRemove}
            disabled={loading}
            className="text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
          >
            Remove
          </button>
        </div>
      )}

      {readOnly && (
        <div className="text-right shrink-0">
          <p className="text-sm font-bold text-gray-900">
            {itemTotal.toLocaleString('vi-VN')}₫
          </p>
        </div>
      )}
    </div>
  );
}
