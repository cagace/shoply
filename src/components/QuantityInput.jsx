// src/components/QuantityInput.jsx
export default function QuantityInput({ value, onChange, min = 0 }) {
  return (
    <div className="inline-flex items-center rounded-xl border border-gray-300 overflow-hidden">
      <button
        type="button"
        className="px-3 py-2 text-sm transition-opacity hover:opacity-70"
        onClick={() => onChange(Math.max(min, value - 1))}
        aria-label="Azalt"
      >
        −
      </button>
      <input
        className="w-12 text-center outline-none py-2 text-sm"
        value={value}
        onChange={(e) => {
          const v = parseInt(e.target.value || "0", 10);
          onChange(Number.isNaN(v) ? min : Math.max(min, v));
        }}
      />
      <button
        type="button"
        className="px-3 py-2 text-sm transition-opacity hover:opacity-70"
        onClick={() => onChange(value + 1)}
        aria-label="Arttır"
      >
        +
      </button>
    </div>
  );
}
