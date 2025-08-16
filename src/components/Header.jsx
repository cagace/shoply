import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import useAnimatedNumber from "../hooks/useAnimatedNumber.js";
import { useEffect, useRef, useState } from "react";

export default function Header() {
  const { summary } = useCart();
  const { user, signout } = useAuth();

  const animatedCount = useAnimatedNumber(summary.count, 350);
  const prevRef = useRef(summary.count);
  const [bump, setBump] = useState(false);
  useEffect(() => {
    if (summary.count !== prevRef.current) {
      setBump(true);
      const t = setTimeout(() => setBump(false), 220);
      prevRef.current = summary.count;
      return () => clearTimeout(t);
    }
  }, [summary.count]);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
    {/* Sol tarafta logo */}
    <Link to="/" className="flex items-center gap-2">
      <img src="/icon.svg" alt="Shoply Logos" className="h-8 w-8" />
      <span className="font-semibold tracking-tight">Shoply</span>
    </Link>

    {/* Ortada nav menü */}
    <nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-6">
      <NavLink to="/" className="text-sm hover:underline">Ana Sayfa</NavLink>
      <NavLink to="/products" className="text-sm hover:underline">Ürünler</NavLink>
    </nav>

    {/* Sağ tarafta kullanıcı bilgisi ve sepet */}
    <div className="flex items-center gap-3">
      {user ? (
        <div className="hidden sm:flex items-center gap-2 text-sm text-gray-700">
          <span>Merhaba,</span>
          <strong className="font-medium">{user.firstName} {user.lastName}</strong>
          <button onClick={signout} className="ml-2 px-3 py-1 rounded-lg border text-xs">Çıkış</button>
        </div>
      ) : (
        <div className="hidden sm:flex items-center gap-2 text-sm">
          <Link to="/signin" className="underline">Giriş Yap</Link>
          <span className="opacity-40">/</span>
          <Link to="/signup" className="underline">Üye Ol</Link>
        </div>
      )}

      <Link to="/cart" className="inline-flex items-center rounded-xl border px-4 py-2 text-sm">
        Sepet
        <span className={["ml-2 rounded-lg bg-black text-white px-2 py-0.5 text-xs tabular-nums","transition-transform duration-200", bump ? "scale-110" : "scale-100"].join(" ")}>{Math.round(animatedCount)}</span>
      </Link>
    </div>
  </div>
</header>
  );
}