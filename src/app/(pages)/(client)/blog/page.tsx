"use client";
import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { Loader2, ArrowRight, Clock, Eye, Sparkles } from "lucide-react";
import { articleService } from "@/services/client/articleService";
import { Article } from "@/types/article";

function formatDate(dateString: string | undefined) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', { 
        day: '2-digit', month: 'short', year: 'numeric' 
    }).format(date);
}

function timeAgo(dateString: string | undefined) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return "Vừa xong";
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays} ngày trước`;
    
    return formatDate(dateString);
}

function BlogContent() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [featuredArticles, setFeaturedArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [articlesRes, featuredRes] = await Promise.all([
                    articleService.getArticles({ limitItems: 9 }),
                    articleService.getFeaturedArticles(3)
                ]);

                if (articlesRes.code === "success") {
                    setArticles(articlesRes.articles);
                }
                if (featuredRes.code === "success") {
                    setFeaturedArticles(featuredRes.articles);
                }
            } catch (error) {
                console.error("Error fetching articles:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const heroArticle = featuredArticles.length > 0 ? featuredArticles[0] : articles[0];
    const sideFeaturedArticles = featuredArticles.slice(1, 3);
    const mainGridArticles = heroArticle 
        ? articles.filter(a => a._id !== heroArticle._id && !sideFeaturedArticles.find(fa => fa._id === a._id))
        : articles;

    return (
        <div className="bg-slate-50 min-h-screen">
            {/* Header Banner */}
            <div className="bg-stone-900 py-20 text-center border-t border-white/10 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay pointer-events-none"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <Sparkles className="w-8 h-8 text-gold mx-auto mb-4 opacity-70" />
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter mb-4 font-serif">
                        Cẩm Nang <span className="text-gold italic font-light">& Phong Cách</span>
                    </h1>
                    <p className="text-stone-300 max-w-2xl mx-auto text-sm tracking-widest uppercase">
                        Khám phá những bí quyết làm đẹp, kiến thức trang sức và xu hướng thời trang mới nhất.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-8 py-16">
                {loading ? (
                    <div className="flex justify-center items-center py-32">
                        <Loader2 className="w-8 h-8 animate-spin text-gold" />
                    </div>
                ) : (
                    <>
                        {/* Featured Section */}
                        {heroArticle && (
                            <div className="mb-20">
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                                    {/* Main Hero Article */}
                                    <div className="lg:col-span-8 group relative overflow-hidden bg-stone-900 aspect-[16/10] md:aspect-[21/9] lg:aspect-auto h-full flex flex-col justify-end p-8 md:p-12 cursor-pointer shadow-2xl">
                                        <Link href={`/blog/${heroArticle.slug}`} className="absolute inset-0 z-10"></Link>
                                        <div className="absolute inset-0">
                                            <img 
                                                src={heroArticle.thumbnail || "https://images.unsplash.com/photo-1599643478514-4a820c56a8e0?auto=format&fit=crop&q=80&w=1200"} 
                                                alt={heroArticle.title} 
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/60 to-transparent"></div>
                                        </div>
                                        <div className="relative z-20 max-w-2xl">
                                            <span className="bg-gold text-stone-900 text-[10px] font-bold px-3 py-1 uppercase tracking-widest mb-4 inline-block">Nổi Bật</span>
                                            <h2 className="text-3xl md:text-4xl font-serif text-white mb-4 leading-tight group-hover:text-gold transition-colors">{heroArticle.title}</h2>
                                            <p className="text-stone-300 text-sm md:text-base line-clamp-2 mb-6 max-w-xl">{heroArticle.description}</p>
                                            <div className="flex items-center gap-6 text-[10px] text-stone-400 font-bold uppercase tracking-widest">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-3 h-3 text-gold" />
                                                    <span>{timeAgo(heroArticle.published_at || heroArticle.createdAt)}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Eye className="w-3 h-3 text-gold" />
                                                    <span>{heroArticle.view_count} Lượt Xem</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Side Featured Articles */}
                                    {sideFeaturedArticles.length > 0 && (
                                        <div className="lg:col-span-4 flex flex-col gap-8">
                                            {sideFeaturedArticles.map(article => (
                                                <div key={article._id} className="group relative overflow-hidden bg-white aspect-square md:aspect-[21/9] lg:aspect-square flex-1 cursor-pointer shadow-lg hover:shadow-xl transition-all">
                                                    <Link href={`/blog/${article.slug}`} className="absolute inset-0 z-10"></Link>
                                                    <div className="absolute inset-0">
                                                        <img 
                                                            src={article.thumbnail || "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=800"} 
                                                            alt={article.title} 
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/20 to-transparent"></div>
                                                    </div>
                                                    <div className="absolute inset-x-0 bottom-0 p-6 z-20">
                                                        <h3 className="text-lg md:text-xl font-serif text-white mb-2 leading-tight group-hover:text-gold transition-colors">{article.title}</h3>
                                                        <div className="flex items-center gap-2 text-[10px] text-stone-300 font-bold uppercase tracking-widest">
                                                            <Clock className="w-3 h-3 text-gold" />
                                                            <span>{formatDate(article.published_at || article.createdAt)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Main Grid */}
                        <div className="mb-8 border-b border-stone-200 pb-4">
                            <h2 className="text-2xl font-serif text-stone-900 tracking-wider">Bài Viết Mới Nhất</h2>
                        </div>
                        
                        {mainGridArticles.length === 0 ? (
                            <div className="text-center py-20 text-stone-500 font-medium">
                                Chưa có bài viết nào.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                                {mainGridArticles.map((article) => (
                                    <div key={article._id} className="group flex flex-col cursor-pointer">
                                        <Link href={`/blog/${article.slug}`} className="block">
                                            <div className="relative aspect-[4/3] overflow-hidden bg-stone-100 mb-6">
                                                <img 
                                                    src={article.thumbnail || "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800"} 
                                                    alt={article.title} 
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                                                />
                                            </div>
                                            <div className="flex items-center gap-4 text-[10px] text-stone-500 font-bold uppercase tracking-widest mb-3">
                                                <span>{formatDate(article.published_at || article.createdAt)}</span>
                                                <span className="w-1 h-1 bg-gold rounded-full"></span>
                                                <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {article.view_count}</span>
                                            </div>
                                            <h3 className="text-xl font-serif text-stone-900 mb-3 group-hover:text-gold transition-colors leading-snug line-clamp-2">
                                                {article.title}
                                            </h3>
                                            <p className="text-stone-600 text-sm line-clamp-3 mb-4 leading-relaxed">
                                                {article.description || article.title}
                                            </p>
                                            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-stone-900 group-hover:text-gold transition-colors mt-auto">
                                                Đọc Tiếp <ArrowRight className="w-4 h-4" />
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Pagination - Dummy for now, can be implemented properly later */}
                        {mainGridArticles.length > 0 && (
                            <div className="mt-20 flex justify-center gap-2">
                                <button className="w-10 h-10 flex items-center justify-center bg-stone-900 text-white font-bold hover:bg-stone-800 transition-colors">1</button>
                                <button className="w-10 h-10 flex items-center justify-center bg-white text-stone-700 border border-stone-200 hover:bg-stone-50 hover:text-gold font-bold transition-colors">2</button>
                                <span className="w-10 h-10 flex items-center justify-center text-stone-400">...</span>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default function BlogPage() {
    return (
        <Suspense fallback={
            <div className="flex justify-center items-center py-20 min-h-screen bg-slate-50">
                <Loader2 className="w-8 h-8 animate-spin text-gold" />
            </div>
        }>
            <BlogContent />
        </Suspense>
    );
}
