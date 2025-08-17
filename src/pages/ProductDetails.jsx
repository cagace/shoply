import { useParams } from "react-router-dom";
import { PRODUCTS } from "../data/products.js";
import { useMemo, useState } from "react";
import Rating from "../components/Rating.jsx";
import { formatPrice } from "../utils/format.js";
import { useCart } from "../context/CartContext.jsx";
import QuantityInput from "../components/QuantityInput.jsx";

export default function ProductDetails() {
  const { id } = useParams();
  const product = useMemo(() => PRODUCTS.find((p) => p.id === id), [id]);
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  // Beden seçenekleri (varsayılan ilk eleman)
  const sizes = useMemo(() => product.sizes || [], [product.sizes]);
  const [size, setSize] = useState(sizes[0] || null);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p>Ürün bulunamadı.</p>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="rounded-2xl overflow-hidden border bg-white max-w-[590px] max-h-[330px] ">
          <img src={product.image} alt={product.title} className="w-full h-full object-cover transition-opacity duration-300" />
        </div>
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold">{product.title}</h1>
          <Rating value={product.rating} />
          
          <p className="text-gray-600">{product.description}</p>
          {/* Beden seçimi (varsa) */}
        {sizes.length > 0 && (
          <div className="pt-1 max-w-36">
            <label className="block text-xs text-gray-600 mb-1">Beden</label>
            <select
              value={size || ""}
              onChange={(e) => setSize(e.target.value)}
              className="w-full rounded-xl border px-3 py-2 text-sm bg-white"
            >
              {sizes.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        )}
        
          <div className="text-2xl font-bold">{formatPrice(product.price)}</div>
          <div className="flex items-center gap-3">
            <QuantityInput value={qty} onChange={setQty} />
            <button className="px-4 py-2 rounded-xl bg-black text-white transition-transform active:scale-95" onClick={() => add(product, qty)}>
              Sepete Ekle
            </button>
            {/* Teslimat bilgisi */}
        {product.delivery && (
          <div className="text-xs text-gray-600 flex items-center gap-1">
            <span aria-hidden>🚚</span>
            <span>Teslimat: {product.delivery}</span>
          </div>
        )}
          </div>
        </div>
      </div>
    </section>
  );
}