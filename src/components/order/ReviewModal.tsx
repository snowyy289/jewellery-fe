"use client";
import React, { useState } from "react";
import { Star, X, Loader2 } from "lucide-react";
import { reviewService } from "@/services/client/reviewService";
import { toast } from "sonner";
import Image from "next/image";

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    productId: string;
    orderId: string;
    productTitle: string;
    productImage?: string;
    onSuccess: () => void;
}

export default function ReviewModal({
    isOpen,
    onClose,
    productId,
    orderId,
    productTitle,
    productImage,
    onSuccess
}: ReviewModalProps) {
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (rating === 0) {
            toast.error("Vui lòng chọn số sao đánh giá!");
            return;
        }

        if (!comment.trim()) {
            toast.error("Vui lòng nhập nội dung đánh giá!");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await reviewService.createReview({
                product_id: productId,
                order_id: orderId,
                rating,
                comment
            });

            if (res.code === 201 || res.code === "success") {
                toast.success("Cảm ơn bạn đã đánh giá sản phẩm!");
                onSuccess();
                onClose();
            } else {
                toast.error(res.message || "Có lỗi xảy ra khi gửi đánh giá.");
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Lỗi kết nối đến máy chủ.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-stone-100">
                    <h3 className="text-xl font-serif font-bold text-stone-900 italic">Đánh Giá Sản Phẩm</h3>
                    <button 
                        onClick={onClose}
                        className="text-stone-400 hover:text-stone-900 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-6">
                        {/* Product Info */}
                        <div className="flex items-center gap-4 p-4 bg-stone-50 rounded-xl">
                            <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-white">
                                <Image 
                                    src={productImage || "https://images.unsplash.com/photo-1605100804763-247f661c6e61?auto=format&fit=crop&q=80&w=200"} 
                                    alt={productTitle}
                                    width={64}
                                    height={64}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <h4 className="font-bold text-stone-800 text-sm">{productTitle}</h4>
                        </div>

                        {/* Rating */}
                        <div className="flex flex-col items-center space-y-2">
                            <span className="text-xs font-bold uppercase tracking-widest text-stone-500">Chất lượng sản phẩm</span>
                            <div className="flex items-center gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        className="p-1 transition-transform hover:scale-110 focus:outline-none"
                                    >
                                        <Star 
                                            className={`w-8 h-8 transition-colors ${
                                                star <= (hoverRating || rating) 
                                                ? "fill-gold text-gold" 
                                                : "fill-transparent text-stone-300"
                                            }`} 
                                        />
                                    </button>
                                ))}
                            </div>
                            <span className="text-sm font-bold text-gold">
                                {rating === 5 ? "Tuyệt vời" : rating === 4 ? "Rất tốt" : rating === 3 ? "Bình thường" : rating === 2 ? "Không hài lòng" : rating === 1 ? "Tệ" : ""}
                            </span>
                        </div>

                        {/* Comment */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-stone-500">Nội dung đánh giá</label>
                            <textarea 
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows={4}
                                placeholder="Hãy chia sẻ trải nghiệm của bạn về sản phẩm này nhé..."
                                className="w-full border border-stone-200 rounded-xl p-4 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all resize-none"
                            ></textarea>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="p-6 border-t border-stone-100 bg-stone-50 flex justify-end gap-3">
                        <button 
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-stone-500 hover:text-stone-900 transition-colors"
                        >
                            Hủy
                        </button>
                        <button 
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-stone-900 hover:bg-gold text-white font-bold px-8 py-3 rounded-lg transition-colors uppercase tracking-widest text-xs flex items-center gap-2 disabled:opacity-50 disabled:hover:bg-stone-900"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Đang Gửi...
                                </>
                            ) : (
                                "Gửi Đánh Giá"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
