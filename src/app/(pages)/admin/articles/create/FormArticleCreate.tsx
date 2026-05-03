"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Plus, Camera, FileText, Activity, Save, X, Tag, Star } from "lucide-react";
import Image from "next/image";
import Button from "@/components/button/Button";
import Input from "@/components/input/Input";
import Textarea from "@/components/input/Textarea";
import { AdminCard } from "@/components/layouts/admin/shared";
import { articleService } from "@/services/admin/articleService";
import { toast } from "sonner";
import RichTextEditor from "@/components/input/RichTextEditor";

export default function FormArticleCreate() {
    const [isLoading, setIsLoading] = useState(false);
    const [previewThumbnail, setPreviewThumbnail] = useState<string | null>(null);
    const [content, setContent] = useState("");
    const thumbnailInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewThumbnail(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        console.log("=== SUBMIT ARTICLE ===");
        console.log("Content length:", content.length);
        console.log("Content preview:", content.substring(0, 100));
        
        if (!content || content.trim() === "") {
            toast.error("Vui lòng nhập nội dung bài viết!");
            return;
        }

        setIsLoading(true);
        try {
            const formData = new FormData(e.target as HTMLFormElement);
            formData.append("content", content);
            
            // Log FormData contents
            console.log("=== FORM DATA ===");
            for (const [key, value] of formData.entries()) {
                if (value instanceof File) {
                    console.log(`${key}:`, value.name, value.size, "bytes");
                } else {
                    console.log(`${key}:`, typeof value === 'string' && value.length > 100 
                        ? value.substring(0, 100) + "..." 
                        : value
                    );
                }
            }
            
            console.log("Sending request to backend...");
            const res = await articleService.createArticle(formData);
            console.log("Response:", res);
            
            if (res.code === "success") {
                toast.success("Tạo bài viết thành công!");
                router.push("/admin/articles");
            } else {
                toast.error(res.message);
            }
        } catch (error: any) {
            console.error("=== ERROR ===", error);
            console.error("Error response:", error.response?.data);
            console.error("Error status:", error.response?.status);
            toast.error(error.response?.data?.message || "Lỗi khi tạo bài viết!");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left col: Image & Settings */}
            <div className="lg:col-span-1 space-y-6">
                <AdminCard title="Ảnh đại diện" subTitle="Thumbnail bài viết">
                    <div 
                        className="group relative aspect-[16/9] w-full rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 hover:border-indigo-400 transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center p-6 shadow-xs"
                        onClick={() => thumbnailInputRef.current?.click()}
                    >
                        {previewThumbnail ? (
                            <Image 
                                src={previewThumbnail} 
                                alt="preview" 
                                width={400} 
                                height={225} 
                                className="w-full h-full object-cover rounded-xl" 
                            />
                        ) : (
                            <>
                                <div className="w-16 h-16 rounded-3xl bg-white shadow-md flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-slate-100">
                                    <Plus className="w-8 h-8 text-slate-300 group-hover:text-indigo-500" />
                                </div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center px-4">
                                    Nhấp để tải ảnh lên
                                </p>
                            </>
                        )}
                        <div className="absolute inset-0 bg-indigo-900/40 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity flex items-center justify-center backdrop-blur-xs">
                            <Camera className="w-8 h-8 text-white animate-in zoom-in-75 duration-300" />
                        </div>
                        <input 
                            type="file" 
                            name="thumbnail" 
                            hidden 
                            ref={thumbnailInputRef} 
                            onChange={handleThumbnailChange}
                            accept="image/*"
                        />
                    </div>
                    <div className="mt-6 p-4 rounded-xl bg-indigo-50/50 border border-indigo-100/50">
                        <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest leading-relaxed">
                            💡 Khuyến nghị: 1200x675px (16:9)
                        </p>
                    </div>
                </AdminCard>

                <AdminCard title="Cấu hình" subTitle="Trạng thái bài viết">
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-slate-700 ml-0.5 flex items-center gap-2">
                                <Activity className="w-4 h-4 text-slate-400" />
                                Trạng thái
                            </label>
                            <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100/50 rounded-2xl border border-slate-200/50">
                                <label className="cursor-pointer">
                                    <input type="radio" name="status" value="draft" defaultChecked className="sr-only peer" />
                                    <div className="py-2 text-center rounded-xl bg-transparent peer-checked:bg-white peer-checked:text-slate-600 peer-checked:shadow-sm text-[9px] font-black uppercase tracking-widest text-slate-400 transition-all">
                                        Nháp
                                    </div>
                                </label>
                                <label className="cursor-pointer">
                                    <input type="radio" name="status" value="published" className="sr-only peer" />
                                    <div className="py-2 text-center rounded-xl bg-transparent peer-checked:bg-white peer-checked:text-emerald-600 peer-checked:shadow-sm text-[9px] font-black uppercase tracking-widest text-slate-400 transition-all">
                                        Xuất bản
                                    </div>
                                </label>
                                <label className="cursor-pointer">
                                    <input type="radio" name="status" value="archived" className="sr-only peer" />
                                    <div className="py-2 text-center rounded-xl bg-transparent peer-checked:bg-white peer-checked:text-amber-600 peer-checked:shadow-sm text-[9px] font-black uppercase tracking-widest text-slate-400 transition-all">
                                        Lưu trữ
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50/50 border border-amber-100/50">
                            <input 
                                type="checkbox" 
                                name="featured" 
                                value="true"
                                id="featured"
                                className="w-5 h-5 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                            />
                            <label htmlFor="featured" className="flex items-center gap-2 text-sm font-semibold text-amber-700 cursor-pointer">
                                <Star className="w-4 h-4" />
                                Đánh dấu nổi bật
                            </label>
                        </div>

                        <Input 
                            label="Vị trí hiển thị"
                            name="position"
                            type="number"
                            placeholder="1, 2, 3..."
                            defaultValue={1}
                            hint="Thứ tự ưu tiên"
                        />
                    </div>
                </AdminCard>
            </div>

            {/* Right col: Content */}
            <div className="lg:col-span-2 space-y-6">
                <AdminCard title="Thông tin cơ bản" subTitle="Tiêu đề và mô tả">
                    <div className="space-y-6">
                        <Input 
                            label="Tiêu đề bài viết"
                            name="title"
                            placeholder="Nhập tiêu đề hấp dẫn..."
                            icon={<FileText className="w-4 h-4" />}
                            required
                        />

                        <Textarea 
                            label="Mô tả ngắn (Excerpt)"
                            name="description"
                            placeholder="Tóm tắt ngắn gọn nội dung bài viết..."
                            hint="Hiển thị trong danh sách bài viết"
                        />

                        <Input 
                            label="Tags"
                            name="tags"
                            placeholder="Ví dụ: skincare, beauty, tips (phân cách bằng dấu phẩy)"
                            icon={<Tag className="w-4 h-4" />}
                            hint="Các từ khóa liên quan"
                        />
                    </div>
                </AdminCard>

                <AdminCard title="Nội dung bài viết" subTitle="Viết nội dung chi tiết">
                    <RichTextEditor
                        value={content}
                        onChange={setContent}
                        height={500}
                    />
                </AdminCard>

                <AdminCard title="SEO" subTitle="Tối ưu hóa công cụ tìm kiếm">
                    <div className="space-y-6">
                        <Input 
                            label="Meta Title"
                            name="meta_title"
                            placeholder="Tiêu đề SEO (để trống = dùng tiêu đề bài viết)"
                            hint="Tối đa 60 ký tự"
                        />

                        <Textarea 
                            label="Meta Description"
                            name="meta_description"
                            placeholder="Mô tả SEO cho công cụ tìm kiếm..."
                            hint="Tối đa 160 ký tự"
                        />

                        <Input 
                            label="Meta Keywords"
                            name="meta_keywords"
                            placeholder="keyword1, keyword2, keyword3"
                            hint="Phân cách bằng dấu phẩy"
                        />
                    </div>
                </AdminCard>

                <div className="flex items-center justify-end gap-4 p-2">
                    <Button 
                        variant="outline" 
                        icon={<X className="w-4 h-4" />}
                        onClick={() => router.push("/admin/articles")}
                    >
                        Hủy bỏ
                    </Button>
                    <Button 
                        type="submit" 
                        isLoading={isLoading}
                        icon={<Save className="w-4 h-4" />}
                        className="px-10"
                    >
                        Lưu bài viết
                    </Button>
                </div>
            </div>
        </form>
    );
}
