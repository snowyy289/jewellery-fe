"use client";
import React, { useEffect, useState } from "react";
import { Star, MessageCircle, Clock } from "lucide-react";
import { reviewService } from "@/services/client/reviewService";
import { Review } from "@/types/review";
import Image from "next/image";

interface ProductReviewsProps {
    productId: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await reviewService.getReviewsForProduct(productId);
                if (res.data) {
                    setReviews(res.data);
                }
            } catch (error) {
                console.error("Error fetching reviews:", error);
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchReviews();
        }
    }, [productId]);

    if (loading) {
        return (
            <div className="py-12 flex justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-gold border-t-transparent animate-spin"></div>
            </div>
        );
    }

    const averageRating = reviews.length > 0 
        ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
        : 0;

    return (
        <div className="max-w-4xl mx-auto mt-24">
            <div className="text-center mb-12 space-y-4">
                <h2 className="text-2xl md:text-3xl font-black text-stone-900 uppercase tracking-tight">Đánh Giá Từ Khách Hàng</h2>
                <div className="w-16 h-1 bg-gold mx-auto"></div>
            </div>

            {reviews.length === 0 ? (
                <div className="text-center py-12 bg-stone-50 border border-stone-100 rounded-2xl">
                    <MessageCircle className="w-12 h-12 text-stone-300 mx-auto mb-4" />
                    <h3 className="text-stone-900 font-bold mb-2">Chưa có đánh giá nào</h3>
                    <p className="text-sm text-stone-500">Hãy là người đầu tiên sở hữu và đánh giá sản phẩm này.</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Summary */}
                    <div className="flex flex-col md:flex-row items-center gap-8 p-8 bg-stone-900 text-white rounded-2xl">
                        <div className="flex flex-col items-center justify-center space-y-2">
                            <span className="text-5xl font-black text-gold">{averageRating}</span>
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star 
                                        key={star} 
                                        className={`w-4 h-4 ${star <= Number(averageRating) ? "fill-gold text-gold" : "fill-transparent text-stone-600"}`} 
                                    />
                                ))}
                            </div>
                            <span className="text-xs font-bold uppercase tracking-widest text-stone-400">{reviews.length} Đánh giá</span>
                        </div>
                        <div className="hidden md:block w-px h-24 bg-stone-700"></div>
                        <div className="flex-1 w-full space-y-2">
                            {[5, 4, 3, 2, 1].map((star) => {
                                const count = reviews.filter(r => r.rating === star).length;
                                const percentage = (count / reviews.length) * 100;
                                return (
                                    <div key={star} className="flex items-center gap-3 text-sm">
                                        <span className="flex items-center gap-1 w-8 font-bold">{star} <Star className="w-3 h-3 fill-gold text-gold" /></span>
                                        <div className="flex-1 h-2 bg-stone-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-gold rounded-full" style={{ width: `${percentage}%` }}></div>
                                        </div>
                                        <span className="w-8 text-right text-stone-400">{count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Review List */}
                    <div className="space-y-6">
                        {reviews.map((review) => {
                            const user = typeof review.user_id === 'object' ? review.user_id : { fullName: "Khách hàng", avatar: null };
                            return (
                                <div key={review._id} className="p-6 bg-white border border-stone-100 rounded-2xl flex flex-col md:flex-row gap-6">
                                    <div className="flex items-start gap-4 md:w-1/4 shrink-0">
                                        <div className="w-12 h-12 rounded-full overflow-hidden bg-stone-100 shrink-0">
                                            <Image 
                                                src={user.avatar || "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.fullName) + "&background=random"} 
                                                alt={user.fullName}
                                                width={48}
                                                height={48}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-stone-900 text-sm mb-1">{user.fullName}</h4>
                                            <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest bg-green-50 px-2 py-1 rounded-full">Đã mua hàng</span>
                                        </div>
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-center gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star 
                                                    key={star} 
                                                    className={`w-4 h-4 ${star <= review.rating ? "fill-gold text-gold" : "fill-transparent text-stone-300"}`} 
                                                />
                                            ))}
                                        </div>
                                        <p className="text-stone-700 leading-relaxed text-sm">{review.comment}</p>
                                        <div className="flex items-center gap-2 text-stone-400 text-xs font-bold uppercase tracking-widest pt-4">
                                            <Clock className="w-3 h-3" />
                                            {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
