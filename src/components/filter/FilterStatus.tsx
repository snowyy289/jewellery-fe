"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface FilterButton {
    name: string;
    status: string;
}

export default function FilterStatus() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    
    const currentStatus = searchParams.get("status") || "";

    const buttons: FilterButton[] = [
        { name: "Tất cả", status: "" },
        { name: "Hoạt động", status: "active" },
        { name: "Dừng", status: "inactive" },
    ];

    const handleFilter = (status: string) => {
        const params = new URLSearchParams(searchParams);
        if (status) {
            params.set("status", status);
        } else {
            params.delete("status");
        }
        params.set("page", "1");
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="flex items-center p-1 bg-slate-100/80 rounded-xl w-fit">
            {buttons.map((btn) => (
                <button
                    key={btn.status}
                    onClick={() => handleFilter(btn.status)}
                    className={`
                        px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all
                        ${
                            currentStatus === btn.status
                                ? "bg-white text-indigo-600 shadow-sm"
                                : "text-slate-500 hover:text-slate-700"
                        }
                    `}
                >
                    {btn.name}
                </button>
            ))}
        </div>
    );
}
