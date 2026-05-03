import { Metadata } from "next";
import FormOtpPassword from "./FormOtpPassword";
import AuthSplitLayout from "@/components/layouts/admin/auth/AuthSplitLayout";
import AuthLeftPanel from "@/components/layouts/admin/auth/AuthLeftPanel";
import AuthFormCard from "@/components/layouts/admin/auth/AuthFormCard";
import { ShieldEllipsis } from "lucide-react";

export const metadata: Metadata = {
    title: "Xác thực OTP | Cosmetic Eco",
    description: "Xác thực mã bảo mật hệ thống",
};

function OtpVisual() {
    return (
        <>
            {/* OTP digit visualization */}
            <div className="flex items-center gap-2.5 mb-10">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                    <div
                        key={n}
                        className="w-10 h-12 rounded-xl flex items-center justify-center text-xl font-black"
                        style={{
                            background:
                                n <= 3
                                    ? "linear-gradient(135deg, rgba(99,102,241,0.3), rgba(129,140,248,0.2))"
                                    : "rgba(255,255,255,0.04)",
                            border: `1px solid ${n <= 3 ? "rgba(129,140,248,0.5)" : "rgba(255,255,255,0.06)"}`,
                            color: n <= 3 ? "#a5b4fc" : "rgba(100,116,139,0.4)",
                        }}
                    >
                        {n <= 3 ? "•" : "·"}
                    </div>
                ))}
            </div>

            <h2 className="text-4xl font-black text-white leading-tight mb-4">
                Xác Thực
                <br />
                <span
                    style={{
                        background: "linear-gradient(135deg, #818cf8, #c084fc)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    Mã OTP
                </span>
            </h2>
            <p className="text-base font-medium leading-relaxed" style={{ color: "rgba(148,163,184,0.9)" }}>
                Nhập mã 6 chữ số đã được gửi đến
                <br />
                địa chỉ email của bạn để xác minh
            </p>

            {/* Security notice */}
            <div
                className="mt-10 px-6 py-5 rounded-2xl text-left"
                style={{
                    background: "rgba(99,102,241,0.1)",
                    border: "1px solid rgba(129,140,248,0.25)",
                }}
            >
                <p className="text-xs font-semibold mb-1.5" style={{ color: "#a5b4fc" }}>⚠️ Lưu ý bảo mật</p>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(148,163,184,0.7)" }}>
                    Không chia sẻ mã OTP với bất kỳ ai.
                    <br />
                    Mã có hiệu lực trong vòng{" "}
                    <strong style={{ color: "#a5b4fc" }}>5 phút</strong>.
                </p>
            </div>
        </>
    );
}

export default function OtpPasswordPage() {
    return (
        <AuthSplitLayout
            leftPanel={
                <AuthLeftPanel>
                    <OtpVisual />
                </AuthLeftPanel>
            }
            rightPanel={
                <AuthFormCard
                    icon={<ShieldEllipsis className="w-7 h-7 text-white" />}
                    title="Xác Thực OTP"
                    subtitle="Một mã xác thực đã được gửi đến Email của bạn"
                    backHref="/admin/forgot-password"
                    backLabel="Quay lại"
                >
                    <FormOtpPassword />
                </AuthFormCard>
            }
        />
    );
}
