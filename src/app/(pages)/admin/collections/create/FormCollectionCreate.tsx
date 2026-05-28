"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Plus, Camera, Image as ImageIcon, Activity, Save, X, Hash } from "lucide-react";
import Image from "next/image";
import Button from "@/components/button/Button";
import Input from "@/components/input/Input";
import Textarea from "@/components/input/Textarea";
import { AdminCard } from "@/components/layouts/admin/shared";
import { collectionService } from "@/services/admin/collectionService";
import { toast } from "sonner";

import { Product } from "@/types/product";

interface Props {
    products: Product[];
}

export default function FormCollectionCreate({ products }: Props) {
    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [previewThumb, setPreviewThumb] = useState<string | null>(null);
    const [previewCover, setPreviewCover] = useState<string | null>(null);
    const thumbInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const handleThumbChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPreviewThumb(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPreviewCover(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const formData = new FormData(e.target as HTMLFormElement);
            
            // Add selected products as JSON string
            if (selectedProducts.length > 0) {
                formData.append("products", JSON.stringify(selectedProducts));
            }

            // Mongoose slug generation is done by mongoose-slug-updater in backend typically, but let's make sure it's valid
            const res = await collectionService.createCollection(formData);
            if (res.code === "success" || res.code === 200 || res.code === "200" || res.code === 201) {
                toast.success("Tạo bộ sưu tập thành công!");
                router.push("/admin/collections");
            } else {
                toast.error(res.message);
            }
        } catch {
            toast.error("Lỗi khi tạo bộ sưu tập!");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
                <AdminCard title="Thumbnail (Ảnh nhỏ)" subTitle="Ảnh vuông hiển thị ở danh sách">
                    <div 
                        className="group relative aspect-square w-full rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 hover:border-indigo-400 transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center p-6 shadow-xs"
                        onClick={() => thumbInputRef.current?.click()}
                    >
                        {previewThumb ? (
                            <Image src={previewThumb} alt="preview" width={400} height={400} className="w-full h-full object-cover rounded-xl" />
                        ) : (
                            <>
                                <div className="w-16 h-16 rounded-3xl bg-white shadow-md flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-slate-100">
                                    <Plus className="w-8 h-8 text-slate-300 group-hover:text-indigo-500" />
                                </div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center px-4">
                                    Tải ảnh Thumbnail lên
                                </p>
                            </>
                        )}
                        <input type="file" name="thumbnail" hidden ref={thumbInputRef} onChange={handleThumbChange} accept="image/*" />
                    </div>
                </AdminCard>

                <AdminCard title="Cover Banner (Tràn viền)" subTitle="Ảnh Hero Image hiển thị ở chi tiết">
                    <div 
                        className="group relative aspect-video w-full rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 hover:border-indigo-400 transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center p-6 shadow-xs"
                        onClick={() => coverInputRef.current?.click()}
                    >
                        {previewCover ? (
                            <Image src={previewCover} alt="preview" width={600} height={338} className="w-full h-full object-cover rounded-xl" />
                        ) : (
                            <>
                                <div className="w-16 h-16 rounded-3xl bg-white shadow-md flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-slate-100">
                                    <Plus className="w-8 h-8 text-slate-300 group-hover:text-indigo-500" />
                                </div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center px-4">
                                    Tải ảnh Cover lên (Tỉ lệ 16:9)
                                </p>
                            </>
                        )}
                        <input type="file" name="cover_image" hidden ref={coverInputRef} onChange={handleCoverChange} accept="image/*" />
                    </div>
                </AdminCard>

                <AdminCard title="Cấu hình" subTitle="Vị trí và trạng thái">
                    <div className="space-y-6">
                        <Input label="Thứ tự hiển thị" name="position" type="number" placeholder="1, 2, 3..." defaultValue={1} />
                        
                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-slate-700 ml-0.5 flex items-center gap-2">
                                <Activity className="w-4 h-4 text-slate-400" /> Nổi bật
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer p-3 border rounded-xl hover:bg-slate-50 transition-colors">
                                <input type="checkbox" name="featured" className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500" />
                                <span className="text-sm text-slate-700">Đánh dấu nổi bật (Hiển thị Home)</span>
                            </label>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-slate-700 ml-0.5 flex items-center gap-2">
                                <Activity className="w-4 h-4 text-slate-400" /> Trạng thái
                            </label>
                            <div className="grid grid-cols-2 gap-3 p-1 bg-slate-100/50 rounded-2xl border border-slate-200/50">
                                <label className="cursor-pointer">
                                    <input type="radio" name="status" value="active" defaultChecked className="sr-only peer" />
                                    <div className="py-2.5 text-center rounded-xl bg-transparent peer-checked:bg-white peer-checked:text-emerald-600 peer-checked:shadow-sm text-[10px] font-black uppercase tracking-widest text-slate-400 transition-all">Hoạt động</div>
                                </label>
                                <label className="cursor-pointer">
                                    <input type="radio" name="status" value="inactive" className="sr-only peer" />
                                    <div className="py-2.5 text-center rounded-xl bg-transparent peer-checked:bg-white peer-checked:text-rose-600 peer-checked:shadow-sm text-[10px] font-black uppercase tracking-widest text-slate-400 transition-all">Ẩn</div>
                                </label>
                            </div>
                        </div>
                    </div>
                </AdminCard>
            </div>

            <div className="lg:col-span-2 space-y-6">
                <AdminCard title="Thông tin cơ bản" subTitle="Chi tiết về bộ sưu tập">
                    <div className="space-y-6">
                        <Input 
                            label="Tên bộ sưu tập"
                            name="title"
                            placeholder="Ví dụ: Timeless Diamond"
                            icon={<ImageIcon className="w-4 h-4" />}
                            required
                        />

                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700 ml-0.5 flex items-center gap-2">
                                Sản phẩm trong bộ sưu tập
                            </label>
                            <div className="border border-slate-200 rounded-xl max-h-60 overflow-y-auto p-2 bg-white">
                                {products.map((product) => (
                                    <label key={product._id} className="flex items-center gap-3 p-2 hover:bg-slate-50 cursor-pointer rounded-lg transition-colors">
                                        <input 
                                            type="checkbox" 
                                            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                                            checked={selectedProducts.includes(product._id)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedProducts([...selectedProducts, product._id]);
                                                } else {
                                                    setSelectedProducts(selectedProducts.filter(id => id !== product._id));
                                                }
                                            }}
                                        />
                                        <div className="flex items-center gap-3">
                                            {product.thumbnail && (
                                                <img src={product.thumbnail} alt={product.title} className="w-8 h-8 rounded object-cover" />
                                            )}
                                            <span className="text-sm text-slate-700">{product.title}</span>
                                        </div>
                                    </label>
                                ))}
                                {products.length === 0 && (
                                    <div className="text-center py-4 text-xs text-slate-400">Không có sản phẩm nào</div>
                                )}
                            </div>
                        </div>

                        <Textarea 
                            label="Storytelling (Mô tả truyền cảm hứng)"
                            name="description"
                            placeholder="Kể câu chuyện về nguồn cảm hứng của bộ sưu tập này..."
                            rows={8}
                        />
                    </div>
                </AdminCard>

                <div className="flex items-center justify-end gap-4 p-2">
                    <Button variant="outline" icon={<X className="w-4 h-4" />} onClick={() => router.push("/admin/collections")}>
                        Hủy bỏ
                    </Button>
                    <Button type="submit" isLoading={isLoading} icon={<Save className="w-4 h-4" />} className="px-10">
                        Lưu bộ sưu tập
                    </Button>
                </div>
            </div>
        </form>
    );
}
