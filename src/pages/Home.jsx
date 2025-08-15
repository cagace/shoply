import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Yeni sezon, sade tasarımlar.</h1>
            <p className="text-gray-600">Shoply ile minimal ve işlevsel ürünlere kolayca ulaş.</p>
            <div className="flex gap-3">
              <Link to="/products" className="px-4 py-2 rounded-xl bg-black text-white">Alışverişe Başla</Link>
              <a href="#highlights" className="px-4 py-2 rounded-xl border border-black">Öne Çıkanlar</a>
            </div>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-sm border bg-white">
            <img
              src="https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1200&auto=format&fit=crop"
              alt="Hero"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
      <div id="highlights" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="rounded-2xl bg-black text-white p-8 md:p-12 flex items-center justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold">Ücretsiz Kargo</h2>
            <p className="opacity-80">₺750 üzeri siparişlerde geçerli.</p>
          </div>
          <Link to="/products" className="px-4 py-2 rounded-xl bg-white text-black">Ürünleri Gör</Link>
        </div>
      </div>
    </section>
  );
}