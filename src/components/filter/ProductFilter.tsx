"use client";
import { useState} from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Filter, X } from "lucide-react";
import Select from "@/components/input/Select";
import Input from "@/components/input/Input";
import Button from "@/components/button/Button";
import { Category } from "@/types/category";
import { createTree } from "@/utils/treeHelper";

interface ProductFilterProps {
    categories: Category[];
    brands: { _id: string; title: string }[];
    users: { _id: string; fullName: string }[];
}

export default function ProductFilter({ categories, brands, users }: ProductFilterProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    
    const [isOpen, setIsOpen] = useState(false);
    const [category, setCategory] = useState(searchParams.get("category") || "");
    const [brand, setBrand] = useState(searchParams.get("brand") || "");
    const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
    const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
    const [updateBy, setUpdateBy] = useState(searchParams.get("updateBy") || "");

    // Xây cây category để hiển thị phân cấp
    const categoryTree = createTree(categories);

    const handleApply = () => {
        const params = new URLSearchParams(searchParams);
        
        console.log("🔍 Applying filters:", { category, brand, minPrice, maxPrice, updateBy });
        
        if (category) {
            params.set("category", category);
        } else {
            params.delete("category");
        }
        
        if (brand) {
            params.set("brand", brand);
        } else {
            params.delete("brand");
        }
        
        if (minPrice) {
            params.set("minPrice", minPrice);
        } else {
            params.delete("minPrice");
        }
        
        if (maxPrice) {
            params.set("maxPrice", maxPrice);
        } else {
            params.delete("maxPrice");
        }
        
        if (updateBy) {
            params.set("updateBy", updateBy);
        } else {
            params.delete("updateBy");
        }
        
        params.set("page", "1");
        console.log("🔍 New URL params:", params.toString());
        router.push(`${pathname}?${params.toString()}`);
        setIsOpen(false);
    };

    const handleReset = () => {
        setCategory("");
        setBrand("");
        setMinPrice("");
        setMaxPrice("");
        setUpdateBy("");
        
        const params = new URLSearchParams(searchParams);
        params.delete("category");
        params.delete("brand");
        params.delete("minPrice");
        params.delete("maxPrice");
        params.delete("updateBy");
        params.set("page", "1");
        
        router.push(`${pathname}?${params.toString()}`);
        setIsOpen(false);
    };

    const activeFiltersCount = [category, brand, minPrice, maxPrice, updateBy].filter(Boolean).length;

    return (
        <div className="relative">
            <Button
                variant="outline"
                size="sm"
                icon={<Filter className="w-4 h-4" />}
                onClick={() => setIsOpen(!isOpen)}
            >
                Lọc
                {activeFiltersCount > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-indigo-500 text-white text-[10px] font-bold rounded-full">
                        {activeFiltersCount}
                    </span>
                )}
            </Button>

            {isOpen && (
                <>
                    <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-6 z-50 space-y-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-slate-800">Bộ lọc nâng cao</h3>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <Select
                                label="Danh mục"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="">-- Tất cả danh mục --</option>
                                {categoryTree.map(cat => (
                                    <option key={cat._id} value={cat._id}>
                                        {"--".repeat(cat.level)} {cat.title}
                                    </option>
                                ))}
                            </Select>

                            <Select
                                label="Thương hiệu"
                                value={brand}
                                onChange={(e) => setBrand(e.target.value)}
                            >
                                <option value="">-- Tất cả thương hiệu --</option>
                                {brands.map(b => (
                                    <option key={b._id} value={b._id}>
                                        {b.title}
                                    </option>
                                ))}
                            </Select>

                            <div className="grid grid-cols-2 gap-3">
                                <Input
                                    label="Giá từ (VNĐ)"
                                    type="number"
                                    placeholder="0"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                    min="0"
                                />
                                <Input
                                    label="Giá đến (VNĐ)"
                                    type="number"
                                    placeholder="999999999"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    min="0"
                                />
                            </div>

                            <Select
                                label="Cập nhật bởi"
                                value={updateBy}
                                onChange={(e) => setUpdateBy(e.target.value)}
                            >
                                <option value="">-- Tất cả người dùng --</option>
                                {users.map(user => (
                                    <option key={user._id} value={user._id}>
                                        {user.fullName}
                                    </option>
                                ))}
                            </Select>
                        </div>

                        <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleReset}
                                className="flex-1"
                            >
                                Xóa bộ lọc
                            </Button>
                            <Button
                                size="sm"
                                onClick={handleApply}
                                className="flex-1"
                            >
                                Áp dụng
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
