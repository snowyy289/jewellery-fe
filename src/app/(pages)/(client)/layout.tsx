import ClientHeader from "@/components/layouts/client/ClientHeader";
import ClientFooter from "@/components/layouts/client/ClientFooter";
import ChatBox from "@/components/layouts/client/ChatBox";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { WishlistProvider } from "@/contexts/WishlistContext";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <div className="min-h-screen flex flex-col bg-white">
          <ClientHeader />

          {/* Nội dung chính */}
          <main className="flex-1 mt-[110px] md:mt-[140px]">
            {children}
          </main>

          <ClientFooter />
          <ChatBox />
        </div>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}
