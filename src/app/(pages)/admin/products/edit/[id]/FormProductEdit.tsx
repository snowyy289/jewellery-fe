"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Camera, Activity, Save, X, DollarSign, Hash, Tag, Star, Layers, Edit3 } from "lucide-react";
import Image from "next/image";
import Button from "@/components/button/Button";
import Input from "@/components/input/Input";
import Select from "@/components/input/Select";
import RichTextEditor from "@/components/input/RichTextEditor";
import { AdminCard } from "@/components/layouts/admin/shared";
import { productService } from "@/services/admin/productService";
import { Product } from "@/types/product";
import { Category } from "@/types/category";
import { Brand } from "@/types/brand";
import { toast } from "sonner";
import { createTree } from "@/utils/treeHelper";

interface FormProductEditProps {
    product: Product | null;
    id: string;
    categories: Category[];
    brands: Brand[];
}

export default function FormProductEdit({ product, id, categories, brands }: FormProductEditProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [previewThumbnail, setPreviewThumbnail] = useState<string | null>(product?.thumbnail || null);
    const [previewImages, setPreviewImages] = useState<string[]>(product?.images || []);
    const [tags, setTags] = useState<string[]>(product?.tags || []);
    const [tagInput, setTagInput] = useState("");
    const [description, setDescription] = useState(product?.description || "");

    // Xây cây category để hiển thị phân cấp
    const categoryTree = createTree(categories);
    const thumbnailInputRef = useRef<HTMLInputElement>(null);
    const imagesInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    useEffect(() => {
        if (product) {
            setPreviewThumbnail(product.thumbnail || null);
            setPreviewImages(product.images || []);
            setTags(product.tags || []);
            setDescription(product.description || "");
        }
    }, [product]);

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

    const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newPreviews: string[] = [];
            Array.from(files).forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    newPreviews.push(reader.result as string);
                    if (newPreviews.length === files.length) {
                        setPreviewImages(prev => [...prev, ...newPreviews]);
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeImage = (index: number) => {
        setPreviewImages(prev => prev.filter((_, i) => i !== index));
    };

    const addTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            setTags([...tags, tagInput.trim()]);
            setTagInput("");
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const formData = new FormData(e.target as HTMLFormElement);
            
            // Add description from TinyMCE
            formData.set("description", description);
            
            // Add tags as JSON string
            if (tags.length > 0) {
                formData.append("tags", JSON.stringify(tags));
            }

            // Add existing images that weren't removed
            if (previewImages.length > 0) {
                formData.append("existingImages", JSON.stringify(previewImages));
            }

            const res = await productService.updateProduct(id, formData);
            if (res.code === 200) {
                toast.success("Cập nhật sản phẩm thành công!");
                router.push("/admin/products");
            } else {
                toast.error(res.message);
            }
        } catch {
            toast.error("Lỗi khi cập nhật sản phẩm!");
        } finally {
            setIsLoading(false);
        }
    };

    const categoryId = typeof product?.category_id === 'object' ? product.category_id._id : product?.category_id;
    const brandId = typeof product?.brand_id === 'object' ? product.brand_id._id : product?.brand_id;

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left col: Images & Configuration */}
            <div className="lg:col-span-1 space-y-6">
                <AdminCard title="Ảnh đại diện" subTitle="Ảnh chính của sản phẩm">
                    <div 
                        className="group relative aspect-square w-full rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 hover:border-indigo-400 transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center p-6 shadow-xs"
                        onClick={() => thumbnailInputRef.current?.click()}
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
                            ref={thumbnailInputRef} 
                            onChange={handleThumbnailChange}
                            accept="image/*"
                        />
                    </div>
                </AdminCard>

                <AdminCard title="Thư viện ảnh" subTitle="Ảnh bổ sung (tối đa 10)">
                    <div className="space-y-4">
                        <div 
                            className="group relative aspect-video w-full rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 hover:border-indigo-400 transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center p-6"
                            onClick={() => imagesInputRef.current?.click()}
                        >
                            <div className="w-12 h-12 rounded-2xl bg-white shadow-md flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <Plus className="w-6 h-6 text-slate-300 group-hover:text-indigo-500" />
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
                                Thêm ảnh
                            </p>
                            <input 
                                type="file" 
                                name="images" 
                                hidden 
                                multiple
                                ref={imagesInputRef} 
                                onChange={handleImagesChange}
                                accept="image/*"
                            />
                        </div>

                        {previewImages.length > 0 && (
                            <div className="grid grid-cols-2 gap-3">
                                {previewImages.map((img, idx) => (
                                    <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border-2 border-slate-200">
                                        <Image 
                                            src={img} 
                                            alt={`preview-${idx}`} 
                                            width={200} 
                                            height={200} 
                                            className="w-full h-full object-cover" 
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(idx)}
                                            className="absolute top-2 right-2 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </AdminCard>

                <AdminCard title="Cấu hình" subTitle="Trạng thái và phân loại">
                    <div className="space-y-6">
                        <Select 
                            label="Danh mục sản phẩm"
                            name="category_id"
                            defaultValue={categoryId}
                            icon={<Layers className="w-4 h-4" />}
                            required
                        >
                            <option value="">-- Chọn danh mục --</option>
                            {categoryTree.map(cat => (
                                <option key={cat._id} value={cat._id}>
                                    {"--".repeat(cat.level)} {cat.title}
                                </option>
                            ))}
                        </Select>

                        <Select 
                            label="Thương hiệu"
                            name="brand_id"
                            defaultValue={brandId}
                            icon={<Tag className="w-4 h-4" />}
                            required
                        >
                            <option value="">-- Chọn thương hiệu --</option>
                            {brands.map(brand => (
                                <option key={brand._id} value={brand._id}>
                                    {brand.title}
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
                                    <input type="radio" name="status" value="active" defaultChecked={product?.status === 'active'} className="sr-only peer" />
                                    <div className="py-2.5 text-center rounded-xl bg-transparent peer-checked:bg-white peer-checked:text-emerald-600 peer-checked:shadow-sm text-[10px] font-black uppercase tracking-widest text-slate-400 transition-all">
                                        Hoạt động
                                    </div>
                                </label>
                                <label className="cursor-pointer">
                                    <input type="radio" name="status" value="inactive" defaultChecked={product?.status === 'inactive'} className="sr-only peer" />
                                    <div className="py-2.5 text-center rounded-xl bg-transparent peer-checked:bg-white peer-checked:text-rose-600 peer-checked:shadow-sm text-[10px] font-black uppercase tracking-widest text-slate-400 transition-all">
                                        Ẩn / Dừng
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50/50 border border-amber-200/50">
                            <input 
                                type="checkbox" 
                                name="featured" 
                                id="featured"
                                defaultChecked={product?.featured}
                                className="w-5 h-5 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                            />
                            <label htmlFor="featured" className="flex items-center gap-2 text-sm font-semibold text-amber-700 cursor-pointer">
                                <Star className="w-4 h-4" />
                                Sản phẩm nổi bật
                            </label>
                        </div>
                    </div>
                </AdminCard>
            </div>

            {/* Right col: Details */}
            <div className="lg:col-span-2 space-y-6">
                <AdminCard title="Thông tin chi tiết" subTitle={`Đang chỉnh sửa: ${product?.title}`}>
                    <div className="space-y-6">
                        <Input 
                            label="Tên sản phẩm"
                            name="title"
                            defaultValue={product?.title}
                            placeholder="Ví dụ: Nhẫn vàng 18K, Dây chuyền bạc..."
                            icon={<Edit3 className="w-4 h-4" />}
                            required
                        />

                        <RichTextEditor 
                            label="Mô tả chi tiết"
                            name="description"
                            value={description}
                            onChange={setDescription}
                            placeholder="Mô tả đầy đủ về sản phẩm, thành phần, công dụng..."
                            hint="Tối đa 5000 ký tự"
                            height={350}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input 
                                label="Giá bán (VNĐ)"
                                name="price"
                                type="number"
                                defaultValue={product?.price}
                                placeholder="299000"
                                icon={<DollarSign className="w-4 h-4" />}
                                required
                                min="0"
                                step="1000"
                            />

                            <Input 
                                label="Giảm giá (%)"
                                name="discountPercentage"
                                type="number"
                                defaultValue={product?.discountPercentage || 0}
                                placeholder="0"
                                icon={<Tag className="w-4 h-4" />}
                                min="0"
                                max="100"
                                hint="Để trống hoặc 0 nếu không giảm giá"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input 
                                label="Số lượng tồn kho"
                                name="stock"
                                type="number"
                                defaultValue={product?.stock}
                                placeholder="100"
                                icon={<Hash className="w-4 h-4" />}
                                required
                                min="0"
                            />

                            <Input 
                                label="Mã SKU"
                                name="sku"
                                defaultValue={product?.sku}
                                placeholder="PROD-001"
                                icon={<Hash className="w-4 h-4" />}
                                required
                                hint="Mã định danh duy nhất"
                            />
                        </div>

                        <Input 
                            label="Vị trí hiển thị"
                            name="position"
                            type="number"
                            defaultValue={product?.position || 1}
                            placeholder="1"
                            min="1"
                            hint="Thứ tự ưu tiên hiển thị (số càng nhỏ càng ưu tiên)"
                        />
                    </div>
                </AdminCard>

                <AdminCard title="Thẻ tag" subTitle="Từ khóa tìm kiếm và phân loại">
                    <div className="space-y-4">
                        <div className="flex gap-2">
                            <Input 
                                label=""
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        addTag();
                                    }
                                }}
                                placeholder="Nhập tag và nhấn Enter..."
                                icon={<Tag className="w-4 h-4" />}
                            />
                            <Button 
                                type="button"
                                onClick={addTag}
                                variant="outline"
                                className="mt-0"
                            >
                                Thêm
                            </Button>
                        </div>

                        {tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {tags.map((tag, idx) => (
                                    <span 
                                        key={idx}
                                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium"
                                    >
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => removeTag(tag)}
                                            className="hover:text-indigo-900"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </AdminCard>

                <div className="flex items-center justify-end gap-4 p-2">
                    <Button 
                        variant="outline" 
                        icon={<X className="w-4 h-4" />}
                        onClick={() => router.push("/admin/products")}
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
