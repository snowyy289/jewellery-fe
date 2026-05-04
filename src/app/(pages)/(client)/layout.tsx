import ClientHeader from "@/components/layouts/client/ClientHeader";
import ClientFooter from "@/components/layouts/client/ClientFooter";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <ClientHeader />

      {/* Nội dung chính */}
      <main className="flex-1 mt-[110px] md:mt-[140px]">
        {children}
      </main>

      <ClientFooter />
    </div>
  );
}
