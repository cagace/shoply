import { Link, useNavigate } from "react-router-dom";
import SuggestedProducts from "./SuggestedProducts.jsx";
import { useCart } from "../context/CartContext.jsx";
import { formatPrice } from "../utils/format.js";
import QuantityInput from "../components/QuantityInput.jsx";
import { useMemo } from "react";
import useAnimatedNumber from "../hooks/useAnimatedNumber.js";

export default function Cart() {
  const { items, updateQty, summary } = useCart();
  const navigate = useNavigate();

  // ⬇️ Tüm hook'lar koşulsuz en üstte
  const shipping = summary.subtotal > 750 ? 0 : 49.9;
  const targetTotal = useMemo(() => summary.subtotal + shipping, [summary.subtotal, shipping]);
  const animatedSubtotal = useAnimatedNumber(summary.subtotal, 450);
  const animatedTotal = useAnimatedNumber(targetTotal, 450);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-4">
        {items.length === 0 ? (
          <div className="text-center space-y-4 py-16 col-span-2">
            <p className="text-gray-600 mb-4">Sepetiniz boş.</p>
            <Link to="/products" className="px-4 py-2 mt-4 rounded-xl bg-black text-white">
              Alışverişe Dön
            </Link>
          </div>
        ) : (
          items.map((i) => (
            <div key={i.id} className="rounded-2xl border p-4 bg-white flex items-center gap-4">
              <img src={i.image} alt={i.title} className="w-24 h-24 object-cover rounded-xl" />
              <div className="flex-1">
                <div className="font-medium line-clamp-1">{i.title}</div>
                <div className="text-sm text-gray-600">{formatPrice(i.price)}</div>
              </div>
              {/* min=0: 0 olursa context otomatik silecek */}
              <QuantityInput value={i.qty} min={0} onChange={(v) => updateQty(i.id, v)} />
            </div>
          ))
        )}

        <SuggestedProducts />
        {/* Önerilen Ürünler bileşeni */}
      </div>

      <aside className="rounded-2xl border p-6 h-fit bg-white">
        <h2 className="text-lg font-semibold mb-4">Sipariş Özeti</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Ara Toplam</span>
            <span className="tabular-nums">{formatPrice(animatedSubtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Kargo</span>
            <span>
              {items.length === 0
                ? "—"
                : (shipping === 0 ? "Ücretsiz" : formatPrice(shipping))}
            </span>
          </div>
        </div>
        <hr className="my-4" />
        <div className="flex justify-between font-semibold">
          <span>Toplam</span>
          {items.length === 0
                ? formatPrice(animatedSubtotal)
                : 
          (<span className="tabular-nums">{formatPrice(animatedTotal)}</span>)}
        </div>
        {items.length > 0 && (
          <button
            className="w-full mt-4 px-4 py-2 rounded-xl bg-black text-white"
            onClick={() => navigate("/checkout")}
          >
            Ödemeye Geç
          </button>
        )}
      </aside>
    </section>
  );
}
