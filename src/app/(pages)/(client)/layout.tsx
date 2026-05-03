export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header sẽ được thêm vào đây sau */}
      <header className="h-20 border-b border-stone-100 flex items-center px-8 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="text-xl font-black text-rose-500 uppercase tracking-tighter">Cosmetic Eco</div>
      </header>

      {/* Nội dung chính */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer sẽ được thêm vào đây sau */}
      <footer className="py-12 bg-stone-900 text-white text-center">
        <p className="text-stone-400">© 2026 Cosmetic Eco Luxury</p>
      </footer>
    </div>
  );
}
