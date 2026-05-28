"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/button/Button";
import Input from "@/components/input/Input";
import { authService } from "@/services/admin/authService";
import { toast } from "sonner";

export default function FormLogin() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleAdminLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);
        
        try {
            const formData = new FormData(event.target as HTMLFormElement);
            const email = formData.get("email") as string;
            const password = formData.get("password") as string;

            console.log("🔐 [LOGIN] Sending login request...", { email });
            
            const res = await authService.login({ email, password });
            
            console.log("📦 [LOGIN] Response received:", res);
            console.log("📊 [LOGIN] Response code:", res.code);
            console.log("📊 [LOGIN] Response code type:", typeof res.code);
            console.log("🔑 [LOGIN] Has token:", !!res.token);
            console.log("👤 [LOGIN] Has user:", !!res.user);

            if (res.code === 200) {
                console.log("✅ [LOGIN] Code is 200, proceeding with login...");
                
                // Save to localStorage
                localStorage.setItem("token", res.token);
                console.log("💾 [LOGIN] Token saved to localStorage");
                
                if (res.user) {
                    localStorage.setItem("user", JSON.stringify(res.user));
                    console.log("💾 [LOGIN] User saved to localStorage:", res.user);
                }
                
                // Save to cookies for middleware
                document.cookie = `token=${res.token}; path=/; max-age=${30 * 24 * 60 * 60}`; // 30 days
                console.log("🍪 [LOGIN] Token saved to cookies");
                
                toast.success("Chào mừng bạn quay trở lại!");
                
                console.log("🚀 [LOGIN] Redirecting to /admin/dashboard...");
                // Force navigation to dashboard
                window.location.href = "/admin/dashboard";
            } else {
                console.log("❌ [LOGIN] Code is NOT 200, showing error");
                console.log("❌ [LOGIN] Expected: 200, Got:", res.code);
                toast.error(res.message || "Đăng nhập thất bại!");
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Lỗi kết nối Server!";
            console.log("💥 [LOGIN] Error:", errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleAdminLogin} className="flex flex-col gap-6">
            <Input
                label="Email"
                type="email"
                name="email"
                placeholder="admin@example.com"
                required
            />
            <Input
                label="Mật khẩu"
                type="password"
                name="password"
                placeholder="••••••••"
                required
            />
            <div className="flex justify-end -mt-2">
                <Link
                    href="/admin/forgot-password"
                    className="text-xs font-bold text-stone-400 hover:text-rose-500 transition-colors uppercase tracking-wider"
                >
                    Quên mật khẩu?
                </Link>
            </div>

            <Button type="submit" isLoading={isLoading} className="mt-4">
                Đăng Nhập
            </Button>

            <div className="text-center mt-6">
                <p className="text-stone-500 text-sm">
                    Chưa có tài khoản?{" "}
                    <Link
                        href="/admin/register"
                        className="text-rose-500 font-bold hover:underline underline-offset-4 transition-all"
                    >
                        Đăng ký ngay
                    </Link>
                </p>
            </div>
        </form>
    );
}
