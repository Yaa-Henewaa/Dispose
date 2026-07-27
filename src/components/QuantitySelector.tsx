"use client";

interface QuantitySelectorProps {
  quantity: number;
  onChange: (quantity: number) => void;
  max?: number;
  min?: number;
}

export default function QuantitySelector({
  quantity,
  onChange,
  max = 99,
  min = 1,
}: QuantitySelectorProps) {
  return (
    <div className="inline-flex items-center rounded-full border border-gray-300">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(Math.max(min, quantity - 1))}
        className="h-9 w-9 rounded-full text-lg font-semibold text-gray-600 hover:bg-gray-100"
      >
        −
      </button>
      <span className="w-10 text-center text-sm font-medium">{quantity}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(Math.min(max, quantity + 1))}
        className="h-9 w-9 rounded-full text-lg font-semibold text-gray-600 hover:bg-gray-100"
      >
        +
      </button>
    </div>
  );
}
