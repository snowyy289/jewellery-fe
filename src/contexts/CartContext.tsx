/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { cartService, getSessionId } from "@/services/client/cartService";
import { useAuth } from "./AuthContext";
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
  updateItemSelection: (productId: string, selected: boolean) => Promise<void>;
  selectAllItems: (selected: boolean) => Promise<void>;
  buyNow: (productId: string, quantity: number) => Promise<void>;
  applyVoucher: (voucherCode: string) => Promise<void>;
  removeVoucher: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate total item count (only counting selected items, or total items? Usually cart badge counts all items, but checkout counts selected. Let's keep cart badge as total items, but add selectedItemCount if needed. Wait, standard e-commerce counts all items in the badge.)
  const itemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

  // Refresh cart from server
  const refreshCart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await cartService.getCart();
      setCart(response.data);
    } catch (err) {
      if (typeof window !== 'undefined' && sessionStorage.getItem("is_logging_out") !== "true") {
        console.error("Error fetching cart:", err);
      }
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

  // Update item selection
  const updateItemSelection = async (productId: string, selected: boolean) => {
    try {
      setLoading(true);
      setError(null);
      const response = await cartService.updateItemSelection(productId, selected);
      setCart(response.data);
    } catch (err) {
      const errorMessage = (err as any).response?.data?.message || "Failed to update selection";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Select all items
  const selectAllItems = async (selected: boolean) => {
    try {
      setLoading(true);
      setError(null);
      const response = await cartService.selectAllItems(selected);
      setCart(response.data);
    } catch (err) {
      const errorMessage = (err as any).response?.data?.message || "Failed to update selection";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Buy now (Add, select only this item, then redirect is handled by caller or here)
  const buyNow = async (productId: string, quantity: number) => {
    try {
      setLoading(true);
      setError(null);
      // We can do this with existing methods, but we want to avoid multiple state updates causing flickers.
      // However, making sequential calls is the easiest way without backend changes.
      await cartService.addToCart({ product_id: productId, quantity });
      await cartService.selectAllItems(false);
      const finalResponse = await cartService.updateItemSelection(productId, true);
      setCart(finalResponse.data);
    } catch (err) {
      const errorMessage = (err as any).response?.data?.message || "Failed to process Buy Now";
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

  // Apply Voucher
  const applyVoucher = async (voucherCode: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await cartService.applyVoucher(voucherCode);
      setCart(response.data);
    } catch (err) {
      const errorMessage = (err as any).response?.data?.message || "Failed to apply voucher";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Remove Voucher
  const removeVoucher = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await cartService.removeVoucher();
      setCart(response.data);
    } catch (err) {
      const errorMessage = (err as any).response?.data?.message || "Failed to remove voucher";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Merge guest cart with user cart (after login)
  const mergeGuestCart = useCallback(async () => {
    try {
      // Check if session ID exists BEFORE generating a new one
      const currentSessionId = typeof window !== 'undefined' ? localStorage.getItem('cart_session_id') : null;
      if (!currentSessionId) return; // Only merge if there was an actual guest cart session

      setLoading(true);
      setError(null);
      const response = await cartService.mergeCart({ guest_session_id: currentSessionId });
      setCart(response.data);
    } catch (err) {
      console.error("Error merging cart:", err);
      // Don't throw error, just log it
      // Cart merge is not critical
    } finally {
      setLoading(false);
    }
  }, []);

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

  // Load cart on mount and when user changes
  const { user } = useAuth();
  const userId = user?._id;
  
  useEffect(() => {
    const handleAuthChange = async () => {
      try {
        if (userId) {
          await mergeGuestCart();
        } else {
          // User logged out. Clear cart state immediately.
          setCart(null);
        }
        
        // Only fetch from server if we are not actively redirecting to login
        if (typeof window !== 'undefined' && sessionStorage.getItem("is_logging_out") !== "true") {
          await refreshCart();
        }
      } catch (err) {
        console.error("Failed to handle auth change", err);
      }
    };
    handleAuthChange();
  }, [userId, refreshCart, mergeGuestCart]);

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
        isInCart,
        updateItemSelection,
        selectAllItems,
        buyNow,
        applyVoucher,
        removeVoucher
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
