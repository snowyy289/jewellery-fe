/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AdminPageHeader } from "@/components/layouts/admin/shared";
import { articleService, articleCategoryService } from "@/services/admin/articleService";
import { Article, ArticleCategory } from "@/types/article";
import FormArticleEdit from "@/app/(pages)/admin/articles/edit/[id]/FormArticleEdit";

export default function ArticleDetailPage() {
    const params = useParams();
    const [isFetching, setIsFetching] = useState(true);
    const [article, setArticle] = useState<Article | null>(null);
    const [categories, setCategories] = useState<ArticleCategory[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [articleRes, categoriesRes] = await Promise.all([
                articleService.getArticleDetail(params.id as string),
                articleCategoryService.getCategories({ status: 'active' })
            ]);
            
            if ((articleRes.code === 200 || articleRes.code === "success") && (articleRes.article || articleRes.data)) {
                setArticle(articleRes.article || articleRes.data || null);
            }
            if (categoriesRes.code === 200 || categoriesRes.code === "success") {
                setCategories(categoriesRes.categories || categoriesRes.data || []);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsFetching(false);
        }
    };

    if (isFetching) return (
        <div className="flex items-center justify-center h-[60vh]">
            <div className="flex flex-col items-center gap-4">
                <div
                    className="w-12 h-12 rounded-full border-2 border-t-transparent animate-spin"
                    style={{ borderColor: "rgba(99,102,241,0.2)", borderTopColor: "#6366f1" }}
                />
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Đang tải dữ liệu...</p>
            </div>
        </div>
    );

    if (!article) return <div>Bài viết không tồn tại</div>;

    return (
        <div className="w-full space-y-6 pb-10">
            <AdminPageHeader
                title="Chi tiết bài viết"
                subTitle={`Thông tin chi tiết: ${article.title}`}
                backHref="/admin/articles"
            />
            <div className="pointer-events-none opacity-90 select-none [&_button[type=submit]]:hidden">
                <FormArticleEdit article={article} categories={categories} />
            </div>
        </div>
    );
}
