/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search as SearchIcon, X } from "lucide-react";
import { useDebounce } from "../../hooks/useDebounce";

export default function Search() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    
    const [value, setValue] = useState(searchParams.get("keyword") || "");
    const debouncedValue = useDebounce(value, 500);

    useEffect(() => {
        const params = new URLSearchParams(searchParams);
        if (debouncedValue) {
            params.set("keyword", debouncedValue);
        } else {
            params.delete("keyword");
        }
        params.set("page", "1"); 
        router.push(`${pathname}?${params.toString()}`);
    }, [debouncedValue]); 

    return (
        <div className="relative group w-full sm:w-80">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                <SearchIcon className="w-4 h-4" />
            </div>
            <input
                type="text"
                placeholder="Tìm kiếm..."
                className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-10 pr-10 text-xs font-medium text-slate-800 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 shadow-sm transition-all"
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
            {value && (
                <button 
                    onClick={() => setValue("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-300 hover:text-slate-500 hover:bg-slate-100 transition-all"
                >
                    <X className="w-3 h-3" />
                </button>
            )}
        </div>
    );
}
