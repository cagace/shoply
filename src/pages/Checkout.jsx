// src/pages/Checkout.jsx
import { useCart } from "../context/CartContext.jsx";
import { formatPrice } from "../utils/format.js";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useAnimatedNumber from "../hooks/useAnimatedNumber.js";

export default function Checkout() {
  const { items, clear, summary } = useCart();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const shipping = summary.subtotal > 750 ? 0 : 49.9;
  const targetTotal = useMemo(() => summary.subtotal + shipping, [summary.subtotal, shipping]);
  const animatedTotal = useAnimatedNumber(targetTotal, 450);

  const placeOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      clear();
      setLoading(false);
      navigate("/");
      alert("Siparişiniz alındı! Teşekkürler 🙌");
    }, 600);
  };

  if (!items.length) {
    return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">Sepetiniz boş.</div>;
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid lg:grid-cols-3 gap-8">
      <form className="rounded-2xl border p-6 space-y-4 bg-white lg:col-span-2" onSubmit={placeOrder}>
        <h1 className="text-xl font-semibold">Ödeme</h1>
        <div className="grid sm:grid-cols-2 gap-4">
          <input className="rounded-xl border px-3 py-2" required placeholder="Ad" />
          <input className="rounded-xl border px-3 py-2" required placeholder="Soyad" />
          <input className="rounded-xl border px-3 py-2 sm:col-span-2" required placeholder="Adres" />
          <input className="rounded-xl border px-3 py-2" required placeholder="Şehir" />
          <input className="rounded-xl border px-3 py-2" required placeholder="Posta Kodu" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <input className="rounded-xl border px-3 py-2" required placeholder="Kart No" />
          <input className="rounded-xl border px-3 py-2" required placeholder="Ad Soyad (Kart)" />
          <input className="rounded-xl border px-3 py-2" required placeholder="SKT (AA/YY)" />
          <input className="rounded-xl border px-3 py-2" required placeholder="CVC" />
        </div>
        <button className="w-full px-4 py-2 rounded-xl bg-black text-white" disabled={loading}>
          {loading ? "İşleniyor..." : "Siparişi Tamamla"}
        </button>
      </form>

      <aside className="rounded-2xl border p-6 h-fit bg-white">
        <h2 className="text-lg font-semibold mb-3">Sepet ({items.reduce((a, b) => a + b.qty, 0)})</h2>
        <ul className="space-y-2 text-sm">
          {items.map((i) => (
            <li key={i.id} className="flex justify-between">
              <span className="line-clamp-1">{i.title} × {i.qty}</span>
              <span>{formatPrice(i.price * i.qty)}</span>
            </li>
          ))}
        </ul>
        <hr className="my-4" />
        <div className="flex justify-between font-semibold">
          <span>Toplam</span>
          <span className="tabular-nums">{formatPrice(animatedTotal)}</span>
        </div>
      </aside>
    </section>
  );
}
