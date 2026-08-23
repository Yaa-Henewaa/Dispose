"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/cart-store";
import QuantitySelector from "@/components/QuantitySelector";

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
  const [quantity, setQuantity] = useState(1);

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
    <div className="flex flex-col gap-3">
      <QuantitySelector
        quantity={quantity}
        max={stock || 99}
        onChange={setQuantity}
      />
      <button
        onClick={() => {
          addItem({ productId, slug, name, price, image, stock }, quantity);
          setAdded(true);
          setQuantity(1);
          setTimeout(() => setAdded(false), 1200);
        }}
        className={buttonClass}
      >
        {added ? "Added ✓" : "Add to Cart"}
      </button>
    </div>
  );
}
