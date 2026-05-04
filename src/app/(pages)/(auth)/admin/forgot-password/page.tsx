import { Metadata } from "next";
import FormForgotPassword from "./FormForgotPassword";
import AuthSplitLayout from "@/components/layouts/admin/auth/AuthSplitLayout";
import AuthLeftPanel from "@/components/layouts/admin/auth/AuthLeftPanel";
import AuthFormCard from "@/components/layouts/admin/auth/AuthFormCard";
import { KeyRound, Mail } from "lucide-react";

export const metadata: Metadata = {
    title: "Quên mật khẩu | Jewelry Eco",
    description: "Khôi phục quyền truy cập hệ thống",
};

function ForgotPasswordVisual() {
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
                <Mail className="w-12 h-12" style={{ color: "#818cf8" }} />
            </div>
            <h2 className="text-4xl font-black text-white leading-tight mb-4">
                Khôi Phục
                <br />
                <span
                    style={{
                        background: "linear-gradient(135deg, #818cf8, #c084fc)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    Mật Khẩu
                </span>
            </h2>
            <p className="text-base font-medium leading-relaxed" style={{ color: "rgba(148,163,184,0.9)" }}>
                Chúng tôi sẽ gửi mã OTP đến địa chỉ email
                <br />
                đăng ký của bạn để xác minh danh tính
            </p>

            {/* Step list */}
            <div className="mt-10 w-full max-w-xs space-y-3">
                {[
                    { step: "01", text: "Nhập địa chỉ Email" },
                    { step: "02", text: "Nhận mã OTP qua Email" },
                    { step: "03", text: "Đặt lại mật khẩu mới" },
                ].map((s) => (
                    <div
                        key={s.step}
                        className="flex items-center gap-3 text-left px-4 py-3 rounded-2xl"
                        style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.06)",
                        }}
                    >
                        <span className="text-xs font-black" style={{ color: "#6366f1" }}>{s.step}</span>
                        <div className="w-px h-4 bg-slate-600" />
                        <span className="text-sm font-medium" style={{ color: "rgba(148,163,184,0.9)" }}>
                            {s.text}
                        </span>
                    </div>
                ))}
            </div>
        </>
    );
}

export default function ForgotPasswordPage() {
    return (
        <AuthSplitLayout
            leftPanel={
                <AuthLeftPanel>
                    <ForgotPasswordVisual />
                </AuthLeftPanel>
            }
            rightPanel={
                <AuthFormCard
                    icon={<KeyRound className="w-7 h-7 text-white" />}
                    title="Quên Mật Khẩu"
                    subtitle="Nhập Email để nhận mã OTP khôi phục"
                    backHref="/admin/login"
                    backLabel="Quay lại đăng nhập"
                >
                    <FormForgotPassword />
                </AuthFormCard>
            }
        />
    );
}
