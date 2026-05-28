"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";

export default function CartPage() {
  const { cart, loading, clearCart, selectAllItems } = useCart();

  const handleClearCart = async () => {
    if (confirm("Are you sure you want to clear your cart?")) {
      try {
        await clearCart();
      } catch {
        alert("Failed to clear cart");
      }
    }
  };

  const handleSelectAll = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      await selectAllItems(e.target.checked);
    } catch {
      alert("Failed to update selection");
    }
  };

  // Check if all items are selected
  const items = cart?.items || [];
  const isAllSelected = items.length > 0 && items.every(item => item.selected !== false);
  const selectedCount = items.filter(item => item.selected !== false).length;

  if (loading && !cart) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <svg className="animate-spin h-12 w-12 mx-auto text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-4 text-gray-600">Loading cart...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!cart || items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center py-16">
          {/* Empty Cart Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-24 h-24 mx-auto text-gray-400 mb-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
            />
          </svg>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">
            Looks like you havent added anything to your cart yet.
          </p>

          <Link
            href="/products"
            className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {selectedCount}/{items.length} selected
          </span>
        </div>
        <button
          onClick={handleClearCart}
          disabled={loading}
          className="text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {/* Select All Toggle */}
          <div className="flex items-center p-4 bg-white border rounded-lg shadow-sm">
            <input 
              type="checkbox"
              id="selectAll"
              checked={isAllSelected}
              onChange={handleSelectAll}
              disabled={loading}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
            />
            <label htmlFor="selectAll" className="ml-3 font-medium text-gray-700 cursor-pointer select-none">
              Chọn tất cả sản phẩm
            </label>
          </div>

          {items.map((item, index) => (
            <CartItem 
              key={typeof item.product_id === 'string' ? item.product_id : item.product_id?._id || `cart-item-${index}`} 
              item={item} 
            />
          ))}
        </div>

        {/* Cart Summary */}
        <div className="lg:col-span-1">
          <CartSummary />
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-gray-700">
            <p className="font-medium mb-1">Free shipping on orders over 500,000₫</p>
            <p>Your cart will be saved for 30 days. Items may sell out during this time.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
