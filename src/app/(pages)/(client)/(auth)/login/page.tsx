"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { clientAuthService } from "@/services/client/authService";
import { ArrowRight, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await clientAuthService.login(formData);
      if (res.code === 200) {
        login(res.user, res.token);
        router.push("/");
      } else {
        setError(res.message || "Đăng nhập thất bại");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Đã xảy ra lỗi, vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-stone-50">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-stone-100">
        <div>
          <h2 className="text-center text-3xl font-serif text-stone-900 tracking-wider">
            Đăng Nhập
          </h2>
          <p className="mt-2 text-center text-sm text-stone-500 uppercase tracking-widest">
            Chào mừng trở lại
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm text-center border border-red-100">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-600 uppercase tracking-widest mb-2">
                Email
              </label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:border-gold transition-colors text-sm"
                placeholder="Nhập địa chỉ email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 uppercase tracking-widest mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:border-gold transition-colors text-sm pr-10"
                  placeholder="Nhập mật khẩu"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-gold focus:ring-gold border-stone-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-xs text-stone-600">
                Ghi nhớ đăng nhập
              </label>
            </div>

            <div className="text-xs">
              <Link href="/forgot-password" className="text-stone-500 hover:text-gold transition-colors">
                Quên mật khẩu?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-stone-900 hover:bg-gold transition-colors focus:outline-none uppercase tracking-widest disabled:opacity-50"
            >
              {isLoading ? "Đang xử lý..." : "Đăng Nhập"}
              <ArrowRight className="ml-2 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </form>

        <div className="text-center mt-6">
          <span className="text-xs text-stone-500">Chưa có tài khoản? </span>
          <Link href="/register" className="text-xs font-bold text-stone-900 hover:text-gold uppercase tracking-widest transition-colors">
            Đăng Ký Ngay
          </Link>
        </div>
      </div>
    </div>
  );
}
