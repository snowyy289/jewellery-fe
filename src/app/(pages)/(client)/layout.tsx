import ClientHeader from "@/components/layouts/client/ClientHeader";
import ClientFooter from "@/components/layouts/client/ClientFooter";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <ClientHeader />

      {/* Nội dung chính */}
      <main className="flex-1 mt-20">
        {children}
      </main>

      <ClientFooter />
    </div>
  );
}
