export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-sm text-gray-600 flex items-center justify-between">
        <p>© {new Date().getFullYear()} Shoply</p>
        <p className="opacity-70">React + Tailwind v3 örnek e-ticaret</p>
      </div>
    </footer>
  );
}