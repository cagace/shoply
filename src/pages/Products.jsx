import { useEffect, useMemo, useRef, useState } from "react";
import { PRODUCTS } from "../data/products.js";
import ProductCard from "../components/ProductCard.jsx";

function useItemsPerRow() {
  const compute = () => {
    if (typeof window === "undefined") return 3;
    const w = window.innerWidth;
    if (w >= 1024) return 3; // lg
    if (w >= 768) return 2;  // md
    return 1;                // mobil
  };
  const [cols, setCols] = useState(compute);
  useEffect(() => {
    const mLg = window.matchMedia("(min-width: 1024px)");
    const mMd = window.matchMedia("(min-width: 768px)");
    const update = () => setCols(mLg.matches ? 3 : mMd.matches ? 2 : 1);
    update();
    mLg.addEventListener?.("change", update);
    mMd.addEventListener?.("change", update);
    return () => {
      mLg.removeEventListener?.("change", update);
      mMd.removeEventListener?.("change", update);
    };
  }, []);
  return cols;
}

export default function Products() {
  const topRef = useRef(null);                 // 👈 sayfa başı referansı
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(PRODUCTS.map((p) => p.category)))],
    []
  );

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return PRODUCTS.filter((p) => {
      const okCat = cat === "All" || p.category === cat;
      const okQ = !query || p.title.toLowerCase().includes(query);
      return okCat && okQ;
    });
  }, [q, cat]);

  const cols = useItemsPerRow();      // 1 | 2 | 3
  const rows = 4;                     // max 4 satır
  const itemsPerPage = cols * rows;   // 4 | 8 | 12

  const [page, setPage] = useState(1);

  // Üste kaydırma yardımcıları
  const scrollToTop = (smooth = true) => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: smooth ? "smooth" : "auto" });
    }
  };
  const goToPage = (n) => {           // 👈 tek nokta
    setPage(n);
    // setState asenkron olsa da kullanıcı etkileşimi anında üste çıkmak UX olarak iyi
    // render sonrası da zaten grid kısalır/uzar
    scrollToTop(true);
  };

  // Filtre/cols değişince sayfayı aralık içinde tut ve üste dön
  useEffect(() => {
    const total = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
    setPage((p) => {
      const next = Math.min(Math.max(1, p), total);
      if (next !== p) {
        // sayfa dışına taşmışsa düzeltirken üste dön
        setTimeout(() => scrollToTop(false), 0);
      }
      return next;
    });
  }, [filtered.length, itemsPerPage]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const start = (page - 1) * itemsPerPage;
  const pageItems = filtered.slice(start, start + itemsPerPage);

  const PageButtons = () => {
    const buttons = [];
    const pushBtn = (n, label = n) =>
      buttons.push(
        <button
          key={`p-${label}`}
          onClick={() => goToPage(n)}
          className={[
            "h-9 min-w-9 px-3 rounded-lg text-sm border",
            n === page ? "bg-black text-white border-black" : "bg-white hover:bg-gray-50"
          ].join(" ")}
        >
          {label}
        </button>
      );

    if (totalPages <= 7) {
      for (let n = 1; n <= totalPages; n++) pushBtn(n);
      return buttons;
    }
    pushBtn(1);
    if (page > 3) buttons.push(<span key="l-ell" className="px-1">…</span>);
    for (let n = Math.max(2, page - 1); n <= Math.min(totalPages - 1, page + 1); n++) pushBtn(n);
    if (page < totalPages - 2) buttons.push(<span key="r-ell" className="px-1">…</span>);
    pushBtn(totalPages);
    return buttons;
  };

  return (
    <section ref={topRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 space-y-6">
      {/* Başlık + filtreler */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-xl sm:text-2xl font-semibold">Ürünler</h1>
        <div className="flex gap-2">
          <select
            value={cat}
            onChange={(e) => { setCat(e.target.value); goToPage(1); }}  // filtre değişince 1. sayfa + üste
            className="rounded-xl border px-3 py-2 text-sm bg-white"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <input
            className="rounded-xl border px-3 py-2 text-sm bg-white w-full sm:w-64"
            placeholder="Ara..."
            value={q}
            onChange={(e) => { setQ(e.target.value); goToPage(1); }}   // aramada da 1. sayfa + üste
          />
        </div>
      </div>

      {/* Sayfa bilgisi */}
      <div className="text-sm text-gray-600">
        {filtered.length} ürün • Sayfa {page}/{totalPages} • Bu sayfada {pageItems.length} ürün
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pageItems.map((p) => (
          <ProductCard key={`${p.id}-${p.size || ""}`} product={p} />
        ))}
        {pageItems.length === 0 && (
          <div className="col-span-full text-gray-500">Bu sayfada ürün yok.</div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => goToPage(Math.max(1, page - 1))}
          disabled={page === 1}
          className={[
            "h-9 px-3 rounded-lg text-sm border",
            page === 1 ? "opacity-50 cursor-not-allowed" : "bg-white hover:bg-gray-50"
          ].join(" ")}
        >
          Prev
        </button>

        <PageButtons />

        <button
          onClick={() => goToPage(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className={[
            "h-9 px-3 rounded-lg text-sm border",
            page === totalPages ? "opacity-50 cursor-not-allowed" : "bg-white hover:bg-gray-50"
          ].join(" ")}
        >
          Next
        </button>
      </div>

      <p className="text-xs text-gray-500 text-center">
        Sayfa başına ürün: mobil 4, tablet 8, masaüstü 12 (en fazla 3 sütun × 4 satır).
      </p>
    </section>
  );
}
