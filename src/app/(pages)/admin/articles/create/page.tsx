"use client";
import { AdminPageHeader } from "@/components/layouts/admin/shared";
import FormArticleCreate from "./FormArticleCreate";

export default function CreateArticlePage() {
    return (
        <div className="w-full space-y-6 pb-10">
            <AdminPageHeader
                title="Tạo bài viết mới"
                subTitle="Viết bài viết mới cho blog"
                backHref="/admin/articles"
            />

            <FormArticleCreate />
        </div>
    );
}
