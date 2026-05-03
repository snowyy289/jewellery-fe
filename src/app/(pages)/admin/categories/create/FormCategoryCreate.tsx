"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Plus, Camera, Layers, Activity, Save, X } from "lucide-react";
import Image from "next/image";
import Button from "@/components/button/Button";
import Input from "@/components/input/Input";
import Select from "@/components/input/Select";
import Textarea from "@/components/input/Textarea";
import { AdminCard } from "@/components/layouts/admin/shared";
import { categoryService } from "@/services/admin/categoryService";
import { Category } from "@/types/category";
import { toast } from "sonner";
import { createTree } from "@/utils/treeHelper";

interface FormCategoryCreateProps {
    categories: Category[];
}

export default function FormCategoryCreate({ categories }: FormCategoryCreateProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [previewThumbnail, setPreviewThumbnail] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const categoryTree = createTree(categories);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        setIsLoading(true);
        try {
            const formData = new FormData(e.target as HTMLFormElement);
            const res = await categoryService.createCategory(formData);
            if (res.code === "success") {
                toast.success("Tạo danh mục thành công!");
                router.push("/admin/categories");
            } else {
                toast.error(res.message);
            }
        } catch {
            toast.error("Lỗi khi tạo danh mục!");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left col: Image & Configuration */}
            <div className="lg:col-span-1 space-y-6">
                <AdminCard title="Hình ảnh" subTitle="Ảnh đại diện cho danh mục">
                    <div 
                        className="group relative aspect-square w-full rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 hover:border-indigo-400 transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center p-6 shadow-xs"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {previewThumbnail ? (
                            <Image 
                                src={previewThumbnail} 
                                alt="preview" 
                                width={400} 
                                height={400} 
                                className="w-full h-full object-cover rounded-xl" 
                            />
                        ) : (
                            <>
                                <div className="w-16 h-16 rounded-3xl bg-white shadow-md flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-slate-100">
                                    <Plus className="w-8 h-8 text-slate-300 group-hover:text-indigo-500" />
                                </div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center px-4">
                                    Nhấp hoặc kéo thả để tải ảnh lên
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
                            ref={fileInputRef} 
                            onChange={handleFileChange}
                            accept="image/*"
                        />
                    </div>
                    <div className="mt-6 p-4 rounded-xl bg-indigo-50/50 border border-indigo-100/50">
                        <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest leading-relaxed">
                            💡 Định dạng hỗ trợ: JPG, PNG, WEBP. Tối đa 2MB.
                        </p>
                    </div>
                </AdminCard>

                <AdminCard title="Phân loại" subTitle="Cấu trúc và trạng thái">
                    <div className="space-y-6">
                        <Select 
                            label="Danh mục cha"
                            name="parent_id"
                            icon={<Layers className="w-4 h-4" />}
                        >
                            <option value="">-- Danh mục gốc --</option>
                            {categoryTree.map(cat => (
                                <option key={cat._id} value={cat._id}>
                                    {"--".repeat(cat.level)} {cat.title}
                                </option>
                            ))}
                        </Select>

                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-slate-700 ml-0.5 flex items-center gap-2">
                                <Activity className="w-4 h-4 text-slate-400" />
                                Trạng thái hiển thị
                            </label>
                            <div className="grid grid-cols-2 gap-3 p-1 bg-slate-100/50 rounded-2xl border border-slate-200/50">
                                <label className="cursor-pointer">
                                    <input type="radio" name="status" value="active" defaultChecked className="sr-only peer" />
                                    <div className="py-2.5 text-center rounded-xl bg-transparent peer-checked:bg-white peer-checked:text-emerald-600 peer-checked:shadow-sm text-[10px] font-black uppercase tracking-widest text-slate-400 transition-all">
                                        Hoạt động
                                    </div>
                                </label>
                                <label className="cursor-pointer">
                                    <input type="radio" name="status" value="inactive" className="sr-only peer" />
                                    <div className="py-2.5 text-center rounded-xl bg-transparent peer-checked:bg-white peer-checked:text-rose-600 peer-checked:shadow-sm text-[10px] font-black uppercase tracking-widest text-slate-400 transition-all">
                                        Ẩn / Dừng
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>
                </AdminCard>
            </div>

            {/* Right col: Details */}
            <div className="lg:col-span-2 space-y-6">
                <AdminCard title="Thông tin cơ bản" subTitle="Chi tiết về danh mục sản phẩm">
                    <div className="space-y-6">
                        <Input 
                            label="Tên danh mục"
                            name="title"
                            placeholder="Ví dụ: Chăm sóc da, Trang điểm..."
                            icon={<Layers className="w-4 h-4" />}
                            required
                        />

                        <Input 
                            label="Vị trí hiển thị"
                            name="position"
                            type="number"
                            placeholder="1, 2, 3..."
                            defaultValue={1}
                            hint="Thứ tự xuất hiện của danh mục trên website (số càng nhỏ ưu tiên càng cao)"
                        />

                        <Textarea 
                            label="Mô tả chi tiết"
                            name="description"
                            placeholder="Mô tả ngắn gọn về nhóm sản phẩm này..."
                            hint="Tối đa 500 ký tự"
                        />
                    </div>
                </AdminCard>

                <div className="flex items-center justify-end gap-4 p-2">
                    <Button 
                        variant="outline" 
                        icon={<X className="w-4 h-4" />}
                        onClick={() => router.push("/admin/categories")}
                    >
                        Hủy bỏ
                    </Button>
                    <Button 
                        type="submit" 
                        isLoading={isLoading}
                        icon={<Save className="w-4 h-4" />}
                        className="px-10"
                    >
                        Lưu danh mục
                    </Button>
                </div>
            </div>
        </form>
    );
}
