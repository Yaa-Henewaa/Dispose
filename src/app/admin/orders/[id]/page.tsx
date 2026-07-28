import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatGHS } from "@/lib/format";
import OrderStatusSelect from "./OrderStatusSelect";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order) notFound();

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">
          Order {order.orderNumber}
        </h1>
        <OrderStatusSelect orderId={order.id} status={order.status} />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-white p-4">
          <h2 className="font-semibold text-gray-800">Customer</h2>
          <p className="mt-1 text-sm text-gray-600">{order.customerName}</p>
          <p className="text-sm text-gray-600">{order.customerPhone}</p>
          {order.customerEmail && (
            <p className="text-sm text-gray-600">{order.customerEmail}</p>
          )}
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-4">
          <h2 className="font-semibold text-gray-800">Fulfillment</h2>
          <p className="mt-1 text-sm text-gray-600">
            {order.fulfillmentType === "DELIVERY" ? "Delivery" : "Pickup"}
          </p>
          {order.deliveryAddress && (
            <p className="text-sm text-gray-600">{order.deliveryAddress}</p>
          )}
          {order.deliveryArea && (
            <p className="text-sm text-gray-600">Area: {order.deliveryArea}</p>
          )}
          <p className="mt-1 text-sm">
            Payment:{" "}
            <span
              className={
                order.paymentStatus === "PAID"
                  ? "font-medium text-[#7a3d62]"
                  : "font-medium text-yellow-600"
              }
            >
              {order.paymentStatus}
            </span>
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-4">
        <h2 className="font-semibold text-gray-800">Items</h2>
        <div className="mt-3 divide-y divide-gray-100">
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
        <div className="mt-3 space-y-1 border-t border-gray-100 pt-3 text-sm">
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
    </div>
  );
}
