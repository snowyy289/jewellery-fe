"use client";
import { useState } from "react";
import AdminSidebar from "@/components/layouts/admin/AdminSidebar";
import AdminHeader from "@/components/layouts/admin/AdminHeader";
import ConfirmDialog from "@/components/modal/ConfirmDialog";
import { Toaster } from "sonner";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#fafaf9]">
      <Toaster position="top-right" richColors />
      <ConfirmDialog />
      <AdminSidebar isCollapsed={isSidebarCollapsed} />

      <div className={`flex-1 flex flex-col h-screen overflow-hidden transition-all duration-300`}>
        <AdminHeader 
          isSidebarCollapsed={isSidebarCollapsed} 
          onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
        />
        
        <main className="flex-1 p-8 md:p-10 overflow-y-auto w-full">
          <div className="max-w-full mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
