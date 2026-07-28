"use client";

import Link from "next/link";
import { FiShoppingBag } from "react-icons/fi";
import {
  useCartStore,
  cartItemCount,
  useCartHasHydrated,
} from "@/lib/cart-store";

export default function CartBadge() {
  const items = useCartStore((state) => state.items);
  const hydrated = useCartHasHydrated();
  const count = hydrated ? cartItemCount(items) : 0;

  return (
    <Link
      href="/cart"
      className="relative flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-[#5b3a63] transition hover:bg-[#fff7fb]"
    >
      <span aria-hidden className="text-[16px]">
        <FiShoppingBag />
      </span>
      <span className="hidden sm:inline">Cart</span>
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-pink text-xs font-semibold text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
