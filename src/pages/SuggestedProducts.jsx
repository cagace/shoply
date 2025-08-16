// src/pages/Products.jsx
import { useMemo, useRef, useState, useEffect } from "react";
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

  // Carousel refs & states
  const trackRef = useRef(null);
  const isMouseDown = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);
  const [dragging, setDragging] = useState(false);

  // Mouse drag (sadece desktop)
  const onMouseDown = (e) => {
    const el = trackRef.current;
    if (!el) return;
    isMouseDown.current = true;
    setDragging(true);
    startX.current = e.clientX || 0;
    scrollLeftStart.current = el.scrollLeft;
  };
  const onMouseMove = (e) => {
    const el = trackRef.current;
    if (!el || !isMouseDown.current) return;
    const x = e.clientX || 0;
    const walk = x - startX.current;
    el.scrollLeft = scrollLeftStart.current - walk;
  };
  const onMouseUp = () => {
    isMouseDown.current = false;
    setDragging(false);
  };

  // Ok butonları için kaydırma
  const scrollByPage = (dir = 1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: "fadeinout" });
  };

  // Scroll bitince en yakın karta hizalama
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let t;

    const snapToNearest = () => {
      const card = el.querySelector("[data-card]");
      if (!card) return;
      const cardWidth = card.getBoundingClientRect().width - 24; // gap ~24px
      const idx = Math.round(el.scrollLeft / cardWidth);
      const target = idx * cardWidth;
      el.scrollTo({ left: target, behavior: "fadeinout" });
    };

    const onScroll = () => {
      clearTimeout(t);
      t = setTimeout(snapToNearest,250); // scroll durunca hizala
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(t);
      el.removeEventListener("scroll", onScroll);
    };
  }, []);

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

        {/* Track */}
        <div
          ref={trackRef}
          tabIndex={0}
          role="region"
          aria-label="Ürün carousel"
          className={[
            "flex gap-4 sm:gap-6 overflow-x-auto",
            "snap-x snap-proximity scroll-px-4 pb-2 pt-1",
            "scroll-smooth",
            "touch-pan-x overscroll-x-contain overscroll-y-none",
            "select-none",
            dragging ? "cursor-grabbing" : "cursor-grab",
            "[-webkit-overflow-scrolling:touch]",
          ].join(" ")}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseUp}
          onMouseUp={onMouseUp}
        >
          {filtered.map((p) => (
            <div
              key={p.id}
              data-card
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

      <p className="text-xs text-gray-500">
        Mobilde kartları sürükleyerek kaydırabilirsin.
      </p>
    </section>
  );
}
