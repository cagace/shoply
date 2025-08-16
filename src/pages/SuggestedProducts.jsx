// src/pages/Products.jsx
import { useMemo, useRef, useState } from "react";
import { PRODUCTS } from "../data/products.js";
import ProductCard from "../components/ProductCard.jsx";

export default function Products() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(PRODUCTS.map((p) => p.category)))],
    []
  );

  const filtered = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const okCat = cat === "All" || p.category === cat;
      const okQ = p.title.toLowerCase().includes(q.toLowerCase());
      return okCat && okQ;
    });
  }, [q, cat]);

  // Carousel refs & handlers
  const trackRef = useRef(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);

  const scrollByPage = (dir = 1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth, behavior: "smooth" });
  };

  // Pointer/Touch drag to scroll (mobilde sürükleme desteği)
  const onPointerDown = (e) => {
    const el = trackRef.current;
    if (!el) return;
    isDown.current = true;
    startX.current = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    scrollLeftStart.current = el.scrollLeft;
  };
  const onPointerMove = (e) => {
    const el = trackRef.current;
    if (!el || !isDown.current) return;
    const x = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    const walk = (x - startX.current) * 1; // sürükleme hassasiyeti
    el.scrollLeft = scrollLeftStart.current - walk;
  };
  const onPointerUp = () => {
    isDown.current = false;
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between">
        <h1 className="text-2xl font-semibold">Önerilen Ürünler</h1>
      </div>

      {/* Carousel wrapper */}
      <div className="relative">
        {/* Sol ok */}
        <button
          onClick={() => scrollByPage(-1)}
          aria-label="Önceki"
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10
                     h-10 w-10 rounded-full border bg-white shadow-sm
                     items-center justify-center hover:bg-gray-50"
        >
          ‹
        </button>

        {/* Track: yatay kaydırılabilir, scroll-snap ile sayfalı, aynı anda max 3 kart */}
        <div
          ref={trackRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-p-4
                     pb-2 pt-1"
          // mobil sürükleme (touch/pointer)
          onMouseDown={onPointerDown}
          onMouseMove={onPointerMove}
          onMouseLeave={onPointerUp}
          onMouseUp={onPointerUp}
          onTouchStart={onPointerDown}
          onTouchMove={onPointerMove}
          onTouchEnd={onPointerUp}
        >
          {filtered.map((p) => (
            <div
              key={p.id}
              className="snap-start shrink-0 w-[85%] sm:w-[60%] md:w-1/2 lg:w-1/3"
            >
              <ProductCard product={p} />
            </div>
          ))}
        </div>

        {/* Sağ ok */}
        <button
          onClick={() => scrollByPage(1)}
          aria-label="Sonraki"
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10
                     h-10 w-10 rounded-full border bg-white shadow-sm
                     items-center justify-center hover:bg-gray-50"
        >
          ›
        </button>
      </div>

      {/* Küçük ipucu */}
      <p className="text-xs text-gray-500">Mobilde kartları sürükleyerek kaydırabilirsin.</p>
    </section>
  );
}
