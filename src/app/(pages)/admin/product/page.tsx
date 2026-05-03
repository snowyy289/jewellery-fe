"use client";
import { Package, Plus, Search, Filter } from "lucide-react";
import Button from "@/components/button/Button";
import { AdminPageHeader, AdminEmptyState, AdminCard } from "@/components/layouts/admin/shared";
import Input from "@/components/input/Input";

export default function ProductPage() {
    return (
        <div className="w-full space-y-6 pb-10">
            <AdminPageHeader
                title="Quản lý sản phẩm"
                subTitle="Quản lý kho hàng và danh mục sản phẩm cao cấp của bạn."
                actions={
                    <Button size="sm" icon={<Plus className="w-4 h-4" />}>
                        Thêm sản phẩm
                    </Button>
                }
            />

            {/* Toolbar Card */}
            <AdminCard className="p-4!">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="w-full md:w-96">
                        <Input
                            placeholder="Tìm kiếm sản phẩm theo tên, mã SKU..."
                            icon={<Search className="w-4 h-4" />}
                            className="py-2.5! bg-slate-50 border-transparent focus:bg-white"
                        />
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="bg-white"
                            icon={<Filter className="w-3.5 h-3.5" />}
                        >
                            Bộ lọc nâng cao
                        </Button>
                    </div>
                </div>
            </AdminCard>

            {/* Empty State */}
            <AdminEmptyState
                title="Chưa có sản phẩm nào"
                description="Danh sách sản phẩm của bạn hiện đang trống rỗng. Hãy bắt đầu bằng cách thêm sản phẩm đầu tiên của bạn để làm giàu nào bro!"
                icon={Package}
                action={
                    <Button size="lg" icon={<Plus className="w-4 h-4" />}>
                        Thêm sản phẩm đầu tiên
                    </Button>
                }
            />
        </div>
    );
}
