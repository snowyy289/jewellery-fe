"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/button/Button";
import Input from "@/components/input/Input";
import { authService } from "@/services/admin/authService";
import { toast } from "sonner";

export default function FormOtpPassword() {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const router = useRouter();

    useEffect(() => {
        const savedEmail = localStorage.getItem("otp_email");
        if (!savedEmail) {
            router.push("/admin/forgot-password");
        } else {
            setEmail(savedEmail);
        }
    }, [router]);

    const handleOtpVerify = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);
        
        try {
            const formData = new FormData(event.target as HTMLFormElement);
            const otp = formData.get("otp") as string;

            const res = await authService.otpPassword({ email, otp });

            if (res.code === "success") {
                localStorage.setItem("token", res.token);
                toast.success("Xác thực OTP thành công!");
                router.push("/admin/reset-password");
            } else {
                toast.error(res.message || "Mã OTP không chính xác!");
            }
        } catch (error) {
            console.error("OTP error:", error);
            toast.error("Lỗi xác thực!");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleOtpVerify} className="flex flex-col gap-6">
            <div className="text-center mb-2">
                <span className="text-stone-400 text-sm italic">Gửi tới: {email}</span>
            </div>
            <Input
                label="Mã OTP"
                type="text"
                name="otp"
                placeholder="Nhập 6 chữ số"
                maxLength={6}
                required
                className="text-center tracking-[1em] font-black text-2xl"
            />
            <Button type="submit" isLoading={isLoading} className="mt-4">
                Xác nhận OTP
            </Button>
        </form>
    );
}
