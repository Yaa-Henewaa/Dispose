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

  const buttonClass =
    "w-full rounded-full bg-[#f7d9e8] px-4 py-2 text-sm font-semibold text-[#7a3d62] transition hover:bg-[#f1c9db] active:scale-[0.98]";

  if (outOfStock) {
    return (
      <button
        disabled
        className={`${buttonClass} cursor-not-allowed opacity-80`}
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
      className={buttonClass}
    >
      {added ? "Added ✓" : "Add to Cart"}
    </button>
  );
}
