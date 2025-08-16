import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { formatPrice } from "../utils/format.js";
import QuantityInput from "../components/QuantityInput.jsx";
import SuggestedProducts from "./SuggestedProducts.jsx";
import { useMemo } from "react";
import useAnimatedNumber from "../hooks/useAnimatedNumber.js";

export default function Cart() {
  const { items, updateQty, summary } = useCart();
  const navigate = useNavigate();

  // Hook'ları koşulsuz çalıştır
  const shipping = summary.subtotal > 750 ? 0 : 49.9;
  const targetTotal = useMemo(() => summary.subtotal + shipping, [summary.subtotal, shipping]);
  const animatedSubtotal = useAnimatedNumber(summary.subtotal, 450);
  const animatedTotal = useAnimatedNumber(targetTotal, 450);

  if (!items.length) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center space-y-4">
          <p className="text-gray-600">Sepetiniz boş.</p>
          <Link to="/products" className="inline-flex px-4 py-2 rounded-xl bg-black text-white">
            Alışverişe Dön
          </Link>
        </div>
        <SuggestedProducts />
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
      {/* Başlık */}
      <div className="mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-semibold">Sepet</h1>
      </div>

      {/* Layout: mobil tek kolon, lg'de 3 kolon (2 + 1) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Ürün listesi */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((i) => (
            <div
              key={i.id}
              className="rounded-2xl border bg-white p-3 sm:p-4 flex items-center gap-3 sm:gap-4"
            >
              {/* Görsel: mobilde küçük, taşma yok */}
              <div className="shrink-0">
                <img
                  src={i.image}
                  alt={i.title}
                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl"
                />
              </div>

              {/* Başlık + fiyat */}
              <div className="min-w-0 flex-1">
                <div className="font-medium line-clamp-2">{i.title}</div>
                <div className="text-sm text-gray-600 mt-0.5">{formatPrice(i.price)}</div>
              </div>

              {/* Miktar: mobilde daha kompakt */}
              <div className="ml-auto">
                <QuantityInput
                  value={i.qty}
                  min={0}
                  onChange={(v) => updateQty(i.id, v)}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Özet: lg+ sağda sticky; küçük ekranlarda tam genişlik ve üst/alt boşluklar iyi ayarlı */}
        <aside className="rounded-2xl border bg-white p-5 h-fit lg:sticky lg:top-20">
          <h2 className="text-lg font-semibold mb-4">Sipariş Özeti</h2>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Ara Toplam</span>
              <span className="tabular-nums">{formatPrice(animatedSubtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Kargo</span>
              <span className="tabular-nums">
                {shipping === 0 ? "Ücretsiz" : formatPrice(shipping)}
              </span>
            </div>
          </div>

          <hr className="my-4" />

          <div className="flex justify-between items-baseline">
            <span className="font-semibold">Toplam</span>
            <span className="tabular-nums text-lg font-semibold">
              {formatPrice(animatedTotal)}
            </span>
          </div>

          <button
            className="w-full mt-4 px-4 py-2 rounded-xl bg-black text-white"
            onClick={() => navigate("/checkout")}
          >
            Ödemeye Geç
          </button>

          {/* Yardım metni: küçük ekranlar için boşluk */}
          <p className="text-xs text-gray-500 mt-3">
            ₺750 üzeri siparişlerde kargo ücretsiz.
          </p>
        </aside>
      </div>
    </section>
  );
}
