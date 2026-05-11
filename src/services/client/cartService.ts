import axiosInstance from "../axiosInstance";
import { 
  CartResponse, 
  AddToCartRequest, 
  UpdateCartRequest, 
  MergeCartRequest,
  StockValidationResponse 
} from "@/types/cart";

// Helper to get/set session ID
const SESSION_ID_KEY = 'cart_session_id';

export const getSessionId = (): string => {
  if (typeof window === 'undefined') return '';
  
  let sessionId = localStorage.getItem(SESSION_ID_KEY);
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(SESSION_ID_KEY, sessionId);
  }
  return sessionId;
};

export const clearSessionId = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_ID_KEY);
  }
};

export const cartService = {
  // Get cart
  getCart: async (): Promise<CartResponse> => {
    const sessionId = getSessionId();
    const response = await axiosInstance.get("/client/cart", {
      headers: {
        'x-session-id': sessionId
      }
    });
    return response.data;
  },

  // Add to cart
  addToCart: async (data: AddToCartRequest): Promise<CartResponse> => {
    const sessionId = getSessionId();
    const response = await axiosInstance.post("/client/cart/add", data, {
      headers: {
        'x-session-id': sessionId
      }
    });
    return response.data;
  },

  // Update cart item quantity
  updateCart: async (productId: string, data: UpdateCartRequest): Promise<CartResponse> => {
    const sessionId = getSessionId();
    const response = await axiosInstance.put(`/client/cart/update/${productId}`, data, {
      headers: {
        'x-session-id': sessionId
      }
    });
    return response.data;
  },

  // Remove from cart
  removeFromCart: async (productId: string): Promise<CartResponse> => {
    const sessionId = getSessionId();
    const response = await axiosInstance.delete(`/client/cart/remove/${productId}`, {
      headers: {
        'x-session-id': sessionId
      }
    });
    return response.data;
  },

  // Clear cart
  clearCart: async (): Promise<CartResponse> => {
    const sessionId = getSessionId();
    const response = await axiosInstance.delete("/client/cart/clear", {
      headers: {
        'x-session-id': sessionId
      }
    });
    return response.data;
  },

  // Validate stock
  validateStock: async (): Promise<StockValidationResponse> => {
    const sessionId = getSessionId();
    const response = await axiosInstance.get("/client/cart/validate-stock", {
      headers: {
        'x-session-id': sessionId
      }
    });
    return response.data;
  },

  // Merge guest cart with user cart (after login)
  mergeCart: async (data: MergeCartRequest): Promise<CartResponse> => {
    const response = await axiosInstance.post("/client/cart/merge", data);
    // Clear old session ID after merge
    clearSessionId();
    return response.data;
  }
};
