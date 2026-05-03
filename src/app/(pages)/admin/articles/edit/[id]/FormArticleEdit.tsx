"use client";
import { useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { Camera, FileText, Activity, Save, X, FolderOpen, Tag, Star } from "lucide-react";
import Image from "next/image";
import Button from "@/components/button/Button";
import Input from "@/components/input/Input";
import Select from "@/components/input/Select";
import Textarea from "@/components/input/Textarea";
import { AdminCard } from "@/components/layouts/admin/shared";
import { articleService } from "@/services/admin/articleService";
import { Article, ArticleCategory } from "@/types/article";
import { toast } from "sonner";
import RichTextEditor from "@/components/input/RichTextEditor";

interface FormArticleEditProps {
    article: Article;
    categories: ArticleCategory[];
}

export default function FormArticleEdit({ article, categories }: FormArticleEditProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [previewThumbnail, setPreviewThumbnail] = useState<string | null>(article.thumbnail || null);
    const [content, setContent] = useState(article.content);
    const thumbnailInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const params = useParams();

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
        
        if (!content || content.trim() === "") {
            toast.error("Vui lòng nhập nội dung bài viết!");
            return;
        }

        setIsLoading(true);
        try {
            const formData = new FormData(e.target as HTMLFormElement);
            formData.append("content", content);
            
            const res = await articleService.updateArticle(params.id as string, formData);
            if (res.code === "success") {
                toast.success("Cập nhật bài viết thành công!");
                router.push("/admin/articles");
            } else {
                toast.error(res.message);
            }
        } catch {
            toast.error("Lỗi khi cập nhật bài viết!");
        } finally {
            setIsLoading(false);
        }
    };

    const categoryId = typeof article.category_id === 'object' && article.category_id ? article.category_id._id : article.category_id;

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
                <AdminCard title="Ảnh đại diện" subTitle="Thumbnail bài viết">
                    <div 
                        className="group relative aspect-[16/9] w-full rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 hover:border-indigo-400 transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center p-6 shadow-xs"
                        onClick={() => thumbnailInputRef.current?.click()}
                    >
                        {previewThumbnail && (
                            <Image 
                                src={previewThumbnail} 
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
                            name="thumbnail" 
                            hidden 
                            ref={thumbnailInputRef} 
                            onChange={handleThumbnailChange}
                            accept="image/*"
                        />
                    </div>
                    <div className="mt-6 p-4 rounded-xl bg-amber-50/50 border border-amber-100/50">
                        <p className="text-[10px] text-amber-600 font-bold uppercase tracking-widest leading-relaxed">
                            💡 Chỉ upload ảnh mới nếu muốn thay đổi
                        </p>
                    </div>
                </AdminCard>

                <AdminCard title="Cấu hình" subTitle="Danh mục và trạng thái">
                    <div className="space-y-6">
                        <Select 
                            label="Danh mục"
                            name="category_id"
                            icon={<FolderOpen className="w-4 h-4" />}
                            defaultValue={categoryId || ""}
                        >
                            <option value="">-- Chọn danh mục --</option>
                            {categories.map(cat => (
                                <option key={cat._id} value={cat._id}>
                                    {cat.title}
                                </option>
                            ))}
                        </Select>

                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-slate-700 ml-0.5 flex items-center gap-2">
                                <Activity className="w-4 h-4 text-slate-400" />
                                Trạng thái
                            </label>
                            <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100/50 rounded-2xl border border-slate-200/50">
                                <label className="cursor-pointer">
                                    <input type="radio" name="status" value="draft" defaultChecked={article.status === 'draft'} className="sr-only peer" />
                                    <div className="py-2 text-center rounded-xl bg-transparent peer-checked:bg-white peer-checked:text-slate-600 peer-checked:shadow-sm text-[9px] font-black uppercase tracking-widest text-slate-400 transition-all">
                                        Nháp
                                    </div>
                                </label>
                                <label className="cursor-pointer">
                                    <input type="radio" name="status" value="published" defaultChecked={article.status === 'published'} className="sr-only peer" />
                                    <div className="py-2 text-center rounded-xl bg-transparent peer-checked:bg-white peer-checked:text-emerald-600 peer-checked:shadow-sm text-[9px] font-black uppercase tracking-widest text-slate-400 transition-all">
                                        Xuất bản
                                    </div>
                                </label>
                                <label className="cursor-pointer">
                                    <input type="radio" name="status" value="archived" defaultChecked={article.status === 'archived'} className="sr-only peer" />
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
                                defaultChecked={article.featured}
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
                            defaultValue={article.position}
                            hint="Thứ tự ưu tiên"
                        />
                    </div>
                </AdminCard>
            </div>

            <div className="lg:col-span-2 space-y-6">
                <AdminCard title="Thông tin cơ bản" subTitle="Tiêu đề và mô tả">
                    <div className="space-y-6">
                        <Input 
                            label="Tiêu đề bài viết"
                            name="title"
                            defaultValue={article.title}
                            icon={<FileText className="w-4 h-4" />}
                            required
                        />

                        <Textarea 
                            label="Mô tả ngắn (Excerpt)"
                            name="description"
                            defaultValue={article.description}
                            placeholder="Tóm tắt ngắn gọn nội dung bài viết..."
                        />

                        <Input 
                            label="Tags"
                            name="tags"
                            defaultValue={article.tags?.join(', ')}
                            placeholder="Ví dụ: skincare, beauty, tips"
                            icon={<Tag className="w-4 h-4" />}
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
                            defaultValue={article.meta_title}
                            placeholder="Tiêu đề SEO"
                        />

                        <Textarea 
                            label="Meta Description"
                            name="meta_description"
                            defaultValue={article.meta_description}
                            placeholder="Mô tả SEO"
                        />

                        <Input 
                            label="Meta Keywords"
                            name="meta_keywords"
                            defaultValue={article.meta_keywords?.join(', ')}
                            placeholder="keyword1, keyword2, keyword3"
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
                        Cập nhật
                    </Button>
                </div>
            </div>
        </form>
    );
}
