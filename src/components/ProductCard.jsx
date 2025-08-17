import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Rating from "./Rating.jsx";
import { formatPrice } from "../utils/format.js";
import { useCart } from "../context/CartContext.jsx";

export default function ProductCard({ product }) {
  const { add } = useCart();


  const handleAdd = () => {
    // Seçilen bedeni sepete eklenen ürüne iliştir
    const toAdd = { ...product, size };
    add(toAdd, 1);
  };

  return (
    <div className="rounded-2xl shadow-sm border border-gray-200 bg-white overflow-hidden group transition transform hover:-translate-y-0.5 hover:shadow-md">
      <Link to={`/products/${product.id}`} className="block aspect-[4/3] bg-gray-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </Link>

      <div className="p-4 space-y-2">
        <Link to={`/products/${product.id}`} className="font-medium line-clamp-1">
          {product.title}
        </Link>

        <Rating value={product.rating} />

        {/* Teslimat bilgisi */}
        {product.delivery && (
          <div className="text-xs text-gray-600 flex items-center gap-1">
            <span aria-hidden>🚚</span>
            <span>Teslimat: {product.delivery}</span>
          </div>
        )}


        <div className="flex items-center justify-between pt-1">
          <span className="font-semibold">{formatPrice(product.price)}</span>
          <button
            onClick={handleAdd}
            className="px-4 py-2 rounded-xl bg-black text-white text-sm transition-transform active:scale-95"
          >
            Sepete Ekle
          </button>
        </div>
      </div>
    </div>
  );
}
