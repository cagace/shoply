// src/pages/Products.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { PRODUCTS } from "../data/products.js";
import ProductCard from "../components/ProductCard.jsx";

export default function Products() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [dragging, setDragging] = useState(false);
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

  // Drag scroll (touch/pointer)
  const onPointerDown = (e) => {
    const el = trackRef.current;
    if (!el) return;
    isDown.current = true;
    setDragging(true);
    startX.current =
      e.clientX ?? (e.touches && e.touches[0]?.clientX) ?? 0;
    scrollLeftStart.current = el.scrollLeft;
  };
  const onPointerMove = (e) => {
    const el = trackRef.current;
    if (!el || !isDown.current) return;
    const x = e.clientX ?? (e.touches && e.touches[0]?.clientX) ?? 0;
    const walk = x - startX.current;
    el.scrollLeft = scrollLeftStart.current - walk;
  };
  const onPointerUp = () => {
    isDown.current = false;
    setDragging(false);
  };

  // Keyboard arrows for accessibility
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onKey = (e) => {
      if (e.key === "ArrowRight") { e.preventDefault(); scrollByPage(1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); scrollByPage(-1); }
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 space-y-6">
      {/* Başlık + filtreler */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-xl sm:text-2xl font-semibold">Önerilen Ürünler</h1>
      </div>

      {/* Carousel wrapper */}
      <div className="relative">
        {/* Sol ok (md ve üstü) */}
        <button
          type="button"
          onClick={() => scrollByPage(-1)}
          aria-label="Önceki"
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-20
                     h-10 w-10 rounded-full border bg-white/90 backdrop-blur
                     items-center justify-center hover:bg-white"
        >
          ‹
        </button>

        {/* Kenar fade (lg ve üstü) */}
        <div className="pointer-events-none hidden lg:block absolute left-0 top-0 h-full w-16 z-10 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none hidden lg:block absolute right-0 top-0 h-full w-16 z-10 bg-gradient-to-l from-white to-transparent" />

        {/* Track */}
        <div
          ref={trackRef}
          tabIndex={0}
          role="region"
          aria-label="Ürün carousel"
          className={[
            "flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory scroll-px-4 pb-2 pt-1",
            "focus:outline-none",
            "select-none", // metin seçmeyi engelle
            dragging ? "cursor-grabbing" : "cursor-grab",
            // momentum scroll iOS
            "[-webkit-overflow-scrolling:touch]"
          ].join(" ")}
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
              className="snap-start shrink-0 w-[86%] xs:w-[80%] sm:w-[60%] md:w-1/2 lg:w-1/3"
            >
              <ProductCard product={p} />
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="min-h-[8rem] flex items-center text-gray-500">
              Sonuç bulunamadı.
            </div>
          )}
        </div>

        {/* Sağ ok (md ve üstü) */}
        <button
          type="button"
          onClick={() => scrollByPage(1)}
          aria-label="Sonraki"
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-20
                     h-10 w-10 rounded-full border bg-white/90 backdrop-blur
                     items-center justify-center hover:bg-white"
        >
          ›
        </button>
      </div>

      <p className="text-xs text-gray-500">
        Mobilde kartları sürükleyerek kaydırabilirsin. Klavyede ← → ile de gezinebilirsin.
      </p>
    </section>
  );
}
