"use client";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FileText, Edit2, Trash2, Plus, Eye, Star } from "lucide-react";
import Image from "next/image";
import Button from "@/components/button/Button";
import { AdminPageHeader, AdminCard } from "@/components/layouts/admin/shared";
import { articleService } from "@/services/admin/articleService";
import { Article } from "@/types/article";
import { toast } from "sonner";
import Search from "@/components/search/Search";
import Pagination from "@/components/pagination/Pagination";

function ArticlesContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [articles, setArticles] = useState<Article[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPage: 1
    });

    useEffect(() => {
        const params = Object.fromEntries(searchParams.entries());
        fetchArticles(params);
    }, [searchParams]);

    const fetchArticles = async (params: Record<string, string | number | boolean> = {}) => {
        setIsLoading(true);
        try {
            const res = await articleService.getArticles(params);
            if (res.code === 200 || res.code === 201 || res.code === "success") {
                setArticles(res.articles || res.data || []);
                if (res.pagination) {
                    setPagination({
                        currentPage: res.pagination.currentPage,
                        totalPage: res.pagination.totalPage
                    });
                }
            }
        } catch {
            console.error("Fetch articles error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
            try {
                const res = await articleService.deleteArticle(id);
                if (res.code === 200 || res.code === 201 || res.code === "success") {
                    toast.success("Xóa thành công!");
                    const params = Object.fromEntries(searchParams.entries());
                    fetchArticles(params);
                } else {
                    toast.error(res.message);
                }
            } catch {
                toast.error("Lỗi khi xóa!");
            }
        }
    };

    const getStatusBadge = (status: string) => {
        const badges: Record<string, { bg: string; text: string; label: string }> = {
            'draft': { bg: 'bg-slate-50', text: 'text-slate-600', label: 'Nháp' },
            'published': { bg: 'bg-emerald-50', text: 'text-emerald-600', label: 'Đã xuất bản' },
            'archived': { bg: 'bg-amber-50', text: 'text-amber-600', label: 'Lưu trữ' }
        };
        const badge = badges[status] || badges.draft;
        return (
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${badge.bg} ${badge.text} border-${badge.text.replace('text-', '')}/20`}>
                <span className={`w-1.5 h-1.5 rounded-full bg-current`} />
                {badge.label}
            </div>
        );
    };

    return (
        <div className="w-full space-y-6 pb-10">
            <AdminPageHeader
                title="Quản lý bài viết"
                subTitle="Blog, tin tức & hướng dẫn"
                actions={
                    <div className="flex items-center gap-3">
                        <Link href="/admin/articles/create">
                            <Button size="sm" icon={<Plus className="w-4 h-4" />}>
                                Thêm mới
                            </Button>
                        </Link>
                    </div>
                }
            />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <select className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 bg-white hover:border-indigo-300 transition-colors">
                        <option value="">Tất cả trạng thái</option>
                        <option value="draft">Nháp</option>
                        <option value="published">Đã xuất bản</option>
                        <option value="archived">Lưu trữ</option>
                    </select>
                    <select className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 bg-white hover:border-indigo-300 transition-colors">
                        <option value="">Tất cả danh mục</option>
                    </select>
                </div>
                <Search />
            </div>

            <AdminCard noPadding title="Tất cả bài viết" subTitle={`${articles.length} bài viết hiện có`}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bài viết</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Danh mục</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tác giả</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trạng thái</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Lượt xem</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ngày xuất bản</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={7} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin border-indigo-500/20" style={{ borderTopColor: "#6366f1" }} />
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Đang tải...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : articles.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-8 py-20 text-center text-slate-400 italic font-medium">
                                        Chưa có bài viết nào được tạo.
                                    </td>
                                </tr>
                            ) : (
                                articles.map((item) => (
                                    <tr 
                                        key={item._id} 
                                        className="group hover:bg-indigo-50/30 transition-all duration-300 cursor-pointer"
                                        onClick={() => router.push(`/admin/articles/${item._id}`)}
                                    >
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-12 rounded-xl overflow-hidden shadow-sm group-hover:shadow-indigo-100 transition-all relative">
                                                    {item.thumbnail ? (
                                                        <Image 
                                                            src={item.thumbnail} 
                                                            alt={item.title} 
                                                            width={64} 
                                                            height={48} 
                                                            className="w-full h-full object-cover" 
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-slate-50 border border-slate-100">
                                                            <FileText className="w-5 h-5 text-slate-300" />
                                                        </div>
                                                    )}
                                                    {item.featured && (
                                                        <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center shadow-sm">
                                                            <Star className="w-3 h-3 text-white fill-white" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-slate-800 transition-colors group-hover:text-indigo-600 line-clamp-1">
                                                        {item.title}
                                                    </p>
                                                    {item.description && (
                                                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                                                            {item.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <span className="text-xs font-bold text-slate-600">
                                                {item.category_id && typeof item.category_id === 'object' ? item.category_id.title : '—'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-slate-700">{item.author_id?.fullName || '—'}</span>
                                                <span className="text-[10px] text-slate-400">{item.author_id?.email || ''}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            {getStatusBadge(item.status)}
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                                <Eye className="w-3.5 h-3.5" />
                                                <span className="font-bold">{item.view_count}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <span className="text-xs text-slate-500">
                                                {item.published_at ? new Date(item.published_at).toLocaleDateString('vi-VN') : '—'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-4" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex items-center justify-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                                                <Link href={`/admin/articles/edit/${item._id}`}>
                                                    <button className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-white hover:text-indigo-600 hover:shadow-md border border-transparent hover:border-slate-100 transition-all">
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                </Link>
                                                <button 
                                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDelete(item._id); }}
                                                    className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-white hover:text-rose-600 hover:shadow-md border border-transparent hover:border-slate-100 transition-all"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="px-8 py-4 bg-slate-50/30 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Tổng cộng: {articles.length} bài viết
                    </p>
                </div>

                <Pagination 
                    totalPage={pagination.totalPage} 
                    currentPage={pagination.currentPage} 
                />
            </AdminCard>
        </div>
    );
}

export default function ArticlesPage() {
    return (
        <Suspense fallback={<div>Đang tải...</div>}>
            <ArticlesContent />
        </Suspense>
    );
}
