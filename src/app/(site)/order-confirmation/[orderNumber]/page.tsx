import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { verifyTransaction } from "@/lib/paystack";
import { formatGHS } from "@/lib/format";

interface OrderConfirmationPageProps {
  params: Promise<{ orderNumber: string }>;
}

export default async function OrderConfirmationPage({
  params,
}: OrderConfirmationPageProps) {
  const { orderNumber } = await params;

  let order = await prisma.order.findUnique({
    where: { orderNumber },
    include: { items: true },
  });

  if (!order) notFound();

  // If the payment webhook hasn't landed yet (common in local/dev), verify directly.
  if (order.paymentStatus === "PENDING") {
    try {
      const verification = await verifyTransaction(order.paymentReference);
      if (verification.success) {
        order = await prisma.order.update({
          where: { id: order.id },
          data: { paymentStatus: "PAID", status: "PROCESSING" },
          include: { items: true },
        });
      } else if (verification.status === "failed") {
        order = await prisma.order.update({
          where: { id: order.id },
          data: { paymentStatus: "FAILED" },
          include: { items: true },
        });
      }
    } catch {
      // Ignore verification errors here; the webhook or a manual check can reconcile later.
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 text-center">
      {order.paymentStatus === "PAID" ? (
        <>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-teal/10 text-3xl">
            ✅
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            Thank you, {order.customerName.split(" ")[0]}!
          </h1>
          <p className="mt-2 text-gray-500">
            Your order has been received and payment confirmed.
          </p>
        </>
      ) : order.paymentStatus === "FAILED" ? (
        <>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-3xl">
            ❌
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Payment failed</h1>
          <p className="mt-2 text-gray-500">
            Your payment could not be completed. Please try again or contact us
            on WhatsApp.
          </p>
        </>
      ) : (
        <>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-50 text-3xl">
            ⏳
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Payment pending</h1>
          <p className="mt-2 text-gray-500">
            We&apos;re still confirming your payment. Refresh this page in a
            moment.
          </p>
        </>
      )}

      <div className="mt-8 rounded-2xl border border-gray-100 p-5 text-left">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Order number</span>
          <span className="font-mono font-semibold text-gray-800">
            {order.orderNumber}
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm text-gray-500">Fulfillment</span>
          <span className="font-medium text-gray-800">
            {order.fulfillmentType === "DELIVERY" ? "Delivery" : "Pickup"}
          </span>
        </div>

        <div className="mt-4 divide-y divide-gray-100 border-y border-gray-100">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between py-2 text-sm">
              <span className="text-gray-600">
                {item.name} × {item.quantity}
              </span>
              <span className="font-medium text-gray-800">
                {formatGHS(Number(item.price) * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-3 space-y-1 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>{formatGHS(Number(order.subtotal))}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Delivery fee</span>
            <span>{formatGHS(Number(order.deliveryFee))}</span>
          </div>
          <div className="flex justify-between text-base font-bold text-gray-900">
            <span>Total</span>
            <span>{formatGHS(Number(order.total))}</span>
          </div>
        </div>
      </div>

      <Link
        href="/"
        className="mt-6 inline-block rounded-full bg-brand-teal px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-teal-dark"
      >
        Continue shopping
      </Link>
    </div>
  );
}
