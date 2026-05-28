"use client";

import React, { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";

interface BuyNowButtonProps {
  productId: string;
  quantity?: number;
  className?: string;
  children?: React.ReactNode;
}

export default function BuyNowButton({ 
  productId, 
  quantity = 1, 
  className = "",
  children 
}: BuyNowButtonProps) {
  const { buyNow, loading } = useCart();
  const [processing, setProcessing] = useState(false);
  const router = useRouter();

  const handleBuyNow = async () => {
    try {
      setProcessing(true);
      await buyNow(productId, quantity);
      router.push('/checkout');
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to process request";
      alert(message);
      setProcessing(false);
    }
  };

  return (
    <button
      onClick={handleBuyNow}
      disabled={loading || processing}
      className={`
        px-4 py-2 rounded-lg font-medium transition-all
        bg-emerald-600 text-white hover:bg-emerald-700
        ${(loading || processing) ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {(loading || processing) ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Đang xử lý...
        </span>
      ) : (
        children || "Mua ngay"
      )}
    </button>
  );
}
