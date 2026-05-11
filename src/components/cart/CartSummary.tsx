"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";

export default function CartSummary() {
  const { cart, loading } = useCart();

  if (!cart) return null;

  const { subtotal, discount_amount, total, items } = cart;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="bg-white rounded-lg border p-6 sticky top-4">
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>

      {/* Items Count */}
      <div className="flex justify-between text-gray-600 mb-2">
        <span>Items ({itemCount})</span>
        <span>{subtotal.toLocaleString('vi-VN')}₫</span>
      </div>

      {/* Discount */}
      {discount_amount > 0 && (
        <div className="flex justify-between text-green-600 mb-2">
          <span>Discount</span>
          <span>-{discount_amount.toLocaleString('vi-VN')}₫</span>
        </div>
      )}

      {/* Voucher Code Input */}
      <div className="my-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter voucher code"
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled
          />
          <button
            className="px-4 py-2 bg-gray-200 text-gray-500 rounded-lg cursor-not-allowed"
            disabled
          >
            Apply
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">Voucher feature coming soon</p>
      </div>

      <div className="border-t pt-4 mt-4">
        {/* Total */}
        <div className="flex justify-between text-lg font-bold mb-4">
          <span>Total</span>
          <span className="text-red-600">{total.toLocaleString('vi-VN')}₫</span>
        </div>

        {/* Checkout Button */}
        <Link
          href="/checkout"
          className={`
            block w-full py-3 text-center rounded-lg font-medium transition-colors
            ${items.length === 0 || loading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
            }
          `}
          onClick={(e) => {
            if (items.length === 0 || loading) {
              e.preventDefault();
            }
          }}
        >
          {loading ? 'Processing...' : 'Proceed to Checkout'}
        </Link>

        {/* Continue Shopping */}
        <Link
          href="/products"
          className="block w-full mt-3 py-3 text-center border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>

      {/* Security Badge */}
      <div className="mt-4 pt-4 border-t">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Secure checkout</span>
        </div>
      </div>
    </div>
  );
}
