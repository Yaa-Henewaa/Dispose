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
    <div className="inline-flex w-fit items-center overflow-hidden rounded-full border border-[#e7c8e6] bg-[#fffafc] shadow-sm">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(Math.max(min, quantity - 1))}
        className="flex h-8 w-8 items-center justify-center text-lg font-semibold text-[#7a3d62] transition hover:bg-[#f7d9e8]"
      >
        −
      </button>
      <span className="min-w-8 px-2 text-center text-sm font-semibold text-[#4b2458]">
        {quantity}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(Math.min(max, quantity + 1))}
        className="flex h-8 w-8 items-center justify-center text-lg font-semibold text-[#7a3d62] transition hover:bg-[#f7d9e8]"
      >
        +
      </button>
    </div>
  );
}
