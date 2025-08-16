// src/context/CartContext.jsx
import { createContext, useContext, useEffect, useMemo } from "react";
import useLocalStorage from "../hooks/useLocalStorage.js";
import { formatPrice } from "../utils/format.js";

const CartContext = createContext(null);
const KEY = "cart";

function normalize(raw) {
  if (!raw) return [];
  // Eski biçim: { items: [...] }
  if (!Array.isArray(raw) && Array.isArray(raw.items)) return raw.items;
  // Beklenen biçim: []
  if (Array.isArray(raw)) return raw;
  return [];
}

export function CartProvider({ children }) {
  const [stored, setStored] = useLocalStorage(KEY, []);
  // İlk mount’ta normalize + 0 qty temizliği
  useEffect(() => {
    const norm = normalize(stored).filter((i) => Number(i?.qty) > 0);
    // ürün alan adlarını da temel düzeyde doğrula
    const safe = norm.map((i) => ({
      id: String(i.id),
      qty: Number(i.qty) || 0,
      price: Number(i.price) || 0,
      title: i.title || i.name || "Ürün",
      image: i.image || i.img || "",
    }));
    if (JSON.stringify(stored) !== JSON.stringify(safe)) {
      setStored(safe);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // sadece ilk yüklemede

  const items = Array.isArray(stored) ? stored : [];

  const setItems = (updater) => {
    setStored((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      // 0 veya altındaki qty’leri temizle
      return (next || []).filter((i) => Number(i.qty) > 0);
    });
  };

  const add = (product, qty = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.id === product.id);
      if (idx >= 0) {
        const clone = [...prev];
        clone[idx] = { ...clone[idx], qty: clone[idx].qty + qty };
        return clone;
      }
      return [
        ...prev,
        {
          id: String(product.id),
          qty: qty,
          price: Number(product.price) || 0,
          title: product.title || "Ürün",
          image: product.image || "",
        },
      ];
    });
  };

  // qty <= 0 ⇒ otomatik sil
  const updateQty = (id, qty) =>
    setItems((prev) =>
      prev.flatMap((i) => {
        if (i.id !== id) return [i];
        const next = Math.max(0, Number(qty) || 0);
        return next <= 0 ? [] : [{ ...i, qty: next }];
      })
    );

  const remove = (id) => setItems((prev) => prev.filter((i) => i.id !== id));
  const clear = () => setItems([]);

  const summary = useMemo(() => {
    const count = items.reduce((a, b) => a + (Number(b.qty) || 0), 0);
    const subtotal = items.reduce((a, b) => a + (Number(b.qty) || 0) * (Number(b.price) || 0), 0);
    return { count, subtotal, subtotalLabel: formatPrice(subtotal) };
  }, [items]);

  const value = { items, add, updateQty, remove, clear, summary };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
