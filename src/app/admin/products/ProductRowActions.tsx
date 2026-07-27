"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ProductVisibility } from "@prisma/client";
import { deleteProduct, setProductVisibility } from "./actions";

export default function ProductRowActions({
  productId,
  visibility,
}: {
  productId: string;
  visibility: ProductVisibility;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/admin/products/${productId}/edit`}
        className="text-brand-teal hover:underline"
      >
        Edit
      </Link>
      <button
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          const next: ProductVisibility =
            visibility === "VISIBLE" ? "OUT_OF_STOCK" : "VISIBLE";
          await setProductVisibility(productId, next);
          router.refresh();
          setBusy(false);
        }}
        className="text-gray-500 hover:underline disabled:opacity-50"
      >
        {visibility === "VISIBLE" ? "Mark out of stock" : "Mark in stock"}
      </button>
      <button
        disabled={busy}
        onClick={async () => {
          if (!confirm("Delete this product? This cannot be undone.")) return;
          setBusy(true);
          await deleteProduct(productId);
          router.refresh();
          setBusy(false);
        }}
        className="text-red-500 hover:underline disabled:opacity-50"
      >
        Delete
      </button>
    </div>
  );
}
