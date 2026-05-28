"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { clientAuthService } from "@/services/client/authService";
import { ArrowRight, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({ 
    fullName: "", 
    email: "", 
    phone: "", 
    password: "", 
    confirmPassword: "" 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }

    setIsLoading(true);

    try {
      const res = await clientAuthService.register(formData);
      if (res.code === 201) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setError(res.message || "Đăng ký thất bại");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Đã xảy ra lỗi, vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 bg-stone-50">
        <div className="max-w-md w-full bg-white p-10 rounded-2xl shadow-xl border border-stone-100 text-center">
          <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-serif text-stone-900 tracking-wider mb-2">Đăng Ký Thành Công</h2>
          <p className="text-sm text-stone-500 mb-6">Chào mừng bạn đến với hệ thống của chúng tôi. Hệ thống sẽ tự động chuyển đến trang Đăng nhập.</p>
          <Link href="/login" className="text-xs font-bold uppercase tracking-widest text-gold hover:text-stone-900">
            Đến trang Đăng Nhập ngay
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-stone-50">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-stone-100">
        <div>
          <h2 className="text-center text-3xl font-serif text-stone-900 tracking-wider">
            Đăng Ký
          </h2>
          <p className="mt-2 text-center text-sm text-stone-500 uppercase tracking-widest">
            Tạo tài khoản mới
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm text-center border border-red-100">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-600 uppercase tracking-widest mb-1">
                Họ và tên
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:border-gold transition-colors text-sm"
                placeholder="Nhập họ và tên"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 uppercase tracking-widest mb-1">
                Số điện thoại
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:border-gold transition-colors text-sm"
                placeholder="Nhập số điện thoại"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 uppercase tracking-widest mb-1">
                Email
              </label>
              <input
                type="email"
                required
                className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:border-gold transition-colors text-sm"
                placeholder="Nhập địa chỉ email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 uppercase tracking-widest mb-1">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:border-gold transition-colors text-sm pr-10"
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

            <div>
              <label className="block text-xs font-bold text-stone-600 uppercase tracking-widest mb-1">
                Xác nhận mật khẩu
              </label>
              <input
                type={showPassword ? "text" : "password"}
                required
                className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:border-gold transition-colors text-sm"
                placeholder="Nhập lại mật khẩu"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-stone-900 hover:bg-gold transition-colors focus:outline-none uppercase tracking-widest disabled:opacity-50 mt-4"
            >
              {isLoading ? "Đang xử lý..." : "Đăng Ký"}
              <ArrowRight className="ml-2 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </form>

        <div className="text-center mt-6">
          <span className="text-xs text-stone-500">Đã có tài khoản? </span>
          <Link href="/login" className="text-xs font-bold text-stone-900 hover:text-gold uppercase tracking-widest transition-colors">
            Đăng Nhập Ngay
          </Link>
        </div>
      </div>
    </div>
  );
}
