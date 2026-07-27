"use client";

import Link from "next/link";
import Image from "next/image";
import {
  useCartStore,
  cartSubtotal,
  useCartHasHydrated,
} from "@/lib/cart-store";
import { formatGHS } from "@/lib/format";
import QuantitySelector from "@/components/QuantitySelector";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const hydrated = useCartHasHydrated();

  if (!hydrated) {
    return <div className="mx-auto max-w-3xl px-4 py-10" />;
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-xl font-bold text-gray-800">Your cart is empty</h1>
        <p className="mt-2 text-gray-500">Add some products to get started.</p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-brand-teal px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-teal-dark"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  const subtotal = cartSubtotal(items);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-xl font-bold text-gray-800">Your Cart</h1>

      <div className="mt-6 divide-y divide-gray-100 rounded-2xl border border-gray-100">
        {items.map((item) => (
          <div key={item.productId} className="flex items-center gap-4 p-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-50">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                  unoptimized
                />
              ) : null}
            </div>
            <div className="flex-1">
              <Link
                href={`/product/${item.slug}`}
                className="text-sm font-medium text-gray-800 hover:text-brand-teal"
              >
                {item.name}
              </Link>
              <p className="text-sm text-brand-pink font-semibold">
                {formatGHS(item.price)}
              </p>
            </div>
            <QuantitySelector
              quantity={item.quantity}
              max={item.stock || 99}
              onChange={(quantity) => updateQuantity(item.productId, quantity)}
            />
            <button
              onClick={() => removeItem(item.productId)}
              aria-label={`Remove ${item.name}`}
              className="text-gray-400 hover:text-red-500"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between rounded-2xl bg-gray-50 p-4">
        <span className="font-medium text-gray-700">Subtotal</span>
        <span className="text-lg font-bold text-gray-800">
          {formatGHS(subtotal)}
        </span>
      </div>

      <Link
        href="/checkout"
        className="mt-6 block rounded-full bg-brand-teal py-3 text-center text-sm font-semibold text-white hover:bg-brand-teal-dark"
      >
        Proceed to Checkout
      </Link>
    </div>
  );
}
