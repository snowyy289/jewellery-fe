"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export const useAuth = () => {
  const [authState, setAuthState] = useState({ isLoading: true, isAuthenticated: false });
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (!token) {
      router.push("/admin/login");
    } else {
      Promise.resolve().then(() => {
        setAuthState({ isLoading: false, isAuthenticated: true });
      });
    }
  }, [router]);

  return { ...authState };
};
