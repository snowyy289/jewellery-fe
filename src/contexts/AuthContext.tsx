"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Clear any pending logout flags from previous sessions
    sessionStorage.removeItem("is_logging_out");
    
    // Only run on client side
    const storedToken = localStorage.getItem("client_token");
    const storedUser = localStorage.getItem("client_user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user from local storage");
      }
    }
    setIsInitialized(true);
  }, []);

  const login = (userData: User, newToken: string) => {
    setUser(userData);
    setToken(newToken);
    localStorage.setItem("client_token", newToken);
    localStorage.setItem("client_user", JSON.stringify(userData));
  };

  const logout = () => {
    sessionStorage.setItem("is_logging_out", "true");
    setUser(null);
    setToken(null);
    localStorage.removeItem("client_token");
    localStorage.removeItem("client_user");
    localStorage.removeItem("cart_session_id");
    window.location.href = "/login";
  };

  if (!isInitialized) {
    return null; // or a loading spinner
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
