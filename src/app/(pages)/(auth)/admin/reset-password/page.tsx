import { Metadata } from "next";
import FormResetPassword from "./FormResetPassword";
import AuthSplitLayout from "@/components/layouts/admin/auth/AuthSplitLayout";
import AuthLeftPanel from "@/components/layouts/admin/auth/AuthLeftPanel";
import AuthFormCard from "@/components/layouts/admin/auth/AuthFormCard";
import { Lock, Shield } from "lucide-react";

export const metadata: Metadata = {
    title: "Đặt lại mật khẩu | Cosmetic Eco",
    description: "Cài đặt mật khẩu mới cho tài khoản",
};

function ResetPasswordVisual() {
    return (
        <>
            <div
                className="w-24 h-24 rounded-3xl flex items-center justify-center mb-8"
                style={{
                    background: "rgba(99,102,241,0.15)",
                    border: "1px solid rgba(129,140,248,0.3)",
                    boxShadow: "0 20px 40px rgba(99,102,241,0.2)",
                }}
            >
                <Shield className="w-12 h-12" style={{ color: "#818cf8" }} />
            </div>

            <h2 className="text-4xl font-black text-white leading-tight mb-4">
                Mật Khẩu
                <br />
                <span
                    style={{
                        background: "linear-gradient(135deg, #818cf8, #c084fc)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    Mới Của Bạn
                </span>
            </h2>
            <p className="text-base font-medium leading-relaxed" style={{ color: "rgba(148,163,184,0.9)" }}>
                Tạo một mật khẩu mạnh để bảo vệ
                <br />
                tài khoản quản trị của bạn
            </p>

            {/* Password tips */}
            <div className="mt-10 w-full max-w-xs text-left space-y-3">
                <p
                    className="text-xs font-bold uppercase tracking-wider mb-3"
                    style={{ color: "rgba(129,140,248,0.6)" }}
                >
                    Gợi ý mật khẩu mạnh
                </p>
                {[
                    "Tối thiểu 8 ký tự",
                    "Kết hợp chữ hoa và chữ thường",
                    "Có ít nhất 1 số và 1 ký tự đặc biệt",
                    "Không dùng thông tin cá nhân",
                ].map((tip) => (
                    <div key={tip} className="flex items-start gap-2.5">
                        <div
                            className="w-1.5 h-1.5 rounded-full mt-1.5"
                            style={{ background: "#6366f1" }}
                        />
                        <span className="text-xs" style={{ color: "rgba(148,163,184,0.7)" }}>
                            {tip}
                        </span>
                    </div>
                ))}
            </div>
        </>
    );
}

export default function ResetPasswordPage() {
    return (
        <AuthSplitLayout
            leftPanel={
                <AuthLeftPanel>
                    <ResetPasswordVisual />
                </AuthLeftPanel>
            }
            rightPanel={
                <AuthFormCard
                    icon={<Lock className="w-7 h-7 text-white" />}
                    title="Mật Khẩu Mới"
                    subtitle="Tạo mật khẩu mới mạnh mẽ và bảo mật"
                    backHref="/admin/otp-password"
                    backLabel="Quay lại"
                >
                    <FormResetPassword />
                </AuthFormCard>
            }
        />
    );
}
