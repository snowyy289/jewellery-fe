import { Metadata } from "next";
import FormLogin from "./FormLogin";
import AuthSplitLayout from "@/components/layouts/admin/auth/AuthSplitLayout";
import AuthLeftPanel from "@/components/layouts/admin/auth/AuthLeftPanel";
import AuthFormCard from "@/components/layouts/admin/auth/AuthFormCard";
import { ShieldCheck, Star, Zap } from "lucide-react";

export const metadata: Metadata = {
    title: "Đăng nhập (Admin) | Jewelry Eco",
    description: "Hệ thống quản trị cao cấp Jewelry Eco",
};

function LoginVisual() {
    return (
        <>
            {/* Badge */}
            <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 border"
                style={{ background: "rgba(99,102,241,0.15)", borderColor: "rgba(129,140,248,0.3)" }}
            >
                <Star className="w-3.5 h-3.5 fill-current" style={{ color: "#818cf8" }} />
                <span className="text-xs font-semibold" style={{ color: "#a5b4fc" }}>
                    Hệ Thống Quản Trị
                </span>
            </div>

            <h2 className="text-4xl font-black text-white leading-tight mb-4">
                Chào Mừng
                <br />
                <span
                    style={{
                        background: "linear-gradient(135deg, #818cf8, #c084fc)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    Trở Lại
                </span>
            </h2>
            <p className="text-base font-medium leading-relaxed" style={{ color: "rgba(148,163,184,0.9)" }}>
                Quản lý toàn bộ hệ thống thương mại điện tử
                <br />
                trang sức cao cấp của bạn
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-2 justify-center mt-10">
                {["Quản lý sản phẩm", "Phân tích dữ liệu", "Kiểm soát đơn hàng", "Bảo mật tuyệt đối"].map((f) => (
                    <span
                        key={f}
                        className="text-xs px-3 py-1.5 rounded-full font-medium"
                        style={{
                            background: "rgba(255,255,255,0.06)",
                            color: "rgba(148,163,184,0.9)",
                            border: "1px solid rgba(255,255,255,0.08)",
                        }}
                    >
                        {f}
                    </span>
                ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-12 w-full max-w-xs">
                {[
                    { val: "10K+", label: "Sản phẩm" },
                    { val: "50K+", label: "Đơn hàng" },
                    { val: "99.9%", label: "Uptime" },
                ].map((s) => (
                    <div
                        key={s.label}
                        className="text-center p-3 rounded-2xl border"
                        style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)" }}
                    >
                        <div className="text-xl font-black" style={{ color: "#a5b4fc" }}>{s.val}</div>
                        <div className="text-xs font-medium mt-0.5" style={{ color: "rgba(100,116,139,0.8)" }}>
                            {s.label}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default function AdminLoginPage() {
    return (
        <AuthSplitLayout
            leftPanel={
                <AuthLeftPanel>
                    <LoginVisual />
                </AuthLeftPanel>
            }
            rightPanel={
                <>
                    <AuthFormCard
                        icon={<ShieldCheck className="w-7 h-7 text-white" />}
                        title="Đăng Nhập"
                        subtitle="Nhập thông tin để truy cập hệ thống"
                    >
                        <FormLogin />
                    </AuthFormCard>
                    <div className="mt-8 text-center flex items-center justify-center gap-2">
                        <Zap className="w-3 h-3" style={{ color: "#6366f1" }} />
                        <p className="text-xs font-medium text-slate-400">Jewelry Eco Admin · Secure Portal</p>
                    </div>
                </>
            }
        />
    );
}
