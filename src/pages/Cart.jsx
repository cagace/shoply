// src/pages/Cart.jsx
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { formatPrice } from "../utils/format.js";
import QuantityInput from "../components/QuantityInput.jsx";
import { useMemo } from "react";
import useAnimatedNumber from "../hooks/useAnimatedNumber.js";

export default function Cart() {
  const { items, updateQty, remove, summary } = useCart();
  const navigate = useNavigate();

  const shipping = summary.subtotal > 750 ? 0 : 49.9;
  const targetTotal = useMemo(() => summary.subtotal + shipping, [summary.subtotal, shipping]);

  // Animasyonlu sayılar
  const animatedSubtotal = useAnimatedNumber(summary.subtotal, 450);
  const animatedTotal = useAnimatedNumber(targetTotal, 450);

  if (!items.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-4">
        <p className="text-gray-600">Sepetiniz boş.</p>
        <Link to="/products" className="px-4 py-2 rounded-xl bg-black text-white">Alışverişe Dön</Link>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-4">
        {items.map((i) => (
          <div key={i.id} className="rounded-2xl border p-4 bg-white flex items-center gap-4">
            <img src={i.image} alt={i.title} className="w-24 h-24 object-cover rounded-xl" />
            <div className="flex-1">
              <div className="font-medium line-clamp-1">{i.title}</div>
              <div className="text-sm text-gray-600">{formatPrice(i.price)}</div>
            </div>
            <QuantityInput value={i.qty} onChange={(v) => updateQty(i.id, v)} />
            <button className="text-sm text-red-600" onClick={() => remove(i.id)}>Kaldır</button>
          </div>
        ))}
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
            <span>{shipping === 0 ? "Ücretsiz" : formatPrice(shipping)}</span>
          </div>
        </div>
        <hr className="my-4" />
        <div className="flex justify-between font-semibold">
          <span>Toplam</span>
          <span className="tabular-nums">{formatPrice(animatedTotal)}</span>
        </div>
        <button className="w-full mt-4 px-4 py-2 rounded-xl bg-black text-white" onClick={() => navigate("/checkout")}>
          Ödemeye Geç
        </button>
      </aside>
    </section>
  );
}
