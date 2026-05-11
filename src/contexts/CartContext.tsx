/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { cartService, getSessionId } from "@/services/client/cartService";
import { Cart } from "@/types/cart";
import { Product } from "@/types/product";

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  itemCount: number;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  updateCart: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  mergeGuestCart: () => Promise<void>;
  getItemQuantity: (productId: string) => number;
  isInCart: (productId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate total item count
  const itemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

  // Refresh cart from server
  const refreshCart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await cartService.getCart();
      setCart(response.data);
    } catch (err) {
      console.error("Error fetching cart:", err);
      const message = err instanceof Error ? (err as any).response?.data?.message || err.message : "Failed to load cart";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Add to cart
  const addToCart = async (productId: string, quantity: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await cartService.addToCart({ product_id: productId, quantity });
      setCart(response.data);
    } catch (err) {
      const errorMessage = (err as any).response?.data?.message || "Failed to add to cart";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Update cart item quantity
  const updateCart = async (productId: string, quantity: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await cartService.updateCart(productId, { quantity });
      setCart(response.data);
    } catch (err) {
      const errorMessage = (err as any).response?.data?.message || "Failed to update cart";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Remove from cart
  const removeFromCart = async (productId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await cartService.removeFromCart(productId);
      setCart(response.data);
    } catch (err) {
      const errorMessage = (err as any).response?.data?.message || "Failed to remove from cart";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await cartService.clearCart();
      setCart(response.data);
    } catch (err) {
      const errorMessage = (err as any).response?.data?.message || "Failed to clear cart";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Merge guest cart with user cart (after login)
  const mergeGuestCart = async () => {
    try {
      const guestSessionId = getSessionId();
      if (!guestSessionId) return;

      setLoading(true);
      setError(null);
      const response = await cartService.mergeCart({ guest_session_id: guestSessionId });
      setCart(response.data);
    } catch (err) {
      console.error("Error merging cart:", err);
      // Don't throw error, just log it
      // Cart merge is not critical
    } finally {
      setLoading(false);
    }
  };

  // Get quantity of a specific product in cart
  const getItemQuantity = (productId: string): number => {
    if (!cart) return 0;
    const item = cart.items.find((item) => {
      const itemProductId = typeof item.product_id === 'string' 
        ? item.product_id 
        : (item.product_id as Product)._id;
      return itemProductId === productId;
    });
    return item?.quantity || 0;
  };

  // Check if product is in cart
  const isInCart = (productId: string): boolean => {
    return getItemQuantity(productId) > 0;
  };

  // Load cart on mount
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
        itemCount,
        addToCart,
        updateCart,
        removeFromCart,
        clearCart,
        refreshCart,
        mergeGuestCart,
        getItemQuantity,
        isInCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
