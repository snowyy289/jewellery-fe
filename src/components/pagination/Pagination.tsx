"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    totalPage: number;
    currentPage: number;
}

export default function Pagination({ totalPage, currentPage }: PaginationProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    if (totalPage <= 1) return null;

    const changePage = (page: number) => {
        if (page < 1 || page > totalPage) return;
        const params = new URLSearchParams(searchParams);
        params.set("page", page.toString());
        router.push(`${pathname}?${params.toString()}`);
    };

    const renderPages = () => {
        const pages = [];
        for (let i = 1; i <= totalPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => changePage(i)}
                    className={`
                        w-8 h-8 rounded-lg text-xs font-bold transition-all
                        ${
                            currentPage === i
                                ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                                : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                        }
                    `}
                >
                    {i}
                </button>
            );
        }
        return pages;
    };

    return (
        <div className="flex items-center gap-1.5 p-4 bg-white/50 border-t border-slate-100">
            <button
                onClick={() => changePage(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            >
                <ChevronLeft className="w-4 h-4" />
            </button>
            
            <div className="flex items-center gap-1">
                {renderPages()}
            </div>

            <button
                onClick={() => changePage(currentPage + 1)}
                disabled={currentPage === totalPage}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            >
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
}
