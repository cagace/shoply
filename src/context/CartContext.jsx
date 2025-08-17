// src/context/CartContext.jsx
import { createContext, useContext, useMemo } from "react";
import useLocalStorage from "../hooks/useLocalStorage.js";
import { formatPrice } from "../utils/format.js";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useLocalStorage("cart", []); // [{id, size?, qty, price, title, image}]

  // Ürünü ekle: aynı id + aynı size ise qty arttır, değilse yeni satır
  const add = (product, qty = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex(
        (i) => i.id === product.id && (i.size || null) === (product.size || null)
      );
      if (idx >= 0) {
        const clone = [...prev];
        clone[idx] = { ...clone[idx], qty: clone[idx].qty + qty };
        return clone;
      }
      return [
        ...prev,
        {
          id: product.id,
          size: product.size || null,         // 👈 BEDENİ KAYDET
          qty,
          price: product.price,
          title: product.title,
          image: product.image,
        },
      ];
    });
  };

  // qty <= 0 ise otomatik sil. Geriye dönük uyumluluk: (id, qty) ya da ({id,size}, qty)
  const updateQty = (key, qty) =>
    setItems((prev) =>
      prev.flatMap((i) => {
        const match =
          typeof key === "object"
            ? i.id === key.id && (i.size || null) === (key.size || null)
            : i.id === key; // eski kullanım
        if (!match) return [i];
        const next = Math.max(0, Number(qty) || 0);
        return next <= 0 ? [] : [{ ...i, qty: next }];
      })
    );

  const remove = (key) =>
    setItems((prev) =>
      prev.filter((i) =>
        typeof key === "object"
          ? !(i.id === key.id && (i.size || null) === (key.size || null))
          : i.id !== key
      )
    );

  const clear = () => setItems([]);

  const summary = useMemo(() => {
    const count = items.reduce((a, b) => a + b.qty, 0);
    const subtotal = items.reduce((a, b) => a + b.qty * b.price, 0);
    return { count, subtotal, subtotalLabel: formatPrice(subtotal) };
  }, [items]);

  const value = { items, add, updateQty, remove, clear, summary };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
