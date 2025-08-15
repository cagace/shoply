import { useMemo, useState } from "react";
import { PRODUCTS } from "../data/products.js";
import ProductGrid from "../components/ProductGrid.jsx";

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

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between">
        <h1 className="text-2xl font-semibold">Ürünler</h1>
        <div className="flex gap-3">
          <select
            value={cat}
            onChange={(e) => setCat(e.target.value)}
            className="rounded-xl border px-3 py-2 text-sm bg-white"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <input
            className="rounded-xl border px-3 py-2 text-sm bg-white"
            placeholder="Ara..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>
      <ProductGrid products={filtered} />
    </section>
  );
}