"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore, cartSubtotal } from "@/lib/cart-store";
import { formatGHS } from "@/lib/format";
import { placeOrder } from "./actions";

interface DeliverySettingOption {
  id: string;
  area: string;
  fee: number;
  isDefault: boolean;
}

interface CheckoutFormProps {
  deliverySettings: DeliverySettingOption[];
  pickupAddress: string;
  pickupHours: string;
  pickupNotes: string;
}

export default function CheckoutForm({
  deliverySettings,
  pickupAddress,
  pickupHours,
  pickupNotes,
}: CheckoutFormProps) {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  const [fulfillmentType, setFulfillmentType] = useState<"DELIVERY" | "PICKUP">(
    "DELIVERY",
  );
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [deliverySettingId, setDeliverySettingId] = useState(
    deliverySettings.find((setting) => setting.isDefault)?.id ??
      deliverySettings[0]?.id ??
      "",
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = cartSubtotal(items);
  const selectedDelivery = deliverySettings.find(
    (setting) => setting.id === deliverySettingId,
  );
  const deliveryFee =
    fulfillmentType === "DELIVERY" ? (selectedDelivery?.fee ?? 0) : 0;
  const total = subtotal + deliveryFee;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }
    setSubmitting(true);
    setError(null);

    const result = await placeOrder({
      customerName: name,
      customerPhone: phone,
      customerEmail: email || undefined,
      fulfillmentType,
      deliveryAddress: fulfillmentType === "DELIVERY" ? address : undefined,
      deliverySettingId:
        fulfillmentType === "DELIVERY" ? deliverySettingId : undefined,
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    });

    if (!result.ok || !result.authorizationUrl) {
      setError(result.error ?? "Something went wrong. Please try again.");
      setSubmitting(false);
      return;
    }

    clearCart();
    router.push(result.authorizationUrl);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 grid gap-8 md:grid-cols-2">
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Full name
          </label>
          <input
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Phone number
          </label>
          <input
            required
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="e.g. 0244 000 000"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Email (optional)
          </label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <span className="mb-1 block text-sm font-medium text-gray-700">
            How do you want to get your order?
          </span>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setFulfillmentType("DELIVERY")}
              className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium ${
                fulfillmentType === "DELIVERY"
                  ? "border-[#e8cfe0] bg-[#fff7fb] text-[#7a3d62]"
                  : "border-[#e9d7e7] text-gray-600"
              }`}
            >
              Delivery
            </button>
            <button
              type="button"
              onClick={() => setFulfillmentType("PICKUP")}
              className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium ${
                fulfillmentType === "PICKUP"
                  ? "border-[#e8cfe0] bg-[#fff7fb] text-[#7a3d62]"
                  : "border-[#e9d7e7] text-gray-600"
              }`}
            >
              Pickup
            </button>
          </div>
        </div>

        {fulfillmentType === "DELIVERY" ? (
          <div className="space-y-3">
            {deliverySettings.length > 0 && (
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Delivery area
                </label>
                <select
                  value={deliverySettingId}
                  onChange={(event) => setDeliverySettingId(event.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                >
                  {deliverySettings.map((setting) => (
                    <option key={setting.id} value={setting.id}>
                      {setting.area} — {formatGHS(setting.fee)}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Delivery address
              </label>
              <textarea
                required
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          </div>
        ) : (
          <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
            <p className="font-medium text-gray-800">Pickup details</p>
            {pickupAddress && <p className="mt-1">{pickupAddress}</p>}
            {pickupHours && <p>{pickupHours}</p>}
            {pickupNotes && <p className="mt-1">{pickupNotes}</p>}
            <p className="mt-1 font-medium text-[#7a3d62]">No delivery fee</p>
          </div>
        )}

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}
      </div>

      <div className="h-fit rounded-[22px] border border-[#f0dfe9] bg-white/90 p-4 shadow-[0_8px_20px_rgba(107,60,123,0.06)]">
        <h2 className="font-semibold text-gray-800">Order summary</h2>
        <div className="mt-3 space-y-2 text-sm">
          {items.map((item) => (
            <div key={item.productId} className="flex justify-between">
              <span className="text-gray-600">
                {item.name} × {item.quantity}
              </span>
              <span className="font-medium text-gray-800">
                {formatGHS(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-1 border-t border-gray-100 pt-3 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>{formatGHS(subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Delivery fee</span>
            <span>{formatGHS(deliveryFee)}</span>
          </div>
          <div className="flex justify-between text-base font-bold text-gray-900">
            <span>Total</span>
            <span>{formatGHS(total)}</span>
          </div>
        </div>
        <button
          type="submit"
          disabled={submitting || items.length === 0}
          className="mt-5 w-full rounded-full bg-[#f7d9e8] py-3 text-sm font-semibold text-[#7a3d62] hover:bg-[#f1c9db] disabled:opacity-50"
        >
          {submitting ? "Redirecting to payment..." : "Pay now"}
        </button>
      </div>
    </form>
  );
}
