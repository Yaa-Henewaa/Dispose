"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { OrderStatus } from "@prisma/client";
import { updateOrderStatus } from "../actions";

const STATUS_OPTIONS: OrderStatus[] = [
  "NEW",
  "PROCESSING",
  "OUT_FOR_DELIVERY",
  "READY_FOR_PICKUP",
  "COMPLETED",
  "CANCELLED",
];

export default function OrderStatusSelect({
  orderId,
  status,
}: {
  orderId: string;
  status: OrderStatus;
}) {
  const router = useRouter();
  const [current, setCurrent] = useState(status);
  const [saving, setSaving] = useState(false);

  return (
    <select
      value={current}
      disabled={saving}
      onChange={async (event) => {
        const next = event.target.value as OrderStatus;
        setCurrent(next);
        setSaving(true);
        await updateOrderStatus(orderId, next);
        router.refresh();
        setSaving(false);
      }}
      className="rounded-full border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700"
    >
      {STATUS_OPTIONS.map((s) => (
        <option key={s} value={s}>
          {s.replace(/_/g, " ")}
        </option>
      ))}
    </select>
  );
}
