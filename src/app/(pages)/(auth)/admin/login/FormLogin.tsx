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

            const res = await authService.login({ email, password });

            if (res.code === "success") {
                localStorage.setItem("token", res.token);
                if (res.user) {
                    localStorage.setItem("user", JSON.stringify(res.user));
                }
                toast.success("Chào mừng bạn quay trở lại!");
                router.push("/admin/dashboard");
            } else {
                toast.error(res.message || "Đăng nhập thất bại!");
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error("Lỗi kết nối Server!");
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
