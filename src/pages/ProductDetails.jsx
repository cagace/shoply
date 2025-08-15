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
        <div className="rounded-2xl overflow-hidden border bg-white">
          <img src={product.image} alt={product.title} className="w-full h-full object-cover transition-opacity duration-300" />
        </div>
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold">{product.title}</h1>
          <Rating value={product.rating} />
          <p className="text-gray-600">{product.description}</p>
          <div className="text-2xl font-bold">{formatPrice(product.price)}</div>
          <div className="flex items-center gap-3">
            <QuantityInput value={qty} onChange={setQty} />
            <button className="px-4 py-2 rounded-xl bg-black text-white transition-transform active:scale-95" onClick={() => add(product, qty)}>
              Sepete Ekle
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}