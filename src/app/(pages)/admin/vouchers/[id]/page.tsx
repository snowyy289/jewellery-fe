"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { AdminPageHeader, AdminCard } from "@/components/layouts/admin/shared";
import Button from "@/components/button/Button";
import { voucherService } from "@/services/admin/voucherService";

export default function VoucherDetailPage() {
    const router = useRouter();
    const params = useParams();
    const [isLoading, setIsLoading] = useState(true);
    
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
        description: ""
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
                        description: data.description || ""
                    });
                } else {
                    toast.error("Không tìm thấy mã giảm giá");
                    router.push("/admin/vouchers");
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

    if (isLoading) return <div>Đang tải thông tin...</div>;

    return (
        <div className="w-full space-y-6 pb-10">
            <AdminPageHeader
                title="Chi tiết mã giảm giá"
                subTitle={`Thông tin mã ${formData.code}`}
                breadcrumbs={[
                    { label: "Mã giảm giá", href: "/admin/vouchers" },
                    { label: "Chi tiết" }
                ]}
            />

            <form onSubmit={(e) => e.preventDefault()} className="pointer-events-none opacity-90 select-none [&_button[type=submit]]:hidden">
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
                                        readOnly
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
                                        readOnly
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
                                        disabled
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
                                        readOnly
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
                                            readOnly
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
                                        readOnly
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
                                        readOnly
                                        min="0"
                                        className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                                        placeholder="0 = Không giới hạn"
                                    />
                                    <p className="mt-1 text-[10px] text-slate-400">Nhập 0 nếu không giới hạn.</p>
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
                                        readOnly
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
                                        readOnly
                                        className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Trạng thái</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        disabled
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
                        variant="secondary"
                        onClick={() => router.push("/admin/vouchers")}
                        className="pointer-events-auto"
                    >
                        Quay lại
                    </Button>
                </div>
            </form>
        </div>
    );
}
