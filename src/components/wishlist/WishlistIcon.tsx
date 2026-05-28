"use client";
import React from 'react';
import { Heart } from 'lucide-react';
import Link from 'next/link';
import { useWishlist } from '@/contexts/WishlistContext';

export default function WishlistIcon() {
    const { wishlistCount } = useWishlist();

    return (
        <Link href="/wishlist" className="relative flex items-center justify-center p-2">
            <Heart className="w-5 h-5 text-stone-600 hover:text-gold transition-colors" />
            {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-gold text-white text-[10px] font-bold flex items-center justify-center">
                    {wishlistCount > 99 ? '99+' : wishlistCount}
                </span>
            )}
        </Link>
    );
}
