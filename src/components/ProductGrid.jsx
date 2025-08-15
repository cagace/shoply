import ProductCard from "./ProductCard.jsx";

export default function ProductGrid({ products }) {
  if (!products?.length) {
    return <p className="text-center text-gray-500 py-16">Ürün bulunamadı.</p>;
  }
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((p) => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}