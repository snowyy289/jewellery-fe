"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { wishlistService } from '@/services/client/wishlistService';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  wishlistIds: string[];
  wishlistCount: number;
  isLoading: boolean;
  toggleWishlist: (productId: string) => Promise<boolean>;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const refreshWishlist = async () => {
    if (!isAuthenticated) {
      setWishlistIds([]);
      return;
    }
    
    try {
      setIsLoading(true);
      const res = await wishlistService.getWishlist();
      if (res.code === 200 && res.data) {
        // Extract product IDs
        const ids = res.data.map((item: any) => {
          // It can be populated or just ID string depending on the API response structure
          return typeof item.product_id === 'object' ? item.product_id._id : item.product_id;
        });
        setWishlistIds(ids);
      }
    } catch (error) {
      console.error("Failed to load wishlist", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshWishlist();
  }, [isAuthenticated]);

  const toggleWishlist = async (productId: string): Promise<boolean> => {
    if (!isAuthenticated) {
      alert("Vui lòng đăng nhập để sử dụng tính năng này!");
      // Optionally redirect to login or show modal
      window.location.href = "/login";
      return false;
    }

    try {
      const isAlreadyInWishlist = wishlistIds.includes(productId);
      
      // Optimistic update
      if (isAlreadyInWishlist) {
        setWishlistIds(prev => prev.filter(id => id !== productId));
      } else {
        setWishlistIds(prev => [...prev, productId]);
      }

      const res = await wishlistService.toggleWishlist(productId);
      
      // If server response differs from optimistic update, refresh
      if (res.code !== 200) {
        await refreshWishlist();
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Toggle wishlist error", error);
      // Revert on error
      await refreshWishlist();
      return false;
    }
  };

  return (
    <WishlistContext.Provider value={{
      wishlistIds,
      wishlistCount: wishlistIds.length,
      isLoading,
      toggleWishlist,
      refreshWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
