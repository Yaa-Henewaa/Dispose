"use client";

import { useState } from "react";
import { formatGHS } from "@/lib/format";
import { trackOrder, type TrackOrderResult } from "./actions";

const STATUS_LABELS: Record<string, string> = {
  NEW: "New",
  PROCESSING: "Processing",
  OUT_FOR_DELIVERY: "Out for delivery",
  READY_FOR_PICKUP: "Ready for pickup",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export default function TrackOrderPage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<TrackOrderResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    const data = await trackOrder(query);
    setResult(data);
    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <h1 className="text-xl font-bold text-gray-800">Track your order</h1>
      <p className="mt-1 text-sm text-gray-500">
        Enter your order number or the phone used at checkout.
      </p>
      <p className="mt-2 text-sm text-gray-500">
        Your order number appears on the order confirmation page after checkout.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-3">
        <input
          required
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Order number or phone number"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-[#f7d9e8] py-2.5 text-sm font-semibold text-[#7a3d62] hover:bg-[#f1c9db] disabled:opacity-50"
        >
          {loading ? "Searching..." : "Track order"}
        </button>
      </form>

      {result && !result.found && (
        <p className="mt-6 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          We couldn&apos;t find an order matching those details.
        </p>
      )}

      {result?.found && result.order && (
        <div className="mt-6 rounded-2xl border border-gray-100 p-5">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Order number</span>
            <span className="font-mono font-semibold">
              {result.order.orderNumber}
            </span>
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-gray-500">Status</span>
            <span className="font-semibold text-brand-teal">
              {STATUS_LABELS[result.order.status] ?? result.order.status}
            </span>
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-gray-500">Payment</span>
            <span className="font-semibold">{result.order.paymentStatus}</span>
          </div>
          <div className="mt-4 divide-y divide-gray-100 border-y border-gray-100">
            {result.order.items.map((item, index) => (
              <div key={index} className="flex justify-between py-2 text-sm">
                <span className="text-gray-600">
                  {item.name} × {item.quantity}
                </span>
                <span className="font-medium text-gray-800">
                  {formatGHS(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-between text-base font-bold text-gray-900">
            <span>Total</span>
            <span>{formatGHS(result.order.total)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
