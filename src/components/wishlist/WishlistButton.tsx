"use client";
import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { useWishlist } from '@/contexts/WishlistContext';

interface WishlistButtonProps {
    productId: string;
    className?: string;
    iconClassName?: string;
}

export default function WishlistButton({ productId, className = "", iconClassName = "w-5 h-5" }: WishlistButtonProps) {
    const { wishlistIds, toggleWishlist } = useWishlist();
    const [isAnimating, setIsAnimating] = useState(false);

    const isFavorited = wishlistIds.includes(productId);

    const handleClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsAnimating(true);
        await toggleWishlist(productId);
        setTimeout(() => setIsAnimating(false), 300);
    };

    return (
        <button 
            onClick={handleClick}
            className={`flex items-center justify-center transition-all ${className} ${isAnimating ? 'scale-125' : 'scale-100'}`}
            title={isFavorited ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
        >
            <Heart 
                className={`${iconClassName} transition-colors ${isFavorited ? "fill-gold text-gold" : "text-stone-700 hover:text-gold"}`} 
            />
        </button>
    );
}
