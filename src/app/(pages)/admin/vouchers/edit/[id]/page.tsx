"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { AdminPageHeader, AdminCard } from "@/components/layouts/admin/shared";
import Button from "@/components/button/Button";
import { voucherService } from "@/services/admin/voucherService";
import { categoryService } from "@/services/admin/categoryService";
import { Category } from "@/types/category";

export default function EditVoucherPage() {
    const router = useRouter();
    const params = useParams();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [categories, setCategories] = useState<Category[]>([]);
    
    const [formData, setFormData] = useState({
        code: "",
        discount_type: "percent",
        discount_value: 0,
        min_order_value: 0,
        max_discount: "",
        start_date: "",
        end_date: "",
        usage_limit: 0,
        status: "active",
        description: "",
        applicable_category: ""
    });

    useEffect(() => {
        const fetchVoucher = async () => {
            try {
                const res = await voucherService.getVoucherDetail(params.id as string);
                if (res.data) {
                    const data = res.data;
                    setFormData({
                        code: data.code,
                        discount_type: data.discount_type,
                        discount_value: data.discount_value,
                        min_order_value: data.min_order_value || 0,
                        max_discount: data.max_discount ? String(data.max_discount) : "",
                        start_date: data.start_date ? new Date(data.start_date).toISOString().split('T')[0] : "",
                        end_date: data.end_date ? new Date(data.end_date).toISOString().split('T')[0] : "",
                        usage_limit: data.usage_limit || 0,
                        status: data.status,
                        description: data.description || "",
                        applicable_category: data.applicable_category || ""
                    });
                } else {
                    toast.error("Không tìm thấy mã giảm giá");
                    router.push("/admin/vouchers");
                }

                // Lấy categories
                const catRes = await categoryService.getCategories();
                if (catRes.code === 200 || catRes.code === "success") {
                    setCategories(catRes.data || []);
                }
            } catch (error) {
                toast.error("Lỗi tải thông tin mã giảm giá");
            } finally {
                setIsLoading(false);
            }
        };

        if (params.id) {
            fetchVoucher();
        }
    }, [params.id, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const dataToSubmit = {
                ...formData,
                discount_value: Number(formData.discount_value),
                min_order_value: Number(formData.min_order_value),
                usage_limit: Number(formData.usage_limit),
                max_discount: formData.discount_type === 'percent' && formData.max_discount ? Number(formData.max_discount) : null,
            };

            const res = await voucherService.updateVoucher(params.id as string, dataToSubmit);

            if (res.code === "success" || res.code === 200 || res.code === 201) {
                toast.success("Cập nhật mã giảm giá thành công!");
                router.push("/admin/vouchers");
                router.refresh();
            } else {
                toast.error(res.message || "Có lỗi xảy ra");
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi cập nhật mã giảm giá");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div>Đang tải thông tin...</div>;

    return (
        <div className="w-full space-y-6 pb-10">
            <AdminPageHeader
                title="Cập nhật mã giảm giá"
                subTitle={`Chỉnh sửa mã ${formData.code}`}
                backHref="/admin/vouchers"
            />

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <AdminCard title="Thông tin chung">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        Mã giảm giá <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="code"
                                        value={formData.code}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all uppercase"
                                        placeholder="VD: SUMMER2024"
                                        required
                                    />
                                    <p className="mt-1.5 text-xs text-slate-400">Chỉ sử dụng chữ cái và số, không khoảng trắng.</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Mô tả ngắn</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={3}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                        placeholder="Nhập mô tả cho mã giảm giá..."
                                    />
                                </div>
                            </div>
                        </AdminCard>

                        <AdminCard title="Thiết lập giá trị">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Loại giảm giá</label>
                                    <select
                                        name="discount_type"
                                        value={formData.discount_type}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                    >
                                        <option value="percent">Phần trăm (%)</option>
                                        <option value="fixed">Giảm số tiền cố định</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        Mức giảm <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="discount_value"
                                        value={formData.discount_value}
                                        onChange={handleChange}
                                        min="0"
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                        required
                                    />
                                </div>

                                {formData.discount_type === 'percent' && (
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Giảm tối đa (VNĐ)</label>
                                        <input
                                            type="number"
                                            name="max_discount"
                                            value={formData.max_discount}
                                            onChange={handleChange}
                                            min="0"
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                            placeholder="Không giới hạn"
                                        />
                                    </div>
                                )}
                            </div>
                        </AdminCard>
                    </div>

                    <div className="space-y-6">
                        <AdminCard title="Điều kiện áp dụng">
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Đơn tối thiểu (VNĐ)</label>
                                    <input
                                        type="number"
                                        name="min_order_value"
                                        value={formData.min_order_value}
                                        onChange={handleChange}
                                        min="0"
                                        className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Số lượt sử dụng</label>
                                    <input
                                        type="number"
                                        name="usage_limit"
                                        value={formData.usage_limit}
                                        onChange={handleChange}
                                        min="0"
                                        className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                                        placeholder="0 = Không giới hạn"
                                    />
                                    <p className="mt-1 text-[10px] text-slate-400">Nhập 0 nếu không giới hạn.</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Phạm vi áp dụng</label>
                                    <select
                                        name="applicable_category"
                                        value={formData.applicable_category}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                                    >
                                        <option value="">Tất cả sản phẩm</option>
                                        {categories.map((category) => (
                                            <option key={category._id} value={category._id}>
                                                Chỉ áp dụng cho: {category.title}
                                            </option>
                                        ))}
                                    </select>
                                    <p className="mt-1 text-[10px] text-slate-400">Để trống để áp dụng cho toàn bộ cửa hàng.</p>
                                </div>
                            </div>
                        </AdminCard>

                        <AdminCard title="Thời gian & Trạng thái">
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Ngày bắt đầu</label>
                                    <input
                                        type="date"
                                        name="start_date"
                                        value={formData.start_date}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Ngày kết thúc</label>
                                    <input
                                        type="date"
                                        name="end_date"
                                        value={formData.end_date}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Trạng thái</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                                    >
                                        <option value="active">Hoạt động</option>
                                        <option value="inactive">Không hoạt động</option>
                                    </select>
                                </div>
                            </div>
                        </AdminCard>
                    </div>
                </div>

                <div className="mt-8 flex justify-end gap-3">
                    <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => router.push("/admin/vouchers")}
                    >
                        Hủy
                    </Button>
                    <Button type="submit" isLoading={isSubmitting}>
                        Lưu cập nhật
                    </Button>
                </div>
            </form>
        </div>
    );
}
