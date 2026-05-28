"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Loader2, ArrowRight } from "lucide-react";
import { collectionService } from "@/services/client/collectionService";
import { Collection } from "@/types/collection";

export default function CollectionsListPage() {
    const [collections, setCollections] = useState<Collection[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCollections = async () => {
            try {
                setLoading(true);
                const res = await collectionService.getCollections();
                if (res.code === "success") {
                    setCollections(res.collections || []);
                }
            } catch (error) {
                console.error("Error fetching collections:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCollections();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-40 min-h-screen bg-slate-50">
                <Loader2 className="w-8 h-8 animate-spin text-gold" />
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen pt-28 md:pt-36 pb-24">
            <div className="container mx-auto px-4 md:px-8">
                {/* Header */}
                <div className="max-w-3xl mx-auto text-center mb-20 space-y-6">
                    <span className="text-xs font-bold uppercase tracking-[0.3em] text-gold">Jewelry Eco Collections</span>
                    <h1 className="text-4xl md:text-6xl font-serif text-stone-900 italic">Bộ Sưu Tập</h1>
                    <p className="text-stone-500 leading-relaxed max-w-xl mx-auto">
                        Khám phá những tuyệt tác trang sức mang đậm dấu ấn thời gian, 
                        được chế tác thủ công tinh xảo để tôn vinh vẻ đẹp độc bản của bạn.
                    </p>
                </div>

                {/* Collections Grid */}
                <div className="flex flex-col gap-24 max-w-6xl mx-auto">
                    {collections.length === 0 ? (
                        <div className="text-center text-stone-400 italic py-20">
                            Hiện chưa có bộ sưu tập nào.
                        </div>
                    ) : (
                        collections.map((collection, index) => (
                            <div 
                                key={collection._id} 
                                className={`flex flex-col md:flex-row gap-12 lg:gap-24 items-center ${
                                    index % 2 !== 0 ? 'md:flex-row-reverse' : ''
                                }`}
                            >
                                {/* Image Half */}
                                <div className="w-full md:w-1/2 group">
                                    <Link href={`/collections/${collection.slug}`} className="block relative aspect-[4/5] overflow-hidden bg-stone-100">
                                        <img 
                                            src={collection.cover_image || collection.thumbnail || "https://images.unsplash.com/photo-1599643478514-4a820c56a8e0?auto=format&fit=crop&q=80&w=1600"} 
                                            alt={collection.title}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500"></div>
                                    </Link>
                                </div>

                                {/* Text Half */}
                                <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left space-y-6">
                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">
                                        Collection
                                    </span>
                                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-stone-900 leading-tight">
                                        {collection.title}
                                    </h2>
                                    {collection.description && (
                                        <p className="text-stone-500 leading-relaxed font-light line-clamp-4">
                                            {collection.description}
                                        </p>
                                    )}
                                    <div className="pt-6">
                                        <Link 
                                            href={`/collections/${collection.slug}`} 
                                            className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-stone-900 hover:text-gold transition-colors group"
                                        >
                                            <span className="relative overflow-hidden">
                                                Khám phá bộ sưu tập
                                                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-gold -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                                            </span>
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
