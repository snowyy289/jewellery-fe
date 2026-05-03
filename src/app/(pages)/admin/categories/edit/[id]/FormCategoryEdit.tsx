"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Camera, Layers, Activity, Save, X, Edit3 } from "lucide-react";
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

interface FormCategoryEditProps {
    category: Category | null;
    id: string;
    categories: Category[];
}

export default function FormCategoryEdit({ category, id, categories }: FormCategoryEditProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [previewThumbnail, setPreviewThumbnail] = useState<string | null>(category?.thumbnail || null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    // Filter out current category and its children (to prevent circular references)
    // For simplicity, we filter out at least the current category ID
    const availableCategories = categories.filter(c => c._id !== id);
    const categoryTree = createTree(availableCategories);

    useEffect(() => {
        if (category?.thumbnail) {
            setPreviewThumbnail(category.thumbnail);
        }
    }, [category]);

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
            const res = await categoryService.updateCategory(id, formData);
            if (res.code === "success") {
                toast.success("Cập nhật danh mục thành công!");
                router.push("/admin/categories");
            } else {
                toast.error(res.message);
            }
        } catch {
            toast.error("Lỗi khi cập nhật!");
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
                                    Nhấp để thay đổi ảnh
                                </p>
                            </>
                        )}
                        <div className="absolute inset-0 bg-indigo-900/40 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity flex items-center justify-center backdrop-blur-xs">
                            <div className="flex flex-col items-center gap-2 animate-in zoom-in-75 duration-300">
                                <Camera className="w-8 h-8 text-white" />
                                <span className="text-[10px] font-black text-white uppercase tracking-widest">Thay đổi ảnh</span>
                            </div>
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
                </AdminCard>

                <AdminCard title="Phân loại" subTitle="Cấu trúc và trạng thái">
                    <div className="space-y-6">
                        <Select 
                            label="Danh mục cha"
                            name="parent_id"
                            defaultValue={typeof category?.parent_id === 'object' ? category.parent_id._id : (category?.parent_id || "")}
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
                                    <input type="radio" name="status" value="active" defaultChecked={category?.status === 'active'} className="sr-only peer" />
                                    <div className="py-2.5 text-center rounded-xl bg-transparent peer-checked:bg-white peer-checked:text-emerald-600 peer-checked:shadow-sm text-[10px] font-black uppercase tracking-widest text-slate-400 transition-all">
                                        Hoạt động
                                    </div>
                                </label>
                                <label className="cursor-pointer">
                                    <input type="radio" name="status" value="inactive" defaultChecked={category?.status === 'inactive'} className="sr-only peer" />
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
                <AdminCard title="Thông tin chi tiết" subTitle={`Đang chỉnh sửa: ${category?.title}`}>
                    <div className="space-y-6">
                        <Input 
                            label="Tên danh mục"
                            name="title"
                            defaultValue={category?.title}
                            placeholder="Ví dụ: Chăm sóc da, Trang điểm..."
                            icon={<Edit3 className="w-4 h-4" />}
                            required
                        />

                        <Input 
                            label="Vị trí hiển thị"
                            name="position"
                            type="number"
                            placeholder="1, 2, 3..."
                            defaultValue={category?.position || 1}
                            hint="Thứ tự xuất hiện của danh mục trên website"
                        />

                        <Textarea 
                            label="Mô tả chi tiết"
                            name="description"
                            defaultValue={category?.description}
                            placeholder="Mô tả ngắn gọn về nhóm sản phẩm này..."
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
                        Lưu thay đổi
                    </Button>
                </div>
            </div>
        </form>
    );
}
