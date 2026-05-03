"use client";
import { useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { Camera, Image as ImageIcon, Activity, Save, X, Calendar } from "lucide-react";
import Image from "next/image";
import Button from "@/components/button/Button";
import Input from "@/components/input/Input";
import Select from "@/components/input/Select";
import Textarea from "@/components/input/Textarea";
import { AdminCard } from "@/components/layouts/admin/shared";
import { bannerService } from "@/services/admin/bannerService";
import { Banner } from "@/types/banner";
import { toast } from "sonner";

interface FormBannerEditProps {
    banner: Banner;
}

export default function FormBannerEdit({ banner }: FormBannerEditProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(banner.image);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const params = useParams();

    // Format date to YYYY-MM-DD for date input
    const formatDateOnly = (dateString: string | null | undefined) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const formData = new FormData(e.target as HTMLFormElement);
            const res = await bannerService.updateBanner(params.id as string, formData);
            if (res.code === "success") {
                toast.success("Cập nhật banner thành công!");
                router.push("/admin/banners");
            } else {
                toast.error(res.message);
            }
        } catch {
            toast.error("Lỗi khi cập nhật banner!");
        } finally {
            setIsLoading(false);
        }
    };

    // Format datetime for input
    const formatDateTimeLocal = (date?: string) => {
        if (!date) return "";
        return new Date(date).toISOString().slice(0, 16);
    };

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
                <AdminCard title="Hình ảnh Banner" subTitle="Ảnh hiển thị trên website">
                    <div 
                        className="group relative aspect-[16/9] w-full rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 hover:border-indigo-400 transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center p-6 shadow-xs"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {previewImage && (
                            <Image 
                                src={previewImage} 
                                alt="preview" 
                                width={400} 
                                height={225} 
                                className="w-full h-full object-cover rounded-xl" 
                            />
                        )}
                        <div className="absolute inset-0 bg-indigo-900/40 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity flex items-center justify-center backdrop-blur-xs">
                            <Camera className="w-8 h-8 text-white animate-in zoom-in-75 duration-300" />
                        </div>
                        <input 
                            type="file" 
                            name="image" 
                            hidden 
                            ref={fileInputRef} 
                            onChange={handleFileChange}
                            accept="image/*"
                        />
                    </div>
                    <div className="mt-6 p-4 rounded-xl bg-amber-50/50 border border-amber-100/50">
                        <p className="text-[10px] text-amber-600 font-bold uppercase tracking-widest leading-relaxed">
                            💡 Chỉ upload ảnh mới nếu muốn thay đổi
                        </p>
                    </div>
                </AdminCard>

                <AdminCard title="Cấu hình" subTitle="Vị trí và trạng thái">
                    <div className="space-y-6">
                        <Select 
                            label="Vị trí hiển thị"
                            name="position"
                            icon={<ImageIcon className="w-4 h-4" />}
                            defaultValue={banner.position}
                            required
                        >
                            <option value="home-slider">Slider Trang Chủ</option>
                            <option value="home-top">Đầu Trang Chủ</option>
                            <option value="home-middle">Giữa Trang Chủ</option>
                            <option value="home-bottom">Cuối Trang Chủ</option>
                            <option value="sidebar">Sidebar</option>
                        </Select>

                        <Input 
                            label="Thứ tự hiển thị"
                            name="order"
                            type="number"
                            defaultValue={banner.order}
                            hint="Số càng nhỏ hiển thị càng trước"
                        />

                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-slate-700 ml-0.5 flex items-center gap-2">
                                <Activity className="w-4 h-4 text-slate-400" />
                                Trạng thái
                            </label>
                            <div className="grid grid-cols-2 gap-3 p-1 bg-slate-100/50 rounded-2xl border border-slate-200/50">
                                <label className="cursor-pointer">
                                    <input type="radio" name="status" value="active" defaultChecked={banner.status === 'active'} className="sr-only peer" />
                                    <div className="py-2.5 text-center rounded-xl bg-transparent peer-checked:bg-white peer-checked:text-emerald-600 peer-checked:shadow-sm text-[10px] font-black uppercase tracking-widest text-slate-400 transition-all">
                                        Hoạt động
                                    </div>
                                </label>
                                <label className="cursor-pointer">
                                    <input type="radio" name="status" value="inactive" defaultChecked={banner.status === 'inactive'} className="sr-only peer" />
                                    <div className="py-2.5 text-center rounded-xl bg-transparent peer-checked:bg-white peer-checked:text-rose-600 peer-checked:shadow-sm text-[10px] font-black uppercase tracking-widest text-slate-400 transition-all">
                                        Ẩn
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>
                </AdminCard>
            </div>

            <div className="lg:col-span-2 space-y-6">
                <AdminCard title="Thông tin cơ bản" subTitle="Chi tiết về banner">
                    <div className="space-y-6">
                        <Input 
                            label="Tiêu đề banner"
                            name="title"
                            defaultValue={banner.title}
                            icon={<ImageIcon className="w-4 h-4" />}
                            required
                        />

                        <Textarea 
                            label="Mô tả ngắn"
                            name="description"
                            defaultValue={banner.description}
                            placeholder="Mô tả ngắn gọn về banner..."
                        />

                        <Input 
                            label="Text nút CTA"
                            name="button_text"
                            defaultValue={banner.button_text}
                            placeholder="Ví dụ: Mua Ngay, Xem Thêm..."
                        />
                    </div>
                </AdminCard>

                <AdminCard title="Lên lịch hiển thị" subTitle="Thời gian banner được hiển thị">
                    <div className="space-y-6">
                        <Input 
                            label="Ngày bắt đầu"
                            name="start_date"
                            type="date"
                            defaultValue={formatDateOnly(banner.start_date)}
                            icon={<Calendar className="w-4 h-4" />}
                        />

                        <Input 
                            label="Ngày kết thúc"
                            name="end_date"
                            type="date"
                            defaultValue={formatDateOnly(banner.end_date)}
                            icon={<Calendar className="w-4 h-4" />}
                        />
                    </div>
                </AdminCard>

                <div className="flex items-center justify-end gap-4 p-2">
                    <Button 
                        variant="outline" 
                        icon={<X className="w-4 h-4" />}
                        onClick={() => router.push("/admin/banners")}
                    >
                        Hủy bỏ
                    </Button>
                    <Button 
                        type="submit" 
                        isLoading={isLoading}
                        icon={<Save className="w-4 h-4" />}
                        className="px-10"
                    >
                        Cập nhật
                    </Button>
                </div>
            </div>
        </form>
    );
}
