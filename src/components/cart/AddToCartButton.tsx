"use client";

import React, { useState } from "react";
import { useCart } from "@/contexts/CartContext";

interface AddToCartButtonProps {
  productId: string;
  quantity?: number;
  className?: string;
  children?: React.ReactNode;
}

export default function AddToCartButton({ 
  productId, 
  quantity = 1, 
  className = "",
  children 
}: AddToCartButtonProps) {
  const { addToCart, loading } = useCart();
  const [success, setSuccess] = useState(false);

  const handleAddToCart = async () => {
    try {
      await addToCart(productId, quantity);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to add to cart";
      alert(message);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={loading}
      className={`
        px-4 py-2 rounded-lg font-medium transition-all
        ${success 
          ? 'bg-green-500 text-white' 
          : 'bg-blue-600 text-white hover:bg-blue-700'
        }
        ${loading ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Adding...
        </span>
      ) : success ? (
        <span className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Added!
        </span>
      ) : (
        children || (
          <span className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
            </svg>
            Add to Cart
          </span>
        )
      )}
    </button>
  );
}
