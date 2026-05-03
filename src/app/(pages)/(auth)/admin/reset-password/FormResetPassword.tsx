"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/button/Button";
import Input from "@/components/input/Input";
import { authService } from "@/services/admin/authService";
import { toast } from "sonner";

export default function FormResetPassword() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleResetPass = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);
        
        try {
            const formData = new FormData(event.target as HTMLFormElement);
            const password = formData.get("password") as string;
            const confirmPassword = formData.get("confirmPassword") as string;

            if (password !== confirmPassword) {
                toast.warning("Mật khẩu xác nhận không khớp!");
                return;
            }

            const res = await authService.resetPassword({ password, confirmPassword });

            if (res.code === "success") {
                toast.success("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
                localStorage.removeItem("otp_email");
                router.push("/admin/login");
            } else {
                toast.error(res.message || "Đổi mật khẩu thất bại!");
            }
        } catch (error) {
            console.error("Reset pass error:", error);
            toast.error("Lỗi kết nối Server!");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleResetPass} className="flex flex-col gap-6">
            <Input
                label="Mật khẩu mới"
                type="password"
                name="password"
                placeholder="••••••••"
                required
            />
            <Input
                label="Xác nhận mật khẩu"
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                required
            />
            <Button type="submit" isLoading={isLoading} className="mt-4">
                Cập nhật mật khẩu
            </Button>
        </form>
    );
}
