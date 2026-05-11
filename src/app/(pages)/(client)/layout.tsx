import ClientHeader from "@/components/layouts/client/ClientHeader";
import ClientFooter from "@/components/layouts/client/ClientFooter";
import { CartProvider } from "@/contexts/CartContext";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-white">
        <ClientHeader />

        {/* Nội dung chính */}
        <main className="flex-1 mt-[110px] md:mt-[140px]">
          {children}
        </main>

        <ClientFooter />
      </div>
    </CartProvider>
  );
}
