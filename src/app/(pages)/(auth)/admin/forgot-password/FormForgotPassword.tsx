"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/button/Button";
import Input from "@/components/input/Input";
import { authService } from "@/services/admin/authService";
import { toast } from "sonner";

export default function FormForgotPassword() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleForgotPass = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);
        
        try {
            const formData = new FormData(event.target as HTMLFormElement);
            const email = formData.get("email") as string;

            const res = await authService.forgotPassword({ email });

            if (res.code === "success") {
                localStorage.setItem("otp_email", email);
                toast.success("Mã OTP đã được gửi vào Email của Bạn!");
                router.push("/admin/otp-password");
            } else {
                toast.error(res.message || "Gửi yêu cầu thất bại!");
            }
        } catch (error) {
            console.error("Forgot pass error:", error);
            toast.error("Lỗi kết nối Server!");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleForgotPass} className="flex flex-col gap-6">
            <Input
                label="Email khôi phục"
                type="email"
                name="email"
                placeholder="Nhập email của Bạn"
                required
            />
            <Button type="submit" isLoading={isLoading} className="mt-4">
                Gửi mã xác nhận
            </Button>

            <div className="text-center mt-6">
                <p className="text-stone-500 text-sm">
                    Quay lại?{" "}
                    <Link
                        href="/admin/login"
                        className="text-rose-500 font-bold hover:underline underline-offset-4 transition-all"
                    >
                        Đăng nhập
                    </Link>
                </p>
            </div>
        </form>
    );
}
