"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/cart-store";

interface AddToCartButtonProps {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string | null;
  stock: number;
  outOfStock: boolean;
}

export default function AddToCartButton({
  productId,
  slug,
  name,
  price,
  image,
  stock,
  outOfStock,
}: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);

  if (outOfStock) {
    return (
      <button
        disabled
        className="w-full rounded-full bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-500 cursor-not-allowed"
      >
        Out of stock
      </button>
    );
  }

  return (
    <button
      onClick={() => {
        addItem({ productId, slug, name, price, image, stock }, 1);
        setAdded(true);
        setTimeout(() => setAdded(false), 1200);
      }}
      className="w-full rounded-full bg-brand-teal px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-teal-dark active:scale-95"
    >
      {added ? "Added ✓" : "Add to Cart"}
    </button>
  );
}
