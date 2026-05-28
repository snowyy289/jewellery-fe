"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Clock, Eye, Share2, Facebook, Twitter, Link2 } from "lucide-react";
import { articleService } from "@/services/client/articleService";
import { Article } from "@/types/article";

function formatDate(dateString: string | undefined) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', { 
        day: '2-digit', month: 'long', year: 'numeric' 
    }).format(date);
}

function formatShortDate(dateString: string | undefined) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', { 
        day: '2-digit', month: '2-digit', year: 'numeric' 
    }).format(date);
}

export default function BlogDetailPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;

    const [article, setArticle] = useState<Article | null>(null);
    const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                setLoading(true);
                const res = await articleService.getArticleBySlug(slug);
                if (res.code === "success") {
                    setArticle(res.article);
                    setRelatedArticles(res.relatedArticles || []);
                } else {
                    // router.push("/404"); // Optional: handle 404
                }
            } catch (error) {
                console.error("Error fetching article:", error);
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchArticle();
        }
    }, [slug, router]);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-40 min-h-screen bg-slate-50">
                <Loader2 className="w-8 h-8 animate-spin text-gold" />
            </div>
        );
    }

    if (!article) {
        return (
            <div className="flex flex-col justify-center items-center py-40 min-h-screen bg-slate-50">
                <h1 className="text-3xl font-serif text-stone-900 mb-4">Bài viết không tồn tại</h1>
                <Link href="/blog" className="text-gold hover:text-amber-600 transition-colors flex items-center gap-2 font-bold uppercase tracking-widest text-sm">
                    <ArrowLeft className="w-4 h-4" /> Quay lại Cẩm Nang
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen pb-20 pt-28 md:pt-36">
            <div className="container mx-auto px-4 md:px-8">
                {/* Back Link */}
                <div className="mb-8 max-w-4xl mx-auto">
                    <Link href="/blog" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-stone-500 hover:text-gold transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Trở về danh sách
                    </Link>
                </div>

                {/* Article Header */}
                <header className="max-w-4xl mx-auto mb-12 text-center">
                    <div className="flex justify-center gap-2 mb-6">
                        {(article.tags || []).slice(0, 2).map((tag, idx) => (
                            <span key={idx} className="bg-stone-100 text-stone-600 text-[10px] font-bold px-3 py-1 uppercase tracking-widest">
                                {tag}
                            </span>
                        ))}
                    </div>
                    <h1 className="text-3xl md:text-5xl font-serif text-stone-900 mb-6 leading-tight">
                        {article.title}
                    </h1>
                    <div className="flex items-center justify-center gap-6 text-xs text-stone-500 font-bold uppercase tracking-widest border-b border-stone-100 pb-8">
                        <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-gold" /> {formatDate(article.published_at || article.createdAt)}</span>
                        <span className="flex items-center gap-2"><Eye className="w-4 h-4 text-gold" /> {article.view_count} Lượt xem</span>
                        <span className="text-stone-300">|</span>
                        <span>Đăng bởi <strong className="text-stone-900">{article.author_id?.fullName || "Admin"}</strong></span>
                    </div>
                </header>

                {/* Cover Image */}
                <div className="max-w-5xl mx-auto mb-16 relative aspect-video bg-stone-100 overflow-hidden shadow-xl">
                    <img 
                        src={article.thumbnail || "https://images.unsplash.com/photo-1599643478514-4a820c56a8e0?auto=format&fit=crop&q=80&w=1600"} 
                        alt={article.title} 
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Article Body */}
                <div className="max-w-3xl mx-auto">
                    {/* Description Highlight */}
                    {article.description && (
                        <p className="text-xl md:text-2xl font-serif text-stone-600 italic mb-10 text-center leading-relaxed px-4 border-l-4 border-gold">
                            "{article.description}"
                        </p>
                    )}

                    {/* Main HTML Content */}
                    <article 
                        className="prose prose-stone prose-lg md:prose-xl max-w-none prose-headings:font-serif prose-headings:text-stone-900 prose-a:text-gold hover:prose-a:text-amber-600 prose-img:rounded-none prose-img:shadow-md mx-auto"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />

                    {/* Article Footer & Share */}
                    <div className="mt-16 pt-8 border-t border-stone-200 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold uppercase tracking-widest text-stone-500">Thẻ:</span>
                            <div className="flex gap-2">
                                {(article.tags || []).map((tag, idx) => (
                                    <span key={idx} className="bg-stone-50 border border-stone-200 text-stone-600 text-[10px] font-bold px-3 py-1 uppercase tracking-widest hover:border-gold hover:text-gold cursor-pointer transition-colors">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="text-xs font-bold uppercase tracking-widest text-stone-500 flex items-center gap-2">
                                <Share2 className="w-4 h-4" /> Chia sẻ:
                            </span>
                            <div className="flex gap-2">
                                <button className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-colors">
                                    <Facebook className="w-4 h-4" />
                                </button>
                                <button className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-[#1DA1F2] hover:text-white hover:border-[#1DA1F2] transition-colors">
                                    <Twitter className="w-4 h-4" />
                                </button>
                                <button 
                                    className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-colors"
                                    onClick={() => navigator.clipboard.writeText(window.location.href)}
                                >
                                    <Link2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Articles */}
                {relatedArticles.length > 0 && (
                    <div className="max-w-5xl mx-auto mt-24 pt-16 border-t border-stone-200">
                        <h3 className="text-3xl font-serif text-stone-900 mb-12 text-center">Bài Viết Liên Quan</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {relatedArticles.map((relArticle) => (
                                <Link href={`/blog/${relArticle.slug}`} key={relArticle._id} className="group block">
                                    <div className="relative aspect-[4/3] overflow-hidden bg-stone-100 mb-4 shadow-sm group-hover:shadow-lg transition-all">
                                        <img 
                                            src={relArticle.thumbnail || "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800"} 
                                            alt={relArticle.title} 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                                        />
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] text-stone-400 font-bold uppercase tracking-widest mb-2">
                                        <span>{formatShortDate(relArticle.published_at || relArticle.createdAt)}</span>
                                    </div>
                                    <h4 className="text-lg font-serif text-stone-900 mb-2 group-hover:text-gold transition-colors line-clamp-2">
                                        {relArticle.title}
                                    </h4>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
